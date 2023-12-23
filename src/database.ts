import { Pool } from "pg";
const pgClient = new Pool({
  port: 5432,
  host: "postgres",
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});

export default pgClient;
