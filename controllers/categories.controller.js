const Category = require('../models/category.model');
const errorHandler = require('../middlewares/errorHandler');
const appError = require('../utils/appError');
const { FAIL, SUCCESS, ERROR } = require('../utils/statusTypes');
const {validationResult} = require('express-validator')

const getCategories = errorHandler( async(req, res, next) => {
    const categories = await Category.find({}, {'__v': false});
    if(categories.length === 0){
        res.json({status: SUCCESS, data: [], message: "Not Found Categories"});
    };
    res.json({status: 'success', data: {categories}});
});

const getCategory = errorHandler( async(req, res, next) => {
    const categoryId = req.params.id;
    const targetCategory = await Category.findById(categoryId);
    if(!targetCategory){
        const error = appError.create("This Category Not Found", 404, ERROR);
        return next(error);
    };
    res.json({status: SUCCESS, data: {category: targetCategory}});
});

const createCategory = errorHandler( async(req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = appError.create(errors.array(), 400, ERROR);
        return next(error);
    }
    const newCategory = new Category(req.body);
    await newCategory.save();
    res.status(201).json({status: SUCCESS, data: {category: newCategory}})
});

const updateCategory = errorHandler( async(req, res, next) => {
    const categoryId = req.params.id;
    const targetCategory = await Category.findById(categoryId);
    if(!targetCategory){
        const error = appError.create("This Category Not Found", 404, ERROR);
        return next(error);
    };
    const updateTargetCategory = await Category.findByIdAndUpdate(targetCategory._id, {...req.body}, {new: true})
    // const updateTargetCategory = await Category.updateOne({_id: targetCategory._id}, {$set: {...req.body}});
    res.json({status: SUCCESS, data: {category: updateTargetCategory}, message: "updated successfully"})
});

const deleteCategory = errorHandler( async(req, res, next) => {
    const categoryId = req.params.id;
    const targetCategory = await Category.findById(categoryId);
    if(!targetCategory){
        const error = appError.create("This Category Not Found", 404, ERROR);
        return next(error);
    };
    await Category.findByIdAndDelete(targetCategory._id)
    // await Category.deleteOne({_id: targetCategory._id});
    res.json({status: SUCCESS, message: "Category deleted successfully"});
});


module.exports = {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
}