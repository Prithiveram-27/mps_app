const db = require('../config/db');

class Customer {
    constructor({
        name,
        address,
        mobileNumber,
        alternateMobileNumber,
        date,
        amount,
        remarks,
        activityPerson,
        activityType,
        isAMCEnabled,
        AMCStartDate,
        AMCEndDate,
        lastServiceDate,
        nextServiceDate,
        brand,
        isEmienabled,
        emiAmount,
        emiMonths
    }) {
        this.name = name;
        this.address = address;
        this.mobileNumber = mobileNumber;
        this.alternateMobileNumber = alternateMobileNumber;
        this.date = date;
        this.amount = amount;
        this.remarks = remarks;
        this.activityPerson = activityPerson;
        this.activityType = activityType;
        this.isAMCEnabled = isAMCEnabled;
        this.AMCStartDate = AMCStartDate;
        this.AMCEndDate = AMCEndDate;
        this.lastServiceDate = lastServiceDate;
        this.nextServiceDate = nextServiceDate;
        this.brand = brand;
        this.isEmienabled = isEmienabled;
        this.emiAmount = emiAmount;
        this.emiMonths = emiMonths;
    }

    static createNewCustomer(customerData, callback) {
        const sql = 'INSERT INTO customers (name, address, mobilenumber, alternatemobilenumber, date, amount, remarks, activityperson, activitytype, isamcenabled, amcstartdate, amcenddate, lastservicedate, nextservicedate,brand,isEmienabled, emiAmount, emiMonths) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,$15,$16,$17,$18) RETURNING id';
        const values = [
            customerData.name,
            customerData.address,
            customerData.mobileNumber,
            customerData.alternateMobileNumber,
            customerData.date,
            customerData.amount,
            customerData.remarks,
            customerData.activityPerson,
            customerData.activityType,
            customerData.isAMCEnabled,
            customerData.AMCStartDate,
            customerData.AMCEndDate,
            customerData.lastServiceDate,
            customerData.nextServiceDate,
            customerData.brand
            customerData.isEmienabled,
            customerData.emiAmount,
            customerData.emiMonths
        ];
        db.pool.query(sql, values, (err, result) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, result.rows[0].id);
        });
    }

    static getAllCustomers(callback) {
        console.log("Inside getall");
        const sql = 'SELECT * FROM customers';
        db.pool.query(sql, (err, result) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, result.rows);
        });
    }

    static getByCustomerNameOrPhoneNumber(searchTerm, callback) {
        const sql = 'SELECT * FROM customers WHERE name ILIKE $1 OR mobilenumber ILIKE $2';
        const searchValue = `%${searchTerm}%`;
        db.pool.query(sql, [searchValue, searchValue], (err, result) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, result.rows);
        });
    }

    static getCustomerById(customerId, callback) {
        const sql = 'SELECT * FROM customers WHERE id = $1';
        const values = [customerId];
        db.pool.query(sql, values, (err, result) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, result.rows[0]);
        });
    }

    static getCustomersByIds(customerIds, callback) {
        const placeholders = customerIds.map((_, index) => `$${index + 1}`).join(',');
        const sql = `SELECT * FROM customers WHERE id IN (${placeholders})`;
        const values = customerIds;
        db.pool.query(sql, values, (err, result) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, result.rows);
        });
    }
    
    static checkExistingCustomer(mobileNumber, callback) {
        const sql = 'SELECT * FROM customers WHERE mobileNumber = $1';
        const values = [mobileNumber];

        db.pool.query(sql, values, (err, result) => {
            if (err) {
                return callback(err);
            }
            const existingCustomer = result.rows[0];
            return callback(existingCustomer);
        });
    }

    static updateCustomerDetailsById(customerId, customerData, callback) {
        const sql = 'UPDATE customers SET name = $1, address = $2, mobilenumber = $3, alternatemobilenumber = $4, date = $5, amount = $6, remarks = $7, activityperson = $8, activitytype = $9, isamcenabled = $10, amcstartdate = $11, amcenddate = $12, lastservicedate = $13, nextservicedate = $14, brand = $15 WHERE id = $16';
        const values = [
            customerData.name,
            customerData.address,
            customerData.mobileNumber,
            customerData.alternateMobileNumber,
            customerData.date,
            customerData.amount,
            customerData.remarks,
            customerData.activityPerson,
            customerData.activityType,
            customerData.isAMCEnabled,
            customerData.amcStartDate,
            customerData.amcEndDate,
            customerData.lastServiceDate,
            customerData.nextServiceDate,
            customerData.brand,
            customerId 
        ];
        db.pool.query(sql, values, (err, result) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, result);
        });
    }
    
    static updateAmcDetailsById(customerId, customerData, callback) {
        const sql = 'UPDATE customers SET isamcenabled = $1, amcstartdate = $2, amcenddate = $3 WHERE id = $4';
        const values = [
            customerData.isAMCEnabled,
            customerData.AMCStartDate,
            customerData.AMCEndDate,
            customerId
        ]
        db.pool.query(sql, values, (err, result) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, result);
        })
    }

    static deleteCustomerById(customerId, callback) {
        const sql = 'DELETE FROM customers WHERE id = $1';
        const values = [customerId];
        db.pool.query(sql, values, (err, result) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, result);
        });
    }

    static getCustomersByMobileNumberOrName(mobileNumber, name, callback) {
        let sql;
        let values;

        if (mobileNumber) {
            sql = 'SELECT * FROM customers WHERE mobilenumber ILIKE $1';
            values = [`%${mobileNumber}%`];
        } else if (name) {
            sql = 'SELECT * FROM customers WHERE name ILIKE $1';
            values = [`%${name}%`];
        } else {
            // No search criteria provided
            return callback('Mobile number or name is required', null);
        }

        db.pool.query(sql, values, (err, result) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, result.rows);
        });
    }

    static getTotalCustomers(callback) {
        const sql = 'SELECT COUNT(*) FROM customers';
        db.pool.query(sql, (err, result) => {
          if (err) {
            return callback(err, null);
          }
          const totalCustomers = parseInt(result.rows[0].count);
          callback(null, totalCustomers);
        });
      }
}

module.exports = Customer;
