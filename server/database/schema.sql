-- ============================================================================
-- BUILDX PLATFORM - RELATIONAL DATABASE SCHEMA (POSTGRESQL SPECIFICATION)
-- Concepts Covered:
-- 1. Relational schema design with Primary Keys (PK) & Foreign Keys (FK)
-- 2. Referential integrity with ON DELETE CASCADE / SET NULL
-- 3. SQL Normalization (1NF, 2NF, 3NF compliant)
-- 4. Single & Composite Indexes for query performance
-- 5. Complex SQL JOINS (INNER, LEFT, FULL, CROSS)
-- 6. Aggregations (GROUP BY, HAVING, COUNT, AVG)
-- 7. ACID Transactions (BEGIN, COMMIT, ROLLBACK)
-- ============================================================================

-- EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. USERS TABLE (Primary Entity)
-- 3NF: No transitive dependencies; attributes depend strictly on user_id (PK)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    role VARCHAR(50) DEFAULT 'collaborator' CHECK (role IN ('admin', 'creator', 'collaborator', 'mentor')),
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INDEX: Fast lookup for login and unique constraint verification
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ----------------------------------------------------------------------------
-- 2. USER SKILLS TABLE (Normalized Junction Entity - 2NF/3NF)
-- Separating multi-valued attributes into atomic rows satisfies 1NF
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_skills (
    skill_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    proficiency_type VARCHAR(20) NOT NULL CHECK (proficiency_type IN ('HAVE', 'WANT')),
    proficiency_level VARCHAR(20) DEFAULT 'Intermediate' CHECK (proficiency_level IN ('Beginner', 'Intermediate', 'Expert')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_skills_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT uq_user_skill UNIQUE (user_id, skill_name, proficiency_type)
);

CREATE INDEX IF NOT EXISTS idx_user_skills_lookup ON user_skills(skill_name, proficiency_type);

-- ----------------------------------------------------------------------------
-- 3. PROJECTS TABLE
-- Foreign Key: owner_id -> users(user_id)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
    project_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'Planning' CHECK (status IN ('Planning', 'Active', 'In Progress', 'Completed', 'Archived')),
    github_repo_url TEXT,
    live_demo_url TEXT,
    progress_percentage INT DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_project_owner FOREIGN KEY (owner_id) REFERENCES users(user_id) ON DELETE RESTRICT
);

-- Compound Index: Optimized for filtering projects by category and ordering by created_at
CREATE INDEX IF NOT EXISTS idx_projects_category_created ON projects(category, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_owner ON projects(owner_id);

-- ----------------------------------------------------------------------------
-- 4. PROJECT MEMBERS TABLE (M:N Relationship with composite PK)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS project_members (
    project_id UUID NOT NULL,
    user_id UUID NOT NULL,
    member_role VARCHAR(50) DEFAULT 'Developer' CHECK (member_role IN ('Owner', 'Developer', 'Designer', 'Tester', 'Observer')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (project_id, user_id),
    CONSTRAINT fk_pm_project FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
    CONSTRAINT fk_pm_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_pm_user ON project_members(user_id);

-- ----------------------------------------------------------------------------
-- 5. TASKS TABLE (1:N from Projects)
-- Composite Indexing for Kanban board board queries
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tasks (
    task_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL,
    assigned_to UUID,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'To Do' CHECK (status IN ('To Do', 'In Progress', 'Review', 'Completed')),
    priority VARCHAR(20) DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')),
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tasks_project FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
    CONSTRAINT fk_tasks_assignee FOREIGN KEY (assigned_to) REFERENCES users(user_id) ON DELETE SET NULL
);

-- Compound Index: Speed up Kanban filter by project and status
CREATE INDEX IF NOT EXISTS idx_tasks_project_status ON tasks(project_id, status);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);

-- ============================================================================
-- SQL JOINS & ADVANCED QUERIES DEMONSTRATION
-- ============================================================================

-- 1. INNER JOIN: Retrieve all tasks with assigned user and project details
-- SELECT
--     t.task_id,
--     t.title AS task_title,
--     t.status AS task_status,
--     p.title AS project_name,
--     u.full_name AS assignee_name,
--     u.email AS assignee_email
-- FROM tasks t
-- INNER JOIN projects p ON t.project_id = p.project_id
-- INNER JOIN users u ON t.assigned_to = u.user_id
-- WHERE t.status != 'Completed'
-- ORDER BY t.priority DESC, t.due_date ASC;

-- 2. LEFT JOIN with Aggregation: Fetch all users, their owned projects count, and total tasks completed
-- SELECT
--     u.user_id,
--     u.full_name,
--     u.email,
--     COUNT(DISTINCT p.project_id) AS total_projects_owned,
--     COUNT(DISTINCT CASE WHEN t.status = 'Completed' THEN t.task_id END) AS completed_tasks_count
-- FROM users u
-- LEFT JOIN projects p ON u.user_id = p.owner_id
-- LEFT JOIN tasks t ON u.user_id = t.assigned_to
-- GROUP BY u.user_id, u.full_name, u.email
-- HAVING COUNT(DISTINCT p.project_id) >= 0
-- ORDER BY total_projects_owned DESC;

-- 3. TRANSACTION EXAMPLE: Creating a new Project and immediately assigning the Owner as a Member
-- BEGIN;
-- INSERT INTO projects (project_id, owner_id, title, description, category, status)
-- VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'd3b07384-d113-46fb-a0ef-281b67f1a302', 'AI Code Reviewer', 'Automated code review using Gemini', 'Artificial Intelligence', 'Active');
--
-- INSERT INTO project_members (project_id, user_id, member_role)
-- VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'd3b07384-d113-46fb-a0ef-281b67f1a302', 'Owner');
-- COMMIT;

