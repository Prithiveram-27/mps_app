const express = require('express');
const router = express.Router();
const {
    createCustomer,
    getCustomersbyNameorMobilenumber,
    getAllCustomers,
    updateCustomerDetailsById,
    updateAmcDetailsById,
    getCustomerNotificationDetails,
} = require('../controllers/customers');

router.get('/getAllCustomers', getAllCustomers);
router.get('/getCustomersbyNameorMobilenumber/', getCustomersbyNameorMobilenumber)
router.get('/getCustomerNotificationDetails', getCustomerNotificationDetails);
router.post('/updateCustomerDetailsById', updateCustomerDetailsById);
router.post('/updateAmcDetailsById', updateAmcDetailsById);


module.exports = router;