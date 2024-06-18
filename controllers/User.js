const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { jwtSecret } = require('../config/db');

const login = async (req, res) => {
    const { username, password } = req.body; 

    try {
        User.findByUsernameOrMobileAndPassword(username, password, (err, user) => {
            if (err) {
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            if (!user) {
                return res.status(401).json({ error: 'Invalid username/phone number or password' });
            }

            // Generate JWT
            const token = jwt.sign({ userId: user.user_id, username: user.username }, jwtSecret, { expiresIn: '1h' });

            res.status(200).json({ token });
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const createUser = async (req, res) => {
    try {
        const { username, email, password, is_admin, date_of_birth, marriage_date, address, mobilenumber } = req.body;
        const password_hash = await bcrypt.hash(password, 10);

        User.checkExistingUser(username,mobilenumber, (err, existingUser) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (existingUser) {
                return res.status(400).json({ error: 'User with this username or mobilenumber already exists' });
            }

            const newUser = new User({ username, email, password_hash, is_admin, date_of_birth, marriage_date, address, mobilenumber });
            User.createNewUser(newUser, (err, userId) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.status(201).json({ user_id: userId });
            });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getAllUsers = (req, res) => {
    User.getAllUsers((err, users) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(users);
    });
};

const getUser = (req, res) => {
    const { id } = req.query;
    User.getUserById(id,(err, user) => {
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    });
};

const getUsersByNameOrMobileNumber = (req, res) => {
    const { searchTerm } = req.query; // Use req.query to get the search term from query parameters
    User.getUsersByNameOrMobileNumber(searchTerm, (err, users) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!users || users.length === 0) {
            return res.status(404).json({ error: 'No users found' });
        }
        res.status(200).json(users);
    });
};

const updateUserById = async (req, res) => {
    const id = req.query.id;
    const { username, email, password, is_admin, date_of_birth, marriage_date, address, mobilenumber } = req.body;
    const password_hash = await bcrypt.hash(password, 10);
    const updatedUserData = { username, email, password_hash, is_admin, date_of_birth, marriage_date, address, mobilenumber};
    User.updateUserById(id, updatedUserData, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(result);
    });
};

const deleteUserById = async (req, res) => {
    try {
        const userId = req.query.id;
        User.deleteUserById(userId, (err, result) => {
            if (err) {
                return res.status(400).json({ success: false, error: err.message });
            }
            return res.status(200).json({ success: true, result });
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "An error occurred while processing the request." });
    }
};


module.exports = {
    login,
    createUser,
    getUser,
    getAllUsers,
    getUsersByNameOrMobileNumber,
    deleteUserById,
    updateUserById,
}