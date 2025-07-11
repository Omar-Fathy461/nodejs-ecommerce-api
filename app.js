require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const { ERROR } = require('./utils/statusTypes');
const cors = require('cors');
const path = require('path')
// const verifyToken = require('./middlewares/verifyToken');

// Middlewares
app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());
// app.use(verifyToken)
app.options('/*splat', cors());
app.use('/public/uploads', express.static(path.join(__dirname, 'public/uploads')))

// Routes
const productsRouter = require('./routes/products.route');
const categoriesRouter = require('./routes/categories.route');
const usersRouter = require('./routes/users.route');
const ordersRouter = require('./routes/orders.route');

app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/users', usersRouter);
app.use('/api/orders', ordersRouter);


// Global Middleware For Not Found Routes
app.all('/*splat', (req, res) => {
    res.status(404).json({status: ERROR, message: 'This resource is not available'})
});


// Global Error Handler
app.use((error, req, res, next) => {
    res.status(error.statusCode || 500).json({
        status: error.statusText || ERROR,
        message: error.message,
        code: error.statusCode || 500,
        data: null
    });
});


const port = process.env.PORT || 4000;
require('./config/db');


app.listen(port, () => {
    console.log("server is running...")
});