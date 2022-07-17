const express = require("express");
const socket = require("socket.io");

const app = express();

const tasks = [];

const server = app.listen(process.env.PORT || 8000, () => {
  console.log("Server is running...");
});

app.use((req, res) => {
  res.status(404).send({ message: "UPS.. page not found" });
});

const io = socket(server);
