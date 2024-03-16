const db = require('../config/db');

class Product {
        constructor({productName,amount}) {
            this.productName = productName;
            this.amount = amount;
        }  

        static getAllProducts(callback) {
            const sql = 'SELECT * FROM product';
            db.query(sql, (err, result) => {
                if (err) {
                    return callback(err, null);
                }
                return callback(null, result.rows);
            });
        }

        static createNewProduct(productData, callback) {
            const sql = 'INSERT INTO product (productname, amount) VALUES ($1, $2) RETURNING product_id';
            const values = [
                productData.productname,
                productData.amount
            ];
            db.query(sql, values, (err, result) => {
                if (err) {
                    return callback(err, null);
                }
                return callback(null, result.rows[0].id);
            });
        }

        static checkExistingProduct(productname, callback) {
            const sql = 'SELECT * FROM product WHERE productname = $1';
            const values = [productname];
    
            db.query(sql, values, (err, result) => {
                if (err) {
                    return callback(err);
                }
                const existingproduct= result.rows[0];
                return callback(existingproduct);
            });
        }
    }

    module.exports = Product;