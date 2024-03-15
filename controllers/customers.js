const Customer = require('../models/Customer')
const express = require('express');


/**
 * @desc Create New Customer
 * @route POST/api/v1/customers
 * @access Public
 */


const createCustomer = (req, res) => {
  try {
    console.log(req.body);

    Customer.checkExistingCustomer(req.body.mobileNumber, (existingCustomer) => {
      if (existingCustomer) { // Check if an existing customer with the same mobile number exists
        return res.status(400).json({ error: "A customer with the same mobile number already exists." });
      }

      const { name, address, mobileNumber, alternateMobileNumber, date, amount, remarks, activityPerson, activityType, isAMCEnabled, AMCStartDate, AMCEndDate, lastServiceDate, nextServiceDate } = req.body;

      const requiredFields = ['name', 'address', 'mobileNumber', 'date', 'amount'];
      const missingFields = requiredFields.filter(field => !req.body[field]);

      if (missingFields.length > 0) {
        return res.status(400).json({ error: `Please provide the following field(s): ${missingFields.join(', ')}.` });
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
        activityType,
        isAMCEnabled,
        AMCStartDate,
        AMCEndDate,
        lastServiceDate,
        nextServiceDate
      };

      Customer.createNewCustomer(newCustomer, (err, customerId) => {
        if (err) {
          return res.status(400).json({ success: false, error: err.message });
        }
        return res.status(201).json({ success: true, customerId });
      });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred while processing the request." });
  }
};


/**
 * @desc Get all Customers
 * @route GET/api/customers
 * @access Private
 */

const getAllCustomers = async (req, res) => {
  try{
     Customer.getAllCustomers((err, customers) => {
        if (err) {
          return res.status(400).json({ success: false, error: err.message });
        }
        console.log("res", res);
        return res.status(200).json({ success: true, customers });
        });
  } catch (error) {
  console.error("Error:", error);
    res.status(500).json({ error: "An error occurred while processing the request." });
}
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
}

  /**
 * @desc Update Customer details
 * @route POST/api/customers
 * @access Public
 */

const updateCustomerDetailsById = (req, res) => {
    try {
      const customerId = req.query.customerId;
      Customer.updateCustomerDetailsById(customerId, req.body, (err, result) => {
        if (err) {
          console.error("Error:", err);
          res.status(500).json({ error: "An error occurred while updating customer details."});
        }else{
          res.status(200).json({ success: true, message: "Customer details updated successfully." });
        }
      })

    }catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "An error occurred while processing the request." });
    }
  }
  const updateAmcDetailsById = (req, res) => {
      try {
        const customerId = req.query.customerId;
        var currentDate = new Date();

        const { name, address, mobileNumber, alternateMobileNumber, date, amount, remarks, activityPerson, activityType, isAMCEnabled, AMCStartDate, AMCEndDate, lastServiceDate, nextServiceDate } = req.body;

        if((isAMCEnabled === false || isAMCEnabled === null) && AMCStartDate < currentDate && AMCEndDate < currentDate){
          
          isAMCEnabled = true;
          AMCStartDate = currentDate;
          AMCEndDate = currentDate.setFullYear(currentDate.getFullYear() + 1);

          const newCustomer = {name,address, mobileNumber,alternateMobileNumber,date,amount,remarks,activityPerson,activityType,isAMCEnabled,AMCStartDate,AMCEndDate,lastServiceDate,nextServiceDate
          };

          Customer.updateAmcDetailsById(customerId, newCustomer, (err, result) => {
            if (err) {
              console.error("Error:", err);
              res.status(500).json({ error: "An error occurred while updating customer details."});
            }else{
              res.status(200).json({ success: true, message: "Customer details updated successfully." });
            }
          });
        }else{
          res.status(200).json({ success: false, message: "AMC is already enabled for this customer"});
        }
      }catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "An error occurred while processing the request." });
      }
    }
  






module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomersbyNameorMobilenumber,
  updateCustomerDetailsById,
  updateAmcDetailsById,
}