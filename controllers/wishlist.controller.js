const mongoose = require('mongoose');
const appError = require('../utils/appError');
const Wishlist = require('../models/wishlist.model');
const errorHandler = require('../middlewares/errorHandler');
const { SUCCESS, FAIL, ERROR } = require('../utils/statusTypes');


const getWishlist = errorHandler(async(req, res, next) => {
    const userId = req.decoded.id;
    console.log(userId)
    const wishlist = await Wishlist.findOne({user: userId});
    if(!wishlist) return next(appError.create('Wishlist Not Found', 404, ERROR));
    res.status(200).json({status: SUCCESS, data: {wishlist}})
});

const addToWishlist = errorHandler(async(req, res, next) => {
    const userId = req.decoded.id;

    const wishlist = await Wishlist.findOne({user: userId});

    if(wishlist){
        const updateWishList = await Wishlist.findOneAndUpdate({_id: wishlist._id}, {...req.body}, {new: true}).populate('wishlistItems', 'name image price');;
        res.status(200).json({status: SUCCESS, data: {wishlist: updateWishList}})
    }else {
        const { wishlistItems } = req.body;
        const newWishlist = await Wishlist.create({
            user: userId,
            wishlistItems
        });
        const populatedWishlist = await Wishlist.findById(newWishlist._id).populate('wishlistItems', 'name price image');
        res.status(201).json({ status: SUCCESS, data: { wishlist: populatedWishlist } });
    }

});

const removeProductFromWishlist = errorHandler(async(req, res, next) => {
    const productId = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(productId)) return next(appError.create('Invalid Id', 400, FAIL));

    const targetWishlist = await Wishlist.findOne({user: req.decoded.id});

    if (!targetWishlist) {
        return next(appError.create('Wishlist not found', 404, FAIL));
    }

    if(!targetWishlist.wishlistItems.includes(productId)){
        return next(appError.create('Product Not Found', 404, ERROR))
    }
    targetWishlist.wishlistItems = targetWishlist.wishlistItems.filter(el => el.toString() != productId);

    await targetWishlist.save();

    res.status(200).json({status: SUCCESS, message: 'Product Deleted Successfully', data: {wishlist: targetWishlist}})
});

module.exports = {
    getWishlist,
    addToWishlist,
    removeProductFromWishlist
};