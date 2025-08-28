const mongoose = require('mongoose');
const replaceObjId = require('../utils/replaceObjId');

const wishlistSchema = new mongoose.Schema({
    wishlistItems: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            }
        ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
        required: true,
    }
}, 
    {timestamps: true}
);

replaceObjId(wishlistSchema);

module.exports = mongoose.model('Wishlist', wishlistSchema);