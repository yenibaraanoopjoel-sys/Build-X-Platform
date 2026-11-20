# Low-Level Design (LLD) — BuildX Platform

**Project Name:** BuildX Platform  
**Target Runtime:** Node.js 20.x, React 18.x, Express 4.x, MongoDB 7.x, PostgreSQL  
**Document Version:** 2.0.0 (Production Release)  
**Status:** Approved & Implemented  

---

## 1. Directory Structure

```text
BuildX/
├── client/                     # React 18 SPA Frontend (Vercel)
│   ├── public/
│   │   ├── index.html
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Jarvis.jsx      # AI Co-pilot floating assistant
│   │   │   ├── Loader.jsx      # Glassmorphic loading spinner
│   │   │   └── Navbar.jsx      # Global navigation & live presence
│   │   ├── context/
│   │   │   └── AuthContext.js  # Global JWT authentication provider
│   │   ├── pages/              # Application views
│   │   │   ├── Chat.jsx        # Socket.IO real-time direct & channel chat
│   │   │   ├── Dashboard.jsx   # Analytics & personalized dashboard
│   │   │   ├── Ideas.jsx       # Ideas discovery & collaboration hub
│   │   │   ├── Login.jsx       # JWT authentication & session login
│   │   │   ├── PostIdea.jsx    # Idea creation with AI assistance
│   │   │   ├── Profile.jsx     # Profile management & public portfolios
│   │   │   ├── ProjectWorkspace.jsx # Project management & team rosters
│   │   │   ├── Register.jsx    # User registration with role selection
│   │   │   ├── SkillSwap.jsx   # P2P skill matching marketplace
│   │   │   ├── Tasks.jsx       # Kanban board with AI task generator
│   │   │   └── VideoCall.jsx   # ZEGOCLOUD WebRTC video rooms
│   │   ├── services/
│   │   │   ├── aiService.js    # Multi-tier AI communication handler
│   │   │   └── api.js          # Axios client with JWT interceptor
│   │   └── styles/
│   │       └── global.css      # SaaS glassmorphism styling
├── server/                     # Express.js REST & Socket.IO Backend (Render)
│   ├── config/
│   │   └── db.js               # MongoDB Mongoose connection
│   ├── controllers/            # Controller business logic
│   │   ├── authController.js   # Registration, JWT login, bcrypt hashing
│   │   ├── ideaController.js   # Ideas CRUD & comments
│   │   ├── projectController.js# Projects CRUD & MongoDB Aggregation Pipelines
│   │   ├── taskController.js   # Kanban tasks CRUD & assignment
│   │   └── userControllers.js  # User profiles & skill directory
│   ├── database/               # SQL & Relational Models
│   │   ├── schema.sql          # PostgreSQL DDL with PK/FK, JOINS, Normalization
│   │   └── prisma/
│   │       └── schema.prisma   # Prisma ORM schema
│   ├── middleware/             # Express middlewares
│   │   ├── authMiddleware.js   # JWT token verification
│   │   ├── errorMiddleware.js  # Global centralized error handler
│   │   └── security.js         # Rate limiting, NoSQL sanitizer, RBAC
│   ├── models/                 # Mongoose NoSQL Schemas
│   │   ├── Idea.js
│   │   ├── Message.js
│   │   ├── Notification.js
│   │   ├── Project.js
│   │   ├── Task.js
│   │   └── User.js
│   ├── routes/                 # REST Route definitions
│   │   ├── aiRoutes.js         # AI endpoints (SSE, Tools, Structured Outputs, RAG)
│   │   ├── authRoutes.js
│   │   ├── ideaRoutes.js
│   │   ├── projectRoutes.js
│   │   └── taskRoutes.js
│   ├── tests/                  # Automated Test Suite
│   │   ├── runner.test.js      # Native Node test runner suite
│   │   └── api.test.js         # Jest/Integration test suite
│   ├── utils/                  # Core JS concepts & matching algorithm
│   │   ├── jsConcepts.js       # Closures, Hoisting, Promises, Event Loop
│   │   └── matchAlgorithm.js   # Jaccard skill-match score calculator
│   ├── Dockerfile              # Multi-stage production container
│   ├── package.json
│   └── server.js               # Main HTTP & Socket.IO entry point
├── docker-compose.yml          # Local multi-service orchestration
├── render.yaml                 # Render Infrastructure-as-Code blueprint
├── vercel.json                 # Vercel Edge routing configuration
├── HLD.md                      # High-Level Design document
├── LLD.md                      # Low-Level Design document
└── PRD.md                      # Product Requirements Document
```

---

## 2. API Contract Specification

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user with password hash | No |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT token | No |
| `GET` | `/api/users/profile` | Get authenticated user profile | Yes (Bearer) |
| `GET` | `/api/projects` | List projects with filters | No |
| `POST` | `/api/projects` | Create new project | Yes (Bearer) |
| `GET` | `/api/projects/analytics/stats` | MongoDB Aggregation Pipeline stats | No |
| `GET` | `/api/tasks/project/:projectId` | Fetch project Kanban tasks | Yes (Bearer) |
| `POST` | `/api/tasks` | Create new task | Yes (Bearer) |
| `POST` | `/api/ai` | JARVIS chat assistant | No |
| `POST` | `/api/ai/task-breakdown` | Structured JSON task sprint breakdown | No |
| `GET` | `/api/ai/tools` | Function calling / tool use spec | No |
| `GET` | `/api/ai/stream` | Server-Sent Events (SSE) token stream | No |
| `POST` | `/api/ai/rag-search` | Vector / embedding similarity search | No |
| `GET` | `/api/ai/metrics` | Token and cost telemetry | No |

---

## 3. Database Modeling & Relationships

### MongoDB (NoSQL Implementation)
```text
User ──── (1:N) ──── Owned Projects
User ──── (N:M) ──── Project Members
Project ── (1:N) ──── Tasks (Referenced)
Idea ──── (1:N) ──── Comments (Embedded Subdocuments)
User ──── (1:N) ──── Notifications (Embedded / Referenced)
```

### PostgreSQL (Relational Implementation)
```text
users (PK: user_id)
  ├── user_skills (FK: user_id -> users.user_id ON DELETE CASCADE)
  ├── projects (FK: owner_id -> users.user_id ON DELETE RESTRICT)
  │     ├── project_members (Composite PK: project_id, user_id)
  │     └── tasks (FK: project_id -> projects.project_id ON DELETE CASCADE)
  └── task_assignee (FK: assigned_to -> users.user_id ON DELETE SET NULL)
```

---

## 4. Real-Time Socket.IO Event Map

| Event Name | Direction | Payload | Description |
|---|---|---|---|
| `join_user` | Client -> Server | `userId: string` | Registers user to private socket room |
| `online_users` | Server -> Client | `userIds: string[]` | Broadcasts active user presence list |
| `send_message` | Client -> Server | `{ senderId, receiverId, text }` | Direct peer-to-peer message |
| `receive_message`| Server -> Client | Message Object | Delivers message to recipient room |
| `task_updated` | Client -> Server | `{ taskId, status, projectId }` | Broadcasts Kanban task movement |
| `task_update_received`| Server -> Client | Task Object | Synchronizes Kanban UI across clients |
| `typing` | Client -> Server | `{ sender, receiver }` | Live typing indicator |
