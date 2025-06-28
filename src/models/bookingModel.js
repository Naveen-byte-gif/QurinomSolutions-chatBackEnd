import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    drivingSchool: {
      type: mongoose.Schema.ObjectId,
      ref: "DrivingSchool",
    },
    student: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    dateOfBooking: {
      type: Date,
    },
    duration:{
        type: Number,
    },
    selectedDay: [{
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
    },],
    selectedSlot: {
      type: String, 
      required: true,
    },
    bookingStatus: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled", "Completed"],
      default: "Pending",
    },
    remarks: [{
      type: String,
      trim: true,
    }],
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model("Booking", BookingSchema);
export default Booking;
