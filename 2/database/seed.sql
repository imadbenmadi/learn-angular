-- Optional seed data (safe to run on a fresh DB)
--
-- What it does:
-- - Creates (or reuses) a demo user by email
-- - Automatically resolves the user's id
-- - Inserts a realistic set of tasks for that user
--
-- Demo credentials:
-- - Email: demo@learn-angular.local
-- - Password: Password123!

USE learn_angular_v15_tasks;

START TRANSACTION;

-- Create or reuse a demo user (the ON DUPLICATE trick lets us always get the id)
SET @DEMO_EMAIL := 'demo@learn-angular.local';

INSERT INTO users (name, email, password_hash)
VALUES ('Demo User', @DEMO_EMAIL, '$2a$10$tGY3rnqJKMQRnCKTGLMgi.IsPNRZfx2UFbSu3iEhqLJLtVuVJmWCm')
ON DUPLICATE KEY UPDATE
  id = LAST_INSERT_ID(id),
  name = VALUES(name),
  password_hash = VALUES(password_hash);

SET @USER_ID := LAST_INSERT_ID();

-- Keep the seed idempotent (re-running won’t duplicate tasks)
DELETE FROM tasks WHERE user_id = @USER_ID;

INSERT INTO tasks (user_id, title, description, status, due_date)
VALUES
  (@USER_ID, 'Read Angular 15 Modules', 'Focus: NgModule, RoutingModule, DI via constructor.', 'DONE', NULL),
  (@USER_ID, 'Set up project scripts', 'Verify npm scripts for client/server and basic env vars.', 'DONE', NULL),
  (@USER_ID, 'Create initial UI layout', 'Navbar + router outlet + basic spacing.', 'DONE', NULL),
  (@USER_ID, 'Build tasks list screen', 'List tasks with title, status, due date, and actions.', 'IN_PROGRESS', NULL),
  (@USER_ID, 'Build task form screen', 'Create/Edit task with validation (title required).', 'IN_PROGRESS', NULL),
  (@USER_ID, 'Add delete confirmation', 'Confirm before deleting a task to prevent accidents.', 'TODO', NULL),
  (@USER_ID, 'Implement filtering in UI', 'Filter by status: TODO / IN_PROGRESS / DONE.', 'TODO', NULL),
  (@USER_ID, 'Add loading & error states', 'Show spinner and friendly error messages for HTTP calls.', 'TODO', NULL),
  (@USER_ID, 'Wire HttpClient service', 'Centralize API calls in a TasksService.', 'DONE', NULL),
  (@USER_ID, 'Add auth login screen', 'Simple email/password login form.', 'DONE', NULL),
  (@USER_ID, 'Add auth register screen', 'Register a user and store JWT on success.', 'DONE', NULL),
  (@USER_ID, 'Create AuthInterceptor', 'Attach Authorization: Bearer <token> for protected routes.', 'DONE', NULL),
  (@USER_ID, 'Protect routes with guard', 'Redirect to /auth/login if not authenticated.', 'DONE', NULL),
  (@USER_ID, 'Implement /api/tasks GET', 'Return current user tasks sorted by created_at desc.', 'DONE', NULL),
  (@USER_ID, 'Implement /api/tasks POST', 'Create a task; validate title length and status.', 'DONE', NULL),
  (@USER_ID, 'Implement /api/tasks PUT', 'Update title/description/status/due_date safely.', 'IN_PROGRESS', NULL),
  (@USER_ID, 'Implement /api/tasks DELETE', 'Delete a task by id for current user only.', 'TODO', NULL),
  (@USER_ID, 'Add DB indexes review', 'Ensure indexes support user_id and common lookups.', 'DONE', NULL),
  (@USER_ID, 'Write happy-path tests', 'Add a couple of API tests for auth + tasks.', 'TODO', NULL),
  (@USER_ID, 'Handle 401 errors globally', 'On token expiry, log out and navigate to login.', 'TODO', NULL),
  (@USER_ID, 'Polish forms validation', 'Inline errors for required fields; disable submit when invalid.', 'TODO', NULL),
  (@USER_ID, 'Refactor models', 'Align TaskStatus enum between client and server.', 'IN_PROGRESS', NULL),
  (@USER_ID, 'Fix timezone edge cases', 'Confirm due_date is treated as DATE (no timezone shift).', 'TODO', NULL),
  (@USER_ID, 'Add sample due dates', 'Use due_date for a few tasks to test UI formatting.', 'DONE', '2026-04-20'),
  (@USER_ID, 'Prepare demo data', 'Make the app look realistic for screenshots and demos.', 'DONE', '2026-04-22');

COMMIT;
