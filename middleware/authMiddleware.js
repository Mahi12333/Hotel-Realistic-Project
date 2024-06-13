import asyncHandler from "express-async-handler"
import jwt from "jsonwebtoken"
import User from "../models/userModel.js";


const protect = asyncHandler(async (req, res, next) => {


    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
        res.status(401).json({ message: 'Not authorized, access token missing' });
        return;
    }
    
    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
        req.user = await User.findByPk(decoded.userId);
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            res.status(401).json({ message: 'Access token expired, please refresh token' });
        } else {
            res.status(401).json({ message: 'Not authorized, token invalid' });
        }
    }
});

export { protect };

