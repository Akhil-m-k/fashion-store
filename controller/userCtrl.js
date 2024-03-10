const User = require('../models/userModel');
const asyncHandler = require('express-async-handler')

const createUser = asyncHandler(async (req,res)=>{
    const email = req.body.email;
    const findUser = await User.findOne({email:email});
    if(!findUser){
        //create a new user
        const newUser = await User.create(req.body);
        res.json(newUser);
    }else{
        throw new Error('User already exists');
    }
});

const loginUserCtrl = asyncHandler(async(req,res)=>{
    const {email, password}= req.body;
    const user = await User.findOne({email:email});
    if(user && await user.isPasswordMatched(password)){
        res.json(user);
    }else{
        throw new Error('Invalid credentials');
    }
});

module.exports = {createUser,loginUserCtrl};