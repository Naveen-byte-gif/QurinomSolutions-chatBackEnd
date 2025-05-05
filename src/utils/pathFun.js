// import fs from 'fs';
// import path from 'path';

// // Get the current file URL and derive the directory name
// const __filename = new URL(import.meta.url).pathname;
// const __dirname = path.dirname(__filename);

// // Helper function to ensure a directory exists
// const ensureDirectoryExists = (directory) => {
//   if (!fs.existsSync(directory)) {
//     fs.mkdirSync(directory, { recursive: true });
//   }
// };

// // Get the upload path relative to the project root, with Date.now() included
// const getUploadPath = (userId, fileName, subDirectory = "") => {
//   const safeUserId = userId.toString();

//   // Use Date.now() to generate a unique timestamp (milliseconds)
//   const timestamp = Date.now(); // This gives the current time in milliseconds

//   // Create the upload directory using the timestamp
//   const uploadDir = path.join(process.cwd(), 'src', 'uploads', safeUserId, subDirectory, timestamp.toString());

//   // Ensure the directory exists or create it
//   ensureDirectoryExists(uploadDir);

//   // Full file path in the filesystem
//   const filePath = path.join(uploadDir, fileName);

//   // Return both the absolute path (filesystem) and a relative path (for URL usage)
//   return {
//     fullPath: filePath,
//     relativePath: path.posix.join("uploads", safeUserId, subDirectory, timestamp.toString(), fileName),
//   };
// };

// export default getUploadPath;

import fs from "fs";
import path from "path";

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

// Helper to make sure the directory exists
const ensureDirectoryExists = (directory) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

// Updated: No timestamp
const getUploadPath = (userId, fileName, subDirectory = "") => {
  const safeUserId = userId.toString();

  // Create directory: /uploads/<userId>/<subDirectory>
  const uploadDir = path.join(
    process.cwd(),
    "src",
    "uploads",
    safeUserId,
    subDirectory
  );

  ensureDirectoryExists(uploadDir);

  const filePath = path.join(uploadDir, fileName);
  const relativePath = path.posix.join(
    "uploads",
    safeUserId,
    subDirectory,
    fileName
  );

  return {
    fullPath: filePath,
    relativePath,
  };
};

export default getUploadPath;
