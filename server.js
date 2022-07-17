const express = require("express");
const socket = require("socket.io");

let tasks = [];

const app = express();

const server = app.listen(8000, () => {
  console.log("Server is running on Port:", 8000);
});

app.use((req, res) => {
  res.status(404).send("404: Page not found");
});

const io = socket(server);

io.on("connection", (socket) => {
  console.log("Client id:" + socket.id);
  socket.emit("updateData", tasks);
  socket.on("addTask", (task) => {
    console.log("Task added");
    tasks.push(task);
    socket.broadcast.emit("addTask", task);
  });
  socket.on("removeTask", () => {
    console.log("Task removed");
    const task = tasks.find((task) => task.id === socket.id);
    tasks.splice(tasks.indexOf(task), 1);
    socket.broadcast.emit("removeTask", task);
  });
});
