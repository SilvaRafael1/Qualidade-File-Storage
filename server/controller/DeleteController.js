const fs = require("fs")
const File = require("../models/FileSchema");
const Folder = require("../models/FolderSchema");
const redisClient = require("../redis/client");

module.exports = {
  async delete(req, res) {
    const { id } = req.params;
    const file = await File.findById(id)
    const folder = await Folder.findById(id)

    function replaceSpaces(input) {
      let rep = " "
      for (let i = 0; i < input.length; i++) {
        if (input[i] == '%20')
          input = input.replace(input[i], rep);
      }
      return input;
    }

    if (file) {
      const path = new URL(file.path)
      const folder = path.pathname.replace("/files/", "/uploads/")
      const filePath = replaceSpaces(folder)
      await File.deleteOne(file);
      await Folder.updateOne(
        { "_id": file.pai },
        { $pull: { "files": file._id }}
      )
      fs.unlink(`../server/${filePath}`, (err) => {
        if (err) {
          console.error(err)
        }
      })
      
      if (file.pai == "66bb480a577f3ec36762ea14") {
        await redisClient.del("mainFolderCache")
      } else {
        await redisClient.del(file.pai)
      }

      return res.json("Arquivo deletado.")
    }
    
    if (folder) {
      if (folder.files.length == 0) {
        await Folder.updateOne(
          { "_id": folder.pai[0] },
          { $pull: { "parent": folder._id }}
        )
        await Folder.deleteOne(folder);

        const haveFolderCache = async (id) => {
          try {
            const cache = await redisClient.get(`${id}`);
            return cache;
          } catch (error) {
            console.error(error)
          }
        }
        
        if (haveFolderCache(folder._id)) {
          await redisClient.del(`${folder._id}`)
        }

        if (folder.pai[0] == "66bb480a577f3ec36762ea14") {
          await redisClient.del("mainFolderCache")
        } else if (haveFolderCache(folder.pai[0])) {
          await redisClient.del(`${folder.pai[0]}`)
        }

        return res.json("Pasta deletada.")
      }

      return res.json("Não foi possivel excluir! Há arquivos presentes na pasta.");
    }
  }
}