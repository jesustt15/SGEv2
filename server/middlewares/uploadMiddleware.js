// middlewares/uploadMiddleware.js
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Utility function to create storage configuration
function createMulterStorage(subfolder) {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadDirectory = path.join(__dirname, '..', 'uploads', subfolder);
      if (!fs.existsSync(uploadDirectory)) {
        fs.mkdirSync(uploadDirectory, { recursive: true });
      }
      cb(null, uploadDirectory);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + file.originalname;
      cb(null, uniqueSuffix);
    },
  });
}

// Configure upload handlers
const uploadEstudiante = multer({ storage: createMulterStorage('fotoEstudiante') });
const uploadRepresentante = multer({ storage: createMulterStorage('fotoRepresentante') });
const uploadAutorizado = multer({ storage: createMulterStorage('fotoAutorizado') });

module.exports = {
  uploadEstudiante,
  uploadRepresentante,
  uploadAutorizado,
};
