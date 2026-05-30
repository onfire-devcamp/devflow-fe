export interface Task {
  id: string;
  title: string;
  status: 'completed' | 'active' | 'locked';
  instructions: string;
  worthXp: number;
  fileName: string;
  skeletonCode: string;
  solutionKeywords: string[];
}

export interface TaskSection {
  id: string;
  title: string;
  tasks: Task[];
}

export interface Project {
  id: string;
  title: string;
  sections: TaskSection[];
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
}
