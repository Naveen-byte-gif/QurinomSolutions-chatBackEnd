import express from "express";
import * as authController from "../controllers/authController.js";
import * as bookingController from "../controllers/bookingController.js";

const Router = express.Router();
Router.post("/register",authController.protect,bookingController.registerBooking);
Router.get("/allBookings",authController.protect, bookingController.getAllBookings);

Router.get("/school/:drivingSchoolId",authController.protect, bookingController.getAllBookingsBasedOnDrivingSchool);
Router.put('/:id',authController.protect, bookingController.updateBooking);
export default Router;