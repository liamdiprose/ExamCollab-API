-- Add exam to public table
INSERT INTO public.exams (short_name)
VALUES (${shortName})
RETURNING id;
