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
        activityType
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
    }

    static createNewCustomer(customerData, callback) {
        const sql = 'INSERT INTO customers (name, address, mobile_number, alternate_mobile_number, date, amount, remarks, sales_service_person) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id';
        const values = [
            customerData.name,
            customerData.address,
            customerData.mobileNumber,
            customerData.alternateMobileNumber,
            customerData.date,
            customerData.amount,
            customerData.remarks,
            customerData.activityPerson,
            customerData.activityType
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


}

module.exports = Customer;
