import React, { useState } from "react";
import { useTasks } from "../hooks/useTasks";
export const TaskList: React.FC = () => {
  const {
    tasks,
    addTask,
    toggleTaskCompletion,
    loading,
    filter,
    setFilter,
  } = useTasks();

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState("");

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      const dueDateString = newDueDate
        ? new Date(newDueDate).toISOString()
        : undefined;

      const taskWithDueDate = {
        title: newTaskTitle.trim(),
        dueDate: dueDateString,
      };
      addTask(taskWithDueDate);
      setNewTaskTitle("");
      setNewDueDate("");
    }
  };

  const handleEditTask = (taskId: string, currentTitle: string) => {
    setEditingTaskId(taskId);
    setEditedTitle(currentTitle);
  };

  const handleSaveEdit = () => {
    console.log("Save edited title:", editedTitle);
    setEditingTaskId(null);
  };

  const formatDate = (isoDate?: string) => {
    if (!isoDate) return "No due date";
    const date = new Date(isoDate);
    return date.toLocaleDateString();
  };

  return (
    <div className="container">
      <h1>To-Do List</h1>
      <div className="input-group">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Enter new task"
        />
        <input
          type="date"
          value={newDueDate}
          onChange={(e) => setNewDueDate(e.target.value)}
        />
        <button onClick={handleAddTask}>Add</button>
      </div>

      <div className="filter-group">
        <button
          onClick={() => setFilter("ALL")}
          className={filter === "ALL" ? "active" : ""}
        >
          All
        </button>
        <button
          onClick={() => setFilter("INCOMPLETE")}
          className={filter === "INCOMPLETE" ? "active" : ""}
        >
          Incomplete
        </button>
        <button
          onClick={() => setFilter("COMPLETED")}
          className={filter === "COMPLETED" ? "active" : ""}
        >
          Completed
        </button>
        <button
          onClick={() => setFilter("OVERDUE")}
          className={filter === "OVERDUE" ? "active" : ""}
        >
          Overdue
        </button>
      </div>

      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className="task-item">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTaskCompletion(task.id)}
              />
              {editingTaskId === task.id ? (
                <>
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                  />
                  <button onClick={handleSaveEdit}>Save</button>
                </>
              ) : (
                <>
                  <span className={task.completed ? "completed" : ""}>
                    {task.title} —{" "}
                    <small>Due: {formatDate(typeof task.dueDate === "string" ? task.dueDate : task.dueDate?.toISOString())}</small>                 
                     </span>
                  <button onClick={() => handleEditTask(task.id, task.title)}>
                    Edit
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
