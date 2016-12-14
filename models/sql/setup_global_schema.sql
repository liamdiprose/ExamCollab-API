----------------------------
-- Populate public schema --
-- Tables needed by all   --
----------------------------
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

CREATE OR REPLACE FUNCTION pseudo_encrypt(VALUE bigint) returns int AS $$
DECLARE
  l1 int;
  l2 int;
  r1 int;
  r2 int;
  i int:=0;
BEGIN
  l1:= (VALUE >> 16) & 65535;
  r1:= VALUE & 65535;
  WHILE i < 3 LOOP
    l2 := r1;
    r2 := l1 # ((((1366 * r1 + 150889) % 714025) / 714025.0) * 32767)::int;
    l1 := l2;
    r1 := r2;
    i := i + 1;
  END LOOP;
  RETURN ((r1 << 16) + l1);
END;
$$ LANGUAGE plpgsql strict immutable;


-- Create Exam schema procedure
CREATE OR REPLACE FUNCTION setup_exam() RETURNS trigger AS $$
DECLARE
  examid int;
  my_schema varchar;
BEGIN


  examid := NEW.id;
  my_schema := 'exam_' || examid;

  EXECUTE format('CREATE SCHEMA %s', my_schema);
 --CREATE SCHEMA my_schema;

  EXECUTE format('SET SEARCH_PATH TO %s', my_schema);
  --SET SEARCH_PATH TO my_schema;

  -- If not sharing with another "related" exam
  CREATE SEQUENCE seq_id_users;
  CREATE TABLE users (
    id BIGINT DEFAULT public.pseudo_encrypt(NEXTVAL('seq_id_users')) PRIMARY KEY,
    name_noun VARCHAR NOT NULL,
    secret_token UUID,
    permission_level INTEGER CHECK
      (permission_level >= 0 AND permission_level <=3) DEFAULT 1,
    name_color VARCHAR(6) NOT NULL,
    created TIMESTAMP DEFAULT now() NOT NULL,
    last_active TIMESTAMP DEFAULT now()
  );

  CREATE TYPE number_system AS ENUM ('arabic', 'roman', 'alpha');

  CREATE SEQUENCE seq_id_questions;
  CREATE TABLE questions (
    ID SERIAL PRIMARY KEY ,
    number INTEGER,
    body_text VARCHAR,
    author BIGINT REFERENCES users(id),
    created TIMESTAMP DEFAULT now(),
    parent_question BIGINT REFERENCES questions(ID),
    superceded_by BIGINT REFERENCES questions(ID) DEFAULT NULL,
    superceded_comment VARCHAR DEFAULT NULL,
    children_number_style number_system
  );

  CREATE TABLE answers (
    ID SERIAL PRIMARY KEY,
    body_text VARCHAR NOT NULL,
    author BIGINT REFERENCES users(id) NOT NULL,
    created TIMESTAMP DEFAULT now(),
    parent_question BIGINT REFERENCES questions(id) NOT NULL,
    votes_up INTEGER DEFAULT 0,
    votes_down INTEGER DEFAULT 0,
    superceded_by BIGINT REFERENCES answers(ID) DEFAULT NULL,
    superceded_comment VARCHAR DEFAULT NULL,
    CONSTRAINT positive_votes CHECK (
      votes_up >= 0 and votes_down >= 0)
  );

  CREATE TABLE comments (
    ID SERIAL PRIMARY KEY ,
    body_text VARCHAR NOT NULL,
    author BIGINT REFERENCES users(id) NOT NULL,
    created TIMESTAMP DEFAULT now(),
    parent_question BIGINT REFERENCES questions(id),
    parent_answer BIGINT REFERENCES answers(id),
    CONSTRAINT question_or_answer CHECK (
      (parent_answer is not NULL and parent_question is NULL) or
      (parent_question is not NULL and parent_answer is NULL))
  );

  CREATE TABLE bans (
    id SERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    created TIMESTAMP DEFAULT now()
  );


  CREATE TABLE related_exams (
    id SERIAL PRIMARY KEY ,
    title VARCHAR NOT NULL,
    exam_id BIGINT REFERENCES public.exams(id) NOT NULL
  );

  CREATE TABLE links (
    ID SERIAL PRIMARY KEY ,
    title VARCHAR NOT NULL,
    link VARCHAR NOT NULL
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Delete exam schema
CREATE OR REPLACE FUNCTION delete_exam_schema()
RETURNS trigger AS $$
DECLARE
  oldid int;
  my_schema varchar;
BEGIN
  oldid :=  OLD.id;
  my_schema := 'exam_' || oldid;
 -- EXECUTE format('DROP SCHEMA exam_%T CASCADE', my_schema);
 DROP SCHEMA my_schema;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create Exams Directory
CREATE SEQUENCE exams_seq_id;

CREATE TABLE exams (
  id BIGINT DEFAULT pseudo_encrypt(NEXTVAL('exams_seq_id')) PRIMARY KEY,
  short_name TEXT,
  name TEXT,
  room TEXT,
  date DATE,
  duration INTERVAL
);

-- Create schema for exam after new row in public.exams
CREATE TRIGGER create_exam_schema
AFTER INSERT ON "exams"
FOR EACH ROW
EXECUTE PROCEDURE setup_exam();

-- Delete schema for exam after row removed from public.exams
CREATE TRIGGER clean_exam_schema
AFTER DELETE ON "exams"
FOR EACH ROW
EXECUTE PROCEDURE delete_exam_schema();

-- For manual IP bans
CREATE TABLE ip_bans (
  id SERIAL PRIMARY KEY,
  ip_addr CIDR,
  expires TIMESTAMP
);

-- For IP limiting
CREATE TABLE ip_connections (
  id SERIAL PRIMARY KEY,
  ip_addr INET,
  connection_time TIMESTAMP DEFAULT now()
);

-- Global User table (for admins)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    permission_level INTEGER CHECK
    (permission_level >= 0 AND permission_level <=3),
    secret_token UUID
);
