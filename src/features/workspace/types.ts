import type { editor } from 'monaco-editor';
import type { CategoryGroup, ProjectDetails } from '../roadmap/RoadmapType';

export type PassStatus = 'PASS' | 'FAIL' | 'UNKNOWN';

export interface AIEvaluateResponse {
  success: boolean;
  data: {
    score: number;
    feedback: string;
    passStatus: PassStatus;
  };
}

export interface AIExplainToPassResponse {
  success: boolean;
  data: {
    score: number;
    feedback: string;
    passStatus: PassStatus;
  };
}

export interface AIHintResponse {
  success: boolean;
  data: {
    aiResponse: string;
  };
}

export interface AIChatResponse {
  success: boolean;
  data: {
    message: string;
  };
}

export interface AIChatHistoryResponse {
  success: boolean;
  data: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  isPassAction?: boolean;
}

export interface WorkspaceData {
  projectDetails: ProjectDetails | null;
  roadmapData: CategoryGroup[];
  activeTaskId: string;
}

export interface TaskEditorState {
  activeFileId: string | null;
  fileContents: Record<string, string>;
  editorInstance: editor.IStandaloneCodeEditor | null;
  hasSelection: boolean;
}

export interface DeviChatState {
  messages: ChatMessage[];
  isChatting: boolean;
  isEvaluating: boolean;
  inputMessage: string;
  showExplainToPassForm: boolean;
  mcqAnswer: string;
  explanation: string;
}

export interface ExplainToPassData {
  question?: string;
  options?: string[];
}

export interface AutoSaveParams {
  projectId: string;
  fileId: string;
  newContent: string;
}

export interface EvaluateCodeParams {
  projectId: string;
  taskId: string;
}

export interface SubmitExplainToPassParams {
  projectId: string;
  taskId: string;
  mcqAnswer: string;
  explanation: string;
}

export interface RequestAiHintParams {
  projectId: string;
  taskId: string;
  fileId: string;
  type: 'explain' | 'hint';
  selectedCode: string;
  userQuestion: string;
}

export interface SendAiChatMessageParams {
  projectId: string;
  taskId: string;
  message: string;
}

export interface AppendChatMessageParams {
  projectId: string;
  taskId: string;
  sender: 'user' | 'ai';
  text: string;
  isPassAction?: boolean;
}

export interface AppendChatMessageResponse {
  success: boolean;
  data: ChatMessage;
}
