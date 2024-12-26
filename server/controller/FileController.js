const File = require("../models/FileSchema");
const Folder = require("../models/FolderSchema");
const IconURL = require("../service/IconsService");
const path = require("path");
const redisClient = require("../redis/client");
const fs = require('node:fs/promises')
require("dotenv/config")

module.exports = {
  async index(req, res) {
    try {
      const files = await File.find(
        { status: false }
      ).populate({
        path: "pai"
      });
      res.status(200).json(files)
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async byId(req, res) {
    try {
      const { id } = req.params;
      const file = await File.findById(id).populate({
        path: "pai",
        options: {
          sort: {
            name: 1
          }
        }
      });
      res.status(200).json(file);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async upload(req, res) {
    const URL = process.env.APP_URL;

    try {
      const { folderId, download } = req.body;

      let trueDownload = false
      if (download == "true") {
        trueDownload = true
      }

      const pastaPrincipal = await Folder.findOne({
        name: "Pasta Principal"
      })

      if (req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded." });
      }

      const savedFiles = [];

      for (const file of req.files) {
        let originalFilename = Buffer.from(file.originalname, "latin1").toString("utf-8");
        let extFile = path.extname(file.filename).split(".")
        
        if (extFile[extFile.length - 1] == 'doc') {
          extFile[extFile.length - 1] = 'docx'
          originalFilename = originalFilename.replace('doc', 'docx')
          newFileName = file.filename.replace('doc', 'docx')
          fs.rename(`../server/uploads/${file.filename}`, `../server/uploads/${newFileName}`, (err) => {
            console.log(err);
          })
          file.filename = file.filename.replace('doc', 'docx')
        }

        let pathOriginal = `https://${URL}/files/${file.filename}`

        const newFile = new File({
          name: originalFilename,
          icon: IconURL(file.originalname),
          path: pathOriginal,
          ext: extFile[extFile.length - 1],
          pai: pastaPrincipal._id,
          download: trueDownload
        });

        if (folderId) {
          const folder = await Folder.findById(folderId);
          newFile.pai = folderId
          folder.files.push(newFile._id);
          await folder.save();
        }

        if (newFile.pai == "66bb480a577f3ec36762ea14") {
          await redisClient.del("mainFolderCache")
        } else {
          await redisClient.del(folderId)
        }

        await newFile.save();
        savedFiles.push(newFile);
      }

      if (folderId == "66bb480a577f3ec36762ea14") {
        res.redirect(`http://${URL}/`)
      } else {
        res.redirect(`http://${URL}/${folderId}`)
      }
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
  },

  async restore(req, res) {
    try {
      const { id } = req.params;
      const file = await File.findByIdAndUpdate(id, {
        status: true
      })

      if (file.pai == "66bb480a577f3ec36762ea14") {
        await redisClient.del("mainFolderCache")
        return res.json("Arquivo restaurado.")
      } 

      await redisClient.del(`${file.pai}`)
      return res.json("Arquivo restaurado.")
    } catch (error) {
      console.error(error)
    }
  },

  async download(req, res) {
    const URL = process.env.APP_URL;

    try {
      const { id } = req.params;
      const file = await File.findById(id).populate({
        path: "pai",
        options: {
          sort: {
            name: 1
          }
        }
      });

      let filePath = file.path
      filePath = filePath.replace(`https://${URL}/files/`, "")

      res.download(`./uploads/${filePath}`, file.name, (err) => {
        if (err) {
          console.error("Erro ao enviar o arquivo:", err);
          res.status(500).send("Erro ao baixar o arquivo.");
        } 
      })

      // if (file.pai == "66bb480a577f3ec36762ea14") {
      //   res.redirect(`http://${URL}/`)
      // } else {
      //   res.redirect(`http://${URL}/${file.pai}`)
      // }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
