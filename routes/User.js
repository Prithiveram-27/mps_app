const express = require('express');
const userController = require('../controllers/User');

const router = express.Router();

router.post('/createUser', userController.createUser);
router.get('/getAllUsers', userController.getAllUsers);
router.get('/getUserById', userController.getUser);
router.get('/getUsersByNameOrMobileNumber', userController.getUsersByNameOrMobileNumber);
router.put('/updateUserById', userController.updateUserById);
router.delete('/deleteUserById', userController.deleteUserById);

router.post('/:id', userController.login);


module.exports = router;
