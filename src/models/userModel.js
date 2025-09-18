import mongoose from "mongoose";
import validator from "validator";
import express from 'express';

import bcrypt from "bcryptjs";


const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
 
  email: {
    type: String,
    unique: true,
  
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
  
  createdDate: {
    type: Date,
    default: Date.now, 
  },
  password: {
    type: String,
    minlength: 8,
  },
  passwordChangedDate: {
    type: Date,
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
