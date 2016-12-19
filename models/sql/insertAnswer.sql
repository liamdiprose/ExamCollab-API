INSERT INTO ${exam_id^}.answers (body_text,author,parent_question)
VALUES (${body_text}, ${author}, ${parent_question})
RETURNING ID;
