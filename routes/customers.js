const express = require('express');
const router = express.Router();
const {
    createCustomer,
    getCustomersbyNameorMobilenumber,
    getAllCustomers,
    updateCustomerDetailsById,
    updateAmcDetailsById,
} = require('../controllers/customers');

router.get('/getAllCustomers', getAllCustomers);
router.get('/getCustomersbyNameorMobilenumber/', getCustomersbyNameorMobilenumber)
router.post('/createCustomer', createCustomer);
router.post('/updateCustomerDetailsById', updateCustomerDetailsById);
router.post('/updateAmcDetailsById', updateAmcDetailsById);


module.exports = router;