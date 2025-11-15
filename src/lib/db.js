const { Pool } = require("pg");

let pool;

function getPool() {
    if (!pool) {
        pool = new Pool({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT || 5432,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
        });
    }
    return pool;
}

async function initializeDatabase() {
    const pool = getPool();
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS search_results (
                id SERIAL PRIMARY KEY,
                search_url TEXT NOT NULL,
                search_params TEXT NOT NULL,
                items_data JSONB NOT NULL,
                items_count INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT NOW()
            )
        `);
        console.log("Database table initialized");
    } catch (error) {
        console.error("Error initializing database:", error);
    }
}

async function saveSearchResult(items, baseUrl, params) {
    const pool = getPool();
    try {
        const result = await pool.query(
            `INSERT INTO search_results (search_url, search_params, items_data, items_count, created_at)
             VALUES ($1, $2, $3, $4, NOW())
             RETURNING id`,
            [baseUrl, params, JSON.stringify(items), items.length]
        );
        return result.rows[0].id;
    } catch (error) {
        console.error("Error saving to database:", error);
        return null;
    }
}

async function getSearchHistory(limit = 50) {
    const pool = getPool();
    try {
        const result = await pool.query(
            `SELECT id, search_url, search_params, items_count, created_at
             FROM search_results
             ORDER BY created_at DESC
             LIMIT $1`,
            [limit]
        );
        return result.rows;
    } catch (error) {
        console.error("Error fetching history:", error);
        return [];
    }
}

async function getSearchResult(id) {
    const pool = getPool();
    try {
        const result = await pool.query(
            `SELECT * FROM search_results WHERE id = $1`,
            [id]
        );
        return result.rows[0] || null;
    } catch (error) {
        console.error("Error fetching search result:", error);
        return null;
    }
}

module.exports = {
    initializeDatabase,
    saveSearchResult,
    getSearchHistory,
    getSearchResult,
};
