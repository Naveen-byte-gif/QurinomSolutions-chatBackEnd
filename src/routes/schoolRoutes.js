import express from "express";
import * as authController from "../controllers/authController.js";
import * as schoolController from "../controllers/schoolController.js";

const Router = express.Router();

Router.post('/',authController.protect, schoolController.createDrivingSchool);

Router.get('/',authController.protect, schoolController.getAllDrivingSchools);
Router.get('/data', schoolController.getAllDrivingSchoolsWithoutLogin);
Router.get('/ownerSchools',authController.protect, schoolController.getAllDrivingSchoolsbyUserId);
Router.get('/:id',authController.protect, schoolController.getDrivingSchoolById);


Router.put('/:id',authController.protect, schoolController.updateDrivingSchool);
Router.put('/shcoolPhotos/:id',authController.protect, schoolController.updateSchoolPhotos);
Router.put('/shcoolVideos/:id',authController.protect, schoolController.updateschoolVideos);
Router.put('/vehiclePhotos/:id',authController.protect, schoolController.updatevehiclePhotos);


Router.delete('/:id',authController.protect, schoolController.deleteDrivingSchool);
Router.delete('/schoolPhoto/:id',authController.protect, schoolController.deletePhotoByIndex);
Router.delete('/schoolVideo/:id',authController.protect, schoolController.deleteVideoByIndex);
Router.delete('/vehiclePhoto/:id',authController.protect, schoolController.deleteVehiclePhotoByIndex);


export default Router;