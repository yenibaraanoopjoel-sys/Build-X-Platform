# Low-Level Design (LLD) — BuildX Platform

**Project Name:** BuildX Platform  
**Target Runtime:** Node.js 20.x, React 18.x, Firebase Web SDK 10.x  
**Document Version:** 1.0.0  
**Status:** Approved & Implemented  

---

## 1. Directory Structure

```text
BuildX/
├── client/
│   ├── public/
│   │   ├── index.html
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/
│   │   │   ├── Jarvis.jsx          # AI Co-pilot floating assistant
│   │   │   ├── Loader.jsx          # Glassmorphic loading spinner
│   │   │   └── Navbar.jsx          # Main navigation & notifications
│   │   ├── context/
│   │   │   └── AuthContext.js      # Global authentication provider
│   │   ├── firebase/
│   │   │   └── config.js           # Firebase Client SDK initialization
│   │   ├── pages/
│   │   │   ├── Chat.jsx            # Real-time messaging & public channels
│   │   │   ├── CollaborationRequests.jsx # Proposal management
│   │   │   ├── Dashboard.jsx       # Analytics & recommendation overview
│   │   │   ├── Ideas.jsx           # Ideas hub & social engagement
│   │   │   ├── Login.jsx           # OAuth & password login
│   │   │   ├── NotFound.jsx        # 404 error page
│   │   │   ├── PostIdea.jsx        # Idea creation with AI enhancer
│   │   │   ├── Profile.jsx         # Profile inspection & editing
│   │   │   ├── ProjectWorkspace.jsx# Project creation & member rosters
│   │   │   ├── Register.jsx        # User onboarding with role selection
│   │   │   ├── Settings.jsx        # Preferences & password reset
│   │   │   ├── SkillSwap.jsx       # P2P skill exchange marketplace
│   │   │   ├── Tasks.jsx           # Kanban board with AI sprint generator
│   │   │   ├── VideoCall.jsx       # ZEGOCLOUD WebRTC meeting room
│   │   │   └── Welcome.jsx         # Public landing page
│   │   ├── services/
│   │   │   ├── aiService.js        # Multi-tier AI communication handler
│   │   │   ├── api.js              # Axios instance with auth interceptors
│   │   │   └── firestoreService.js # Granular Firestore CRUD operations
│   │   ├── styles/
│   │   │   └── global.css          # Futuristic SaaS styling system
│   │   ├── App.js                  # Application routing & provider tree
│   │   ├── index.js                # React DOM root render
│   │   └── routes.jsx              # Private & Public Route guards
│   └── package.json
├── functions/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── aiController.js     # Server-side Gemini & OpenRouter bridge
│   │   │   ├── analyticsController.js # Firestore metrics aggregation
│   │   │   ├── authController.js   # User profile synchronization
│   │   │   ├── matchController.js  # Skill matching affinity scoring
│   │   │   └── videoController.js  # ZEGOCLOUD token generator
│   │   ├── middleware/
│   │   │   └── authMiddleware.js   # Bearer JWT verification
│   │   ├── routes/
│   │   │   └── api.js              # Express API router
│   │   └── index.js                # Cloud Functions export entry point
│   └── package.json
├── firebase.json                   # Hosting & Functions configuration
├── firestore.rules                 # Cloud Firestore security rules
├── firestore.indexes.json          # Composite query index definitions
├── storage.rules                   # Firebase Storage security rules
├── HLD.md                          # High-Level Design specification
├── LLD.md                          # Low-Level Design specification
├── PRD.md                          # Product Requirements Document
└── README.md                       # Repository overview & setup guide
```

---

## 2. Core Service Modules & Interfaces

### 2.1 Firestore Service (`client/src/services/firestoreService.js`)

Provides strongly typed asynchronous functions for database operations:

```javascript
// Ideas
export const getIdeas = async (category = "All", search = ""): Promise<Idea[]>
export const createIdea = async (ideaData: Partial<Idea>, user: User): Promise<Idea>
export const toggleLikeIdea = async (ideaId: string, userId: string): Promise<void>
export const getIdeaComments = async (ideaId: string): Promise<Comment[]>
export const addIdeaComment = async (ideaId: string, content: string, user: User): Promise<Comment>

// Projects
export const getProjects = async (status = "All", search = ""): Promise<Project[]>
export const createProject = async (projectData: Partial<Project>, user: User): Promise<Project>
export const joinProject = async (projectId: string, user: User, role: string): Promise<void>

// Tasks (Kanban)
export const subscribeTasks = (projectId: string, callback: (tasks: Task[]) => void): Unsubscribe
export const createTask = async (taskData: Partial<Task>, user: User): Promise<Task>
export const updateTaskStatus = async (taskId: string, newStatus: string): Promise<void>

// Messaging & Channels
export const subscribeConversations = (userId: string, callback: (convos: Conversation[]) => void): Unsubscribe
export const subscribeMessages = (conversationId: string, callback: (msgs: Message[]) => void): Unsubscribe
export const sendMessage = async (conversationId: string, text: string, user: User, fileUrl?: string): Promise<Message>
export const getOrCreateDirectConversation = async (currentUser: User, targetUser: User): Promise<Conversation>

// Skill Exchanges & Matching
export const sendSkillExchangeRequest = async (targetUser: User, offerSkill: string, wantSkill: string, user: User): Promise<SkillExchange>
export const getMatchingUsers = async (currentUser: User): Promise<MatchedUser[]>
export const getPlatformAnalytics = async (): Promise<PlatformAnalytics>
```

---

## 3. Algorithmic Specifications

### 3.1 Skill Swap Matching Algorithm
The matching algorithm pairs users based on complementary skill interests:

$$\text{MatchScore} = (\text{CommonSkills} \times 10) + (\text{TeachMatches} \times 20) + (\text{LearnMatches} \times 20)$$

1. **Extraction**: Normalize all skill tags to lowercase trimmed strings.
2. **Teach Match**: Check if current user's `skillsToLearn` intersects with target user's `skills`.
3. **Learn Match**: Check if current user's `skills` intersects with target user's `skillsToLearn`.
4. **Ranking**: Sort candidates in descending order by `MatchScore` with ties broken by profile activity.

### 3.2 Multi-Tier AI Fallback Workflow
When a prompt is dispatched to `askJarvisAI({ message, history })`:

1. **Tier 1 (Cloud Function)**: `POST /api/ai/chat` with 5s timeout.
2. **Tier 2 (Gemini REST)**: On Tier 1 failure, invoke Google Gemini 1.5 Flash endpoint (`generativelanguage.googleapis.com`) using `systemInstruction`.
3. **Tier 3 (OpenRouter)**: On Tier 2 failure, forward prompt to OpenRouter API (`google/gemini-2.0-flash-001`).
4. **Tier 4 (Contextual Heuristic Engine)**: If all network calls fail, generate an expert, structured response based on message intent (Milestone breakdown, Pitch refinement, Skill pair recommendation).

---

## 4. Database Schema & Field Types

### Collection: `users/{userId}`
| Field | Type | Description |
|---|---|---|
| `uid` | string | Firebase Auth User ID |
| `name` | string | Full display name |
| `email` | string | Registered email address |
| `role` | string | Chosen professional persona |
| `skills` | string[] | Array of proficient skills |
| `skillsToLearn` | string[] | Desired learning topics |
| `avatar` | string | Avatar image URL |
| `socialLinks` | map | `{ github, linkedin, twitter, website }` |
| `totalProjects`| number | Count of owned projects |
| `createdAt` | timestamp | Document creation timestamp |

### Collection: `tasks/{taskId}`
| Field | Type | Description |
|---|---|---|
| `title` | string | Task summary |
| `description` | string | Detailed instructions |
| `status` | string | `todo`, `in_progress`, `review`, `completed` |
| `priority` | string | `High`, `Medium`, `Low` |
| `projectId` | string | Associated project reference |
| `assignedTo` | string | Assignee name |
| `deadline` | string | Due date ISO string |
| `createdAt` | timestamp | Creation timestamp |

---

## 5. Security Rules Implementation

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() { return request.auth != null; }
    function isOwner(userId) { return isAuthenticated() && request.auth.uid == userId; }

    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isOwner(userId);
    }
    match /ideas/{ideaId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && request.resource.data.authorId == request.auth.uid;
      allow update, delete: if isAuthenticated() && resource.data.authorId == request.auth.uid;
      match /comments/{commentId} {
        allow read, create: if isAuthenticated();
      }
    }
    match /projects/{projectId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && request.resource.data.ownerId == request.auth.uid;
      allow update: if isAuthenticated();
      allow delete: if isAuthenticated() && resource.data.ownerId == request.auth.uid;
    }
    match /tasks/{taskId} {
      allow read, create, update, delete: if isAuthenticated();
    }
    match /conversations/{conversationId} {
      allow read, create, update: if isAuthenticated();
      match /messages/{messageId} {
        allow read, create: if isAuthenticated();
      }
    }
    match /collaborations/{collabId} {
      allow read, create, update, delete: if isAuthenticated();
    }
    match /skillExchanges/{exchangeId} {
      allow read, create, update, delete: if isAuthenticated();
    }
    match /notifications/{notificationId} {
      allow read, update, delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated();
    }
  }
}
```
