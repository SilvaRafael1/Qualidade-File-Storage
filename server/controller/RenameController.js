const fs = require("fs")
const File = require("../models/FileSchema");
const Folder = require("../models/FolderSchema");
const redisClient = require("../redis/client")
require("dotenv/config")

module.exports = {
  async rename(req, res) {
    try {
      const { id, newName, oldName } = req.body
      const file = await File.findById(id)
      const folder = await Folder.findById(id)
      const URL = process.env.APP_URL

      if (file) {
        const extension = file.ext        
        const newNameExt = `${newName}.${extension}`
        const fullOldName = file.path.replace(`https://${URL}/files/`, "")
        const newPath = file.path.replace(oldName, newNameExt)
        const fullNewName = newPath.replace(`https://${URL}/files/`, "")

        fs.rename(`../server/uploads/${fullOldName}`, `../server/uploads/${fullNewName}`, (err) => {
          if (err) {
            console.error(err)
          }
        })

        const updatedFile = await File.updateOne(file, {
          name: newNameExt,
          path: newPath
        })

        if (file.pai == "66bb480a577f3ec36762ea14") {
          await redisClient.del(`mainFolderCache`)
        } else {
          await redisClient.del(`${file.pai}`)
        }

        return res.json(updatedFile)
      }

      if (folder) {
        const updatedFolder = await Folder.updateOne(folder, {
          name: newName
        })

        await redisClient.del(`${folder._id}`)
        if (folder.pai == "66bb480a577f3ec36762ea14") {
          await redisClient.del(`mainFolderCache`)
        } else {
          await redisClient.del(`${folder.pai}`)
        }

        return res.json(updatedFolder)
      }
    } catch (error) {
      console.error(error)
    }
  }
}