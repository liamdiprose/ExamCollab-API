# Endpoints

###/exams
* POST: New exam created
###/exams/:id
* GET: Initial call, returns top answer(s), commments, all questions
* DELETE: Delete Exam (not supported?)
###/exams/:id/info
* GET: Information on exams
* PUT: Update exam info
###/exams/:id/questions
* GET: List of all questions
* POST: Add a new question
###/exams/:id/questions/:id/
* GET: Full Question Text + Full Answers + Full Comments
* PUT: Update question
* DELETE: Delete question
###/exams/:id/questions/:id/comments
* GET: List of Full comments
* POST: New comment
###/exams/:id/questions/:id/comments/:id
* GET: Single comment
* PUT: Update comment
* DELTE: Delete Comment
###/exams/:id/questions/:id/answers
* GET: List of answers for question
* POST: New answer
###/exams/:id/questions/:id/answers/:id
* GET: Single Answer + Comments
* PUT: Update Answer
* DELETE: Delete Answer
###/exams/:id/questions/:id/answers/:id/comments
* GET: List of comments for answer
* POST: New comment for answer
###/exams/:id/questions/:id/answers/:id/comments/:id
* GET: Single comment
* PUT: Update comment
* DELETE: Delete Comment
###/exams/:id/users
* GET: List of full users for exam
* POST: New User
###/exams/:id/users/:id 
* GET: Single user
* PUT: Update user info
* DELETE: Delete user