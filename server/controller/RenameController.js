const fs = require("fs")
const path = require("path")
const File = require("../models/FileSchema");
const Folder = require("../models/FolderSchema");

module.exports = {
  async rename(req, res) {
    try {
      const { id, newName, oldName } = req.body
      const file = await File.findById(id)
      const folder = await Folder.findById(id)

      if (file) {
        const extension = path.extname(oldName)        
        const newNameExt = `${newName}${extension}`
        const fullOldName = file.path.replace("http://localhost:3000/files/", "")
        const newPath = file.path.replace(oldName, newNameExt)
        const fullNewName = newPath.replace("http://localhost:3000/files/", "")

        fs.rename(`../server/uploads/${fullOldName}`, `../server/uploads/${fullNewName}`, (err) => {
          if (err) {
            console.error(err)
          }
        })

        const updatedFile = await File.updateOne(file, {
          name: newNameExt,
          path: newPath
        })

        return res.json(updatedFile)
      }
    } catch (error) {
      console.error(error)
    }
  }
}