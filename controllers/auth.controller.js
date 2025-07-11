const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const appError = require('../utils/appError');
const errorHandler = require('../middlewares/errorHandler')
const { SUCCESS, ERROR, FAIL} = require('../utils/statusTypes');
const generateJWT = require('../utils/generateJWT');

const register = errorHandler( async(req, res, next) => {
    // const {name, email, password, street, apartment, city, zip, country, phone,isAdmin} = req.body;
    if(!req.body.name || !req.body.email || !req.body.password) return next(appError.create("This Fields Are Required", 400, FAIL));

    const isExisting = await User.findOne({email: req.body.email});
    if(isExisting) return next(appError.create("User is already exists", 400, ERROR))

    // Password Hashing
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    
    const newUser = new User({...req.body, password: hashedPassword});

    // Generate JWT and send it with response
    const token = await generateJWT({id: newUser._id, email: newUser.email, isAdmin: newUser.isAdmin});
    newUser.token = token;

    await newUser.save();

    res.status(201).json({status: SUCCESS, data: {user: newUser}});
});


const login = errorHandler( async(req, res, next) => {
    const {email, password} = req.body;
    if(!email || !password) return next(appError.create("This Fields Are Required", 400, FAIL));

    const isExisting = await User.findOne({email});
    if(!isExisting) return next(appError.create("User Not Found", 404, ERROR));

    const matchedPassword = await bcrypt.compare(password, isExisting.password);
    if(!matchedPassword) return next(appError.create("Password is not correct", 400, FAIL));

    if(isExisting && matchedPassword){
        const token = await generateJWT({id: isExisting._id, email: isExisting.email, isAdmin: isExisting.isAdmin});
        res.status(200).json({status: SUCCESS, data: {token}});
    }else{
        return next(appError.create("something wrong", 400, ERROR));
    }
})

module.exports = {
    register,
    login
}