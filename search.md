SELECT * FROM course_selection_nice_user WHERE netid='ca9';
SELECT * FROM course_selection_schedule WHERE user_id='7160' AND semester_id=2362;
-- SELECT * FROM course_selection_semester;
SELECT * FROM course_selection_course WHERE id=20260 OR id=20376 OR id=20380 OR id=20553 OR id=21030;
SELECT * FROM course_selection_section;
SELECT * FROM course_selection_meeting WHERE section_id=21543;
SELECT title, start_time, end_time, days, location, section_id
FROM course_selection_course
INNER JOIN course_selection_section ON course_selection_course.id=course_selection_section.course_id
INNER JOIN course_selection_meeting ON course_selection_section.id=course_selection_meeting.section_id
WHERE section_id in (45493,45850,47671,46210,47224);
-- (SELECT id FROM course_selection_section WHERE id=45493)