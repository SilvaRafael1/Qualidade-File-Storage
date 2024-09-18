const mongoose = require("mongoose");
require("dotenv/config")

const URL = process.env.APP_URL

const folderSchema = new mongoose.Schema({
  name: String,
  files: [{ type: mongoose.Schema.Types.ObjectId, ref: "File" }],
  parent: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
    },
  ],
  pai: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
    },
  ],
  icon: {
    type: String,
    default: `https://${URL}/icons/folder.png`
  },
  createdAt: { type: Date, default: Date.now },
});

const Folder = mongoose.model("Folder", folderSchema);

module.exports = Folder;
