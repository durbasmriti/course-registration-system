SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------
-- STUDENTS
-- ----------------------
INSERT INTO students (student_id, name, dept, year, cpi) VALUES
('S001', 'Amit Sharma', 'CSE', 3, 8.75),
('S002', 'Neha Verma', 'CSE', 2, 9.10),
('S003', 'Ravi Kumar', 'EE', 4, 7.80),
('S004', 'Priya Singh', 'ME', 1, 8.20),
('S005', 'Arjun Das', 'CSE', 3, 9.50);

-- ----------------------
-- PROFESSORS
-- ----------------------
INSERT INTO professors (prof_id, name, dept, prof_email) VALUES
('P001', 'Dr. Mehta', 'CSE', 'mehta@iitk.ac.in'),
('P002', 'Dr. Iyer', 'EE', 'iyer@iitk.ac.in'),
('P003', 'Dr. Gupta', 'ME', 'gupta@iitk.ac.in');

-- ----------------------
-- COURSES
-- ----------------------
INSERT INTO courses (course_id, course_name, course_credit, prof_id, max_seats, offering_dept) VALUES
('CS101', 'Data Structures', 4, 'P001', 2, 'CSE'),
('CS102', 'Operating Systems', 4, 'P001', 2, 'CSE'),
('EE101', 'Circuits', 3, 'P002', 2, 'EE'),
('ME101', 'Thermodynamics', 3, 'P003', 2, 'ME');

-- ----------------------
-- COURSE MEETINGS
-- ----------------------
INSERT INTO course_meetings (course_id, meeting_type, day_of_week, start_time, end_time) VALUES
('CS101', 'LECTURE', 1, '09:00:00', '10:00:00'),
('CS101', 'LAB', 3, '14:00:00', '16:00:00'),
('CS102', 'LECTURE', 2, '10:00:00', '11:00:00'),
('EE101', 'LECTURE', 1, '11:00:00', '12:00:00'),
('ME101', 'LECTURE', 4, '09:00:00', '10:00:00');

-- ----------------------
-- PREREQUISITES
-- ----------------------
INSERT INTO prerequisites (course_id, prereq_course_id) VALUES
('CS102', 'CS101');

-- ----------------------
-- PRIORITY RULES
-- ----------------------
INSERT INTO priority_rules (course_id, weight_cpi, weight_year, weight_first_come, weight_dept) VALUES
('CS101', 1.0, 0.2, 0.05, 0.5),
('CS102', 1.2, 0.3, 0.05, 0.6),
('EE101', 1.0, 0.2, 0.05, 0.5),
('ME101', 1.0, 0.2, 0.05, 0.5);

-- ----------------------
-- REQUESTS
-- ----------------------
INSERT INTO requests (student_id, course_id, status, request_intent) VALUES
('S001', 'CS101', 'requested', 'major'),
('S002', 'CS101', 'requested', 'major'),
('S005', 'CS101', 'requested', 'major'), -- overflow → waitlist candidate
('S003', 'EE101', 'requested', 'major'),
('S004', 'ME101', 'requested', 'elective'),
('S001', 'CS102', 'requested', 'minor');

-- ----------------------
-- PRIORITY SCORES (mock values)
-- ----------------------
INSERT INTO priority_scores (student_id, course_id, score) VALUES
('S001', 'CS101', 8.9),
('S002', 'CS101', 9.3),
('S005', 'CS101', 9.6),
('S003', 'EE101', 7.8),
('S004', 'ME101', 8.2);

-- ----------------------
-- ENROLLMENTS (fill seats manually)
-- ----------------------
INSERT INTO enrollments (student_id, course_id) VALUES
('S002', 'CS101'),
('S005', 'CS101');  -- CS101 now FULL

-- ----------------------
-- WAITLIST
-- ----------------------
INSERT INTO waitlist (student_id, course_id, position) VALUES
('S001', 'CS101', 1); -- waiting

SET FOREIGN_KEY_CHECKS = 1;