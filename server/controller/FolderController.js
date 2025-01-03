const Folder = require("../models/FolderSchema")
const redisClient = require("../redis/client")

module.exports = {
  async index(req, res) {
    try {
      const mainFolderCache = await redisClient.get("mainFolderCache")
      if (mainFolderCache) {
        return res.status(200).json(JSON.parse(mainFolderCache));
      }

      const mainFolder = await Folder
        .find({ name: "Pasta Principal" })
        .populate({
          path: "files",
          options: {
            sort: {
              name: 1
            }
          }
        })
        .populate({
          path: "parent",
          options: {
            sort: {
              name: 1
            }
          }
        })

      await redisClient.set("mainFolderCache", JSON.stringify(mainFolder[0]))

      res.status(200).json(mainFolder[0]);
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

      if (!paiId || paiId == "66bb480a577f3ec36762ea14") {
        await redisClient.del("mainFolderCache")
      } else {
        await redisClient.del(paiId)
      }

      await newFolder.save();

      res.status(201).json(newFolder);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async filesFolder(req, res) {
    try {
      const folderById = await redisClient.get(req.params.id)
      if (folderById) {
        return res.status(200).json(JSON.parse(folderById));
      }

      const folder = await Folder.findById(req.params.id)
        .populate({
          path: "files",
          options: {
            sort: {
              name: 1
            }
          }
        })
        .populate({
          path: "parent",
          populate: { path: "files" },
          options: {
            sort: {
              name: 1
            }
          }
        });

      await redisClient.set(req.params.id, JSON.stringify(folder))

      res.status(200).json(folder);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async breadcrumbs(req, res) {
    try {
      let folderid = req.params.id

      const isCached = await redisClient.get(`${folderid}-breadcrumb`)
      if (isCached) {
        return res.status(200).json(JSON.parse(isCached));
      }

      const list = []

      let ativo = true
      do {
        let searchFolder = await Folder.findById(folderid).populate({
          path: "pai",
          options: {
            sort: {
              name: 1
            }
          }
        });
        if (searchFolder) {
          if (searchFolder.pai[0]) {
            if (searchFolder.pai[0]._id == "66bb480a577f3ec36762ea14") {
              let newObj = {
                id: "",
                name: searchFolder.pai[0].name
              }
              list.unshift(newObj)
              ativo = false
              continue
            }
            let newObj = {
              id: searchFolder.pai[0]._id,
              name: searchFolder.pai[0].name
            }
            list.unshift(newObj)
            folderid = searchFolder.pai[0]._id
          } else {
            ativo = false
          }
        } else {
          ativo = false
        }
      } while (ativo)
      await redisClient.set(`${req.params.id}-breadcrumb`, JSON.stringify(list))
      return res.json(list)
    } catch (error) {
      console.error(error)
    }
  }
};
