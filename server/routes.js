const express = require("express");
const multer = require("multer");
const router = express.Router();

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  }
}).array('files');

// Controllers
const FileController = require("./controller/FileController");
const FolderController = require("./controller/FolderController")

router.post("/upload", upload, FileController.upload);

router.get("/folder", FolderController.index);
router.get("/folder/:id", FolderController.filesFolder);
router.post("/folder", FolderController.create);

module.exports = router;