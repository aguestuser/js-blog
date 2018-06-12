START TRANSACTION;

WITH new_user AS (
  INSERT INTO "user" (username)
  VALUES ('pynchon')
  RETURNING "id"
)

INSERT INTO post (title, body, "authorId")
  SELECT 'gravitys rainbow', 'a screaming came across the sky', id
  FROM new_user;

COMMIT; 
