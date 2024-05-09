const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  name: String,
  icon: String,
  path: String,
  createdAt: { type: Date, default: Date.now },
});

const File = mongoose.model("File", fileSchema);

module.exports = File;
