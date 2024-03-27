const Service = require('../models/Service');

const createService = async (req, res) => {
    try {
        const {
            name,
            address,
            mobileNumber,
            alternateMobileNumber,
            date,
            servicePerson,
            productBrand,
            problemType,
            problemStatus,
            problemDescription
        } = req.body;

        if (!name || !address || !mobileNumber || !date || !servicePerson || !problemType) {
            return res.status(400).json({ error: "Name, address, mobile number, date, service person, and problem type are required." });
        }

        const newService = {
            name,
            address,
            mobileNumber,
            alternateMobileNumber,
            date,
            servicePerson,
            productBrand,
            problemType,
            problemStatus,
            problemDescription
        };

        Service.create(newService, (err, service) => {
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
        const serviceId = req.params.id;
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
        const serviceId = req.params.id;
        const {
            name,
            address,
            mobileNumber,
            alternateMobileNumber,
            date,
            servicePerson,
            productBrand,
            problemType,
            problemStatus,
            problemDescription
        } = req.body;

        const updatedService = {
            name,
            address,
            mobileNumber,
            alternateMobileNumber,
            date,
            servicePerson,
            productBrand,
            problemType,
            problemStatus,
            problemDescription
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
        Service.getAll((err, service) => {
            if (err) {
                return res.status(400).json({ success: false, error: err.message });
            }
            return res.status(200).json({ success: true, service });
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