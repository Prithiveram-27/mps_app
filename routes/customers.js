const express = require('express');
const router = express.Router();
const {
    createCustomer,
    getCustomersbyNameorMobilenumber,
    getAllCustomers
} = require('../controllers/customers');

router.get('/getAllCustomers', getAllCustomers);
router.get('/getCustomersbyNameorMobilenumber/', getCustomersbyNameorMobilenumber)
router.post('/', createCustomer);

module.exports = router;