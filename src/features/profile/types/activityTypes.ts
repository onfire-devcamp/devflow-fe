export type ActivityType = 'PROJECT_START' | 'TASK_SUBMIT_FAIL' | 'TASK_PASS';

export interface ActivityResponse {
  userId: string;
  projectId: string;
  type: ActivityType;
  moduleName: string;
  activityTitle: string;
  createdAt: string;
}
