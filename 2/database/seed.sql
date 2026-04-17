-- Optional seed data (run AFTER you have at least 1 user)
--
-- Tip: easiest path is to start the API and create a user via:
-- POST /api/auth/register
-- Then you can run this file to insert example tasks for that user.

USE learn_angular_v15_tasks;

-- Change this to your real user id (you can see it in /api/auth/me)
SET @USER_ID := 1;

INSERT INTO tasks (user_id, title, description, status, due_date)
VALUES
  (@USER_ID, 'Read Angular 15 Modules', 'Focus: NgModule, RoutingModule, DI via constructor.', 'TODO', NULL),
  (@USER_ID, 'Build CRUD screens', 'List + Create/Edit form + Delete with confirm.', 'IN_PROGRESS', NULL),
  (@USER_ID, 'Connect to Express API', 'Use HttpClient, interceptor, and guards.', 'DONE', NULL);
