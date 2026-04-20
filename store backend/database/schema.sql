-- MySQL schema for the Learn Angular v15 Fullstack sample (App "2")
--
-- Goal:
-- - Keep it beginner-friendly, readable, and close to what you see in real apps.
-- - Use proper constraints, indexes, and timestamps.
--
-- Usage:
-- 1) Open a MySQL client (Workbench / CLI)
-- 2) Run this file
-- 3) Then start the Express API and register a user via the /api/auth/register endpoint.

CREATE DATABASE IF NOT EXISTS learn_angular_v15_tasks
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE learn_angular_v15_tasks;

-- Users table
-- - We store a bcrypt hash in password_hash (never store plain passwords)
CREATE TABLE IF NOT EXISTS users (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(191) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB;

-- Tasks table
-- - Each task belongs to a single user (user_id)
-- - ON DELETE CASCADE deletes a user's tasks when the user is deleted
CREATE TABLE IF NOT EXISTS tasks (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NULL,
  status ENUM('TODO', 'IN_PROGRESS', 'DONE') NOT NULL DEFAULT 'TODO',
  due_date DATE NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_tasks_user_id (user_id),
  CONSTRAINT fk_tasks_user_id
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;
