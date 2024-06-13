const Customer = require('../models/Customer');
const Service = require('../models/Service');

const getDashboardCounts = (req, res) => {
    const results = {};

    // Fetch total number of customers
    Customer.getTotalCustomers((err, totalCustomers) => {
      if (err) {
        console.error('Error fetching total customers:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      results.totalCustomers = totalCustomers;

      // Fetch total number of services completed
      Service.getTotalServicesCompleted((err, totalCompletedServices) => {
        if (err) {
          console.error('Error fetching total completed services:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        results.totalCompletedServices = totalCompletedServices;

        // Fetch total number of pending services
        Service.getTotalPendingServices((err, totalPendingServices) => {
          if (err) {
            console.error('Error fetching total pending services:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
          }
          results.totalPendingServices = totalPendingServices;

          // Fetch total number of cancelled services
          Service.getTotalCancelledServices((err, totalCancelledServices) => {
            if (err) {
              console.error('Error fetching total cancelled services:', err);
              return res.status(500).json({ error: 'Internal Server Error' });
            }
            results.totalCancelledServices = totalCancelledServices;

            // Send the results as JSON response
            res.json(results);
          });
        });
      });
    });
  };


  module.exports = {
    getDashboardCounts,
};
