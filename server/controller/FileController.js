const File = require("../models/FileSchema");
const Folder = require("../models/FolderSchema");
const IconURL = require("../service/IconsService");

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
    try {
      const { folderId } = req.body;

      if (req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded." });
      }

      const savedFiles = [];

      for (const file of req.files) {
        const originalFilename = Buffer.from(file.originalname, "latin1").toString("utf-8");
        const newFile = new File({
          name: originalFilename,
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

      res.redirect(`http://localhost:5173/${folderId}`)
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
