const User = require('../models/user.model');
const appError = require('../utils/appError');
const { ERROR, SUCCESS } = require('../utils/statusTypes');
const errorHandler = require('../middlewares/errorHandler');
const mongoose = require('mongoose');

const getUsers = errorHandler(async(req, res, next) => {
    const users = await User.find({}, {'__v': false, 'password': false});
    if(!users) return next(appError.create("Users Not Found", 404, ERROR))
    res.json({status: 'success', data: {users}}) 
});

const getUser = errorHandler( async(req, res, next) => {
    const userId = req.params.id;
    if(!mongoose.isValidObjectId(userId)) return next(appError.create("Invalid Id", 400, ERROR));

    const user = await User.findById(userId).select('-password');
    if(!user) return next(appError.create("User Not Found", 404, ERROR));

    res.status(200).json({status: SUCCESS, data: {user}});
});

const updateUser = errorHandler( async(req, res, next) => {
    const userId = req.params.id;
    if(!mongoose.isValidObjectId(userId)) return next(appError.create("Invalid Id", 400, ERROR));

    const updateUser = await User.findByIdAndUpdate(userId, req.body, {new: true});

    res.status(200).json({status: SUCCESS, data: {user: updateUser}})
});

const deleteUser = errorHandler( async(req, res, next) => {
    const userId = req.params.id;
    if(!mongoose.isValidObjectId(userId)) return next(appError.create("Invalid Id", 400, ERROR));
    const targetUser = await User.findById(userId);
    if(!targetUser) return next(appError.create("User Not Found", 404, ERROR));
    await User.deleteOne({_id: targetUser._id});
    res.status(200).json({status: SUCCESS, message: "Deleted Successfully!"});
})

const getUserCount = errorHandler( async(req, res, next) => {
    const usersCount = await User.countDocuments();
    if(!usersCount) return next(appError.create("Products Not Found", 404, ERROR));
    res.status(200).json({status: SUCCESS, data: {count: usersCount}});
})

module.exports = {
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    getUserCount
};