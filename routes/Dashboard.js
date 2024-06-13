const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/Dashboard');

// Define routes
router.get('/counts', DashboardController.getDashboardCounts);

module.exports = router;
