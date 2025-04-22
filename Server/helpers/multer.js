// multer.js (helpers/multer.js)
const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({ storage: storage }).array('images', 5); // 'images' is the field name for multiple files

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpeg, .jpg, and .png files are allowed"));
  }
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB per file
}).array("images", 5); // Ensure the field name matches the client-side form field
