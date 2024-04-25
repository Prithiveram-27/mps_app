const Service = require('../models/Service');
const Customer = require('../models/Customer');

const createService = async (req, res) => {
    try {
        const {
            id,
            date,
            servicePerson,
            productBrand,
            problemType,
            problemStatus,
            problemDescription,
            
        } = req.body;

        if (!id|| !date || !servicePerson || !problemType) {
            return res.status(400).json({ error: "Name, address, mobile number, date, service person, and problem type are required." });
        }

        const newService = {
            id,
            date,
            servicePerson,
            productBrand,
            problemType,
            problemStatus,
            problemDescription
        };

        Service.createService(newService, (err, service) => {
            if (err) {
                return res.status(400).json({ success: false, error: err.message });
            }
            return res.status(201).json({ success: true, service });
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "An error occurred while processing the request." });
    }
};

const deleteServiceById = async (req, res) => {
    try {
        const serviceId = req.query.serviceId;
        Service.deleteServiceById(serviceId, (err, result) => {
            if (err) {
                return res.status(400).json({ success: false, error: err.message });
            }
            return res.status(200).json({ success: true, result });
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "An error occurred while processing the request." });
    }
};

const updateServiceById = async (req, res) => {
    try {
        const serviceId = req.query.serviceId;
        const {
            date,
            serviceperson,
            productname,
            problemtype,
            productstatus,
            problemdescription,
            serviceid
        } = req.body;

        const updatedService = {
            date,
            serviceperson,
            productname,
            problemtype,
            productstatus,
            problemdescription,
            serviceid
        };

        Service.updateServiceById(serviceId, updatedService, (err, result) => {
            if (err) {
                return res.status(400).json({ success: false, error: err.message });
            }
            return res.status(200).json({ success: true, result });
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "An error occurred while processing the request." });
    }
};


const getAllServices = async (req, res) => {
    try {
        Service.getAll((err, services) => {
            if (err) {
                return res.status(400).json({ success: false, error: err.message });
            }

            if (!services || services.length === 0) {
                return res.status(404).json({ success: false, error: "No services found." });
            }

            const customerIds = services.map(service => service.customerid);

            Customer.getCustomersByIds(customerIds, (err, customers) => {
                if (err) {
                    console.error("Error fetching customer details:", err);
                    return res.status(500).json({ error: "An error occurred while fetching customer details." });
                }

                const serviceDataList = services.map(service => {
                    const customer = customers.find(customer => customer.id === service.customerid);
                    return {
                        service: service,
                        customer: customer
                    };
                });

                return res.status(200).json({ success: true, data: serviceDataList });
            });

        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "An error occurred while processing the request." });
    }
};


module.exports = {
    createService,
    deleteServiceById,
    updateServiceById,
    getAllServices
};