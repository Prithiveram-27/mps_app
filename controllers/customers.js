const Customer = require('../models/Customer')

/**
 * @desc Create New Customer
 * @route POST/api/v1/customers
 * @access Public
 */

const createCustomer = (req, res) => {
  try {
    const { name, address, mobileNumber, alternateMobileNumber, date, amount, remarks, activityPerson, activityType } = req.body;

    if (!name || !address || !mobileNumber || !date || !amount) {
      return res.status(400).json({ error: "Please provide name, address, mobile number, date, and amount." });
    }

    const newCustomer = {
      name,
      address,
      mobileNumber,
      alternateMobileNumber,
      date,
      amount,
      remarks,
      activityPerson,
      activityType
    };

    Customer.createNewCustomer(customerData, (err, customerId) => {
      if (err) {
        return res.status(400).json({ success: false, error: err.message });
      }
      return res.status(201).json({ success: true, customerId });
    });
  } catch {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred while processing the request." });
  }
}

/**
 * @desc Get all Customers
 * @route GET/api/customers
 * @access Private
 */

const getAllCustomers = async (req, res) => {
  Customer.getAllCustomers((err, customers) => {
    if (err) {
      return res.status(400).json({ success: false, error: err.message });
    }
    console.log("res", res);
    return res.status(200).json({ success: true, customers });
  });
}

/**
 * @desc Get Customers by name or mobilenumber
 * @route GET/api/customers
 * @access Private
 */

const getCustomersbyNameorMobilenumber = (req, res) => {
  try {
    const searchTerm = req.query.searchTerm.trim();
    console.log("searchTerm", searchTerm);

    Customer.getByCustomerNameOrPhoneNumber(searchTerm, (err, customers) => {
      if (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "An error occurred while fetching customers." });
      } else {
        res.status(200).json({ customers });
      }
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred while processing the request." });
  }

};




module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomersbyNameorMobilenumber,
}