const express = require('express');
const {query} = require("../config/db");
const bodyParser = require('body-parser');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.use(bodyParser.json());

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (error, results) => {
            if (error) {
                console.error('Error registering user:', error);
                res.status(500).send('Internal Server Error');
            } else {
                res.status(201).send('User registered successfully.');
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        query('SELECT * FROM users WHERE username = ?', [username], async (error, results) => {
            if (error) {
                console.error('Error retrieving user:', error);
                res.status(500).send('Internal Server Error');
            } else {
                const user = results[0];

                if (user && await bcrypt.compare(password, user.password)) {
                    // Generate a JWT token for authentication
                    const token = jwt.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '480s' });

                    res.status(200).json({ token });
                } else {
                    res.status(401).send('Invalid credentials.');
                }
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;