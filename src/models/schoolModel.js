import mongoose from "mongoose";
import validator from "validator";
import express from "express";

const DayTimingSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      required: true,
    },
    timing: {
      type: String, // e.g., "10:00 AM - 5:00 PM"
      required: true,
    },
  },
  { _id: false }
);

const TimetableSchema = new mongoose.Schema(
  {
    numberOfDays: {
      type: Number,
      required: true,
    },
    days: [DayTimingSchema],
  },
  { _id: false }
);

const DrivingSchoolSchema = new mongoose.Schema(
  {
    schoolName: {
      type: String,
      trim: true,
    },
    schoolOwner: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },

    schoolAddress: {
      type: String,
    },
    contactNumber: {
      type: String,
    },
    schoolPhotos: [
      {
        type: String,
      },
    ],
    schoolVideos: [
      {
        type: String,
      },
    ],
    typeOfDriving: {
      type: [String], // e.g., ["Car", "Bike", "Heavy Vehicle"]
      required: true,
    },
    forWhom: {
      type: [String], // e.g., ["Beginners", "Elderly", "Women"]
      required: true,
    },
    slotTimings: {
      type: [String], // e.g., ["9AM-11AM", "11AM-1PM"]
      required: true,
    },
    vehiclePhotos: {
      type: [String], // URLs or local paths
    },
    coworkers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    timetable: TimetableSchema,

    // Optional Enhancements
    isActive: {
      type: Boolean,
      default: true,
    },
    verificationStatus: {
      type: String,
      enum: ["Pending", "Verified", "Rejected"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const DrivingSchool = mongoose.model("DrivingSchool", DrivingSchoolSchema);

export default DrivingSchool;
