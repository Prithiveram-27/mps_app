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
    }

    module.exports = Product;