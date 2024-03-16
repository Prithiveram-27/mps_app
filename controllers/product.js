const Product = require('../models/Product');

/**
 * @desc Get all Products
 * @route GET/api/products
 * @access Private
 */

const getAllProducts = async (req, res) => {
    try{
       Product.getAllProducts((err, products) => {
          if (err) {
            return res.status(400).json({ success: false, error: err.message });
          }
          return res.status(200).json({ success: true, products });
          });
    } catch (error) {
    console.error("Error:", error);
      res.status(500).json({ error: "An error occurred while processing the request." });
    }
  }

  const createProduct = (req, res) => {
    try {
      Product.checkExistingProduct(req.body.productname, (existingProduct) => {
        if (existingProduct) { 
          return res.status(400).json({ error: "A Product with the same name already exists." });
        }
  
        const { productname, amount } = req.body;
  
        const newProduct = {
            productname,
            amount,
        };
  
        Product.createNewProduct(newProduct, (err, ProductId) => {
          if (err) {
            return res.status(400).json({ success: false, error: err.message });
          }
          return res.status(201).json({ success: true, ProductId });
        });
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "An error occurred while processing the request." });
    }
  };

  module.exports = {
    getAllProducts,
    createProduct,
  }