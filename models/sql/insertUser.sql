INSERT INTO ${exam_id^}.users (name_noun,secret_token,permission_level,name_color)
VALUES (${name_noun},${uuid},${permission_level},${name_color})
RETURNING id;
