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
    return axiosClient.get<APIRoadmapResponse, APIRoadmapResponse>(
      `/project/${projectId.trim()}/roadmap`,
    );
  },

  async fetchTaskDetails(taskId: string): Promise<APITaskDetailsResponse> {
    return axiosClient.get<APITaskDetailsResponse, APITaskDetailsResponse>(
      `/project/tasks/${taskId}`,
    );
  },

  async autoSaveTaskFile(params: AutoSaveParams): Promise<void> {
    return axiosClient.put('/workspace/file', {
      projectId: params.projectId.trim(),
      fileId: params.fileId,
      newContent: params.newContent,
    });
  },

  async evaluateCode(params: EvaluateCodeParams): Promise<AIEvaluateResponse> {
    return axiosClient.post<AIEvaluateResponse, AIEvaluateResponse>(
      '/ai/evaluate',
      {
        projectId: params.projectId.trim(),
        taskId: params.taskId,
      },
    );
  },

  async submitExplainToPass(
    params: SubmitExplainToPassParams,
  ): Promise<AIExplainToPassResponse> {
    return axiosClient.post<AIExplainToPassResponse, AIExplainToPassResponse>(
      '/ai/explain-to-pass',
      {
        projectId: params.projectId.trim(),
        taskId: params.taskId,
        mcqAnswer: params.mcqAnswer,
        explanation: params.explanation.trim(),
      },
    );
  },

  async requestAiHint(params: RequestAiHintParams): Promise<AIHintResponse> {
    return axiosClient.post<AIHintResponse, AIHintResponse>('/ai/hint', {
      projectId: params.projectId.trim(),
      taskId: params.taskId,
      fileId: params.fileId,
      type: params.type,
      selectedCode: params.selectedCode,
      userQuestion: params.userQuestion,
    });
  },

  async sendAiChatMessage(
    params: SendAiChatMessageParams,
  ): Promise<AIChatResponse> {
    return axiosClient.post<AIChatResponse, AIChatResponse>('/ai/chat', {
      projectId: params.projectId.trim(),
      taskId: params.taskId,
      message: params.message,
    });
  },

  async fetchChatHistory(
    projectId: string,
    taskId: string,
    cursor?: string,
    limit: number = 4,
  ): Promise<AIChatHistoryResponse> {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (cursor) params.append('cursor', cursor);

    return axiosClient.get<AIChatHistoryResponse, AIChatHistoryResponse>(
      `/ai/chat/${projectId.trim()}/${taskId}?${params.toString()}`,
    );
  },

  async appendChatMessage(
    params: AppendChatMessageParams,
  ): Promise<AppendChatMessageResponse> {
    return axiosClient.post<
      AppendChatMessageResponse,
      AppendChatMessageResponse
    >('/ai/chat/message', {
      projectId: params.projectId.trim(),
      taskId: params.taskId,
      sender: params.sender,
      text: params.text,
      isPassAction: params.isPassAction,
    });
  },
};
