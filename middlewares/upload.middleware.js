const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads'); // storage location
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // file naming
  }
});

// Allowed extensions
const allowedFileTypes = /jpeg|jpg|png|pdf|zip/;

const fileFilter = (req, file, cb) => {
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, PDF, and ZIP are allowed.'), false);
  }
};

// Initialize upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

// For multiple file uploads (e.g. NGO registration)
const multiFileUpload = upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'registrationCertificate', maxCount: 1 }
]);

// For single file upload (e.g. campaign image)
const singleFileUpload = upload.single('image'); // 'image' is the field name in the form

module.exports = {
  multiFileUpload,
  singleFileUpload
};