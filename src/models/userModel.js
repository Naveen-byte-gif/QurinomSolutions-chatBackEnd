import mongoose from "mongoose";
import validator from "validator";
import express from 'express';

import bcrypt from "bcryptjs";


const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please tell us your first name!"],
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Please tell us your email!"],
    unique: true,
    lowercase: true,
  
  },
  phoneNumber: {
    type: String,

  },
  dob: {
    type: String, 
  },
  location: {
    type: String,
  
  },
  profile: {
    type: String,
   
  },
  bio: {
    type: String,
   
  },
  gender: {
    type: String,
    enum: ['Male', 'Female','Trans'],
  },
  accountType: {
    type: String,
    enum: ['User', 'Vendor','Admin','Worker'],
    default:'User',
  },
  schoolId: 
        {
          type: mongoose.Schema.ObjectId,
          ref: "DrivingSchool",
        },
  createdDate: {
    type: Date,
    default: Date.now, 
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
  },
  passwordChangedDate: {
    type: Date,
  },
 otp: {
  type: String,
},
otpExpires: {
  type: Date,
},
  deleted: {
    type: Boolean,
    default: false,
  },
   aadharNo: {
    type: String,
  },
   panNo: {
    type: String, 
  },
  voterId: {
    type: String, 
  },

});

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
  });

const User = mongoose.model("User", userSchema);

export default User;
