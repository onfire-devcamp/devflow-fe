import { useMemo, useCallback } from 'react';
import type { editor } from 'monaco-editor';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from '@tanstack/react-query';
import { workspaceApi } from '../api/workspaceApi';
import type {
  AIChatHistoryResponse,
  ChatMessage,
  RequestAiHintParams,
  SubmitExplainToPassParams,
} from '../types';
import type { TaskDetailsState } from '../../roadmap/RoadmapType';

const CHAT_PAGE_SIZE = 4;

export const chatHistoryQueryKey = (projectId: string, taskId: string) =>
  ['chatHistory', projectId, taskId] as const;

interface UseDeviChatParams {
  projectId: string | undefined;
  activeTaskId: string;
  activeFileId: string | null;
  editorInstance: editor.IStandaloneCodeEditor | null;
  taskDetails: TaskDetailsState | null;
  onTaskCompleted: () => void;
}

export function useDeviChat({
  projectId,
  activeTaskId,
  activeFileId,
  editorInstance,
  taskDetails,
  onTaskCompleted,
}: UseDeviChatParams) {
  const queryClient = useQueryClient();
  const trimmedProjectId = projectId?.trim() ?? '';
  const isChatEnabled = Boolean(trimmedProjectId && activeTaskId);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingHistory,
  } = useInfiniteQuery({
    queryKey: chatHistoryQueryKey(trimmedProjectId, activeTaskId),
    queryFn: ({ pageParam }) =>
      workspaceApi.fetchChatHistory(
        trimmedProjectId,
        activeTaskId,
        pageParam as string | undefined,
        CHAT_PAGE_SIZE,
      ),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.data?.nextCursor ?? undefined,
    enabled: isChatEnabled,
  });

  const messages = useMemo(() => {
    if (!data?.pages.length) return [];
    return [...data.pages]
      .reverse()
      .flatMap((page) => page.data?.messages ?? []);
  }, [data]);

  const invalidateChatHistory = useCallback(async () => {
    if (!isChatEnabled) return;
    await queryClient.invalidateQueries({
      queryKey: chatHistoryQueryKey(trimmedProjectId, activeTaskId),
    });
  }, [queryClient, trimmedProjectId, activeTaskId, isChatEnabled]);

  const persistChatMessage = useCallback(
    (message: ChatMessage) => {
      if (!isChatEnabled) return;
      void workspaceApi
        .appendChatMessage({
          projectId: trimmedProjectId,
          taskId: activeTaskId,
          sender: message.sender,
          text: message.text,
          isPassAction: message.isPassAction,
        })
        .then(() => invalidateChatHistory())
        .catch((err: unknown) => {
          console.error('Failed to persist chat message:', err);
        });
    },
    [trimmedProjectId, activeTaskId, isChatEnabled, invalidateChatHistory],
  );

  const { mutate: sendMessage, isPending: isSendingMessage } = useMutation({
    mutationFn: (message: string) =>
      workspaceApi.sendAiChatMessage({
        projectId: trimmedProjectId,
        taskId: activeTaskId,
        message,
      }),
    onMutate: async (message: string) => {
      const queryKey = chatHistoryQueryKey(trimmedProjectId, activeTaskId);
      await queryClient.cancelQueries({ queryKey });

      const previousData =
        queryClient.getQueryData<InfiniteData<AIChatHistoryResponse>>(queryKey);

      const optimisticMessage: ChatMessage = {
        id: `optimistic-user-${Date.now()}`,
        sender: 'user',
        text: message,
      };

      queryClient.setQueryData<InfiniteData<AIChatHistoryResponse>>(
        queryKey,
        (old) => {
          if (!old?.pages.length) {
            return {
              pages: [
                {
                  success: true,
                  data: { messages: [optimisticMessage], nextCursor: null },
                },
              ],
              pageParams: [undefined],
            };
          }
          return {
            ...old,
            pages: old.pages.map((page, index) =>
              index === 0
                ? {
                    ...page,
                    data: {
                      ...page.data,
                      messages: [...page.data.messages, optimisticMessage],
                    },
                  }
                : page,
            ),
          };
        },
      );

      return { previousData };
    },
    onError: (_error, _message, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          chatHistoryQueryKey(trimmedProjectId, activeTaskId),
          context.previousData,
        );
      }
    },
    onSettled: () => {
      void invalidateChatHistory();
    },
  });

  const { mutate: submitCode, isPending: isSubmittingCode } = useMutation({
    mutationFn: () =>
      workspaceApi.evaluateCode({
        projectId: trimmedProjectId,
        taskId: activeTaskId,
      }),
    onSuccess: (response) => {
      if (!response?.success) {
        persistChatMessage({
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: "Devi couldn't evaluate the code right now. Please try again later.",
        });
      } else {
        void invalidateChatHistory();
      }
    },
    onError: (err) => {
      console.error('Code evaluation error:', err);
      persistChatMessage({
        id: `ai-catch-${Date.now()}`,
        sender: 'ai',
        text: 'Devi is having trouble evaluating the code right now. Please try again later.',
      });
    },
  });

  const handleSubmitCode = useCallback(() => {
    if (!isChatEnabled || !taskDetails) return;
    const targetFileId = taskDetails.files[0]?._id;
    if (!targetFileId) return;

    submitCode();
  }, [isChatEnabled, taskDetails, submitCode]);

  const { mutate: submitExplainToPass, isPending: isExplainingToPass } =
    useMutation({
      mutationFn: (
        params: Pick<SubmitExplainToPassParams, 'mcqAnswer' | 'explanation'>,
      ) =>
        workspaceApi.submitExplainToPass({
          projectId: trimmedProjectId,
          taskId: activeTaskId,
          ...params,
        }),
      onSuccess: (response) => {
        if (response?.success && response.data) {
          const totalScore = response.data.score ?? 0;
          const passStatus = response.data.passStatus ?? 'UNKNOWN';
          const didPass = passStatus === 'PASS' && Number(totalScore) >= 7;

          if (didPass) {
            onTaskCompleted();
          }
          void invalidateChatHistory();
        } else {
          throw new Error('Invalid explain-to-pass response');
        }
      },
      onError: (err) => {
        console.error('Error during Explain-to-Pass submission:', err);
        persistChatMessage({
          id: `ai-explain-err-${Date.now()}`,
          sender: 'ai',
          text: 'Devi could not grade the Explain-to-Pass answer yet. Please try again.',
          isPassAction: true,
        });
      },
    });

  const handleExplainToPassSubmit = useCallback(
    (mcqAnswer: string, explanation: string) => {
      if (!isChatEnabled || !taskDetails) return;
      if (!mcqAnswer || !explanation.trim()) return;

      submitExplainToPass({ mcqAnswer, explanation });
    },
    [isChatEnabled, taskDetails, submitExplainToPass],
  );

  const { mutate: requestQuickAction, isPending: isRequestingQuickAction } =
    useMutation({
      mutationFn: (
        params: Pick<
          RequestAiHintParams,
          'type' | 'selectedCode' | 'userQuestion'
        >,
      ) =>
        workspaceApi.requestAiHint({
          projectId: trimmedProjectId,
          taskId: activeTaskId,
          fileId: activeFileId!,
          ...params,
        }),
      onSuccess: (response) => {
        if (response?.success && response.data) {
          void invalidateChatHistory();
        } else {
          throw new Error('Invalid response');
        }
      },
      onError: (err) => {
        console.error('AI quick action error:', err);
        persistChatMessage({
          id: `ai-hint-err-${Date.now()}`,
          sender: 'ai',
          text: 'Devi is having trouble providing the hint right now. Please try again later.',
        });
      },
    });

  const handleQuickAction = useCallback(
    (type: 'explain' | 'hint') => {
      if (!isChatEnabled || !activeFileId || !editorInstance) return;

      const selection = editorInstance.getSelection();
      const model = editorInstance.getModel();
      if (!selection || !model) return;

      const selectedText = model.getValueInRange(selection).trim();
      if (!selectedText) return;

      const actionText =
        type === 'explain'
          ? 'Can you explain this highlighted code?'
          : 'Can you give me a hint for this highlighted code?';

      requestQuickAction({
        type,
        selectedCode: selectedText,
        userQuestion: actionText,
      });
    },
    [isChatEnabled, activeFileId, editorInstance, requestQuickAction],
  );

  const handleSendTextMessage = useCallback(
    (question: string) => {
      if (!question.trim() || !isChatEnabled) return;
      sendMessage(question.trim());
    },
    [isChatEnabled, sendMessage],
  );

  return {
    messages,
    isChatting: isRequestingQuickAction || isSendingMessage,
    isEvaluating: isSubmittingCode || isExplainingToPass,
    isLoadingHistory,
    isFetchingNextPage,
    hasNextPage: Boolean(hasNextPage),
    fetchNextPage,
    handleSubmitCode,
    handleExplainToPassSubmit,
    handleQuickAction,
    handleSendTextMessage,
  };
}
