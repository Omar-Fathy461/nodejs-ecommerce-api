const mongoose = require('mongoose');
const replaceObjId = require('../utils/replaceObjId');

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    quantity: {
        type: Number,
        required: true
    }
});

replaceObjId(orderItemSchema);

module.exports = mongoose.model('OrderItem', orderItemSchema);