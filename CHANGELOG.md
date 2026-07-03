# Changelog

## v1.1.2

### Added or Changed

- **AI Mentor Persona Separation**
  - _Before:_ The AI Mentor used a single generic prompt for all interactions, causing inconsistent tone between hinting and code explanation.
  - _After:_ We separated the system prompts into distinct personas (`HINT_SYSTEM_PROMPT` vs `EXPLAIN_SYSTEM_PROMPT`), ensuring the AI provides targeted guidance versus strict explanations.
  - PR: [#47](https://github.com/onfire-devcamp/devflow-fe/pull/47)
- **Context-Aware AI Generation**
  - _Before:_ The AI was unaware of the user's active file name or specific task instructions, often resulting in generic or slightly off-topic feedback.
  - _After:_ The prompt is now dynamically formatted with XML tags (`<task_context>` and `<current_file>`) injecting the exact `codeContext` and `currentFileName` for hyper-relevant guidance.
  - PR: [#47](https://github.com/onfire-devcamp/devflow-fe/pull/47)
- **Explain-to-Pass Anti-Cheat**
  - _Before:_ Users could bypass the conceptual check by thoughtlessly copy-pasting the exact MCQ answer into the "Explain your answer" text area.
  - _After:_ A strict anti-cheat evaluation protocol penalizes copy-pasting with an automatic 0 score, and the frontend UI explicitly prompts users to "explain what you did in this task" in their own words.
  - PR: [#51](https://github.com/onfire-devcamp/devflow-fe/pull/51)
- **Dashboard UI Polish**
  - _Before:_ The dashboard page featured a flat MVP aesthetic with a white background and hard borders on empty streak days, causing cards to blend into the main layout.
  - _After:_ We upgraded to a premium SaaS aesthetic by adding a subtle `bg-slate-50` page background to contrast pure white cards, applied `shadow-sm` and hover shadow effects to the main components, and refined the empty states for a cleaner look.
  - PR: [#52](https://github.com/onfire-devcamp/devflow-fe/pull/52)

## v1.1.1

### Added or Changed

- **README Overhaul:** Generated a production-grade `README.md` with full codebase-scanned Tech Stack, Project Architecture, and Bulletproof React structure documentation.
- **Features & Showcase:** Expanded the Features section to 7 chronological subsections (Authentication, Dashboard, Project Preview, Workspace, AI Mentor, Explain-to-Pass, Profile) with real demo images from `.github/assets/`.
- **App Branding:** Added the DevFlow `logo.png` to the `<h1>` title in the README header, replacing the generic emoji.
- **OG Media:** Added an animated OG GIF for social media link previews and updated `og-image` assets.
- **Contributors Section:** Integrated the automated `contrib.rocks` dynamic contributor image.

### Removed

- Removed all `[Image Placeholder: ...]` tags and replaced them with real markdown image links.
- Removed the "Graceful Rate-Limit Handling" subsection from Features (moved to an internal architecture concern).

---

## v1.1.0

### Added or Changed

- **Monaco Editor Zero-Render Context Extraction:** Implemented imperative `editorInstance.getValue()` and `editorInstance.getModel().uri` calls inside the `useDeviChat` React Query mutation to extract `codeContext` and `currentFileName` without triggering React re-renders.
- **Current File Name Injection:** Refined the AI chat prompt to include the active file name alongside the code context for more targeted mentor responses.
- **Dynamic SEO via react-helmet-async:** Added `<HelmetProvider>` wrapping in `main.tsx` and created a reusable `<SEO />` component for route-specific `<title>` and `<meta>` tag injection.
- **Open Graph Meta Tags:** Added baseline OG tags (`og:type`, `og:title`, `og:description`, `og:image`) and Twitter card metadata directly in `index.html`.
- **Global Axios 429 Interceptor:** Built a centralized response interceptor in `axiosClient.ts` that catches HTTP 429 errors and displays the backend-provided rate-limit message via the Zustand-powered toast notification system.
- **Toast Notification System:** Implemented a global `toastStore` (Zustand) with persistent and timed toast support, wired into the Axios interceptor for network errors, 404s, and rate limits.
- **CI/CD Pipeline:** Added GitHub Actions workflow for automated linting and type checking on pushes and PRs to `main`.
- **Loading UI:** Created a CSS-only preloader with animated dots directly in `index.html` for instant perceived load before the React bundle hydrates.
- **Preload Optimization:** Added `<link rel="preload">` for the loading GIF asset to improve First Contentful Paint.
- **UI Previews & System Flow Images:** Added static preview images and system architecture flow diagrams for all 4 seed projects (Single-Page CV, Twitter Clone, Kahoot Clone, URL Shortener).
- **Landing Page:** Built a complete landing page with Hero Section, Features Section, CTA Section, and Footer.
- **Profile Page Refinements:** Fixed UI bugs, added Terms and Conditions, and refined the profile edit mode with input validation (reject blank names, validate URLs).
- **Project Summary & Scorecard:** Implemented the project summary page and scorecard modal with completion statistics.
- **Workspace Lock Logic:** Enforced sequential task unlocking on the frontend to match backend access control.
- **Codebase Feature Tab:** Added the project codebase file-tree viewer with performance-optimized tree rendering.
- **404 Not Found Page:** Created a dedicated 404 page and added `vercel.json` SPA rewrite rules.
- **Offline Notifications:** Replaced error pages with toast notifications when the internet connection drops.
- **Mobile Responsiveness:** Fixed critical UI bugs on mobile viewports (scrollbar hiding, layout shifts, cursor pointers).

---

## v1.0.0

### Added or Changed

- **Project Initialization:** Scaffolded the React 19 + Vite + TypeScript frontend following the "Bulletproof React" feature-based architecture.
- **Authentication Flow:** Implemented login and registration forms with `react-hook-form`, JWT access/refresh token handling, and the global `authStore` (Zustand).
- **Google OAuth Integration:** Added `@react-oauth/google` with `useGoogleAuth` hook and environment fail-fast for missing `VITE_GOOGLE_CLIENT_ID`.
- **Refresh Token Flow:** Wired up automatic token refresh with a failed-request queue in the Axios interceptor to seamlessly retry 401'd requests after token rotation.
- **AppProvider Architecture:** Extracted all global providers (React Query, Google OAuth, Router) into a dedicated `AppProvider.tsx` with environment variable validation.
- **Axios Client:** Created a centralized `axiosClient.ts` with request interceptor (auto-attach Bearer token) and response interceptor (global error routing for 401, 404, 429, network errors).
- **Dashboard Page:** Implemented the dashboard with `ContinueLearningCard`, `ProjectCard`, `WeeklyStreakCard`, and API integration via `useDashboardData` hook.
- **Project Detail Page:** Built the project detail page with tabbed navigation (Features, Tech Stack, Codebase, System Flow) using SPA tab switching.
- **Roadmap Feature:** Integrated TanStack Query-backed roadmap service with module/task sequential unlocking, progress bars, and status badges.
- **Workspace Feature:** Built the interactive coding workspace with Monaco Editor integration, multi-file tab management, and auto-save logic.
- **AI Chat Panel:** Implemented the `DeviChatPanel` with cursor-paginated chat history, optimistic message updates, and TanStack Query infinite scrolling.
- **Explain-to-Pass UI:** Wired up the Explain-to-Pass modal with MCQ and text explanation submission, score evaluation, and task completion gating.
- **Routing & Guards:** Set up `react-router-dom` v7 with `PrivateRoute` and `PublicRoute` guards, slug-based project routing, and default redirect to `/dashboard`.
- **Shared UI Components:** Created reusable `Button`, `Badge`, `ErrorBoundary`, `MarkdownRenderer`, and icon components (`GithubIcon`, `GoogleIcon`, `LinkedinIcon`).
- **Global Stores:** Initialized Zustand stores for `authStore`, `toastStore`, `errorStore`, and `offlineSyncStore`.
- **Utility Functions:** Added shared utilities for file icons, file tree construction, form helpers, and export (JSZip, HTML-to-Image, File Saver).
- **Tailwind CSS v4:** Configured Tailwind CSS with PostCSS and `tailwind-merge` for conditional class composition.
- **Husky & Commitlint:** Set up Git hooks with Husky, lint-staged (ESLint + Prettier), and conventional commit enforcement.
- **Vercel Deployment:** Added `vercel.json` with SPA rewrite rules for client-side routing support.
