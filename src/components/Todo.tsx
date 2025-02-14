import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "./Todo.css";

interface TodoProps {
  todo: {
    id: string;
    text: string;
    completed: boolean;
    dueDate: string;
  };
  onToggle: () => void;
  onDelete: () => void;
}

const Todo: React.FC<TodoProps> = ({ todo, onToggle, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={`todo-item ${todo.completed ? "completed" : "incomplete"}`}>
      <div className="todo-main">
        <div className="todo-left">
          <input type="checkbox" checked={todo.completed} onChange={onToggle} className="todo-checkbox" />
          <span className={`todo-text ${todo.completed ? "completed" : ""}`}>{todo.text}</span>
        </div>

        <div className="todo-actions">
          <button onClick={onDelete} className="delete-btn">❌</button>
        </div>
      </div>

      <div className="todo-due-date">
        <p>📅 Due: {todo.dueDate || "No due date"}</p>
      </div>
    </div>
  );
};

export default Todo;
