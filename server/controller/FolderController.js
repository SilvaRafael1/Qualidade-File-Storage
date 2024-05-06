const Folder = require("../models/FolderSchema")

module.exports = {
  async index(req, res) {
    try {
      const mainFolder = await Folder.find({ name: "main" }).populate("files");
      res.status(200).json(mainFolder[0].files);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async create(req, res) {
    try {
      const { name, parentId, paiId } = req.body;

      const newFolder = new Folder({
        name,
        parent: [],
        pai: []
      });

      if (parentId) {
        const parentFolder = await Folder.findById(parentId);
        parentFolder.parent.push(newFolder._id);
        await parentFolder.save();
      }
      
      if (paiId) {
        newFolder.pai.push(paiId);
      }

      await newFolder.save();

      res.status(201).json(newFolder);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async filesFolder(req, res) {
    try {
      const folder = await Folder.findById(req.params.id)
        .populate("files")
        .populate({
          path: "parent",
          populate: { path: "files" },
        });

      res.status(200).json(folder);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
