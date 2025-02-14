import React, { useEffect, useState } from "react";
import Todo from "./Todo";
import "./TodoList.css";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  dueDate: string;
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim() !== "") {
      setTodos([
        ...todos,
        { id: Date.now().toString(), text: newTodo, completed: false, dueDate: newDueDate },
      ]);
      setNewTodo("");
      setNewDueDate("");
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // Handle Drag-and-Drop Reordering
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = todos.findIndex((todo) => todo.id === active.id);
      const newIndex = todos.findIndex((todo) => todo.id === over.id);
      setTodos(arrayMove(todos, oldIndex, newIndex));
    }
  };

  // Updated filtering logic: exclude completed tasks from "All Tasks" and "Incomplete Tasks"
  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.completed;
    if (filter === "incomplete") return !todo.completed;
    if (filter === "all") return !todo.completed; // "All Tasks" now only shows incomplete tasks
    return true;
  });

  const sensors = useSensors(useSensor(PointerSensor));

  return (
    <div className="todo-container">
      <h1 className="todo-title">To-Do List 📝</h1>

      <div className="todo-input-container">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task..."
          className="todo-input"
        />
        <input
          type="date"
          value={newDueDate}
          onChange={(e) => setNewDueDate(e.target.value)}
          className="todo-date-input"
        />
        <button onClick={addTodo} className="add-btn">
          Add
        </button>
      </div>

      <div className="todo-filter-container">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="todo-filter"
        >
          <option value="all">📋 All Tasks</option>
          <option value="incomplete">❌ Incomplete Tasks</option>
          <option value="completed">✅ Completed Tasks</option>
        </select>
      </div>

      {/* Drag-and-Drop Context */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={filteredTodos} strategy={verticalListSortingStrategy}>
          {filteredTodos.length === 0 ? (
            <p className="todo-empty">No tasks for Today.</p>
          ) : (
            filteredTodos.map((todo) => (
              <Todo
                key={todo.id}
                todo={todo}
                onToggle={() => toggleTodo(todo.id)}
                onDelete={() => deleteTodo(todo.id)}
              />
            ))
          )}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default TodoList;
