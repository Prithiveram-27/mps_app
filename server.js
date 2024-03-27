const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = process.env.PORT || 3000;

//MOUNT ROUTER
const customersRouter = require('./routes/customers');
const loginRoute = require('./routes/login')
const productRouter = require('./routes/product')
const serviceRouter = require('./routes/service')

app.use(cors()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/login', loginRoute);
app.use('/api/v1/customers', customersRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/service', serviceRouter);

app.listen(PORT, () => {
    console.log(`Server is Up and running in port ${PORT}`)
})
