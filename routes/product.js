const express = require('express');
const router = express.Router();
const {
    getAllProducts,
    createProduct,
} = require('../controllers/product');
const { createNewProduct } = require('../models/Product');

router.get('/getAllProducts', getAllProducts);
router.post('/createProduct', createProduct);

module.exports = router;