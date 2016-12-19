IF EXISTS (${user_id}, ${answer_id})
THEN
    INSERT INTO ${exam_id^}.answer_votes (user,answer,is_upvote)
    VALUES (${user_id}, ${answer_id}, ${is_upvote})
ELSE
    UPDATE ${exam_id}.answer_votes SET is_upvote = ${is_upvote}
END IF;