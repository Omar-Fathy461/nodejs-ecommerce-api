const mongoose = require('mongoose');
const replaceObjId = require('../utils/replaceObjId');

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    quantity: {
        type: Number,
        default: 1,
        min: 1
    }
});

replaceObjId(cartItemSchema);

module.exports = mongoose.model('CartItem', cartItemSchema);