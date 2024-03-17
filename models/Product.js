const db = require('../config/db');

class Product {
        constructor({productName,amount}) {
            this.productName = productName;
            this.amount = amount;
        }  

        static getAllProducts(callback) {
            const sql = 'SELECT * FROM product ORDER BY productname ASC';
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

        static deleteProductbyId(productId, callback) {
            const sql = 'DELETE FROM product WHERE product_id = $1';
            const values = [productId];
            db.query(sql, values, (err, result) => {
                if (err) {
                    return callback(err);
                }
                return callback(null, result);
            });
        }

        static updateProductbyId(productId, productData, callback) {
            const sql = 'UPDATE product SET productname = $1, amount = $2 WHERE product_id = $3';
            const values = [
                productData.productname,
                productData.amount,
                productId
            ];
            db.query(sql, values, (err, result) => {
                if (err) {
                    return callback(err);
                }
                return callback(null, result);
            });
        }
    }

    module.exports = Product;