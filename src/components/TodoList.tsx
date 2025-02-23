import React, { useState } from "react";
import Todo from "./Todo";
import "./TodoList.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { addTodo, toggleTodo, deleteTodo, updateTodos } from "../store/todoSlice";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";

const TodoList: React.FC = () => {
  const todos = useSelector((state: RootState) => state.todos.todos);
  const dispatch = useDispatch();
  const [newTodo, setNewTodo] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("default");

  const handleAddTodo = () => {
    if (newTodo.trim() !== "") {
      dispatch(addTodo({ text: newTodo, completed: false, dueDate: newDueDate }));
      setNewTodo("");
      setNewDueDate("");
    }
  };

  const handleToggleTodo = (id: string) => {
    dispatch(toggleTodo(id));
  };

  const handleDeleteTodo = (id: string) => {
    dispatch(deleteTodo(id));
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = todos.findIndex((todo) => todo.id === active.id);
    const newIndex = todos.findIndex((todo) => todo.id === over.id);
    const newTodos = arrayMove(todos, oldIndex, newIndex);
    dispatch(updateTodos(newTodos));
  };

  const isOverdue = (dueDate: string) => {
    if (!dueDate) return false;
    const today = new Date();
    const taskDueDate = new Date(dueDate);
    return today > new Date(taskDueDate.setDate(taskDueDate.getDate() + 1));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.completed;
    if (filter === "incomplete") return !todo.completed && !isOverdue(todo.dueDate);
    if (filter === "overdue") return isOverdue(todo.dueDate) && !todo.completed;
    if (filter === "all") return !todo.completed && !isOverdue(todo.dueDate);
    return true;
  });

  const sortTodos = (todos: typeof filteredTodos) => {
    return [...todos].sort((a, b) => {
      if (sortOrder === "dueDate") {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (sortOrder === "alphabetical") {
        return a.text.localeCompare(b.text);
      }
      if (sortOrder === "completed") {
        return Number(a.completed) - Number(b.completed);
      }
      return 0;
    });
  };

  const sortedTodos = sortTodos(filteredTodos);

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
        <button onClick={handleAddTodo} className="add-btn">
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
          <option value="overdue">⚠️ Overdue Tasks</option>
        </select>
      </div>

      <div className="todo-sort-container">
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="todo-sort">
          <option value="dueDate">📅 Due Date</option>
          <option value="alphabetical">🔤 Alphabetical</option>
        </select>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sortedTodos} strategy={verticalListSortingStrategy}>
          {sortedTodos.length === 0 ? (
            <p className="todo-empty">No tasks found.</p>
          ) : (
            sortedTodos.map((todo) => (
              <Todo
                key={todo.id}
                todo={todo}
                onToggle={() => handleToggleTodo(todo.id)}
                onDelete={() => handleDeleteTodo(todo.id)}
              />
            ))
          )}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default TodoList;
