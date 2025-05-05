import multer from "multer";
import AppError from "./appError.js";

const multerWrapper = () => {
  const multerStorage = multer.memoryStorage();

  const multerFilter = (req, file, cb) => {
    if (
      file.mimetype.startsWith("application") ||
      file.mimetype.startsWith("image") ||
      file.mimetype.startsWith("video") ||
      file.mimetype.startsWith("audio")
    ) {
      cb(null, true);
    } else {
      cb(
        new AppError(
          "Unsupported file type! Please upload only images, videos, audios, or application files.",
          400
        ),
        false
      );
    }
  };

  return multer({ storage: multerStorage, fileFilter: multerFilter });
};

export default multerWrapper;
