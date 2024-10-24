const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  name: String,
  icon: String,
  path: String,
  ext: String,
  status: {
    type: Boolean,
    default: true,
  },
  pai: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Folder",
  },
  createdAt: { type: Date, default: Date.now },
});

const File = mongoose.model("File", fileSchema);

module.exports = File;
