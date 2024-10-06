ALTER TABLE user_answers ADD COLUMN test_history_id INTEGER;

ALTER TABLE "user_answers" ALTER COLUMN "test_history_id" SET DEFAULT 0;