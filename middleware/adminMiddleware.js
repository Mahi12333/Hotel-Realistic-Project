import asyncHandler from "express-async-handler"
import jwt from "jsonwebtoken"
import User from "../models/userModel.js";

const adminChecker = asyncHandler(async (req, res, next) => {


    const accessToken = req.cookies.accessToken;
    
        const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
        req.user = await User.findByPk(decoded.userId);
        if(req.user.role === '1'){
            next();
        }
        else{
            res.status(401).json({ message: 'Permission denied only admin used' });
        }
     
   

});
const channelPartnerChecker = asyncHandler(async (req, res, next) => {


    const accessToken = req.cookies.accessToken;
    
        const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
        req.user = await User.findByPk(decoded.userId);
        if(req.user.role === '2'){
            next();
        }
        else{
            res.status(401).json({ message: 'Permission denied only admin used' });
        }
     
   

});
const brokerChecker = asyncHandler(async (req, res, next) => {


    const accessToken = req.cookies.accessToken;
    
        const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
        req.user = await User.findByPk(decoded.userId);
        if(req.user.role === '3'){
            next();
        }
        else{
            res.status(401).json({ message: 'Permission denied only admin used' });
        }
     
   

});
const ChannelPartnerAndBrokerChecker = asyncHandler(async (req, res, next) => {


    const accessToken = req.cookies.accessToken;
    
        const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
        req.user = await User.findByPk(decoded.userId);
        if(req.user.role === '3' || req.user.role === '2'){
            next();
        }
        else{
            res.status(401).json({ message: 'Permission denied only admin used' });
        }
     
   

});


export { adminChecker,channelPartnerChecker,brokerChecker,ChannelPartnerAndBrokerChecker };