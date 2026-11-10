# Product Requirements Document (PRD) — BuildX Platform

**Project Name:** BuildX  
**Tagline:** Connect. Collaborate. Create. Grow.  
**Version:** 1.0.0 (Production)  
**Author:** BuildX Architecture & Engineering Team  
**Status:** Approved & Implemented  
**Date:** November 2026  

---

## 1. Executive Summary

BuildX is an all-in-one full-stack innovation, collaboration, and peer-learning web platform engineered for students, developers, designers, entrepreneurs, and investors. The platform bridges the gap between ideation and execution by providing integrated tools to publish ideas, discover complementary skill partners, manage Kanban sprint tasks, communicate via real-time chat, conduct video collaboration, and leverage an intelligent AI assistant (JARVIS).

The platform is built exclusively on modern web standards (React.js, JavaScript ES6+, Cloud Firestore, Firebase Authentication, Firebase Hosting, and ZEGOCLOUD WebRTC).

---

## 2. Target Audience & Personas

| Persona | Description & Goals | Key Platform Value |
|---|---|---|
| **Idea Creators & Entrepreneurs** | Visionaries seeking technical talent, validation, and execution partners. | Ideas Hub, pitching tools, collaboration requests. |
| **Developers & Engineers** | Software builders looking to contribute to real-world projects and acquire new skills. | Project Workspace, Kanban task board, real-time code chat. |
| **UI/UX Designers** | Creatives wanting to craft modern user interfaces and build portfolio pieces. | Design channels, idea collaboration, video workshops. |
| **Students & Learners** | Ambitious individuals eager to exchange knowledge (e.g. teach React to learn UI/UX). | Skill Swap matching engine, peer-to-peer exchanges. |
| **Investors & Mentors** | Industry leaders seeking high-potential innovation projects and vetted teams. | Analytics dashboard, public project portfolios. |

---

## 3. Problem Statement & Value Proposition

### The Problem
1. **Fragmented Collaboration**: Builders currently juggle multiple disconnected tools (Discord for chat, Trello for tasks, Zoom for calls, LinkedIn for networking) to build simple projects.
2. **Cold Outreach Friction**: Finding peers with complementary skills (e.g. Frontend developer needing a backend engineer) requires manual scouring on social media.
3. **Execution Gap**: Most early-stage ideas never move beyond brainstorm notes due to lack of sprint task tracking and technical mentorship.

### The BuildX Solution
BuildX unifies the entire project lifecycle into a cohesive, futuristic SaaS interface:
- **Discover**: Find ideas, projects, and peers filtered by tech stack and category.
- **Match**: Automated skill-exchange pairing based on "Skills I Have" vs. "Skills I Want to Learn".
- **Collaborate**: Real-time Firestore group channels, direct 1:1 messaging, and embedded ZEGOCLOUD video meetings.
- **Execute**: Interactive Kanban task management with AI-powered task breakdowns via JARVIS.

---

## 4. Comprehensive Module Specifications

### Module 1: Authentication & Role-Based Access Control (RBAC)
- **Email/Password**: Registration with full validation, password complexity check, and password reset email dispatch.
- **Google OAuth**: One-click Sign-In with Google using persistent local sessions and automatic Firestore profile provisioning.
- **Role Selection**: User roles assigned upon onboarding (Developer, Designer, Idea Creator, Entrepreneur, Student, Learner, Investor, Project Collaborator).
- **Security**: Protected route wrapper (`PrivateRoute`, `PublicOnlyRoute`), token expiration handling, and Firestore security rules enforcement.

### Module 2: Personalized User Dashboard
- **Welcome Banner**: Dynamic greeting tailored to user's professional role and name.
- **Live Metrics**: Total projects, active projects, completed projects, ideas published, and task completion rates pulled directly from Cloud Firestore.
- **Visual Analytics**: Interactive task status distribution and project health metrics rendered via Recharts.
- **Recommendations**: Automated feed of recommended projects matching user skills, and recommended peers for collaboration.

### Module 3: User Profiles & Portfolio
- **Public Profile**: Shareable user view showing bio, role, avatar seed, skills available, skills to learn, social links (GitHub, LinkedIn, Website), and achievements.
- **Live Editing**: Inline profile update modal with instantaneous state and Firestore synchronization.

### Module 4: Ideas Hub
- **Idea Publishing**: Form capturing title, description, category, and required skill tags.
- **Social Engagement**: Real-time likes/unlikes with duplicate prevention, and timestamped comment threads.
- **Collaboration Triggers**: Direct "Request Collaboration" action allowing visitors to express interest in joining an idea.

### Module 5: Projects Workspace
- **Project Lifecycle**: Supports 4 distinct statuses: `Planning`, `Active`, `On Hold`, `Completed`.
- **Team Collaboration**: Project creator acts as owner; team members can be invited and assigned roles.
- **Progress Tracking**: Numeric completion percentage slider and task summary integration.

### Module 6: Task Management (Kanban Board)
- **Columns**: 4 drag-and-drop / click-to-move columns: `To Do`, `In Progress`, `Review`, `Completed`.
- **Task Metadata**: Title, description, priority (`High`, `Medium`, `Low`), deadline, assignee, and project association.
- **JARVIS AI Sprint Breakdown**: Input a project milestone, and JARVIS generates 4 structured engineering tasks directly into the Kanban board.

### Module 7: Skill Swap Engine
- **Matching Algorithm**: Evaluates current user's `skillsHave` and `skillsWant` against all registered members to calculate an affinity score.
- **Exchange Requests**: Send formal swap proposals specifying offered skill and requested skill.
- **Status Workflow**: Tracks swap states (`pending`, `accepted`, `rejected`, `completed`).

### Module 8: Collaboration Requests
- **Dual Perspective**: Dedicated views for incoming proposals and outgoing applications.
- **Decision Engine**: Accept or reject incoming requests with automatic project team roster synchronization.

### Module 9: Real-Time Messaging System
- **Firestore Subcollections**: Uses Firestore `onSnapshot` real-time listeners (no external Socket.IO dependency).
- **Public Innovation Channels**: General Community, Design Systems, Startups & Dev.
- **1:1 Direct Chat**: Instant peer-to-peer conversations with automated thread creation and unread status.

### Module 10: WebRTC Video Collaboration
- **Powered by ZEGOCLOUD UIKit**: High-definition video, crystal-clear audio, and screen sharing.
- **Meeting Rooms**: Custom meeting room links for scheduled or ad-hoc project standups.
- **Token Resilience**: Cloud Function token generation with client fallback.

### Module 11: Real-Time Notifications
- **Navbar Notification Bell**: Real-time badge counter indicating unread alerts.
- **Triggers**: Collaboration requests, task assignments, skill swap offers, and idea interactions.

### Module 12: JARVIS AI Assistant
- **Floating Co-pilot**: Expandable conversational AI available on all pages.
- **Multi-Tier Resilience**:
  1. Primary: Cloud Functions endpoint.
  2. Secondary: Direct Google Gemini 1.5 Flash REST API.
  3. Tertiary: OpenRouter API.
  4. Quaternary: Contextual engineering heuristic engine.

### Module 13: Global Search & Discovery
- **Unified Query**: Single search bar in navigation header matching users by skill, projects by name, and ideas by keyword.

### Module 14: Settings & Preferences
- **Platform Controls**: Notification preferences, sound toggles, public profile visibility, and password reset trigger.

---

## 5. Non-Functional Requirements (NFR)

1. **Performance**: Initial page load under 1.5s via React code splitting (`React.lazy` and `Suspense`).
2. **Security**: Granular Firestore security rules (`firestore.rules`) enforcing document ownership and authenticated read/write access.
3. **Reliability**: 99.9% uptime hosted on Google Firebase global CDN. Zero crashes on third-party service degradation via fallback handlers.
4. **Responsiveness**: Fully fluid design optimized for desktop (1920x1080), tablet (768x1024), and mobile viewports (375x812).
5. **Data Integrity**: Automated schema normalization with `createdAt` and `updatedAt` timestamps on all Firestore records.

---

## 6. Acceptance Criteria

- [x] Zero build compilation errors (`npm run build` exits with code 0).
- [x] Hosted and operational on Firebase Hosting (`https://buildx-63e3f.web.app`).
- [x] All 14 application modules fully functional with database integration.
- [x] Real-time updates on Tasks, Chat, Ideas, and Notifications without page refresh.
