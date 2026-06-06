import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { axiosClient } from '../../lib/axiosClient';
import { Header } from '../../components/ui/Header';
import { Pen, Send, Star } from 'lucide-react';
import { SidebarHeader } from './components/SideBarHeader';
import { TabSwitcher } from './components/TabSwitcher';
import { ProgressBar } from './components/ProgressBar';
import { TaskList } from './components/TaskList';
import mascot from '../../assets/mascot.png';
import ReactMarkdown from 'react-markdown';
import type {
  CategoryGroup,
  ProjectDetails,
  TaskDetailsState,
  APIRoadmapResponse,
  APITaskDetailsResponse,
  RawModuleFromAPI,
  Task,
  RawTaskFromAPI,
} from './RoadmapType';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export default function RoadmapLayout() {
  const { projectId } = useParams<{ projectId: string }>();

  const [activeTaskId, setActiveTaskId] = useState<string>('');
  const [projectDetails, setProjectDetails] = useState<ProjectDetails | null>(
    null,
  );
  const [roadmapData, setRoadmapData] = useState<CategoryGroup[]>([]);

  const [taskDetails, setTaskDetails] = useState<TaskDetailsState | null>(null);

  const [loadingTask, setLoadingTask] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isChatting, setIsChatting] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [inputMessage, setInputMessage] = useState<string>('');

  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [fileContents, setFileContents] = useState<Record<string, string>>({});
  const [editorInstance, setEditorInstance] = useState<any>(null);
  const [hasSelection, setHasSelection] = useState<boolean>(false);
  useEffect(() => {
    if (!projectId || projectId === 'undefined') return;

    const fetchWorkspaceData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosClient.get(
          `/project/${projectId.trim()}/roadmap`,
        );
        const resJson: APIRoadmapResponse = response.data;
        if (resJson && resJson.success && resJson.data) {
          const { project, modules } = resJson.data;

          if (project) {
            setProjectDetails({
              title: project.title,
              description: project.description,
              progressPercentage: project.progressPercentage,
            });
          }

          if (Array.isArray(modules)) {
            const formattedRoadmap: CategoryGroup[] = modules.map(
              (module: RawModuleFromAPI): CategoryGroup => ({
                category: (module?.title || '').toUpperCase(),
                tasks: Array.isArray(module?.tasks)
                  ? module.tasks.map((task: RawTaskFromAPI): Task => {
                      let assignedStatus: 'completed' | 'current' | 'locked' =
                        'locked';
                      if (
                        task?.status === 'completed' ||
                        task?.status === 'passed'
                      ) {
                        assignedStatus = 'completed';
                      } else if (
                        task?.status === 'current' ||
                        task?.status === 'unlocked'
                      ) {
                        assignedStatus = 'current';
                      }
                      assignedStatus = 'current';
                      return {
                        id: task?._id || task?.id || '',
                        title: task?.title || '',
                        status: assignedStatus,
                      };
                    })
                  : [],
              }),
            );

            setRoadmapData(formattedRoadmap);

            if (
              formattedRoadmap.length > 0 &&
              formattedRoadmap[0].tasks.length > 0 &&
              !activeTaskId
            ) {
              setActiveTaskId(formattedRoadmap[0].tasks[0].id);
            }
          }
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            err.message ||
            'Lỗi khi đồng bộ dữ liệu.',
        );
      } finally {
        setLoading(false);
      }
    };
    fetchWorkspaceData();
  }, [projectId]);

  // FLOW 2: Fetch detailed content for a specific task
  useEffect(() => {
    if (!activeTaskId) return;

    const fetchTaskDetails = async () => {
      try {
        setLoadingTask(true);
        setMessages([]);

        const response = await axiosClient.get(
          `/project/tasks/${activeTaskId}`,
        );
        const resJson: APITaskDetailsResponse = response.data;

        if (resJson && resJson.success && resJson.data?.task) {
          const fetchedTask = resJson.data.task;
          const files = fetchedTask.fileId || [];
          setTaskDetails({
            _id: fetchedTask._id,
            title: fetchedTask.title,
            description: fetchedTask.description,
            skillPoints: fetchedTask.skillPoints || 10,
            files: fetchedTask.fileId || [],
          });
          const initialContents: Record<string, string> = {};
          files.forEach((f: any) => {
            initialContents[f._id] = f.content || '';
          });
          setFileContents(initialContents);
          if (files.length > 0) {
            setActiveFileId(files[0]._id);
          } else {
            setActiveFileId(null);
          }

          setMessages([
            {
              id: 'welcome',
              sender: 'ai',
              text: `New task: **${fetchedTask.title}**. Submit code when you're ready — I'll point out anything missing.`,
            },
          ]);
        } else {
          setTaskDetails(null);
        }
      } catch (err: any) {
        console.error(
          'Lỗi khi tải task detail:',
          err.response?.data || err.message,
        );
        setTaskDetails(null);
      } finally {
        setLoadingTask(false);
      }
    };

    fetchTaskDetails();
  }, [activeTaskId]);

  // FLOW 3: Debounced Auto-save Engine
  useEffect(() => {
    if (!projectId || !activeFileId) return;

    const currentContent = fileContents[activeFileId];
    if (currentContent === undefined) return;
    const delayDebounceTimer = setTimeout(async () => {
      try {
        await axiosClient.put('/workspace/file', {
          projectId: projectId.trim(),
          fileId: activeFileId,
          newContent: currentContent,
        });
      } catch (err) {
        console.error('Auto-save lỗi:', err);
      }
    }, 800);

    return () => clearTimeout(delayDebounceTimer);
  }, [fileContents[activeFileId], activeFileId, projectId]);

  // SUBMIT CODE & CALL AI API
  const handleSubmitCode = async () => {
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
      const response = await axiosClient.post('/ai/evaluate', {
        projectId: projectId.trim(),
        taskId: activeTaskId,
      });
      const resJson = response.data;
      if (resJson && resJson.success) {
        const aiFeedback =
          resJson.data.feedback ||
          'Bài làm rất tốt! Bạn đã hoàn thành thử thách này.';
        const status = resJson.data.passStatus || 'UNKNOWN';
        const score = resJson.data.score !== undefined ? resJson.data.score : 0;
        const combinedMessage = `**Status:** ${status} | **Score:** ${score}\n\n${aiFeedback}`;
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: combinedMessage,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-err-${Date.now()}`,
            sender: 'ai',
            text: 'Devi đang gặp chút trục trặc khi đọc mã nguồn này. Hãy thử gửi lại nhé!',
          },
        ]);
      }
    } catch (err: any) {
      console.error('Lỗi khi call API evaluate:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-catch-${Date.now()}`,
          sender: 'ai',
          text: 'Hệ thống kết nối AI đang bận. Bạn vui lòng thử lại sau vài giây!',
        },
      ]);
    } finally {
      setIsEvaluating(false);
    }
  };
  // Explain or Hint
  const handleQuickAction = async (type: 'explain' | 'hint') => {
    if (!projectId || !activeTaskId || !activeFileId || !editorInstance) return;

    const selection = editorInstance.getSelection();
    const model = editorInstance.getModel();
    if (!selection || !model) return;

    const selectedText = model.getValueInRange(selection).trim();
    if (!selectedText) return;

    setHasSelection(false);

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
      const response = await axiosClient.post('/ai/hint', {
        projectId: projectId.trim(),
        taskId: activeTaskId,
        fileId: activeFileId,
        type: type,
        selectedCode: selectedText,
        userQuestion: actionText,
      });

      const resJson = response.data;
      if (resJson && resJson.success && resJson.data) {
        const aiReply = resJson.data.aiResponse;
        setMessages((prev) => [
          ...prev,
          { id: `ai-hint-${Date.now()}`, sender: 'ai', text: aiReply },
        ]);
      } else {
        throw new Error('Invalid response');
      }
    } catch (err: any) {
      console.error('Lỗi khi gọi API hint:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-hint-err-${Date.now()}`,
          sender: 'ai',
          text: 'Oops, Devi chưa phân tích được đoạn code này. Bạn thử lại nhé!',
        },
      ]);
    } finally {
      setIsChatting(false);
    }
  };

  const handleSendTextMessage = async (e: React.FormEvent) => {
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
      const response = await axiosClient.post('/ai/chat', {
        projectId: projectId.trim(),
        taskId: activeTaskId,
        message: question,
      });

      const resJson = response.data;
      if (resJson && resJson.success && resJson.data) {
        const aiReply = resJson.data.message;
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
    } catch (err: any) {
      console.error('Lỗi khi gọi API chat:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-chat-err-${Date.now()}`,
          sender: 'ai',
          text: 'Oops, Devi đang bận chút xíu. Bạn hỏi lại câu khác nhé!',
        },
      ]);
    } finally {
      setIsChatting(false);
    }
  };

  const currentProjectName = projectDetails?.title || 'Loading project...';
  const currentProgress = projectDetails?.progressPercentage ?? 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg text-fg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const currentCategory = roadmapData.find((group) =>
    group.tasks.some((task) => task.id === activeTaskId),
  )?.category;

  return (
    <div className="flex flex-col h-screen bg-bg select-none overflow-hidden text-fg">
      <Header />
      <div className="flex flex-1 overflow-hidden w-full">
        {/* LEFT SIDEBAR */}
        <aside className="hidden lg:flex w-76 flex-shrink-0 border-r border-primary-mid bg-primary-soft flex-col justify-between overflow-y-auto">
          <div>
            <SidebarHeader projectName={currentProjectName} />
            <div className="p-4 space-y-5">
              <TabSwitcher />
              <ProgressBar progress={currentProgress} />
              <TaskList
                academyData={roadmapData}
                activeTaskId={activeTaskId}
                onTaskSelect={setActiveTaskId}
              />
            </div>
          </div>
        </aside>

        {/* MIDDLE MAIN CONTENT */}
        <main className="flex-1 bg-bg p-4 sm:p-8 border-r border-slate-100 overflow-y-auto">
          <div className="max-w-3xl mx-auto w-full min-h-[500px]">
            {loadingTask ? (
              <div className="flex items-center justify-center h-full min-h-[400px] text-slate-400 text-sm">
                <div className="animate-pulse">Loading task contents...</div>
              </div>
            ) : taskDetails ? (
              <div className="space-y-4 animate-fadeIn">
                {/* 1. Task Meta Header */}
                <div>
                  <span className="text-[11px] font-bold text-purple-500 tracking-wider uppercase block mb-1">
                    {currentCategory || 'SETUP & FOUNDATIONS'}
                  </span>
                  <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                    {taskDetails.title}
                  </h2>
                  <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
                    {taskDetails.description}
                  </p>
                </div>

                {/* 2. TAB BARS */}
                {taskDetails.files.length > 0 && (
                  <div className="flex items-center gap-2 pt-2 overflow-x-auto no-scrollbar">
                    {taskDetails.files.map((file) => (
                      <button
                        key={file._id}
                        onClick={() => setActiveFileId(file._id)}
                        className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-t-xl border transition-colors ${
                          activeFileId === file._id
                            ? 'bg-white border-slate-200 border-b-transparent text-slate-800 shadow-sm z-10 relative top-[1px]'
                            : 'bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        <Pen
                          className={`w-3 h-3 ${activeFileId === file._id ? 'text-pink-500' : 'text-slate-400'}`}
                        />
                        {file.path}
                      </button>
                    ))}
                  </div>
                )}

                {/* 3. Mock macOS Code Editor Window */}
                <div className="w-full rounded-xl rounded-tl-none border border-slate-800 bg-[#1e1e1e] overflow-hidden shadow-md relative z-0">
                  <div className="flex items-center justify-between px-4 py-2.5 bg-[#181818] border-b border-slate-900">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] block" />
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {taskDetails.files.find((f) => f._id === activeFileId)
                        ?.path || ''}
                    </span>
                    <div className="w-10" />
                  </div>

                  <div className="py-2 bg-[#1e1e1e] relative">
                    <Editor
                      height="420px"
                      theme="vs-dark"
                      language={
                        taskDetails.files
                          .find((f) => f._id === activeFileId)
                          ?.path?.endsWith('.json')
                          ? 'json'
                          : 'typescript'
                      }
                      value={activeFileId ? fileContents[activeFileId] : ''}
                      onMount={(editor) => {
                        setEditorInstance(editor);
                        editor.onDidChangeCursorSelection((e: any) => {
                          const selection = e.selection;
                          const hasText = !selection.isEmpty();
                          setHasSelection(hasText);
                        });
                      }}
                      onChange={(value) => {
                        if (activeFileId) {
                          setFileContents((prev) => ({
                            ...prev,
                            [activeFileId]: value || '',
                          }));
                        }
                      }}
                    />
                    {/* FLOATING ACTION MENU */}
                    {hasSelection && !isEvaluating && !isChatting && (
                      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-[#2d2d2d] border border-[#444] shadow-lg rounded-xl px-2 py-1.5 flex items-center gap-2 z-10 animate-fadeIn">
                        <span className="text-[11px] font-medium text-slate-400 pl-2 pr-1">
                          Devi:
                        </span>
                        <button
                          onClick={() => handleQuickAction('explain')}
                          className="text-[11px] font-semibold px-3 py-1 bg-purple-500/20 text-purple-300 hover:bg-purple-500/40 rounded-lg transition"
                        >
                          Explain
                        </button>
                        <button
                          onClick={() => handleQuickAction('hint')}
                          className="text-[11px] font-semibold px-3 py-1 bg-amber-500/20 text-amber-300 hover:bg-amber-500/40 rounded-lg transition"
                        >
                          Hint
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. Action Footer */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1 text-amber-500 font-medium text-xs">
                    <Star
                      size={14}
                      className="flex-shrink-0"
                      fill="currentColor"
                    />
                    <span>
                      Worth{' '}
                      <span className="font-bold text-slate-700">
                        {taskDetails.skillPoints} XP
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        if (activeFileId) {
                          const activeFile = taskDetails.files.find(
                            (f) => f._id === activeFileId,
                          );
                          setFileContents((prev) => ({
                            ...prev,
                            [activeFileId]: activeFile?.content || '',
                          }));
                        }
                      }}
                      className="px-4 py-2 text-xs font-semibold text-slate-500 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 transition shadow-sm cursor-pointer"
                    >
                      Reset to skeleton
                    </button>
                    <button
                      onClick={handleSubmitCode}
                      disabled={isEvaluating}
                      className={`px-5 py-2 text-xs font-semibold text-white bg-primary hover:opacity-90 rounded-xl shadow-md flex items-center gap-1.5 transition cursor-pointer ${
                        isEvaluating ? 'opacity-60 cursor-not-allowed' : ''
                      }`}
                    >
                      <span>
                        {isEvaluating ? 'Reviewing...' : 'Submit code'}
                      </span>
                      <Send className="w-3.5 h-3.5 transform rotate-90 flex-shrink-0" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[400px] text-slate-400 text-sm">
                Select a task from the roadmap to view workspace.
              </div>
            )}
          </div>
        </main>

        {/* RIGHT SIDEBAR: AI MENTOR CHAT INTERFACE*/}
        <aside className="hidden xl:flex w-84 flex-shrink-0 bg-primary-soft border-l border-primary-mid flex-col h-full overflow-hidden">
          {/* Header Panel */}
          <div className="p-4 border-b border-primary-mid flex items-center justify-between bg-transparent">
            <div>
              <h3 className="font-bold text-sm text-slate-800">Devi</h3>
              <p className="text-[11px] text-fg-muted">
                AI mentor • never hands you the answer
              </p>
            </div>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col bg-transparent">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 max-w-[85%] ${
                  msg.sender === 'user'
                    ? 'self-end flex-row-reverse'
                    : 'self-start items-start'
                }`}
              >
                {/* AI Avatar capybara */}
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-amber-200 flex items-center justify-center shadow-sm flex-shrink-0 bg-amber-50">
                    <img
                      src={mascot}
                      alt="Devi Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`px-3.5 py-2 text-xs rounded-2xl shadow-sm leading-relaxed min-w-0 break-words ${
                    msg.sender === 'user'
                      ? 'bg-primary text-white rounded-tr-none'
                      : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
                  }`}
                >
                  {msg.sender === 'user' ? (
                    <p className="whitespace-pre-wrap m-0">{msg.text}</p>
                  ) : (
                    <div className="flex flex-col gap-2 min-w-0">
                      <ReactMarkdown
                        components={{
                          p: ({ node, ...props }: any) => (
                            <p className="m-0" {...props} />
                          ),
                          ul: ({ node, ...props }: any) => (
                            <ul
                              className="list-disc pl-4 m-0 space-y-1"
                              {...props}
                            />
                          ),
                          ol: ({ node, ...props }: any) => (
                            <ol
                              className="list-decimal pl-4 m-0 space-y-1"
                              {...props}
                            />
                          ),
                          li: ({ node, ...props }: any) => (
                            <li className="m-0" {...props} />
                          ),
                          strong: ({ node, ...props }: any) => (
                            <strong
                              className="font-bold text-slate-900"
                              {...props}
                            />
                          ),

                          pre: ({ node, ...props }: any) => (
                            <pre
                              className="block bg-[#1e1e1e] text-slate-200 p-2.5 rounded-lg font-mono text-[11px] overflow-x-auto max-w-full mt-1 mb-1"
                              {...props}
                            />
                          ),

                          code: ({ node, className, ...props }: any) => {
                            const isInline = !className;
                            return isInline ? (
                              <code
                                className="bg-slate-100 px-1.5 py-0.5 rounded text-pink-500 font-mono text-[11px] break-words"
                                {...props}
                              />
                            ) : (
                              <code className={className} {...props} />
                            );
                          },
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* AI Reviewing Loading Bubble */}
            {(isEvaluating || isChatting) && (
              <div className="flex gap-2 max-w-[85%] self-start items-start animate-pulse">
                <div className="w-7 h-7 rounded-full bg-purple-100 border border-purple-200 flex items-center justify-center text-xs flex-shrink-0">
                  <img
                    src={mascot}
                    alt="Devi Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="px-3.5 py-2 text-xs rounded-2xl rounded-tl-none bg-purple-50 text-purple-600 font-medium border border-purple-100 italic">
                  {isEvaluating
                    ? '••• Devi is reviewing your code...'
                    : '••• Devi is thinking...'}
                </div>
              </div>
            )}
          </div>

          {/* Input Form Box bottom sidebar */}
          <form
            onSubmit={handleSendTextMessage}
            className="p-3 bg-transparent border-t border-primary-mid flex gap-2 items-center"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask Devi something... (Enter to send)"
              className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary-mid transition"
              disabled={isEvaluating || isChatting}
            />
            <button
              type="submit"
              disabled={isEvaluating || isChatting || !inputMessage.trim()}
              className="p-2 bg-primary text-white border border-primary rounded-xl transition hover:opacity-90 active:opacity-70"
            >
              <Send size={14} className="transform rotate-90" />
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}
