const Product = require('../models/product.model');
const Category = require('../models/category.model');
const mongoose = require('mongoose');
const errorHandler = require('../middlewares/errorHandler');
const { SUCCESS, ERROR, FAIL} = require('../utils/statusTypes');
const {validationResult} = require('express-validator');
const appError = require('../utils/appError');


const getProducts = errorHandler( async(req, res, next) => {
    let filter = {};
    if(req.query.categories){
        filter = {category: req.query.categories.split(',')}
    }
    const products = await Product.find(filter).select("name images price category id").populate('category');
    if(products.length === 0) return res.json({status: SUCCESS, message: "Not Found Products", data: []});
    res.json({status: 'success', data: {products}}) 
});

const getProduct = errorHandler( async(req, res, next) => {
    const productId = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(productId)) {
        const error = appError.create("Invalid Id", 400, FAIL);
        return next(error);
    };
    const targetProduct = await Product.findById(productId).populate('category').lean();
    if(!targetProduct){
        const error = appError.create("Product Not Found", 404, ERROR);
        return next(error);
    };
    res.json({status: SUCCESS, data: {product: targetProduct}});
})

const createProduct = errorHandler( async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty){
        const error = appError.create(errors.array(), 400, ERROR);
        return next(error);
    }
    const category = await Category.findById(req.body.category);
    if(!category){
        const error = appError.create("Invalid Category", 400, FAIL);
        return next(error);
    };
    const fileUpload = req.files.image;
    console.log(fileUpload)
    if(!fileUpload){
        const error = appError.create('No Image In The Request', 400, FAIL);
        return next(error);
    }
    const fileName = fileUpload[0].filename;
    console.log(fileName)
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`

    const imagesUploads = req.files.images;
    const imagesPaths = [];
    if(imagesUploads) {
        imagesUploads.map(el => imagesPaths.push(`${basePath}${el.filename}`))
    }

    const newProduct = new Product({...req.body, image: `${basePath}${fileName}`, images: imagesPaths});
    await newProduct.save();
    res.status(201).json({status: SUCCESS, data: {product: newProduct}});
})

const updateProduct = errorHandler( async(req, res, next) => {
    const productId = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(productId)) {
        const error = appError.create("Invalid Id", 400, FAIL);
        return next(error);
    };
    const targetProduct = await Product.findById(productId);
    if(!targetProduct){
        const error = appError.create("Product Not Found", 404, ERROR);
        return next(error);
    };
    const updateTargetProduct = await Product.findByIdAndUpdate(targetProduct._id, {...req.body}, {new: true}).select('-_id -__v');
    res.status(200).json({status: SUCCESS, message: "Product Updated Successfully", product: updateTargetProduct})
});

const deleteProduct = errorHandler( async(req, res, next) => {
    const productId = req.params.id;
    if(!mongoose.isValidObjectId(productId)){
        const error = appError.create("Invalid Id", 400, FAIL);
        return next(error);
    };
    const targetProduct = await Product.findById(productId);
    if(!targetProduct){
        const error = appError.create("Product Not Found", 404, ERROR);
        return next(error);
    };
    await Product.deleteOne({_id: targetProduct._id});
    res.status(200).json({status: SUCCESS, message: "Deleted Successfully"});
});

const getCount = errorHandler( async(req, res, next) => {
    const productsCount = await Product.countDocuments();
    if(!productsCount) return next(appError.create("Products Not Found", 404, ERROR));
    res.status(200).json({status: SUCCESS, data: {count: productsCount}});
})

const getFeaturedProducts = errorHandler( async(req, res, next) => {
    const count = req.params.count ? +req.params.count : 0;
    const featuredProducts = await Product.find({isFeatured: true}, {'_id': false, '__v': false}).limit(count);
    if(!featuredProducts) return next(appError.create("Featured Products Not Found", 404, ERROR));
    res.status(200).json({status: SUCCESS, data: {Featured_products: featuredProducts}})
})

const updateGallery = errorHandler( async(req, res, next) => {
    const productId = req.params.id;
    if(!mongoose.isValidObjectId(productId)){
        const error = appError.create("Invalid Id", 400, FAIL);
        return next(error);
    };
    
    const filesUpload = req.files;
    const imagesPaths = [];
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`
    if(filesUpload){
        filesUpload.map(el => imagesPaths.push(`${basePath}${el.filename}`))
    }

    const targetProduct = await Product.findByIdAndUpdate(productId, {images: imagesPaths}, {new: true});

    if(!targetProduct){
        const error = appError.create("Product Not Found", 404, ERROR);
        return next(error);
    };

    res.status(200).json({status: SUCCESS, message: "Updated Successfully", data: {product: targetProduct}});
})

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getCount,
    getFeaturedProducts,
    updateGallery
}