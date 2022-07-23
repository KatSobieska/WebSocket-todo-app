const express = require("express");
const socket = require("socket.io");

const app = express();

let tasks = [];

const server = app.listen(process.env.PORT || 8000, () => {
  console.log("Server is running...");
});

app.use((req, res) => {
  res.status(404).send({ message: "Not found..." });
});

const io = socket(server);

io.on("connection", (socket) => {
  console.log("Client id:" + socket.id);
  socket.emit("updateData", tasks);
  socket.on("addTask", (task) => {
    console.log("Task added" + task.id);
    tasks.push(task);
    socket.broadcast.emit("addTask", task);
  });
  socket.on("removeTask", (taskId) => {
    const task = tasks.find((task) => task.id === taskId);
    tasks.splice(tasks.indexOf(task), 1);
    console.log("Task removed" + taskId);
    socket.broadcast.emit("removeTask", taskId);
  });
});
