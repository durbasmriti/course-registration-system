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
(7, 'aayushman',    'aayushman@iitk.ac.in',    '$2b$10$KZ/DmaE2BswTPTyASFqA0.deBofgEIDUXbQdJZctkAc2fYKbfAZp2', 'student'),
(8, 'arnav',        'arnav@iitk.ac.in',        '$2b$10$7YdIJczZkxro885qAD8bMuOnzZQFjwTa4.Q1RIsX2uev3CBSE9TQm', 'student'),
(9, 'satyarth',     'satyarth@iitk.ac.in',     '$2b$10$7YdIJczZkxro885qAD8bMuOnzZQFjwTa4.Q1RIsX2uev3CBSE9TQm', 'student'),
(10, 'shreya',      'shreya@iitk.ac.in',      '$2b$10$7YdIJczZkxro885qAD8bMuOnzZQFjwTa4.Q1RIsX2uev3CBSE9TQm', 'student'),
(11, 'tanmay',      'tanmay@iitk.ac.in',      '$2b$10$7YdIJczZkxro885qAD8bMuOnzZQFjwTa4.Q1RIsX2uev3CBSE9TQm', 'student'),
(12, 'priyanshu',   'priyanshu@iitk.ac.in',   '$2b$10$7YdIJczZkxro885qAD8bMuOnzZQFjwTa4.Q1RIsX2uev3CBSE9TQm', 'student'),
(13, 'ananya',      'ananya@iitk.ac.in',      '$2b$10$7YdIJczZkxro885qAD8bMuOnzZQFjwTa4.Q1RIsX2uev3CBSE9TQm', 'student'),
(14, 'philip',       'philip@iitk.ac.in',       '$2b$10$7YdIJczZkxro885qAD8bMuOnzZQFjwTa4.Q1RIsX2uev3CBSE9TQm', 'professor'),
(15, 'sudharsana',      'sudharsana@iitk.ac.in',      '$2b$10$7YdIJczZkxro885qAD8bMuOnzZQFjwTa4.Q1RIsX2uev3CBSE9TQm', 'professor'),
(16, 'baswana',     'baswana@iitk.ac.in',     '$2b$10$7YdIJczZkxro885qAD8bMuOnzZQFjwTa4.Q1RIsX2uev3CBSE9TQm', 'professor'),
(17, 'preeti',     'preeti@iitk.ac.in',     '$2b$10$7YdIJczZkxro885qAD8bMuOnzZQFjwTa4.Q1RIsX2uev3CBSE9TQm', 'professor'),
(18, 'gayathri',     'gayathri@iitk.ac.in',     '$2b$10$7YdIJczZkxro885qAD8bMuOnzZQFjwTa4.Q1RIsX2uev3CBSE9TQm', 'student'),
(19, 'manas',     'manas@iitk.ac.in',     '$2b$10$7YdIJczZkxro885qAD8bMuOnzZQFjwTa4.Q1RIsX2uev3CBSE9TQm', 'student'),
(20, 'sneha',     'sneha@iitk.ac.in',     '$2b$10$7YdIJczZkxro885qAD8bMuOnzZQFjwTa4.Q1RIsX2uev3CBSE9TQm', 'student');

-- -------------------------------------------------------
-- STUDENT PROFILES
-- -------------------------------------------------------
INSERT INTO student_profiles (user_id, name, roll_no, department, academic_year, cpi) VALUES
(4, 'Durbasmriti', '230101', 'CSE', 3, 8.5),
(5, 'Pallavi',     '230102', 'CSE', 3, 8.0),
(6, 'Jyothika',    '230103', 'CSE', 3, 8.8),
(7, 'Aayushman',   '230104', 'CE',  3, 8.2),
(8, 'Arnav',       '220105', 'MSE', 4, 7.5),
(9, 'Satyarth',    '230106', 'ME', 3, 7.0),
(10, 'Shreya',     '220107', 'CHM',  4, 8.1),
(11, 'Tanmay',     '210108', 'CHE',  5, 7.9),
(12, 'Priyanshu',   '240109', 'AE', 2, 8.4),
(13, 'Ananya',      '200110', 'EE', 6, 8.6),
(18, 'Gayathri',    '250111', 'EE', 1, 8.3),
(19, 'Manas',       '240112', 'BSBE', 2, 7.8),
(20, 'Sneha',       '200113', 'ECO', 6, 8.0);

-- -------------------------------------------------------
-- PROFESSOR PROFILES
-- -------------------------------------------------------
INSERT INTO professor_profiles (user_id, name, department) VALUES
(2, 'Prof. Arnab', 'CSE'),
(3, 'Prof. Ritwij', 'HSS'),
(14, 'Prof. Philip', 'DES'),
(15, 'Prof. Sudharsana', 'ENG'),
(16, 'Prof. Baswana', 'CSE'),
(17, 'Prof. Preeti', 'CSE');

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
(3, 'CE683', 'Humans, Environment and Sustainable Development', 9, 'CE'),
(4, 'CS315', 'DataBase Systems', 9, 'CSE'),
(5, 'CS420', 'Artificial Intelligence', 9, 'CSE'),
(6, 'CS430', 'Machine Learning', 9, 'CSE'),
(7, 'ENG450', 'Academic Writing', 6, 'ENG'),
(8, 'HSS310', 'Philosophy of Science', 6, 'HSS'),
(9, 'DES220', 'Design Thinking', 6, 'DES'),
(10, 'CHE350', 'Chemical Process Calculations', 9, 'CHE'),
(11, 'AE410', 'Aerodynamics', 9, 'AE'),
(12, 'EE330', 'Power Systems', 9, 'EE'),
(13, 'BSBE310', 'Molecular Biology', 9, 'BSBE'),
(14, 'ECO320', 'Microeconomics', 6, 'ECO'),
(15, 'CS101', 'Introduction to Computer Science', 9, 'CSE');

-- -------------------------------------------------------
-- PREREQUISITES
-- CS610 requires CS371 to be completed first
-- -------------------------------------------------------
INSERT INTO prerequisites (course_id, prerequisite_id) VALUES
(2, 5), -- CS610 requires CS420
(1, 5),  --- CS371 requires CS420
(4, 15); -- CS315 requires CS101


-- -------------------------------------------------------
-- COURSE OFFERINGS
-- offering_id 1-3: current semester (academic_id 2)
-- offering_id 4:   past semester offering of CS371 (academic_id 1)
--                  needed so transcript rows can reference it
-- -------------------------------------------------------
INSERT INTO course_offerings (offering_id, course_id, professor_id, academic_id, max_seats) VALUES
(1, 1, 2, 2, 5),   -- CS371 | Prof. Arnab | sem2 2026
(2, 2, 2, 2, 7),   -- CS610 | Prof. Arnab | sem2 2026
(3, 3, 3, 2, 3),   -- CE683 | Prof. Ritwij | sem2 2026
(4, 1, 2, 1, 2),   -- CS371 | Prof. Arnab | sem1 2025 (past — for transcripts)
(5, 4, 2, 2, 8),   -- CS315 | Prof. Arnab | sem2 2026
(6, 5, 16, 2, 5),   -- CS420 | Prof. Baswana | sem2 2026
(7, 6, 16, 2, 9),   -- CS430 | Prof. Baswana | sem2 2026
(8, 7, 15, 2, 10),   -- ENG450 | Prof. Sudharsana | sem2 2026
(9, 8, 3, 2, 4),    -- HSS310 | Prof. Ritwij | sem2 2026
(10,9,14,2,8),      -- DES220 | Prof. Philip | sem2 2026
(11,10,17,2,12),     -- CHE350 | Prof. Preeti | sem2 2026
(12,11,17,2,11),     -- AE410 | Prof. Preeti | sem2 2026
(13,12,17,2,6),     -- EE330 | Prof. Preeti | sem2 2026
(14,13,17,2,2),     -- BSBE310 | Prof. Preeti | sem2 2026
(15,14,17,2,7),     -- ECO320 | Prof. Preeti | sem2 2026
(16,15,17,2,20);    -- CS101 | Prof. Preeti | sem2 2026

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
(4, 6, 8.5, TRUE,  '2025-11-30'),   -- Durbasmriti passed CS420 in sem1 2025
(5, 6, 7.8, TRUE,  '2025-11-30'),   -- Pallavi     passed CS420 in sem1 2025
(6, 6, 9.8, TRUE,  '2025-11-30'),   -- Jyothika    passed CS420 in sem1 2025
(7, 6, 8.8, TRUE,  '2025-11-30'),   -- Aayushman   passed CS420 in sem1 2025
(10, 6, 4.0, FALSE, '2025-11-30'),   -- Shreya      failed CS420 in sem1 2025
(11, 16, 7.0, TRUE,  '2025-11-30'),   -- Tanmay      passed CS420 in sem1 2025
(12, 16, 8.0, FALSE,  '2025-11-30'),   -- Priyanshu   failed CS420 in sem1 2025
(13, 16, 9.0, TRUE,  '2025-11-30'),   -- Ananya      passed CS420 in sem1 2025


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


