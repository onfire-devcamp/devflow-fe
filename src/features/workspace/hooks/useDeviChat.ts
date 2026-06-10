import { useState, useCallback } from 'react';
import type { editor } from 'monaco-editor';
import { workspaceApi } from '../api/workspaceApi';
import type { ChatMessage } from '../types';
import type { TaskDetailsState } from '../../roadmap/RoadmapType';

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
  const [isChatting, setIsChatting] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [showExplainToPassForm, setShowExplainToPassForm] =
    useState<boolean>(false);
  const [mcqAnswer, setMcqAnswer] = useState<string>('');
  const [explanation, setExplanation] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<Record<string, ChatMessage[]>>(
    {},
  );
  const messages = chatHistory[activeTaskId] || [];
  const setMessages = useCallback(
    (updater: React.SetStateAction<ChatMessage[]>) => {
      setChatHistory((prev) => {
        const current = prev[activeTaskId] || [];
        const next = typeof updater === 'function' ? updater(current) : updater;
        return { ...prev, [activeTaskId]: next };
      });
    },
    [activeTaskId],
  );

  const persistChatMessage = useCallback(
    (message: ChatMessage) => {
      if (!projectId || !activeTaskId) return;

      void workspaceApi
        .appendChatMessage({
          projectId: projectId.trim(),
          taskId: activeTaskId,
          sender: message.sender,
          text: message.text,
          isPassAction: message.isPassAction,
        })
        .catch((err: unknown) => {
          console.error('Failed to persist chat message:', err);
        });
    },
    [projectId, activeTaskId],
  );

  const appendMessage = useCallback(
    (message: ChatMessage, options?: { persist?: boolean }) => {
      setMessages((prev) => [...prev, message]);
      if (options?.persist) {
        persistChatMessage(message);
      }
    },
    [persistChatMessage, setMessages],
  );

  const initChatForTask = useCallback(
    async (taskTitle: string) => {
      if (!projectId || !activeTaskId) return;

      let isAlreadyCached = false;
      setChatHistory((prev) => {
        isAlreadyCached = Boolean(prev[activeTaskId]);
        return prev;
      });

      if (isAlreadyCached) return;

      const welcomeMessage: ChatMessage = {
        id: `welcome-${activeTaskId}`,
        sender: 'ai',
        text: `New task: **${taskTitle}**. Submit code when you're ready — I'll point out anything missing.`,
      };

      try {
        const response = await workspaceApi.fetchChatHistory(
          projectId.trim(),
          activeTaskId,
        );

        const loadedMessages =
          response.success && response.data.length > 0
            ? response.data
            : [welcomeMessage];

        setChatHistory((prev) => {
          if (prev[activeTaskId]) return prev;
          return { ...prev, [activeTaskId]: loadedMessages };
        });
      } catch (err: unknown) {
        console.error('Failed to load chat history:', err);
        setChatHistory((prev) => {
          if (prev[activeTaskId]) return prev;
          return { ...prev, [activeTaskId]: [welcomeMessage] };
        });
      }
    },
    [projectId, activeTaskId],
  );

  const handleSubmitCode = useCallback(async () => {
    if (!projectId || !activeTaskId || !taskDetails) return;

    const targetFileId = taskDetails.files[0]?._id;
    if (!targetFileId) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: 'Submitted my code for review.',
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsEvaluating(true);

    try {
      const response = await workspaceApi.evaluateCode({
        projectId: projectId.trim(),
        taskId: activeTaskId,
      });

      if (response && response.success) {
        const aiFeedback =
          response.data.feedback || 'No feedback provided by Devi.';
        const status = response.data.passStatus || 'UNKNOWN';
        const score =
          response.data.score !== undefined ? response.data.score : 0;
        const passedCodeReview = status === 'PASS' && Number(score) >= 7;
        const combinedMessage = passedCodeReview
          ? `**Task passed - Score:** ${score}/10\n\n${aiFeedback}\n\nLet's finish with the Explain-to-Pass quick check.`
          : `**Status:** ${status} | **Score:** ${score}\n\n${aiFeedback}`;
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: combinedMessage,
            isPassAction: passedCodeReview,
          },
        ]);
      } else {
        appendMessage(
          {
            id: `ai-err-${Date.now()}`,
            sender: 'ai',
            text: "Devi couldn't evaluate the code right now. Please try again later.",
          },
          { persist: true },
        );
      }
    } catch (err: unknown) {
      console.error('Code evaluation error:', err);
      appendMessage(
        {
          id: `ai-catch-${Date.now()}`,
          sender: 'ai',
          text: 'Devi is having trouble evaluating the code right now. Please try again later.',
        },
        { persist: true },
      );
    } finally {
      setIsEvaluating(false);
    }
  }, [projectId, activeTaskId, taskDetails, appendMessage, setMessages]);

  const handleOpenExplainToPass = useCallback(() => {
    setMcqAnswer('');
    setExplanation('');
    setShowExplainToPassForm(true);
  }, []);

  const handleExplainToPassSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!projectId || !activeTaskId || !taskDetails) return;
      if (!mcqAnswer || !explanation.trim()) return;

      setMessages((prev) => [
        ...prev,
        {
          id: `user-explain-${Date.now()}`,
          sender: 'user',
          text: 'Submitted my Explain-to-Pass answers.',
        },
      ]);
      setIsEvaluating(true);

      try {
        const response = await workspaceApi.submitExplainToPass({
          projectId: projectId.trim(),
          taskId: activeTaskId,
          mcqAnswer,
          explanation: explanation.trim(),
        });

        if (response && response.success && response.data) {
          const totalScore = response.data.score ?? 0;
          const passStatus = response.data.passStatus ?? 'UNKNOWN';
          const feedback = response.data.feedback ?? 'No feedback provided.';
          const didPass = passStatus === 'PASS' && Number(totalScore) >= 7;

          setShowExplainToPassForm(false);
          setMcqAnswer('');
          setExplanation('');

          if (didPass) {
            onTaskCompleted();
            setMessages((prev) => [
              ...prev,
              {
                id: `ai-explain-pass-${Date.now()}`,
                sender: 'ai',
                text: `**Task officially completed - Explain-to-Pass Score:** ${totalScore}/10\n\n${feedback}\n\nNice. The next task should now be unlocked.`,
              },
            ]);
          } else {
            setMessages((prev) => [
              ...prev,
              {
                id: `ai-explain-fail-${Date.now()}`,
                sender: 'ai',
                text: `**Explain-to-Pass needs one more try - Score:** ${totalScore}/10\n\n${feedback}`,
                isPassAction: true,
              },
            ]);
          }
        } else {
          throw new Error('Invalid explain-to-pass response');
        }
      } catch (err: unknown) {
        console.error('Error during Explain-to-Pass submission:', err);
        appendMessage(
          {
            id: `ai-explain-err-${Date.now()}`,
            sender: 'ai',
            text: 'Devi could not grade the Explain-to-Pass answer yet. Please try again.',
            isPassAction: true,
          },
          { persist: true },
        );
      } finally {
        setIsEvaluating(false);
      }
    },
    [
      projectId,
      activeTaskId,
      taskDetails,
      mcqAnswer,
      explanation,
      onTaskCompleted,
      appendMessage,
      setMessages,
    ],
  );

  const handleQuickAction = useCallback(
    async (type: 'explain' | 'hint') => {
      if (!projectId || !activeTaskId || !activeFileId || !editorInstance)
        return;

      const selection = editorInstance.getSelection();
      const model = editorInstance.getModel();
      if (!selection || !model) return;

      const selectedText = model.getValueInRange(selection).trim();
      if (!selectedText) return;

      const actionText =
        type === 'explain'
          ? 'Can you explain this highlighted code?'
          : 'Can you give me a hint for this highlighted code?';

      setMessages((prev) => [
        ...prev,
        { id: `user-action-${Date.now()}`, sender: 'user', text: actionText },
      ]);
      setIsChatting(true);

      try {
        const response = await workspaceApi.requestAiHint({
          projectId: projectId.trim(),
          taskId: activeTaskId,
          fileId: activeFileId,
          type: type,
          selectedCode: selectedText,
          userQuestion: actionText,
        });

        if (response && response.success && response.data) {
          const aiReply = response.data.aiResponse;
          setMessages((prev) => [
            ...prev,
            { id: `ai-hint-${Date.now()}`, sender: 'ai', text: aiReply },
          ]);
        } else {
          throw new Error('Invalid response');
        }
      } catch (err: unknown) {
        console.error('AI quick action error:', err);
        appendMessage(
          {
            id: `ai-hint-err-${Date.now()}`,
            sender: 'ai',
            text: 'Devi is having trouble providing the hint right now. Please try again later.',
          },
          { persist: true },
        );
      } finally {
        setIsChatting(false);
      }
    },
    [
      projectId,
      activeTaskId,
      activeFileId,
      editorInstance,
      appendMessage,
      setMessages,
    ],
  );

  const handleSendTextMessage = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const question = inputMessage.trim();
      if (!question || !projectId || !activeTaskId) return;

      setMessages((prev) => [
        ...prev,
        { id: `user-text-${Date.now()}`, sender: 'user', text: question },
      ]);
      setInputMessage('');
      setIsChatting(true);

      try {
        const response = await workspaceApi.sendAiChatMessage({
          projectId: projectId.trim(),
          taskId: activeTaskId,
          message: question,
        });

        if (response && response.success && response.data) {
          const aiReply = response.data.message;
          setMessages((prev) => [
            ...prev,
            {
              id: `ai-chat-${Date.now()}`,
              sender: 'ai',
              text: aiReply,
            },
          ]);
        } else {
          throw new Error('Invalid response');
        }
      } catch (err: unknown) {
        console.error('AI chat error:', err);
        appendMessage(
          {
            id: `ai-chat-err-${Date.now()}`,
            sender: 'ai',
            text: 'Devi is busy right now. Please try again later.',
          },
          { persist: true },
        );
      } finally {
        setIsChatting(false);
      }
    },
    [projectId, activeTaskId, inputMessage, appendMessage, setMessages],
  );

  return {
    messages,
    isChatting,
    isEvaluating,
    inputMessage,
    setInputMessage,
    showExplainToPassForm,
    mcqAnswer,
    setMcqAnswer,
    explanation,
    setExplanation,
    initChatForTask,
    handleSubmitCode,
    handleOpenExplainToPass,
    handleExplainToPassSubmit,
    handleQuickAction,
    handleSendTextMessage,
  };
}
