CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

INSERT INTO users (name) VALUES
  ('Chris Cornell'),
  ('Courtney Love'),
  ('Layne Staley'),
  ('Tina Bell'),
  ('Kurt Cobain');

CREATE TABLE connections (
  user_id INTEGER REFERENCES users(id),
  friend_id INTEGER REFERENCES users(id),
  PRIMARY KEY (user_id, friend_id)
);

INSERT INTO connections (user_id, friend_id) VALUES
  (1, 2),
  (2, 1),
  (1, 3),
  (3, 1),
  (2, 3),
  (3, 2),
  (3, 4),
  (4, 3),
  (5, 4),
  (4, 5);


WITH RECURSIVE DistanceLookup AS (
  SELECT user_id, friend_id, 1 AS distance
    FROM connections
  UNION
  SELECT c.user_id, dl.friend_id, dl.distance + 1
    FROM DistanceLookup dl
  JOIN connections c 
    ON dl.user_id = c.friend_id
  WHERE dl.distance < 10
)

SELECT user_id, friend_id, distance
  FROM DistanceLookup
WHERE (user_id = 1 AND friend_id = 5)
LIMIT 1;

select * from users;
select * from connections;