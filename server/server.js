const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const router = require("./routes");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to Local MongoDB
const uri = "mongodb://localhost:27017";
mongoose.connect(uri, {
  dbName: "filestorage",
});
const db = mongoose.connection;
mongoose.connection.on("error", function (err) {
  console.log("Erro na conexão Mongoose padrão: " + err);
});
db.once("open", function () {
  console.log("Estamos conectados no banco de dados!");
});

// JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/files", express.static(path.join(__dirname, "uploads")));

// Router
app.use("/api", router);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/api`);
});
