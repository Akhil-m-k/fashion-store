const { generateToken } = require('../config/jwtToken');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler')
const validateMongodbId = require("../utils/validateMongodbId")
const {generateRefreshToken} = require("../config/refreshToken");
const jwt = require('jsonwebtoken');

// create a user
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

// login a user
const loginUserCtrl = asyncHandler(async(req,res)=>{
    const {email, password}= req.body;
    // check user exists or not
    const user = await User.findOne({email:email});
    if(user && await user.isPasswordMatched(password)){
        const refreshToken = await generateRefreshToken(user?._id);
        const updateUser = await User.findByIdAndUpdate(user._id,{
            refreshToken:refreshToken
        },{
            new:true
        });
        res.cookie('refreshToken',refreshToken,{
            httpOnly:true,
            maxAge:72*60*60*1000
        });
        res.json({
            _id:user?._id,
            firstname:user?.firstname,
            lastname:user?.lastname,
            email:user?.email,
            mobile:user?.mobile,
            token:generateToken(user?._id)
        });
    }else{
        throw new Error('Invalid credentials');
    }
});

// get all users
const getallUser = asyncHandler(async(req,res)=>{
    try{
        const getUsers = await User.find();
        res.json(getUsers);
    }catch(error){
        throw new Error(error);
    }
});

// get a single user

const getaUser = asyncHandler(async(req,res)=>{
    validateMongodbId(req.user._id)
    try{
        const getUser = await User.findById(req.user._id);
        res.json(getUser);
    }catch(error){
        throw new Error(error);
    }
});

// delete a user 
const deleteAUser = asyncHandler(async(req,res)=>{
    validateMongodbId(req.params.id)
    try{
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        res.json(deletedUser);
    }catch(error){
        throw new Error(error);
    }
});

// update a user 

const updateAUser = asyncHandler(async(req,res)=>{
    const {_id} = req.user;
    validateMongodbId(_id);
    try{
        const updatedUser = await User.findByIdAndUpdate(_id,{
            firstname:req?.body?.firstname,
            lastname:req?.body?.lastname,
            email:req?.body?.email,
            mobile:req?.body?.mobile
        },{
            new:true
        });
        res.json(updatedUser);
    }catch(error){
        throw new Error(error);
    }
});

const blockUser = asyncHandler(async(req,res)=>{
const {id} = req.params;
validateMongodbId(id)
try{
 const block =await User.findByIdAndUpdate(id,{
    isBlocked:true
 },{
    new:true
 })
 res.json({
    message:"user blocked"
 })
}catch(error){
        throw new Error(error);
}
});

const unblockUser = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongodbId(id)
try{
 const unblock =await User.findByIdAndUpdate(id,{
    isBlocked:false
 },{
    new:true
 })
 res.json({
    message:"user unblocked"
 })
}catch(error){
        throw new Error(error);
    }
});

// handle refresh token 
const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) throw new Error(" No Refresh token present in db or not matched");
    jwt.verify(refreshToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err || user.id !== decoded.id) {
        throw new Error("There is something wrong with refresh token");
      }
      const accessToken = generateToken(user?._id);
      res.json({ accessToken });
    });
  });


module.exports = {
    createUser,
    loginUserCtrl,
    getallUser,
    getaUser,
    deleteAUser,
    updateAUser,
    blockUser,
    unblockUser,
    handleRefreshToken
};