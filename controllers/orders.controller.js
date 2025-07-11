const Order = require('../models/order.model');
const OrderItem = require('../models/orderItem.model');
const appError = require('../utils/appError');
const { FAIL, SUCCESS, ERROR} = require('../utils/statusTypes');
const errorHandler = require('../middlewares/errorHandler');
const mongoose = require('mongoose')



const getOrders = errorHandler( async(req, res, next) => {
    const orders = await Order.find().populate('user orderItems', 'name product quantity').sort({'dateOrdered': -1}); // from new to old
    if(!orders || orders.length === 0) {
        const error = appError.create("Orders Not Found", 404, FAIL);
        return next(error)
    }
    res.json({status: SUCCESS, data: {orders}}) 
});

const getOrder = errorHandler( async(req, res, next) => {
    const orderId = req.params.id;
    if(!mongoose.isValidObjectId(orderId)) return next(appError.create("Invalid Id", 400, ERROR));

    const order = await Order.findById(orderId)
    .populate('user', 'name')
    .populate({
        path: 'orderItems', populate: 
            {path: 'product', populate: 'category'}
        })

    if(!order) return next(appError.create("This Order Is Not Found", 404, FAIL));

    res.status(200).json({status: SUCCESS, data: {order}})
});

const createOrder = errorHandler( async(req, res, next) => {
    const orderItemsIds = Promise.all(req.body.orderItems.map(async el => {
        let newOrderItem = new OrderItem({
            product: el.product,
            quantity: el.quantity
        });
        
        await newOrderItem.save();
        return newOrderItem._id
    }));
    const orderItemsIdsRsolved = await orderItemsIds;

    const calcTotalPrcie = await Promise.all( orderItemsIdsRsolved.map(async el => {
        const items = await OrderItem.findById(el).populate('product', 'price');
        console.log(items)
        return items.product.price * items.quantity;
    }))
    const totalPrice = calcTotalPrcie.reduce((acc, cur) => acc + cur, 0)

    const newOrder = new Order({...req.body, orderItems: orderItemsIdsRsolved, totalPrice});
    if(!newOrder) return next(appError.create("The order cannot be created", 400, FAIL))
    await newOrder.save();
    res.status(201).json({status: SUCCESS, data: {order: newOrder}})
});


const updateOrderStatus = errorHandler( async(req, res, next) => {
    const orderId = req.params.id;
    if(!mongoose.isValidObjectId(orderId)) return next(appError.create("Invalid Id", 400, ERROR));

    const targetOrder = await Order.findById(orderId);
    if(!targetOrder) return next(appError.create("Not Found", 404, ERROR));

    const updateTargetOrder = await Order.updateOne({_id: targetOrder._id}, {$set: {...req.body}});
    res.status(200).json({status: SUCCESS, date: {order: updateTargetOrder}, message: "updated successfully"});
});

const deleteOrder = errorHandler(async (req, res, next) => {
    const orderId = req.params.id;
    if(!mongoose.isValidObjectId(orderId)) return next(appError.create("Invalid Id", 400, ERROR));

    const targetOrder = await Order.findById(orderId);
    if(!targetOrder) return next(appError.create("This Order Is Not Found", 404, ERROR));

    targetOrder.orderItems.forEach( async el => (
        await OrderItem.deleteOne({_id: el})
    ))

    await Order.deleteOne({_id: targetOrder._id});
    res.status(200).json({status: SUCCESS, message: "Deleted Successfully"});
});

const getTotalSales = errorHandler( async(req, res, next) => {
    const totalSales = await Order.aggregate([
        {$group: {_id: null, totalsales: {$sum: '$totalPrice'}}}
    ]);

    if(!totalSales) return next(appError.create("The Order Sales Cannot Be Generated", 400, ERROR));
    res.status(200).json({status: SUCCESS, data: {totalsales: totalSales.pop().totalsales}})
});

const getOrdersCount = errorHandler(async(req, res, next) => {
    const ordersCount = await Order.countDocuments();

    if(!ordersCount) return next(appError.create("Products Not Found", 404, ERROR));

    res.status(200).json({status: SUCCESS, data: {count: ordersCount}});
})

module.exports = {
    getOrders,
    getOrder,
    createOrder,
    updateOrderStatus,
    deleteOrder,
    getTotalSales,
    getOrdersCount
}