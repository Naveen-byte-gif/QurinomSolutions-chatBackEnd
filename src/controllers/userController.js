import crypto from "crypto";
import nodemailer from "nodemailer";
import User from "../models/userModel.js";
import { catchAsync } from "../utils/catchAsync.js";

export const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

  user.otp = otp;
  user.otpExpires = Date.now() + 15 * 60 * 1000; // OTP valid for 15 minutes
  await user.save();
console.log(process.env.EMAIL_USER)
console.log(process.env.EMAIL_PASS)
  // Send email (use real SMTP config in prod)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS?.trim() // App password
    },
  });
console.log(process.env.EMAIL_USER)
console.log(process.env.EMAIL_PASS)
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Your Password Reset OTP",
    text: `Your OTP for password reset is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);

  res.status(200).json({ message: "OTP sent to email" });
});


export const resetPassword = catchAsync(async (req, res, next) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await User.findOne({
    email,
    otp,
    otpExpires: { $gt: Date.now() }, // Check if OTP is still valid
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.password = newPassword;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  res.status(200).json({ message: "Password reset successful" });
});


export const editUser = catchAsync(async (req, res, next) => {
 const  userId = req.user.id;
  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError("User not found", 400));
  }
  const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

export const getUserById = catchAsync(async (req, res, next) => {
  const id = req.params.id; // ✅ Correct: req.params, not req.param
  const user = await User.findById(id);

  if (!user) {
    return res.status(400).json({
      status: "fail",
      message: "No user found",
    });
  }

  res.status(200).json({
    status: "success",
    data: { user },
  });
});
