const fs = require("fs")
const File = require("../models/FileSchema");
const Folder = require("../models/FolderSchema");

module.exports = {
  async delete(req, res) {
    const { id } = req.params;
    const file = await File.findById(id)
    const folder = await Folder.findById(id)

    if (file) {
      const path = new URL(file.path)
      const folder = path.pathname.replace("/files/", "/uploads/").replace("%20", " ")
      fs.unlink(`../server/${folder}`, (err) => {
        if (err) {
          console.error(err)
        }
      })
      await File.deleteOne(file);
      return res.json("Arquivo deletado.")
    }
    
    if (folder) {
      if (folder.files.length == 0) {
        await Folder.deleteOne(folder);
        return res.json("Pasta deletada.")
      }

      return res.json("Não foi possivel excluir! Há arquivos presentes na pasta.");
    }
  }
}