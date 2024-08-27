const express = require("express");
const multer = require("multer");
const router = express.Router();

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    const filename = Buffer.from(file.originalname, "latin1").toString("utf-8");
    cb(null, `${Date.now()}-${filename}`);
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
const DeleteController = require("./controller/DeleteController")
const RenameController = require("./controller/RenameController")
const SearchController = require("./controller/SearchController")

router.get("/file/:id", FileController.byId);
router.post("/upload", upload, FileController.upload);
router.get("/updateIcons", FileController.updateIcons);

router.delete("/delete/:id", DeleteController.delete);

router.put("/rename", RenameController.rename);

router.get("/search/:search", SearchController.search);

router.get("/folder", FolderController.index);
router.get("/folder/:id", FolderController.filesFolder);
router.post("/folder", FolderController.create);

module.exports = router;