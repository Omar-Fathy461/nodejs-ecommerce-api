const mongoose = require('mongoose');
const replaceObjId = require('../utils/replaceObjId');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is required']
    },
    color: { // hash string => ex: #000
        type: String,
        required: [true, 'color is required']
    },
    icon: {
        type: String,
        required: [true, 'icon is required']
    },
});

replaceObjId(categorySchema);

module.exports = mongoose.model('Category', categorySchema);