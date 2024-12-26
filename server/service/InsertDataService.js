const bcrypt = require("bcrypt");
const User = require("../models/UserSchema"); 
const Folder = require("../models/FolderSchema");
const File = require("../models/FileSchema");

async function InsertAdminUser(username, password, role) {
  try {
    const existUser = await User.findOne({
      username: "admin"
    });
    if (existUser) return console.log("Usuário admin já criado.");
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashedPassword,
      role
    });

    await user.save();
    console.log("Usuário inserido com sucesso!");
  } catch (error) {
    console.error("Erro ao inserir dados:", error);
  } 
}

async function InsertMainFolder() {
  try {
    const existFolder = await Folder.findOne({
      name: "Pasta Principal"
    })
    if (existFolder) return console.log("Pasta principal já criada.");

    const folder = new Folder({
      _id: "66bb480a577f3ec36762ea14",
      name: "Pasta Principal"
    })
    await folder.save()

    console.log("Pasta principal inserido com sucesso!");
  } catch (error) {
    console.error("Erro ao inserir dados:", error)
  }
}

async function UpdateFileStatus() {
    try {
      await File.updateMany(
        { status: { $exists: false } },
        { $set: { status: true }}
      ).then((result) => {
        console.log(`Documentos atualizados: ${result.nModified}`);
      })
      await File.updateMany(
        { download: { $exists: false } },
        { $set: { download: false }}
      ).then((result) => {
        console.log(`Documentos atualizados: ${result.nModified}`);
      })
    } catch (error) {
      console.error(error)
    }
}

module.exports = {
  InsertAdminUser,
  InsertMainFolder,
  UpdateFileStatus
};