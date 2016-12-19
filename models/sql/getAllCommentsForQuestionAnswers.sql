SELECT * FROM ${exam_id^}.comments
WHERE parent_answer IN (
    SELECT ID FROM ${exam_id^}.answers
    WHERE parent_question=${question_id}
);
