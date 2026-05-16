# BuildX 🚀

BuildX is a modern full-stack collaboration platform designed for developers, creators, and startup teams to work together efficiently in a single workspace.

The platform enables users to:

* Share and explore innovative project ideas
* Collaborate with team members in real time
* Manage projects and tasks efficiently
* Communicate through integrated chat features
* Track productivity and contributions
* Discover collaborators based on skills and interests

BuildX is built with a scalable architecture and a modern luxury-inspired user interface to deliver a professional SaaS-style experience.

---

# ✨ Core Features

## 🔐 Authentication & Security

* Secure user registration and login system
* JWT-based authentication
* Protected routes for authorized access
* Authentication state management using React Context API

---

## 💡 Idea Collaboration System

* Create and publish startup or project ideas
* Browse ideas shared by other users
* Display project descriptions and technology stacks
* View creator information for each idea

---

## 🛠️ Project Workspace

* Create and manage collaborative projects
* Organize workspace activities
* Monitor active projects and team participation
* Maintain scalable project architecture

---

## ✅ Task Management

* Create and assign tasks
* Track task completion status
* Manage project workflows efficiently
* Improve team productivity and coordination

---

## 💬 Real-Time Communication

* Team messaging interface
* Socket.io-based real-time communication foundation
* Structured messaging architecture for scalability

---

## 👤 User Profile System

* Professional user profile pages
* Skills and interests management
* Contribution and productivity tracking
* Collaboration-focused identity system

---

## ⚙️ Settings & Preferences

* Account management options
* Security and privacy controls
* Notification preferences
* Theme-ready settings architecture

---

# 🧠 Technology Stack

## Frontend Technologies

* React.js
* React Router DOM
* Axios
* CSS3
* Context API

## Backend Technologies

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Socket.io

---

# 📁 Project Structure

```bash
BuildX/
│
├── client/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── services/
│       ├── styles/
│       ├── utils/
│       ├── App.js
│       ├── main.jsx
│       └── routes.jsx
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── sockets/
│   ├── utils/
│   ├── server.js
│   └── .env
│
└── README.md
```

---

# ⚙️ Installation Guide

## 1️⃣ Clone the Repository

```bash
git clone <your-repository-url>
```

---

## 2️⃣ Install Frontend Dependencies

```bash
cd client
npm install
```

---

## 3️⃣ Install Backend Dependencies

```bash
cd server
npm install
```

---

# 🔑 Environment Variables

Create a `.env` file inside the `server` folder and add the following configuration:

```env
PORT=5000
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING
JWT_SECRET=YOUR_SECRET_KEY
```

---

# ▶️ Running the Application

## Start Backend Server

```bash
cd server
npm run dev
```

---

## Start Frontend Application

```bash
cd client
npm start
```

---

# 🌐 API Base URL

```bash
http://localhost:5000/api
```

---

# 🔒 Authentication Routes

## Register User

```bash
POST /api/auth/register
```

## Login User

```bash
POST /api/auth/login
```

---

# 💡 Idea Routes

## Get All Ideas

```bash
GET /api/ideas
```

## Create New Idea

```bash
POST /api/ideas
```

---

# 🛠️ Project Routes

## Get All Projects

```bash
GET /api/projects
```

## Create New Project

```bash
POST /api/projects
```

---

# ✅ Task Routes

## Get All Tasks

```bash
GET /api/tasks
```

## Create New Task

```bash
POST /api/tasks
```

---

# 💬 Message Routes

## Send Message

```bash
POST /api/messages
```

## Get Messages

```bash
GET /api/messages
```

---

# 🎨 User Interface Design

BuildX follows a modern luxury-inspired interface design that includes:

* Dark-themed workspace layout
* Glassmorphism user interface components
* Responsive design system
* Gradient-based visual accents
* Modern SaaS-inspired user experience

---

# 🚀 Planned Future Enhancements

The following features are planned for future development:

* AI-based collaborator matching
* Video conferencing integration
* Advanced notification system
* Team performance analytics
* Cloud deployment support
* Real-time collaborative editing
* File sharing and storage system
* Kanban-based workflow boards

---

# 👨‍💻 Author

Developed by Anoop Joel.

---

# 📜 License

This project is intended for educational, learning, and personal development purposes.
