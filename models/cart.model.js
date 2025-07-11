const mongoose = require('mongoose');
const replaceObjId = require('../utils/replaceObjId');

const cartSchema = new mongoose.Schema({
    cartItems: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "CartItem",
                required: true
            }
        ]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

replaceObjId(cartSchema);

module.exports = mongoose.model('Cart', cartSchema);