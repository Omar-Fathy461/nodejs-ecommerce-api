const express = require('express');
const { getProducts, createProduct, getProduct, updateProduct, deleteProduct, getCount, getFeaturedProducts, updateGallery} = require('../controllers/products.controller');
const protectRoute = require('../middlewares/protectRout');
const verifyToken = require('../middlewares/verifyToken');
const { SUCCESS, ERROR, FAIL} = require('../utils/statusTypes');
const appError = require('../utils/appError');
const router = express.Router();
const multer = require('multer');

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = appError.create("Invalid Image Type", 400, ERROR);
        if(isValid){
            uploadError = null
        }
        cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(" ").join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
});

const upload = multer({storage})

router.route('/')
    .get( getProducts)
    .post(upload.fields([{name: 'image', maxCount: 1}, {name: 'images', maxCount: 10}]),createProduct)

router.route('/:id')
    .get(getProduct)
    .patch(updateProduct)
    .delete(deleteProduct)

router.route('/get/count')
    .get(getCount)

router.route('/get/featured/:count')
    .get(getFeaturedProducts)

router.route('/gallery-images/:id')
    .patch(upload.array('images', 10), updateGallery)

module.exports = router;