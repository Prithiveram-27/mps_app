const express = require('express');
const router = express.Router();
const {
    createCustomer,
    getCustomersbyNameorMobilenumber,
    getAllCustomers,
    updateCustomerDetailsById,
    updateAmcDetailsById,
    getCustomerNotificationDetails,
    deleteCustomerById,
} = require('../controllers/customers');

router.get('/getAllCustomers', getAllCustomers);
router.get('/getCustomersbyNameorMobilenumber/', getCustomersbyNameorMobilenumber)
router.get('/getCustomerNotificationDetails', getCustomerNotificationDetails);
router.post('/createCustomer', createCustomer);
router.post('/updateCustomerDetailsById', updateCustomerDetailsById);
router.post('/updateAmcDetailsById', updateAmcDetailsById);
router.delete('/deleteCustomerById', deleteCustomerById);


module.exports = router;