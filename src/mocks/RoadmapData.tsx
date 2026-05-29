// src/mocks/RoadmapData.tsx
import { type ProjectData } from '../features/roadmap/RoadmapType';

export const MOCK_PROJECT_DATA: ProjectData = {
  projectName: 'Build a REST API from scratch',
  progressPercentage: 11,
  academyData: [
    {
      category: 'SETUP & FOUNDATIONS',
      tasks: [
        {
          id: 'init-vite',
          title: 'Initialize the Vite project',
          status: 'completed',
        },
        { id: 'add-tailwind', title: 'Add Tailwind CSS', status: 'completed' },
        { id: 'setup-routing', title: 'Set up routing', status: 'current' },
      ],
    },
    {
      category: 'AUTH & USER ACCOUNTS',
      tasks: [
        {
          id: 'signup-form',
          title: 'Build the sign-up form',
          status: 'locked',
        },
        {
          id: 'hash-passwords',
          title: 'Hash passwords on the server',
          status: 'locked',
        },
        { id: 'issue-jwt', title: 'Issue a JWT on login', status: 'locked' },
        {
          id: 'protect-routes',
          title: 'Protect routes with middleware',
          status: 'locked',
        },
      ],
    },
  ],
};
