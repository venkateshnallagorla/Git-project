const express = require('express');
const multer = require('multer');
const path = require('path');
const fileSystem = require('fs');
const logError = require('./utils/errorLogger');
const app = express();
const uploadDirectory = path.join(__dirname, 'uploads');
 
if (!fileSystem.existsSync(uploadDirectory)) {
  fileSystem.mkdirSync(uploadDirectory, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
 
const upload = multer({ storage: storage });
 
app.use(express.json());
app.post('/upload', (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      logError(err);
      return res.status(500).send('Error uploading file.');
    }
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
 
    const filePath = path.join(uploadDirectory, req.file.filename);
    res.status(200).json({
      message: 'File uploaded successfully',
      fileName: req.file.originalname,
      filePath: filePath,
      fileSize: req.file.size
    });
  });
});
const PORT = 4512;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});