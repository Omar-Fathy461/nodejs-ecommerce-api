const express = require('express');
const { addToCart, getCart, removeProductFromCart, updateQuantity} = require('../controllers/cart.controller');
const verifyToken = require('../middlewares/verifyToken');
const router = express.Router();

router.route('/')
    .get( verifyToken, getCart)
    .post(verifyToken, addToCart)

router.route('/:id')
    .patch(verifyToken, updateQuantity)
    .delete(verifyToken, removeProductFromCart)



module.exports = router;