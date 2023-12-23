export const createUser = `INSERT INTO users (name) VALUES ($1)`;

export const getAllUsers = `SELECT * FROM users`;

export const getUserById = `SELECT * FROM users WHERE id = ($1)`;

export const updateUserNameById = `UPDATE users SET name = ($1) WHERE id = ($2)`;

export const deleteConnection = `DELETE FROM connections WHERE user_id = ($1) OR friend_id = ($1)`;
export const deleteUserById = `DELETE FROM users WHERE id = ($1)`;

export const createConnection = `INSERT INTO connections (user_id, friend_id) VALUES ($1, $2), ($2, $1)`;

export const getConnectionByBothIds = `SELECT * FROM connections WHERE user_id = ($1) AND friend_id = ($2) OR user_id = ($2) AND friend_id = ($1)`;
export const getConnections = `SELECT * FROM connections`;

export const getDistance = `WITH RECURSIVE DistanceLookup AS (
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
WHERE (user_id = ($1) AND friend_id = ($2))
LIMIT 1;`;
