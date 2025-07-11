const mongoose = require('mongoose');
const validator = require('validator');
const replaceObjId = require('../utils/replaceObjId');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        uniqe: true,
        validation: [validator.isEmail, "Invalid Email"]
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    street: {
        type: String,
        default: ''
    },
    apartment: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    zip: {
        type: String,
        default: ''
    },
    country: {
        type: String,
        default: 'Egypt'
    },
    phone: {
        type: Number,
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    verified: {
        type: Boolean,
        default: false
    },
    verificationCode: {
        type: String,
        select: false
    },
    verificationCodeValidation: {
        type: Number,
        select: false
    },
    forgotPasswordCode: {
        type: String,
        select: false
    },
    forgotPasswordCodeValidation: {
        type: Number,
        select: false
    },
    token: {
        type: String
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
}, {timestamps: true});

replaceObjId(userSchema);

module.exports = mongoose.model('User', userSchema);