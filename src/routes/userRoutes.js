import express from "express";
import * as authController from "../controllers/authController.js";
import * as userController from "../controllers/userController.js";

const Router = express.Router();

Router.post("/login", authController.login);
Router.patch("/protect", authController.protect);
Router.route("/").post(authController.createUser);
Router.post("/forgotRequest", userController.forgotPassword);
Router.post("/restetPassword", userController.resetPassword);
Router.post("/changeOldPassword", authController.protect,authController.changePassword);


Router.put("/edit", authController.protect,userController.editUser);
Router.get("/userDetails/:id",authController.protect, userController.getUserById);

export default Router;
