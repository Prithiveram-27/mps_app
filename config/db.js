
const { Pool } = require('pg');
const crypto = require('crypto');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mpswaterpurifier',
    password: 'prithive@123',
    port: 5432,
});

module.exports = pool;

pool.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database: ', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// JWT secret key
const jwtSecret = crypto.randomBytes(32).toString('hex');

module.exports = {
    pool,
    jwtSecret,
};