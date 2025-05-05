import DrivingSchool from "../models/schoolModel.js"; // adjust path as needed
import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import User from "../models/userModel.js";
import fs from "fs";
import path from "path";
import getUploadPath from "../utils/pathFun.js";
import multerWrapper from "../utils/multerFun.js";

export const createDrivingSchool = catchAsync(async (req, res, next) => {
  const schoolOwner = req.user.id;
  req.body.schoolOwner = schoolOwner;
  const school = await DrivingSchool.create(req.body);
  res.status(201).json({ success: true, data: school });
});

// Get all driving schools
export const getAllDrivingSchools = catchAsync(async (req, res, next) => {
  const schools = await DrivingSchool.find()
    .populate("schoolOwner", "firstName lastName email")
    .populate("coworkers", "firstName lastName email");
  res.status(200).json({ success: true, count: schools.length, data: schools });
});

export const getAllDrivingSchoolsWithoutLogin = catchAsync(
  async (req, res, next) => {
    const schools = await DrivingSchool.find()
      .populate("schoolOwner", "firstName lastName email")
      .populate("coworkers", "firstName lastName email");
    res
      .status(200)
      .json({ success: true, count: schools.length, data: schools });
  }
);
// Get a driving school by ID
export const getDrivingSchoolById = catchAsync(async (req, res, next) => {
  const school = await DrivingSchool.findById(req.params.id)
    .populate("schoolOwner", "firstName lastName email")
    .populate("coworkers", "firstName lastName email");
  if (!school) {
    return res
      .status(404)
      .json({ success: false, message: "Driving school not found" });
  }
  res.status(200).json({ success: true, data: school });
});

// Update a driving school
export const updateDrivingSchool = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const school = await DrivingSchool.findByIdAndUpdate(
    id,
    { $set: { ...req.body } }, // dynamically updates fields provided
    { new: true, runValidators: true }
  );
  if (!school) {
    return res
      .status(404)
      .json({ success: false, message: "Driving school not found" });
  }
  res.status(200).json({ success: true, data: school });
});

// Delete a driving school
export const deleteDrivingSchool = catchAsync(async (req, res, next) => {
  const school = await DrivingSchool.findByIdAndDelete(req.params.id);
  if (!school) {
    return res
      .status(404)
      .json({ success: false, message: "Driving school not found" });
  }
  res.status(200).json({ success: true, message: "Driving school deleted" });
});


export const updateSchoolPhotos = catchAsync(async (req, res, next) => {
  const upload = multerWrapper().array("schoolPhotos", 10);

  upload(req, res, async (err) => {
    if (err) return next(new AppError(err.message, 400));

    const { id } = req.params;

    const school = await DrivingSchool.findById(id);
    if (!school) return next(new AppError("No school found with that ID", 404));

    if (!req.files || req.files.length === 0) {
      return next(new AppError("No files uploaded", 400));
    }

    const newFilePaths = [];

    for (const file of req.files) {
      const { fullPath, relativePath } = await getUploadPath(
        req.user.id.toString(),
        file.originalname,
        "school"
      );
      fs.writeFileSync(fullPath, file.buffer); // ✅ use file.buffer
      newFilePaths.push(relativePath);
    }

    // Append new paths to existing schoolPhotos
    school.schoolPhotos = [...school.schoolPhotos, ...newFilePaths];
    await school.save();

    res.status(200).json({
      status: "success",
      message: "School photos added successfully",
      data: { school },
    });
  });
});

export const deletePhotoByIndex = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const index = req.query.index;
  const school = await DrivingSchool.findById(id);
  if (!school) return next(new AppError("No school found with that ID", 404));

  const indexNum = parseInt(index);
  if (
    isNaN(indexNum) ||
    indexNum < 0 ||
    indexNum >= school.schoolPhotos.length
  ) {
    return next(new AppError("Invalid photo index", 400));
  }

  const filePath = school.schoolPhotos[indexNum];

  // Remove from array
  school.schoolPhotos.splice(indexNum, 1);
  await school.save();

  res.status(200).json({
    status: "success",
    message: `Photo at index ${index} deleted successfully`,
  });
});
export const updateschoolVideos = catchAsync(async (req, res, next) => {
  const upload = multerWrapper().array("schoolVideos", 10);

  upload(req, res, async (err) => {
    if (err) return next(new AppError(err.message, 400));

    const { id } = req.params;

    const school = await DrivingSchool.findById(id);
    if (!school) return next(new AppError("No school found with that ID", 404));

    if (!req.files || req.files.length === 0) {
      return next(new AppError("No files uploaded", 400));
    }

    const newFilePaths = [];

    for (const file of req.files) {
      const { fullPath, relativePath } = await getUploadPath(
        req.user.id.toString(),
        file.originalname,
        "school"
      );
      fs.writeFileSync(fullPath, file.buffer); // ✅ use file.buffer
      newFilePaths.push(relativePath);
    }

    // Append new paths to existing schoolPhotos
    school.schoolVideos = [...school.schoolVideos, ...newFilePaths];
    await school.save();

    res.status(200).json({
      status: "success",
      message: "School videos added successfully",
      data: { school },
    });
  });
});

export const deleteVideoByIndex = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const index = req.query.index;
  const school = await DrivingSchool.findById(id);
  if (!school) return next(new AppError("No school found with that ID", 404));

  const indexNum = parseInt(index);
  if (
    isNaN(indexNum) ||
    indexNum < 0 ||
    indexNum >= school.schoolVideos.length
  ) {
    return next(new AppError("Invalid video index", 400));
  }

  const filePath = school.schoolVideos[indexNum];

  // Remove from array
  school.schoolVideos.splice(indexNum, 1);
  await school.save();

  res.status(200).json({
    status: "success",
    message: `video at index ${index} deleted successfully`,
  });
});



export const updatevehiclePhotos = catchAsync(async (req, res, next) => {
    const upload = multerWrapper().array("vehiclePhotos", 10);
  
    upload(req, res, async (err) => {
      if (err) return next(new AppError(err.message, 400));
  
      const { id } = req.params;
  
      const school = await DrivingSchool.findById(id);
      if (!school) return next(new AppError("No school found with that ID", 404));
  
      if (!req.files || req.files.length === 0) {
        return next(new AppError("No files uploaded", 400));
      }
  
      const newFilePaths = [];
  
      for (const file of req.files) {
        const { fullPath, relativePath } = await getUploadPath(
          req.user.id.toString(),
          file.originalname,
          "school"
        );
        fs.writeFileSync(fullPath, file.buffer); // ✅ use file.buffer
        newFilePaths.push(relativePath);
      }
  
      // Append new paths to existing schoolPhotos
      school.vehiclePhotos = [...school.vehiclePhotos, ...newFilePaths];
      await school.save();
  
      res.status(200).json({
        status: "success",
        message: "School photos added successfully",
        data: { school },
      });
    });
  });
  
  export const deleteVehiclePhotoByIndex = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const index = req.query.index;
    const school = await DrivingSchool.findById(id);
    if (!school) return next(new AppError("No school found with that ID", 404));
  
    const indexNum = parseInt(index);
    if (
      isNaN(indexNum) ||
      indexNum < 0 ||
      indexNum >= school.vehiclePhotos.length
    ) {
      return next(new AppError("Invalid photo index", 400));
    }
  
    const filePath = school.vehiclePhotos[indexNum];
  
    // Remove from array
    school.vehiclePhotos.splice(indexNum, 1);
    await school.save();
  
    res.status(200).json({
      status: "success",
      message: `Photo at index ${index} deleted successfully`,
    });
  });
  