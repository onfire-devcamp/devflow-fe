export type ActivityType = 'PROJECT_START' | 'TASK_SUBMIT_FAIL' | 'TASK_PASS';

export interface ActivityResponse {
  _id?: string;
  userId: string;
  projectId: string | { _id: string; title: string; slug: string };
  type: ActivityType;
  moduleName: string;
  activityTitle: string;
  createdAt: string;
}
