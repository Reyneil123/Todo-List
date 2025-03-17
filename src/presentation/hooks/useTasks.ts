import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { useEffect } from "react";
import {
  addTask,
  toggleTask,
  loadTasks,
  setFilter,
} from "../store/tasksSlice";
import { Task } from "../../domain/entities/Task";

const isOverdue = (task: Task) => {
  if (!task.dueDate) return false;
  return new Date(task.dueDate) < new Date() && !task.completed;
};

export const useTasks = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading, error, filter } = useSelector(
    (state: RootState) => state.tasks
  );

  useEffect(() => {
    dispatch(loadTasks());
  }, [dispatch]);

  const handleAddTask = (task: { title: string; dueDate?: string }) => {
    dispatch(addTask(task));
  };

  const handleToggleTask = (id: string) => {
    dispatch(toggleTask(id));
  };

  const handleSetFilter = (
    filterType: "ALL" | "INCOMPLETE" | "COMPLETED" | "OVERDUE"
  ) => {
    dispatch(setFilter(filterType));
  };

  // 🧹 Filter tasks based on filter type
  let filteredTasks = tasks.filter((task) => {
    switch (filter) {
      case "COMPLETED":
        return task.completed;
      case "INCOMPLETE":
        return !task.completed;
      case "OVERDUE":
        return isOverdue(task);
      case "ALL":
        return !task.completed && !isOverdue(task); // ✅ Exclude completed & overdue
      default:
        return true;
    }
  });

  // 🔠 Sort alphabetically (A → Z by title)
  filteredTasks = filteredTasks.sort((a, b) => a.title.localeCompare(b.title));

  return {
    tasks: filteredTasks,
    loading,
    error,
    addTask: handleAddTask,
    toggleTaskCompletion: handleToggleTask,
    filter,
    setFilter: handleSetFilter,
  };
};
