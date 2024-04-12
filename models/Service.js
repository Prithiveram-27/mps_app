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
        const sql = 'INSERT INTO service (customer_id, date, service_person, product_name, problem_type,product_status,problem_description) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING service_id';
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
            return callback(null, result.rows[0].id);
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
        const sql = 'DELETE FROM service WHERE service_id = $1';
        const values = [serviceId];
        db.query(sql, values, (err, result) => {
            if (err) {
                return callback(err);
            }
            return callback(null, result);
        });
    }

    static updateServiceById(serviceId, serviceData, callback) {
        const sql = 'UPDATE service SET name = $1, address = $2, mobileNumber = $3, alternateMobileNumber = $4, date = $5, servicePerson = $6, productBrand = $7, problemType = $8, problemStatus = $9, problemDescription = $10 WHERE service_id = $11';
        const values = [
            serviceData.name,
            serviceData.address,
            serviceData.mobileNumber,
            serviceData.alternateMobileNumber,
            serviceData.date,
            serviceData.servicePerson,
            serviceData.productBrand,
            serviceData.problemType,
            serviceData.problemStatus,
            serviceData.problemDescription
        ];
        db.query(sql, values, (err, result) => {
            if (err) {
                return callback(err);
            }
            return callback(null, result);
        });
    }
}
module.exports = Service;