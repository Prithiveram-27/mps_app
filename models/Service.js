const db = require('../config/db');

class Service {
    constructor({
        name,
        address,
        mobileNumber,
        alternateMobileNumber,
        date,
        servicePerson,
        productBrand,
        problemType,
        problemStatus,
        problemDescription,
        
    }) {
        this.name = name;
        this.address = address;
        this.mobileNumber = mobileNumber;
        this.alternateMobileNumber = alternateMobileNumber;
        this.date = date;
        this.servicePerson = servicePerson;
        this.productBrand = productBrand;
        this.problemType = problemType;
        this.problemStatus = problemStatus;
        this.problemDescription = problemDescription;
    }
}