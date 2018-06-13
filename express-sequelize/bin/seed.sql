
START TRANSACTION;

DELETE from "user";
DELETE from post;

INSERT INTO "user" (username) VALUES ('pynchon');
INSERT INTO "user" (username) VALUES ('dideon');
INSERT INTO "user" (username) VALUES ('kafka');
INSERT INTO "user" (username) VALUES ('joyce');
INSERT INTO "user" (username) VALUES ('goldman');

INSERT INTO post (title, body, "authorId")
VALUES(
  'gravitys rainbow',
  'a screaming came across the sky',
  (SELECT id from "user" WHERE username = 'pynchon')
);

INSERT INTO post (title, body, "authorId")
VALUES(
  'against the day',
  'single up all the lines',
  (SELECT id from "user" WHERE username = 'pynchon')
);

INSERT INTO user_followers_user ("userId_1", "userId_2")
VALUES(
  (SELECT id from "user" WHERE username = 'pynchon'),
  (SELECT id from "user" WHERE username = 'dideon')
);

INSERT INTO user_followers_user ("userId_1", "userId_2")
VALUES(
  (SELECT id from "user" WHERE username = 'pynchon'),
  (SELECT id from "user" WHERE username = 'kafka')
);


INSERT INTO user_followers_user ("userId_1", "userId_2")
VALUES(
  (SELECT id from "user" WHERE username = 'joyce'),
  (SELECT id from "user" WHERE username = 'pynchon')
);

INSERT INTO user_followers_user ("userId_1", "userId_2")
VALUES(
  (SELECT id from "user" WHERE username = 'goldman'),
  (SELECT id from "user" WHERE username = 'pynchon')
);

COMMIT; 
