-- -------------------------------------------------------
-- USERS
-- -------------------------------------------------------
INSERT INTO users (user_id, username, email, password_hash, role) VALUES
(1, 'admin',        'admin@iitk.ac.in',        '$2b$10$OD8q9f1tpIi8G4RfoyV3suXH5xwuOK9c6mfFPfC6SM9bUN8v9YE0u', 'admin'),
(2, 'arnab',        'arnab@iitk.ac.in',        '$2b$10$9pvVCQ7v0eY354DLm7jqy.T/XxhPhBMe97MKT0Cp1fxwgLHUiIdvC', 'professor'),
(3, 'ritwij',       'ritwij@iitk.ac.in',       '$2b$10$PulLMyBxjR6Vvzx8Lewn6.LMjSBehkLzXH4Jts.sgSCt85Gk1d7JW', 'professor'),
(4, 'durbasmriti',  'durbasmriti@iitk.ac.in',  '$2b$10$JB3nrzvK5fn3H8DWoPxLTuOlFBqZOgYDMua4T9N1lZMheVOG8eYBy', 'student'),
(5, 'pallavi',      'pallavi@iitk.ac.in',      '$2b$10$7zQcGkBqX5pV8unWEVEXSOSvmdIynRuLp.M55rt6VKs8eUoPv4.bu', 'student'),
(6, 'jyothika',     'jyothika@iitk.ac.in',     '$2b$10$7YdIJczZkxro885qAD8bMuOnzZQFjwTa4.Q1RIsX2uev3CBSE9TQm', 'student'),
(7, 'aayushman',    'aayushman@iitk.ac.in',    '$2b$10$KZ/DmaE2BswTPTyASFqA0.deBofgEIDUXbQdJZctkAc2fYKbfAZp2', 'student');

-- -------------------------------------------------------
-- STUDENT PROFILES
-- -------------------------------------------------------
INSERT INTO student_profiles (user_id, name, roll_no, department, academic_year, cpi) VALUES
(4, 'Durbasmriti', '200101', 'CSE', 3, 8.5),
(5, 'Pallavi',     '200102', 'CSE', 3, 8.0),
(6, 'Jyothika',    '200103', 'CSE', 3, 8.8),
(7, 'Aayushman',   '200104', 'CE',  3, 8.2);

-- -------------------------------------------------------
-- PROFESSOR PROFILES
-- -------------------------------------------------------
INSERT INTO professor_profiles (user_id, name, department) VALUES
(2, 'Prof. Arnab', 'CSE'),
(3, 'Prof. Ritwij', 'HSS');

-- -------------------------------------------------------
-- ACADEMICS
-- current active semester + one past semester for transcript data
-- -------------------------------------------------------
INSERT INTO academics (academic_id, academic_year, semester, is_active) VALUES
(1, 2025, 'sem1', FALSE),   -- past semester (used in transcript)
(2, 2026, 'sem2', TRUE);    -- current active semester

-- -------------------------------------------------------
-- REGISTRATION TYPES
-- -------------------------------------------------------
INSERT INTO registration_types (reg_type_id, name) VALUES
(1, 'HSS'),
(2, 'ADD_DROP'),
(3, 'PRE_REG'),
(4, 'SUMMER');

-- -------------------------------------------------------
-- COURSES
-- -------------------------------------------------------
INSERT INTO courses (course_id, course_code, title, credits, department) VALUES
(1, 'CS371', 'Design of Reinforced Concrete Structures',      9, 'CSE'),
(2, 'CS610', 'Programming for Performance',                   9, 'CSE'),
(3, 'CE683', 'Humans, Environment and Sustainable Development', 9, 'CE');

INSERT INTO courses (course_id, course_code, title, credits, department) VALUES
(4, 'CS315', 'DataBase Systems', 9, 'CSE');

-- -------------------------------------------------------
-- PREREQUISITES
-- CS610 requires CS371 to be completed first
-- -------------------------------------------------------
INSERT INTO prerequisites (course_id, prerequisite_id) VALUES
(2, 1);

-- -------------------------------------------------------
-- COURSE OFFERINGS
-- offering_id 1-3: current semester (academic_id 2)
-- offering_id 4:   past semester offering of CS371 (academic_id 1)
--                  needed so transcript rows can reference it
-- -------------------------------------------------------
INSERT INTO course_offerings (offering_id, course_id, professor_id, academic_id, max_seats) VALUES
(1, 1, 2, 2, 45),   -- CS371 | Prof. Arnab | sem2 2026
(2, 2, 2, 2, 40),   -- CS610 | Prof. Arnab | sem2 2026
(3, 3, 3, 2, 50),   -- CE683 | Prof. Ritwij | sem2 2026
(4, 1, 2, 1, 45);   -- CS371 | Prof. Arnab | sem1 2025 (past — for transcripts)

-- -------------------------------------------------------
-- PRIORITY RULES
-- -------------------------------------------------------
INSERT INTO priority_rules (course_id, weight_cpi, weight_dept_match) VALUES
(1, 1.0, 0.5),
(2, 1.0, 0.5),
(3, 1.0, 0.5);

-- -------------------------------------------------------
-- STUDENT TRANSCRIPT
-- Records courses completed in past semesters.
-- Durba (5) and Pallavi (6) completed CS371 in sem1 2025 → cleared for CS610.
-- -------------------------------------------------------
INSERT INTO student_transcript (student_id, offering_id, grade, is_passed, completed_at) VALUES
(4, 4, 8.5, TRUE,  '2025-11-30'),   -- Durbasmriti passed CS371 in sem1 2025
(5, 4, 7.8, TRUE,  '2025-11-30'),   -- Pallavi     passed CS371 in sem1 2025
(6, 4, 9.8, TRUE,  '2025-11-30'),   -- Jyothika    passed CS371 in sem1 2025
(7, 4, 8.8, TRUE,  '2025-11-30');   -- Aayushman   passed CS371 in sem1 2025

-- -------------------------------------------------------
-- ENROLLMENTS (current semester requests)
-- Only students who have passed CS371 are enrolled in CS610 (offering 2).
-- Jyothika (7) and Aayushman (8) are correctly NOT enrolled in CS610.
-- -------------------------------------------------------
-- INSERT INTO enrollments (student_id, offering_id, reg_type_id, intent, status) VALUES
-- (4, 1, 3, 'major',    'pending'),   -- Durbasmriti → CS371
-- (4, 2, 3, 'major',    'pending'),   -- Durbasmriti → CS610 (cleared: passed CS371)
-- (5, 1, 3, 'major',    'pending'),   -- Pallavi     → CS371
-- (5, 2, 3, 'minor',    'pending'),   -- Pallavi     → CS610 (cleared: passed CS371)
-- (6, 3, 3, 'major',    'pending'),   -- Jyothika    → CE683


