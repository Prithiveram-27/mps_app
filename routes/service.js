const express = require('express');
const router = express.Router();
const { createService, updateServiceById, deleteServiceById, getAllServices,getServiceRecordsByCustomer} = require('../controllers/service');

router.post('/', createService);
router.get('/getAllServices', getAllServices);
router.get('/getServiceRecordsByCustomer', getServiceRecordsByCustomer);
router.post('/updateService', updateServiceById);
router.delete('/deleteService', deleteServiceById);

module.exports = router;