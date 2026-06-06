import { useEffect, useState } from 'react';
import { getProjectById } from '../api/projectsApi';
import type { ProjectDetail } from '../types/projectTypes';
import twitterPreview from '../../../assets/twitter-project.png';

const MOCK_PROJECT: ProjectDetail = {
  id: 'demo',
  title: 'Build a Twitter Clone',
  description:
    'You will build a working microblog: users sign up, post short messages, follow each other, and see a live feed. Along the way you will learn React state, REST APIs, auth tokens, and database design — by actually shipping each piece.',
  category: 'FULLSTACK',
  difficulty: 'INTERMEDIATE',
  estimatedHours: 14,
  moduleCount: 5,
  status: 'NOT_STARTED',
  previewUrl: twitterPreview,
  features: [
    'User sign-up and JWT-based authentication',
    'Post short messages (tweets) up to 280 characters',
    'Follow / unfollow other users',
    'Live feed showing posts from people you follow',
    'Like and retweet functionality',
    'Notification system for new followers and likes',
    "Responsive UI matching Twitter's core layout",
  ],
  techStack: [
    'React',
    'TypeScript',
    'Node.js',
    'Express',
    'MongoDB',
    'Tailwind CSS',
    'JWT',
    'Socket.io',
  ],
  systemFlowUrl:
    'https://placehold.co/1200x700/f9fafb/6b7280?text=System+Flow+Diagram',
  codebaseUrl: 'https://github.com',
};

type UseProjectDetailState = {
  project: ProjectDetail | null;
  isLoading: boolean;
  error: string | null;
};

// Flip to false when /api/projects/:id endpoint is ready
const USE_MOCK_DATA = true;

export function useProjectDetail(
  id: string | undefined,
): UseProjectDetailState {
  const [state, setState] = useState<UseProjectDetailState>(() => {
    // Handle missing ID at initialization
    if (!id) {
      return {
        project: null,
        isLoading: false,
        error: 'Project not found.',
      };
    }

    // Handle mock data at initialization
    if (USE_MOCK_DATA) {
      return {
        project: { ...MOCK_PROJECT, id },
        isLoading: false,
        error: null,
      };
    }

    // For real API calls, use loading state
    return {
      project: null,
      isLoading: true,
      error: null,
    };
  });

  useEffect(() => {
    // Skip effect if no ID or using mock data (already handled in initializer)
    if (!id || USE_MOCK_DATA) {
      return;
    }

    let active = true;

    getProjectById(id)
      .then((project) => {
        if (active) setState({ project, isLoading: false, error: null });
      })
      .catch(() => {
        if (active)
          setState({
            project: null,
            isLoading: false,
            error: 'Failed to load project.',
          });
      });

    return () => {
      active = false;
    };
  }, [id]);

  return state;
}
