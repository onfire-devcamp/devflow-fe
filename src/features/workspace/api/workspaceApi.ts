import { axiosClient } from '../../../lib/axiosClient';
import type {
  APIRoadmapResponse,
  APITaskDetailsResponse,
} from '../../roadmap/RoadmapType';
import type {
  AIChatHistoryResponse,
  AIChatResponse,
  AIEvaluateResponse,
  AIExplainToPassResponse,
  AIHintResponse,
  AppendChatMessageParams,
  AppendChatMessageResponse,
  AutoSaveParams,
  EvaluateCodeParams,
  SubmitExplainToPassParams,
  RequestAiHintParams,
  SendAiChatMessageParams,
} from '../types';

export const workspaceApi = {
  async fetchProjectRoadmap(projectId: string): Promise<APIRoadmapResponse> {
    const response = await axiosClient.get(
      `/project/${projectId.trim()}/roadmap`,
    );
    return response.data;
  },

  async fetchTaskDetails(taskId: string): Promise<APITaskDetailsResponse> {
    const response = await axiosClient.get(`/project/tasks/${taskId}`);
    return response.data;
  },

  async autoSaveTaskFile(params: AutoSaveParams): Promise<void> {
    await axiosClient.put('/workspace/file', {
      projectId: params.projectId.trim(),
      fileId: params.fileId,
      newContent: params.newContent,
    });
  },

  async evaluateCode(params: EvaluateCodeParams): Promise<AIEvaluateResponse> {
    const response = await axiosClient.post('/ai/evaluate', {
      projectId: params.projectId.trim(),
      taskId: params.taskId,
    });
    return response.data;
  },

  async submitExplainToPass(
    params: SubmitExplainToPassParams,
  ): Promise<AIExplainToPassResponse> {
    const response = await axiosClient.post('/ai/explain-to-pass', {
      projectId: params.projectId.trim(),
      taskId: params.taskId,
      mcqAnswer: params.mcqAnswer,
      explanation: params.explanation.trim(),
    });
    return response.data;
  },

  async requestAiHint(params: RequestAiHintParams): Promise<AIHintResponse> {
    const response = await axiosClient.post('/ai/hint', {
      projectId: params.projectId.trim(),
      taskId: params.taskId,
      fileId: params.fileId,
      type: params.type,
      selectedCode: params.selectedCode,
      userQuestion: params.userQuestion,
    });
    return response.data;
  },

  async sendAiChatMessage(
    params: SendAiChatMessageParams,
  ): Promise<AIChatResponse> {
    const response = await axiosClient.post('/ai/chat', {
      projectId: params.projectId.trim(),
      taskId: params.taskId,
      message: params.message,
    });
    return response.data;
  },

  async fetchChatHistory(
    projectId: string,
    taskId: string,
  ): Promise<AIChatHistoryResponse> {
    const response = await axiosClient.get(
      `/ai/chat/${projectId.trim()}/${taskId}`,
    );
    return response.data;
  },

  async appendChatMessage(
    params: AppendChatMessageParams,
  ): Promise<AppendChatMessageResponse> {
    const response = await axiosClient.post('/ai/chat/message', {
      projectId: params.projectId.trim(),
      taskId: params.taskId,
      sender: params.sender,
      text: params.text,
      isPassAction: params.isPassAction,
    });
    return response.data;
  },
};
