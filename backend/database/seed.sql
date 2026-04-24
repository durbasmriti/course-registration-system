-- 1. Create Academic Term
INSERT INTO academics (year, semester, is_active) 
VALUES (2026, 2, 1);

-- 2. Create Users (IDs will be 1, 2, 3)
INSERT INTO users (username, email, password_hash, role) VALUES 
('Arnab', 'Arnab.iitk.ac.in', 'hash123', 'professor'),
('Durba', 'Durba.iitk.ac.in', 'hash123', 'student'),
('Pallavi', 'Pallavi.iitk.ac.in', 'hash123', 'student');

-- 3. Academic Details for Students
INSERT INTO students (user_id, dept, year, cpi) VALUES 
(2, 'CSE', 3, 9.50),
(3, 'EE', 2, 8.20);

-- 4. Create Master Courses
INSERT INTO courses (course_code, course_name, credits) VALUES 
('CS101', 'Intro to Programming', 6),
('CS610', 'Deep Learning', 9);

-- 5. Set CS101 as a Prerequisite for CS610
INSERT INTO course_prerequisites (course_id, prerequisite_course_id) 
VALUES (2, 1);

-- 6. Offer Deep Learning for the current semester (Offering ID: 1)
INSERT INTO course_offerings (course_id, academic_id, professor_id, max_seats, department) 
VALUES (2, 1, 1, 1, 'CSE'); -- Setting max_seats to 1 to test waitlisting!

-- 7. Set Professor's Priority Weights
INSERT INTO priority_rules (offering_id, weight_cpi, weight_year, weight_dept) 
VALUES (1, 1.0, 0.5, 2.0);

-- offering
INSERT INTO course_offerings (course_id, academic_id, professor_id, max_seats, department) 
VALUES (1, 1, 1, 0, 'CSE');

INSERT INTO enrollments (user_id, offering_id) 
VALUES (2, (SELECT LAST_INSERT_ID()));

-- see the check on mex_seat
INSERT INTO enrollments (user_id, offering_id) 
VALUES (3, (SELECT offering_id FROM course_offerings WHERE course_id = 1 LIMIT 1));