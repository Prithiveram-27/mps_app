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

  module.exports = {
    getAllProducts
  }