const mongoose = require("mongoose");
const File = require("../models/FileSchema");
const Folder = require("../models/FolderSchema");
const path = require("path");
const IconURL = require("../service/IconsService")

module.exports = {
  async upload(req, res) {
    try {
      const { folderId } = req.body;

      if (req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded." });
      }

      const savedFiles = [];

      for (const file of req.files) {
        const newFile = new File({
          name: file.originalname,
          icon: IconURL(file.originalname),
          path: `http://localhost:3000/files/${file.filename}`,
        });

        await newFile.save();
        savedFiles.push(newFile);

        if (folderId) {
          const folder = await Folder.findById(folderId);
          folder.files.push(newFile._id);
          await folder.save();
        }
      }

      res.status(201).json(savedFiles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
