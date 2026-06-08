import { axiosClient } from '../../../lib/axiosClient';
import type {
  APIRoadmapResponse,
  APITaskDetailsResponse,
} from '../../roadmap/RoadmapType';
import type {
  AIChatResponse,
  AIEvaluateResponse,
  AIExplainToPassResponse,
  AIHintResponse,
  AutoSaveParams,
  EvaluateCodeParams,
  SubmitExplainToPassParams,
  RequestAiHintParams,
  SendAiChatMessageParams,
} from '../types';

export const workspaceApi = {
  /**
   * Fetch project roadmap data including modules and tasks
   */
  async fetchProjectRoadmap(projectId: string): Promise<APIRoadmapResponse> {
    const response = await axiosClient.get(
      `/project/${projectId.trim()}/roadmap`,
    );
    return response.data;
  },

  /**
   * Fetch detailed content for a specific task
   */
  async fetchTaskDetails(taskId: string): Promise<APITaskDetailsResponse> {
    const response = await axiosClient.get(`/project/tasks/${taskId}`);
    return response.data;
  },

  /**
   * Auto-save task file content with debouncing
   */
  async autoSaveTaskFile(params: AutoSaveParams): Promise<void> {
    await axiosClient.put('/workspace/file', {
      projectId: params.projectId.trim(),
      fileId: params.fileId,
      newContent: params.newContent,
    });
  },

  /**
   * Evaluate submitted code for the current task
   */
  async evaluateCode(params: EvaluateCodeParams): Promise<AIEvaluateResponse> {
    const response = await axiosClient.post('/ai/evaluate', {
      projectId: params.projectId.trim(),
      taskId: params.taskId,
    });
    return response.data;
  },

  /**
   * Submit Explain-to-Pass answers (MCQ + explanation)
   */
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

  /**
   * Request AI hint or explanation for selected code
   */
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

  /**
   * Send a text message to the AI mentor
   */
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
};
