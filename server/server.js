const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const router = require("./routes");
const cors = require("cors");
const http = require("node:http")
const https = require("node:https")
const fs = require("node:fs")
const InsertDataService = require("./service/InsertDataService");

const app = express();

// Connect to Local MongoDB
const uri = "mongodb://mongo:27017";
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

// Security
app.use(cors());

// JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SSL
const certs = {
  key: fs.readFileSync("./cert/wildcard.tacchini.com.br2024.key"),
  cert: fs.readFileSync("./cert/wildcard.tacchini.com.br.crt"),
}

// Router
app.use("/api", router);

// Auto Insert
InsertDataService.InsertAdminUser("admin", "Tac428220ss", "admin")
InsertDataService.InsertMainFolder()

// Public Files
app.use("/files", express.static(path.join(__dirname, "uploads")));
app.use("/icons", express.static(path.join(__dirname, "icons")));

app.use((req, res, next) => {
  if (/(.ico|.js|.css|.jpg|.png|.map)$/i.test(req.path)) {
      next();
  } else {
      res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      res.header('Expires', '-1');
      res.header('Pragma', 'no-cache');
      res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
  }
});

app.use(express.static(path.join(__dirname, '../client/dist')));

// Middleware para redirecionar HTTP para HTTPS
app.use((req, res, next) => {
  if (req.secure) {
    // Se a requisição já for HTTPS, prossiga normalmente
    next();
  } else {
    // Redireciona para HTTPS
    res.redirect(`https://${req.headers.host}${req.url}`);
  }
});

// Start the server
http.createServer((req, res) => {
  res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
  res.end();
}).listen(80);
https.createServer(certs, app).listen(443, () => {
  console.log(`Servidor HTTPS rodando na porta 443`)
})
