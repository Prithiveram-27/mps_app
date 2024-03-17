const express = require('express');
const router = express.Router();
const {
    getAllProducts,
    createProduct,
    deleteProductbyId,
    updateProductbyId
} = require('../controllers/product');
const { createNewProduct } = require('../models/Product');

router.get('/getAllProducts', getAllProducts);
router.post('/createProduct', createProduct);
router.post('/deleteProductbyId', deleteProductbyId);
router.post('/updateProductbyId', updateProductbyId);

module.exports = router;