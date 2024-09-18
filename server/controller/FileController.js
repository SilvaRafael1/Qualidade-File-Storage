const File = require("../models/FileSchema");
const Folder = require("../models/FolderSchema");
const IconURL = require("../service/IconsService");
const path = require("path");
require("dotenv/config")

module.exports = {
  async byId(req, res) {
    try {
      const { id } = req.params;
      const file = await File.findById(id);
      res.status(200).json(file);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async upload(req, res) {
    const URL = process.env.APP_URL;

    try {
      const { folderId } = req.body;

      const pastaPrincipal = await Folder.findOne({
        name: "Pasta Principal"
      })

      if (req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded." });
      }

      const savedFiles = [];

      for (const file of req.files) {
        const originalFilename = Buffer.from(file.originalname, "latin1").toString("utf-8");
        const extFile = path.extname(file.filename).split(".")
        const newFile = new File({
          name: originalFilename,
          icon: IconURL(file.originalname),
          path: `https://${URL}/files/${file.filename}`,
          ext: extFile[extFile.length - 1],
          pai: pastaPrincipal._id
        });

        if (folderId) {
          const folder = await Folder.findById(folderId);
          newFile.pai = folderId
          folder.files.push(newFile._id);
          await folder.save();
        }

        await newFile.save();
        savedFiles.push(newFile);
      }

      res.redirect(`https://${URL}/${folderId}`)
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateIcons(req, res) {
    try {
      const files = await File.find();
      for (const file of files) {
        await File.updateOne(file, {
          icon: IconURL(file.name)
        })
      }
      res.json("feito xd")
    } catch (error) {
      console.error(error)
    }
  }
};
