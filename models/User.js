const db = require('../config/db');
const bcrypt = require('bcrypt');

class User {
    constructor({ username, email,mobilenumber, password_hash, is_admin }) {
        this.username = username;
        this.email = email;
        this.mobilenumber = mobilenumber;
        this.password_hash = password_hash;
        this.is_admin = is_admin;
    }

    static async findByUsernameOrMobileAndPassword(identifier, password, callback) {
        const isPhoneNumber = /^\d{10}$/.test(identifier); 

        const sql = isPhoneNumber
            ? 'SELECT * FROM users WHERE mobilenumber = $1'
            : 'SELECT * FROM users WHERE username = $1';

        const values = [identifier];

        try {
            const result = await db.pool.query(sql, values);
            if (result.rows.length === 0) {
                return callback(null, null); 
            }

            const user = result.rows[0];
            const passwordMatch = await bcrypt.compare(password, user.password_hash);
            if (!passwordMatch) {
                return callback(null, null); 
            }

            return callback(null, user); 
        } catch (err) {
            return callback(err);
        }
    }

    
    static getAllUsers(callback) {
        const sql = 'SELECT * FROM users ORDER BY username ASC';
        db.pool.query(sql, (err, result) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, result.rows);
        });
    }

    static createNewUser(userData, callback) {
        const sql = 'INSERT INTO users (username, email, mobilenumber, password_hash,is_admin) VALUES ($1, $2, $3, $4, $5) RETURNING user_id';
        const values = [
            userData.username,
            userData.email,
            userData.mobilenumber,
            userData.password_hash,
            userData.is_admin
        ];
        db.pool.query(sql, values, (err, result) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, result.rows[0].user_id);
        });
    }

    static async checkExistingUser(name,mobilenumber, callback) {
        const sql = 'SELECT * FROM users WHERE username = $1 OR mobilenumber = $2';
        const values = [name, mobilenumber];
        try {
            const result = await db.pool.query(sql, values);
            const existingUser = result.rows[0];
            return callback(null, existingUser);
        } catch (err) {
            return callback(err);
        }
    }

    static deleteUserById(userId, callback) {
        const sql = 'DELETE FROM users WHERE user_id = $1';
        const values = [userId];
        db.pool.query(sql, values, (err, result) => {
            if (err) {
                return callback(err);
            }
            return callback(null, result);
        });
    }

    static updateUserById(userId, userData, callback) {
        const sql = 'UPDATE users SET username = $1, email = $2, password_hash = $3, is_admin = $4 WHERE user_id = $5';
        const values = [
            userData.username,
            userData.email,
            userData.password_hash,
            userData.is_admin,
            userId
        ];
        db.pool.query(sql, values, (err, result) => {
            if (err) {
                return callback(err);
            }
            return callback(null, result);
        });
    }
}

module.exports = User;
