const File = require("../models/FileSchema");
const Folder = require("../models/FolderSchema");

module.exports = {
  async search(req, res) {
    try {
      const { search } = req.params
      const folders = await Folder.find({
        "name": {
          '$regex': search,
          '$options': 'i'
        }
      })
      const files = await File.find({
        "name": {
          '$regex': search,
          '$options': 'i'
        },
        status: true
      })
      
      res.json({ folders, files })
    } catch (error) {
      console.error(error)
      res.json(error)
    }
  }
}