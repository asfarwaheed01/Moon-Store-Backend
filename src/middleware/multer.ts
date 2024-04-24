import multer from "multer";
import path from "path";

// Define a Storage

const storage = multer.diskStorage({
  // Define the file destination
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});

// Upload Parameters for multer

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 3,
  },
});

export default upload;
