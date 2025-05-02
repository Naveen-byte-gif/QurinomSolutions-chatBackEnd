import express from "express";
import * as authController from "../controllers/authController.js";
import * as userController from "../controllers/userController.js";

const Router = express.Router();

Router.post("/login", authController.login);
Router.patch("/protect", authController.protect);
Router.route("/").post(authController.createUser);

export default Router;
