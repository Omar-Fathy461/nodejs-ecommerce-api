const mongoose = require('mongoose');
const replaceObjId = require('../utils/replaceObjId');


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is required']
    },
    description: {
        type: String,
        required: [true, 'description is required']
    },
    richDescription: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        required: [true, 'This Field Is Required']
    },
    images: [{
        type: String
    }],
    brand: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        default: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId, // id of category
        ref: 'Category',
        required: [true, 'category is required'],
    },
    countInStock: {
        type: Number,
        required: [true, 'count in stock is required'],
        min: 0,
        max: 100
    },
    rating: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
});

replaceObjId(productSchema);

module.exports = mongoose.model('Product', productSchema);