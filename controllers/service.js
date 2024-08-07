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

const getServiceRecordsByCustomer = (req, res) => {
    const { mobileNumber, name } = req.query;

    if (!mobileNumber && !name) {
        return res.status(400).json({ error: 'Mobile number or name is required' });
    }

    Service.getServicesByCustomerDetails(mobileNumber, name, (err, services) => {
        if (err) {
            if (err.message === 'Customer not found') {
                return res.status(404).json({ error: 'Customer not found' });
            }
            return res.status(500).json({ error: 'An error occurred while retrieving service records' });
        }

        Customer.getCustomersByMobileNumberOrName(mobileNumber, name, (err, customers) => {
            if (err) {
                console.error('Error fetching customer details:', error);
                return res.status(500).json({ error: 'An error occurred while retrieving customer details' });
            }

            const customer = customers.length > 0 ? customers[0] : null;

            const serviceDataList = services.map(service => ({
                service: service
            }));

            res.status(200).json({ success: true, customer: customer, services: serviceDataList });
        });
    });
};

const updateServiceStatus = (req, res) => {
    const { serviceId } = req.query;
    const { serviceStatus } = req.body;

    if (!serviceId || !serviceStatus) {
        return res.status(400).json({ error: 'Service ID and status are required' });
    }

    Service.updateServiceStatusById(serviceId, serviceStatus, (err, result) => {
        if (err) {
            console.error('Error updating service status:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        return res.status(200).json({ message: 'Service status updated successfully', result:'success' });
    });
};


module.exports = {
    createService,
    deleteServiceById,
    updateServiceById,
    getAllServices,
    getServiceRecordsByCustomer,
    updateServiceStatus
};