import { useMemo, useCallback, useState } from 'react';
import type { editor } from 'monaco-editor';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from '@tanstack/react-query';
import { workspaceApi } from '../api/workspaceApi';
import type { AIChatHistoryResponse, ChatMessage } from '../types';
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
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [isHintChatting, setIsHintChatting] = useState<boolean>(false);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [showExplainToPassForm, setShowExplainToPassForm] =
    useState<boolean>(false);
  const [mcqAnswer, setMcqAnswer] = useState<string>('');
  const [explanation, setExplanation] = useState<string>('');

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
    getNextPageParam: (lastPage) => lastPage.data.nextCursor ?? undefined,
    enabled: isChatEnabled,
  });

  const messages = useMemo(() => {
    if (!data?.pages.length) return [];

    return [...data.pages].reverse().flatMap((page) => page.data.messages);
  }, [data?.pages]);

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

  const sendMessageMutation = useMutation({
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

  const handleSubmitCode = useCallback(async () => {
    if (!isChatEnabled || !taskDetails) return;

    const targetFileId = taskDetails.files[0]?._id;
    if (!targetFileId) return;

    setIsEvaluating(true);

    try {
      const response = await workspaceApi.evaluateCode({
        projectId: trimmedProjectId,
        taskId: activeTaskId,
      });

      if (!response?.success) {
        persistChatMessage({
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: "Devi couldn't evaluate the code right now. Please try again later.",
        });
      } else {
        await invalidateChatHistory();
      }
    } catch (err: unknown) {
      console.error('Code evaluation error:', err);
      persistChatMessage({
        id: `ai-catch-${Date.now()}`,
        sender: 'ai',
        text: 'Devi is having trouble evaluating the code right now. Please try again later.',
      });
    } finally {
      setIsEvaluating(false);
    }
  }, [
    isChatEnabled,
    taskDetails,
    trimmedProjectId,
    activeTaskId,
    persistChatMessage,
    invalidateChatHistory,
  ]);

  const handleOpenExplainToPass = useCallback(() => {
    setMcqAnswer('');
    setExplanation('');
    setShowExplainToPassForm(true);
  }, []);

  const handleExplainToPassSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!isChatEnabled || !taskDetails) return;
      if (!mcqAnswer || !explanation.trim()) return;

      setIsEvaluating(true);

      try {
        const response = await workspaceApi.submitExplainToPass({
          projectId: trimmedProjectId,
          taskId: activeTaskId,
          mcqAnswer,
          explanation: explanation.trim(),
        });

        if (response?.success && response.data) {
          const totalScore = response.data.score ?? 0;
          const passStatus = response.data.passStatus ?? 'UNKNOWN';
          const didPass = passStatus === 'PASS' && Number(totalScore) >= 7;

          setShowExplainToPassForm(false);
          setMcqAnswer('');
          setExplanation('');

          if (didPass) {
            onTaskCompleted();
          }

          await invalidateChatHistory();
        } else {
          throw new Error('Invalid explain-to-pass response');
        }
      } catch (err: unknown) {
        console.error('Error during Explain-to-Pass submission:', err);
        persistChatMessage({
          id: `ai-explain-err-${Date.now()}`,
          sender: 'ai',
          text: 'Devi could not grade the Explain-to-Pass answer yet. Please try again.',
          isPassAction: true,
        });
      } finally {
        setIsEvaluating(false);
      }
    },
    [
      isChatEnabled,
      taskDetails,
      trimmedProjectId,
      activeTaskId,
      mcqAnswer,
      explanation,
      onTaskCompleted,
      persistChatMessage,
      invalidateChatHistory,
    ],
  );

  const handleQuickAction = useCallback(
    async (type: 'explain' | 'hint') => {
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

      setIsHintChatting(true);

      try {
        const response = await workspaceApi.requestAiHint({
          projectId: trimmedProjectId,
          taskId: activeTaskId,
          fileId: activeFileId,
          type,
          selectedCode: selectedText,
          userQuestion: actionText,
        });

        if (response?.success && response.data) {
          await invalidateChatHistory();
        } else {
          throw new Error('Invalid response');
        }
      } catch (err: unknown) {
        console.error('AI quick action error:', err);
        persistChatMessage({
          id: `ai-hint-err-${Date.now()}`,
          sender: 'ai',
          text: 'Devi is having trouble providing the hint right now. Please try again later.',
        });
      } finally {
        setIsHintChatting(false);
      }
    },
    [
      isChatEnabled,
      activeFileId,
      editorInstance,
      trimmedProjectId,
      activeTaskId,
      persistChatMessage,
      invalidateChatHistory,
    ],
  );

  const handleSendTextMessage = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const question = inputMessage.trim();
      if (!question || !isChatEnabled) return;

      setInputMessage('');
      sendMessageMutation.mutate(question);
    },
    [inputMessage, isChatEnabled, sendMessageMutation],
  );

  return {
    messages,
    isChatting: isHintChatting || sendMessageMutation.isPending,
    isEvaluating,
    isLoadingHistory,
    isFetchingNextPage,
    hasNextPage: Boolean(hasNextPage),
    fetchNextPage,
    inputMessage,
    setInputMessage,
    showExplainToPassForm,
    mcqAnswer,
    setMcqAnswer,
    explanation,
    setExplanation,
    handleSubmitCode,
    handleOpenExplainToPass,
    handleExplainToPassSubmit,
    handleQuickAction,
    handleSendTextMessage,
  };
}
