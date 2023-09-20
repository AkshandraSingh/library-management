const multer = require('multer');
const path = require('path');

// Define storage configuration for image uploads
const imageStorageConfig = (destination, filenamePrefix) => multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.join(__dirname, '..', 'uploads', destination));
    },
    filename: (req, file, callback) => {
        const ext = path.extname(file.originalname);
        // Use a unique identifier (e.g., user ID or timestamp) to ensure unique filenames
        const uniqueIdentifier = req.user ? req.user.id : Date.now();
        callback(null, `${filenamePrefix}_${uniqueIdentifier}${ext}`);
    }
});

// Define filter for image uploads
const imageFilter = (req, file, callback) => {
    if (file.mimetype.startsWith('image')) {
        callback(null, true);
    } else {
        callback(new Error('Only image files are supported'));
    }
};


const profilePicUpload = multer({ storage: imageStorageConfig('userProfilePics', 'profile'), fileFilter: imageFilter });
const bookImageUpload = multer({ storage: imageStorageConfig('booksImages', 'book'), fileFilter: imageFilter });

module.exports = {
    profilePicUpload,
    bookImageUpload,
};
