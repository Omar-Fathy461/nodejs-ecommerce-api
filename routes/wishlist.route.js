const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const { getWishlist, addToWishlist, removeProductFromWishlist } = require('../controllers/wishlist.controller');
const router = express.Router();

router.route('/')
    .get( verifyToken, getWishlist)
    .post(verifyToken, addToWishlist)

router.route('/:id')
    .delete(verifyToken, removeProductFromWishlist)



module.exports = router;