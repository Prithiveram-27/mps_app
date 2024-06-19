const db = require('../config/db');
const bcrypt = require('bcrypt');

class User {
    constructor({username,
                 email,
                 mobilenumber,
                 password_hash,
                 is_admin,
                 date_of_birth,
                 marriage_date,
                 address}) {
        this.username = username;
        this.email = email;
        this.password_hash = password_hash;
        this.is_admin = is_admin;
        this.date_of_birth = date_of_birth;
        this.marriage_date = marriage_date;
        this.address = address;
        this.mobilenumber = mobilenumber;

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

    static getUserById(id, callback) {
        const sql = 'SELECT * FROM users WHERE user_id = $1';
        const values = [id];
        db.pool.query(sql, values, (err, result) => {
            if (err) {
                return callback(err, null);
            }
            if (result.rows.length === 0) {
                return callback(null, null); // User not found
            }
            return callback(null, result.rows);
        });
    }

    static getUsersByNameOrMobileNumber(searchTerm, callback) {
        const sql = 'SELECT * FROM users WHERE username = $1 OR mobilenumber = $2';
        const values = [searchTerm, searchTerm];
        db.pool.query(sql, values, (err, result) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, result.rows);
        });
    }

    static createNewUser(userData, callback) {
        const sql = 'INSERT INTO users (username, email, password_hash,is_admin, date_of_birth, marriage_date, address, mobilenumber) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING user_id';
        const values = [
            userData.username,
            userData.email,
            userData.password_hash,
            userData.is_admin,
            userData.date_of_birth,
            userData.marriage_date,
            userData.address,
            userData.mobilenumber
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
        const sql = 'UPDATE users SET username = $1, email = $2, password_hash = $3, is_admin = $4, date_of_birth = $5, marriage_date = $6, address = $7, mobilenumber = $8 WHERE user_id = $9';
        const values = [
            userData.username,
            userData.email,
            userData.password_hash,
            userData.is_admin,
            userData.date_of_birth,
            userData.marriage_date,
            userData.address,
            userData.mobilenumber,
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