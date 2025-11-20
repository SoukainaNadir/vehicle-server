import * as pg from "pg";

const createSchemaStatement = `
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE SCHEMA IF NOT EXISTS vehicle_server;
CREATE TABLE IF NOT EXISTS vehicle_server.vehicles (
	id SERIAL PRIMARY KEY,
	shortcode TEXT NOT NULL,
	battery SMALLINT,
	position GEOMETRY(POINT, 4326) not null
);
`

const deleteSchemaStatement = `
DROP TABLE IF EXISTS vehicle_server.vehicles;
DROP SCHEMA IF EXISTS vehicle_server;
`

interface DBConfig {
  user: string
  host: string
  database: string
  password: string
  port: number
}

export function dbConfigFromEnv(): DBConfig {
  return {
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432'),
    database: process.env.DB_DATABASE ?? 'vehicle',
    user: process.env.DB_USER ?? 'vehicle',
    password: process.env.DB_PASSWORD ?? 'vehicle',
  }
}

export async function connectDb(cfg: DBConfig): Promise<pg.Pool> {
  const pool = new pg.Pool({
    user: cfg.user,
    host: cfg.host,
    database: cfg.database,
    password: cfg.password,
    port: cfg.port
  });

  // Create the database. We should run migrations here,
  await createSchema(pool);

  return pool;
}

export async function createSchema(pool: pg.Pool) {
  await pool.query(createSchemaStatement);
}

export async function dropSchema(pool: pg.Pool) {
  await pool.query(deleteSchemaStatement);
}
