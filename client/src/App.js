import { useEffect, useState } from "react";
import io from "socket.io-client";
const { v4: uuidv4 } = require("uuid");

const socket = io("http://localhost:8000");

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");

  useEffect(() => {
    socket.on("updateData", (tasks) => {
      updateTasks(tasks);
    });
    socket.on("addTask", (task) => {
      addTask(task);
    });
    socket.on("removeTask", (id) => {
      removeTask(id);
    });

    return () => {
      socket.off("updateData");
      socket.off("addTask");
      socket.off("removeTask");
    };
  }, []);

  const updateTasks = (taskData) => {
    setTasks(taskData);
  };

  const removeTask = (taskId) =>
    setTasks((tasks) => tasks.filter((task) => task.id !== taskId));

  const addTask = (task) => {
    setTasks((tasks) => [...tasks, task]);
  };

  const submitForm = (e) => {
    e.preventDefault();
    addTask({ name: taskName, id: uuidv4() });
    socket.emit("addTask", { name: taskName, id: uuidv4() });
  };

  const submitRemoval = (e, taskId) => {
    e.preventDefault();
    removeTask(taskId);
    socket.emit("removeTask", taskId);
  };

  return (
    <div className="App">
      <header>
        <h1>ToDoList.app</h1>
      </header>

      <section className="tasks-section" id="tasks-section">
        <h2>Tasks</h2>

        <ul className="tasks-section__list" id="tasks-list">
          {tasks.map((task) => (
            <li className="task" key={task.id}>
              {task.name}
              <button
                className="btn btn--red"
                onClick={(e) => submitRemoval(e, task.id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

        <form id="add-task-form" onSubmit={(e) => submitForm(e)}>
          <input
            className="text-input"
            autoComplete="off"
            type="text"
            placeholder="Type your description"
            id="task-name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
          <button className="btn" type="submit">
            Add
          </button>
        </form>
      </section>
    </div>
  );
};

export default App;
