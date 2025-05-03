const multer = require('multer');

// Configure multer (store in memory or disk)
const storage = multer.memoryStorage(); // or configure disk storage
const upload = multer({ storage });

exports.upload;