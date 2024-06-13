const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { jwtSecret } = require('../config/db');

const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        // Find user by username
        User.findByUsernameAndPassword(username,password ,async (err, user) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (!user) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }

            // Verify password
            const passwordMatch = await bcrypt.compare(password, user.password_hash);
            if (!passwordMatch) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }

            // Generate JWT
            const token = jwt.sign({ userId: user.user_id, username: user.username }, jwtSecret, { expiresIn: '1h' });
            
            res.status(200).json({ token });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createUser = async (req, res) => {
    try {
        const { username, email, password, is_admin } = req.body;
        const password_hash = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password_hash, is_admin });
        User.createNewUser(newUser, (err, userId) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ user_id: userId });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllUsers = (req, res) => {
    User.getAllUsers((err, users) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(users);
    });
};

const getUser = (req, res) => {
    const { id } = req.params;
    User.checkExistingUser(id, (user) => {
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    });
};

const updateUserById = async (req, res) => {
    const { id } = req.params;
    const { username, email, password, is_admin } = req.body;
    const password_hash = await bcrypt.hash(password, 10);
    const updatedUserData = { username, email, password_hash, is_admin };
    User.updateUserById(id, updatedUserData, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(result);
    });
};

const deleteUserById = (req, res) => {
    const { id } = req.params;
    User.deleteUserById(id, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(204).send();
    });
};


module.exports = {
    login,
    createUser,
    getUser,
    getAllUsers,
    deleteUserById,
    updateUserById,
}