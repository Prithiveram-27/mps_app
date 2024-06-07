const db = require('../config/db');

class Service {
    constructor({
                    customerId,
                    date,
                    servicePerson,
                    productBrand,
                    problemType,
                    problemStatus,
                    problemDescription,

                }) {
        this.customerId = customerId;
        this.date = date;
        this.servicePerson = servicePerson;
        this.productBrand = productBrand;
        this.problemType = problemType;
        this.problemStatus = problemStatus;
        this.problemDescription = problemDescription;
    }

    static createService(serviceData, callback) {
        const sql = 'INSERT INTO service (customerid, date, serviceperson, productname, problemtype,productstatus,problemdescription) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING serviceid';
        const values = [
            serviceData.id,
            serviceData.date,
            serviceData.servicePerson,
            serviceData.productBrand,
            serviceData.problemType,
            serviceData.problemStatus,
            serviceData.problemDescription
        ];
        db.query(sql, values, (err, result) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, result.rows[0].serviceid);
        });
    }

    static getAll(callback) {
        const sql = 'SELECT * FROM service ORDER BY date ASC';
        db.query(sql, (err, result) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, result.rows);
        });
    }

    static deleteServiceById(serviceId, callback) {
        const sql = 'DELETE FROM service WHERE serviceid = $1';
        const values = [serviceId];
        db.query(sql, values, (err, result) => {
            if (err) {
                return callback(err);
            }
            return callback(null, result);
        });
    }

    static updateServiceById(serviceId, serviceData, callback) {
        const sql = 'UPDATE service SET  date = $1, servicePerson = $2, productname = $3, problemType = $4, productStatus = $5, problemDescription = $6 WHERE serviceid = $7';
        const values = [
            serviceData.date,
            serviceData.serviceperson,
            serviceData.productname,
            serviceData.problemtype,
            serviceData.productstatus,
            serviceData.problemdescription,
            serviceData.serviceid
        ];
        db.query(sql, values, (err, result) => {
            if (err) {
                return callback(err);
            }
            return callback(null, result);
        });
    }

    static getServicesByCustomerDetails(mobileNumber, name, callback) {
        const customerSql = `
            SELECT id FROM customers WHERE mobilenumber = $1 OR name = $2
        `;
        const customerValues = [mobileNumber, name];

        db.query(customerSql, customerValues, (err, customerResult) => {
            if (err) {
                return callback(err, null);
            }

            if (customerResult.rows.length === 0) {
                return callback(new Error('Customer not found'), null);
            }

            const customerId = customerResult.rows[0].id;
            const serviceSql = `
                SELECT * FROM service WHERE customerid = $1
            `;
            const serviceValues = [customerId];

            db.query(serviceSql, serviceValues, (err, serviceResult) => {
                if (err) {
                    return callback(err, null);
                }
                return callback(null, serviceResult.rows);
            });
        });
    }


}
module.exports = Service;