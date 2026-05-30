import { create } from 'zustand';
import type { Project, ChatMessage } from '../types';

interface PlatformState {
  sidebarTab: 'roadmap' | 'explorer';
  setSidebarTab: (tab: 'roadmap' | 'explorer') => void;
  projects: Project[];
  activeProjectId: string;
  activeTaskId: string;
  setActiveTask: (id: string) => void;
  browsingFile: string | null;
  setBrowsingFile: (filePath: string | null) => void;
  chatHistory: ChatMessage[];
  addUserMessage: (text: string) => void;
  isTyping: boolean;
}

export const usePlatformStore = create<PlatformState>((set) => ({
  sidebarTab: 'roadmap',
  setSidebarTab: (tab) => set({ sidebarTab: tab }),
  activeProjectId: 'p1',
  activeTaskId: 't3',
  browsingFile: null,
  setBrowsingFile: (filePath) => set({ browsingFile: filePath }),
  setActiveTask: (id) => set({ activeTaskId: id, browsingFile: null }),
  isTyping: false,
  chatHistory: [
    {
      id: '1',
      sender: 'ai',
      text: 'Your new task is ready! Complete the required file and click Submit when you are done.',
    },
  ],
  addUserMessage: (text) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
    };
    set((state) => ({
      chatHistory: [...state.chatHistory, userMsg],
      isTyping: true,
    }));

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'I have reviewed your source code. The routing structure looks solid, feel free to implement sub-pages!',
      };
      set((state) => ({
        chatHistory: [...state.chatHistory, aiMsg],
        isTyping: false,
      }));
    }, 1800);
  },

  projects: [
    {
      id: 'p1',
      title: 'Build a Twitter Clone',
      sections: [
        {
          id: 's1',
          title: 'Setup & Foundations',
          tasks: [
            {
              id: 't1',
              title: 'Install Dependencies',
              status: 'completed',
              instructions:
                'Install core dependencies like react and react-router-dom.',
              worthXp: 10,
              fileName: 'package.json',
              skeletonCode:
                '{\n  "dependencies": {\n    "react": "^18.2.0",\n    "react-router-dom": "^6.22.0"\n  }\n}',
              solutionKeywords: ['react', 'react-router-dom'],
            },
            {
              id: 't2',
              title: 'Configure Tailwind CSS',
              status: 'completed',
              instructions:
                'Configure tailwind content array to look for paths.',
              worthXp: 20,
              fileName: 'tailwind.config.js',
              skeletonCode:
                'module.exports = {\n  content: ["./src/**/*.{js,jsx,ts,tsx}"],\n  theme: { extend: {} }\n}',
              solutionKeywords: ['content', 'theme'],
            },
            {
              id: 't3',
              title: 'Set up routing',
              status: 'active',
              instructions:
                'Declare your main system routes using createBrowserRouter.',
              worthXp: 30,
              fileName: 'src/router.tsx',
              skeletonCode:
                'import { createBrowserRouter } from "react-router-dom";\n\nexport const router = createBrowserRouter([\n  // Declare your application routes here\n]);',
              solutionKeywords: ['createBrowserRouter', 'router'],
            },
          ],
        },
        {
          id: 's2',
          title: 'Auth & User Accounts',
          tasks: [
            {
              id: 't4',
              title: 'Build the sign-up form',
              status: 'locked',
              instructions:
                'Design a clean template container for signup processes.',
              worthXp: 40,
              fileName: 'src/pages/Signup.tsx',
              skeletonCode:
                'export default function Signup() {\n  return <div>Signup Form Container</div>;\n}',
              solutionKeywords: ['Signup', 'return'],
            },
          ],
        },
      ],
    },
  ],
}));
