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
        brand
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
    }

    static createNewCustomer(customerData, callback) {
        const sql = 'INSERT INTO customers (name, address, mobilenumber, alternatemobilenumber, date, amount, remarks, activityperson, activitytype, isamcenabled, amcstartdate, amcenddate, lastservicedate, nextservicedate,brand) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,$15) RETURNING id';
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
        ];
        db.query(sql, values, (err, result) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, result.rows[0].id);
        });
    }

    static getAllCustomers(callback) {
        console.log("Inside getall");
        const sql = 'SELECT * FROM customers';
        db.query(sql, (err, result) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, result.rows);
        });
    }

    static getByCustomerNameOrPhoneNumber(searchTerm, callback) {
        console.log("Inside getByCustomerNameOrPhoneNumber");
        console.log("searchTerm insided query", searchTerm);
        const sql = 'SELECT * FROM customers WHERE name ILIKE $1 OR mobilenumber ILIKE $2';
        const searchValue = `%${searchTerm}%`;
        console.log("sql", sql);
        console.log("searchValue", searchValue);
        db.query(sql, [searchValue, searchValue], (err, result) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, result.rows);
        });
    }

    static checkExistingCustomer(mobileNumber, callback) {
        const sql = 'SELECT * FROM customers WHERE mobileNumber = $1';
        const values = [mobileNumber];

        db.query(sql, values, (err, result) => {
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
        db.query(sql, values, (err, result) => {
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
        db.query(sql, values, (err, result) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, result);
        })
    }

    static deleteCustomerById(customerId, callback) {
        const sql = 'DELETE FROM customers WHERE id = $1';
        const values = [customerId];
        db.query(sql, values, (err, result) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, result);
        });
    }
}

module.exports = Customer;
