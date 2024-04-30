const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema({
  name: String,
  files: [{ type: mongoose.Schema.Types.ObjectId, ref: "File" }],
  parent: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const Folder = mongoose.model("Folder", folderSchema);

module.exports = Folder;
