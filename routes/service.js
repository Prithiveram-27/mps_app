const express = require('express');
const router = express.Router();
const { createService, updateServiceById, deleteServiceById, getAllServices,getServiceRecordsByCustomer,updateServiceStatus} = require('../controllers/service');

router.post('/', createService);
router.get('/getAllServices', getAllServices);
router.get('/getServiceRecordsByCustomer', getServiceRecordsByCustomer);
router.put('/updateService', updateServiceById);
router.patch('/updateServiceStatus', updateServiceStatus);
router.delete('/deleteService', deleteServiceById);

module.exports = router;