const express = require('express');
const userController = require('../controllers/User');

const router = express.Router();

router.post('/createUser', userController.createUser);
router.get('/getAllUsers', userController.getAllUsers);
router.get('/:id', userController.getUser);
router.put('/:id', userController.updateUserById);
router.delete('/:id', userController.deleteUserById);

router.post('/:id', userController.login);


module.exports = router;
