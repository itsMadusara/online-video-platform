import pg from "pg";
const { Pool } = pg;
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'vidplat',
    password: 'root',
    dialect: 'postgres',
    port: 5432
});

export default pool;