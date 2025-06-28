import Booking from "../models/bookingModel.js"; // adjust path as needed
import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import User from "../models/userModel.js";
import fs from "fs";
import path from "path";
import getUploadPath from "../utils/pathFun.js";
import multerWrapper from "../utils/multerFun.js";


export const registerBooking = catchAsync(async (req, res, next) => {
  const student = req.user.id;
  req.body.student = student;
  const booking = await Booking.create(req.body);
  res.status(201).json({ success: true, data: booking });
});

// Get all bookings
export const getAllBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find()
    .populate("drivingSchool", "name location")
    .populate("student", "firstName lastName email");
  res.status(200).json({ success: true, count: bookings.length, data: bookings });
});

export const getAllBookingsBasedOnDrivingSchool = catchAsync(async (req, res, next) => {
  const { drivingSchoolId } = req.params;
  const bookings = await Booking.find({ drivingSchool: drivingSchoolId })
    .populate("drivingSchool", "name location")
    .populate("student", "firstName lastName email");
  res.status(200).json({ success: true, count: bookings.length, data: bookings });
});

export const updateBooking = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const booking = await Booking.findByIdAndUpdate(
    id,
    { $set: { ...req.body } }, // dynamically updates fields provided
    { new: true, runValidators: true }
  );
  if (!booking) {
    return res
      .status(404)
      .json({ success: false, message: "Booking not found" });
  }
  res.status(200).json({ success: true, data: booking });
});