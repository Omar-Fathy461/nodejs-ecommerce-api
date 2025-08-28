const mongoose = require('mongoose');
const appError = require('../utils/appError');
const Cart = require('../models/cart.model');
const CartItem = require('../models/cartItem.model');
const errorHandler = require('../middlewares/errorHandler');
const { SUCCESS, FAIL, ERROR } = require('../utils/statusTypes');

const getCart = errorHandler(async (req, res, next) => {
    const cart = await Cart.find( { user: req.decoded.id }).populate({
        path: 'cartItems', populate: {path: 'product', select: 'name price image'}
    });
    res.status(200).json({status: SUCCESS, data: {cart}})
})

const addToCart = errorHandler( async(req, res, next) => {
    const cartItemsIds = Promise.all(req.body.cartItems.map( async el => {
        const newCartItems = new CartItem({
            product: el.product,
            quantity: el.quantity
        });
        await newCartItems.save();
        return newCartItems._id;
    }));
    
    const cartItemsIdsRsolved = await cartItemsIds;

    const calcTotalPrcie = await Promise.all(cartItemsIdsRsolved.map( async el => {
        if(!mongoose.Types.ObjectId.isValid(el)) return next(appError.create('Invalid Id', 400, ERROR));
        
        const item = await CartItem.findById(el).populate('product', 'price');
        return item.product.price * item.quantity;
    }));

    const totalPrice = calcTotalPrcie.reduce((acc, cur) => acc + cur, 0);

    let existingCart = await Cart.findOne({user: req.decoded.id}).populate('cartItems');
    if(existingCart){
        await Cart.deleteOne({_id: existingCart._id});
    }

    const newCart = new Cart({user: req.decoded.id, cartItems: cartItemsIdsRsolved, totalPrice: totalPrice});
    if(!newCart) return next(appError.create("The cart Item cannot be created", 400, FAIL));
    await newCart.save();

    res.status(201).json({status: SUCCESS, data: {cart: newCart}})
});

const updateQuantity = errorHandler(async(req, res, next) => {
    const productId = req.params.id;
    const userId = req.decoded.id;
    const {quantity} = req.body;
    if(!quantity || quantity <= 0) return next(appError.create('Invalid Quantity', 400, FAIL));

    const targetCartItem = await CartItem.findOneAndUpdate({product: productId}, {quantity}, {new: true});
    if(!targetCartItem) return next(appError.create('Cart item not found', 404, FAIL));

    const targetCart = await Cart.findOne({user: userId}).populate({
        path: 'cartItems',
        populate: {path: 'product', select: 'price'}
    });
    const totalPrice = targetCart.cartItems.map(el => el.product.price * el.quantity)
                        .reduce((acc, cur) => acc + cur, 0);

    targetCart.totalPrice = totalPrice;
    await targetCart.save();

    res.status(200).json({status: SUCCESS, data: {cart: targetCart}});
});

const removeProductFromCart = errorHandler(async(req, res, next) => {
    const productId = req.params.id;
    const userId = req.decoded.id;

    const targetCartItem = await CartItem.findOne({product: productId}).populate('product');
    if(!targetCartItem) return next(appError.create('Product Not Found', 404, ERROR));

    await CartItem.deleteMany({product: targetCartItem.product._id});
    const cart = await Cart.findOne({user: userId}).populate({
        path: 'cartItems',
        populate: {path: 'product', select: 'price'}
    });

    if(!cart) return next(appError.create('Cart Not Found', 404, ERROR));

    cart.cartItems = cart.cartItems.filter(el => el.product._id.toString() !== productId);
    const calcPrice = cart.cartItems.map(el => {
        return el.product.price * el.quantity
    });

    const totalPrice = calcPrice.reduce((acc, cur) => acc + cur, 0);
    cart.totalPrice = totalPrice;

    await cart.save();

    res.status(200).json({status: SUCCESS, data: {cart}})

});




module.exports = {
    addToCart,
    getCart,
    updateQuantity,
    removeProductFromCart
}