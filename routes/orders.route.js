const express = require('express');
const { getOrders, getOrder, createOrder, updateOrderStatus, deleteOrder, getTotalSales, getOrdersCount} = require('../controllers/orders.controller');
const router = express.Router();


router.route('/')
    .get(getOrders)
    .post(createOrder)

router.route('/:id')
    .get(getOrder)
    .patch(updateOrderStatus)
    .delete(deleteOrder)

router.route('/get/totalsales')
    .get(getTotalSales)
    
router.route('/get/count')
    .get(getOrdersCount)


module.exports = router;