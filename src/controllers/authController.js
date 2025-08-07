
import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import User from "../models/userModel.js";
import dotenv from 'dotenv';
import jwt from "jsonwebtoken";
import { promisify } from 'util';
import bcrypt from 'bcryptjs';

dotenv.config();



export const createUser = catchAsync(async (req, res, next) => {
    const user = await User.create(req.body);
  
    res.status(201).json({
      status: 'success',
      data: {
        user,
      },
    });
  });
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_S, {
      expiresIn: process.env.JWT_E,
    });
  };
  
  export const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }
  
    // Check if the user exists
    const user = await User.findOne({ email });
//   console.log("user",user)
    if (!user) {
      return res.status(401).json({
        status: 'failed',
        message: 'Invalid email ',
      });
    }
  
    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        status: 'failed',
        message: 'Invalid  password',
      });
    }
  
    const token = signToken(user._id);
  
    res.status(200).json({
      status: 'success',
      token,
      user,
    });
  });
  
   
  export const protect = catchAsync(async (req, res, next) => {
    let token;
    
  // Check for Bearer token in the Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  
  // Check for token in cookies
  // if (req.cookies && req.cookies.auth_token) {
  //   token = req.cookies.auth_token;
  // }
    if (!token) {
      return res.status(400).json({ error: "You are not logged in! Please login."});
    }
  
    try {
      // Verify the token
      const decoded = await promisify(jwt.verify)(token, process.env.JWT_S);
      const currentUser = await User.findById(decoded.id);
  
      if (!currentUser) {
        return res.status(401).json({ error: "The user belonging to this token no longer exists."});
       
      }
  
      req.user = currentUser;
  
      // // Prevent Bunny.net from caching the dynamic user-specific data
      // res.set('Cache-Control', 'no-store');  // Avoid caching of dynamic content
      // res.set('Vary', 'Authorization');  // Cache separately per Authorization token
  
      next();
    } catch (error) {
      return next(new AppError("Token verification failed or expired", 401));
    }
  });
  


  
export const changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Both current and new passwords are required" });
  }

  // Get the currently logged-in user
  const user = await User.findById(req.user.id).select("+password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Check if current password is correct
  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Current password is incorrect" });
  }

  // Update to new password
  user.password = newPassword;
  await user.save();

  res.status(200).json({ message: "Password changed successfully" });
});
