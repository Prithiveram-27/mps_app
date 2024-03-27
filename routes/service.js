const express = require('express');
const router = express.Router();
const { createService, updateServiceById, deleteServiceById, getAllServices} = require('../controllers/service');

router.post('/', createService);
router.get('/getAll', getAllServices);
router.post('/updateService', updateServiceById);
router.delete('/deleteService', deleteServiceById);

module.exports = router;