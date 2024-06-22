const express = require('express');
const {query} = require("../config/db");
const bodyParser = require('body-parser');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Customer = require('../models/Customer');

router.use(bodyParser.json());

function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000);
}

// Object to store OTPs temporarily
const otpStore = {};

function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000);
}

router.post('/register', async (req, res) => {
    try {
        const { username, email, password, phoneNumber } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOTP();

        const insertQuery = `
            INSERT INTO users (
                username,
                email,
                password_hash,
                phone_number,
                is_admin,
                created_dt_tm,
                updated_dt_tm,
                active_ind,
                updated_cnt
            ) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, true, 0)
        `;

        const values = [username, email, hashedPassword, phoneNumber, false]; // Assuming the new user is not an admin by default

        // Execute the SQL query to insert user details into the database
        await query(insertQuery, values);

        otpStore[email] = otp;

        // Send OTP to user's email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'mpswaterpurifier@gmail.com',
                pass: 'your_password'
            }
        });

        const mailOptions = {
            from: 'mpswaterpurifier@gmail.com',
            to: email,
            subject: 'OTP Verification',
            text: `Your OTP for registration is: ${otp}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending OTP:', error);
                res.status(500).send('Internal Server Error');
            } else {
                console.log('OTP sent:', info.response);
                res.status(201).send('User registered successfully. Please check your email for OTP verification.');
            }
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/verifyOTP', async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Retrieve the OTP from the temporary store
        const actualOTP = otpStore[email];

        if (actualOTP && otp === actualOTP.toString()) {
            delete otpStore[email]; // Remove OTP from store after verification
            res.status(200).send('OTP verified successfully.');
        } else {
            // If OTP verification fails, respond with error code
            res.status(400).send('OTP verification failed. Please try again.');
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
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
                    const token = jwt.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '480s' });
                    // const customerToNotify = await sendLastDateNotification(req, res);
                    // res.status(200).json({ token, customerToNotify });
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

const sendLastDateNotification = async (req, res) => {
    try {
        Customer.getAllCustomers((err, customers) => {
            if (err) {
                return res.status(400).json({ success: false, error: err.message });
            }

            const startDaysBefore = 1;
            const endDaysBefore = 2;

            const filteredCustomers = filterCustomersByAMCServiceEndDate(customers, startDaysBefore, endDaysBefore);

            return res.status(200).json({ success: true, customers: filteredCustomers });
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "An error occurred while processing the request." });
    }
};

const filterCustomersByAMCServiceEndDate = (customers, startDaysBefore, endDaysBefore) => {
    const currentDate = new Date();
    return customers.filter(customer => {
        console.log("Customer", customer);
        const nextservicedate = new Date(customer.nextservicedate);
        return isWithinNotificationRange(currentDate, nextservicedate, startDaysBefore, endDaysBefore);
    });
};

const isWithinNotificationRange = (currentDate, endDate, startDaysBefore, endDaysBefore) => {
    console.log("inside isWithinNotificationRange");
    const startNotificationDate = new Date(currentDate);
    startNotificationDate.setDate(startNotificationDate.getDate() + startDaysBefore);

    const endNotificationDate = new Date(currentDate);
    endNotificationDate.setDate(endNotificationDate.getDate() + endDaysBefore);

    return endDate >= startNotificationDate && endDate <= endNotificationDate;
};

module.exports = router;