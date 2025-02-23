import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  dueDate: string;
}

interface TodoState {
  todos: TodoItem[];
}

const initialState: TodoState = {
  todos: JSON.parse(localStorage.getItem("todos") || "[]"),
};

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<Omit<TodoItem, "id">>) => {
      const newTodo = { id: Date.now().toString(), ...action.payload };
      state.todos.push(newTodo);
      localStorage.setItem("todos", JSON.stringify(state.todos));
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find((t) => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        localStorage.setItem("todos", JSON.stringify(state.todos));
      }
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter((t) => t.id !== action.payload);
      localStorage.setItem("todos", JSON.stringify(state.todos));
    },
    updateTodos: (state, action: PayloadAction<TodoItem[]>) => {
      state.todos = action.payload;
      localStorage.setItem("todos", JSON.stringify(state.todos));
    },
  },
});

export const { addTodo, toggleTodo, deleteTodo, updateTodos } = todoSlice.actions;
export default todoSlice.reducer;
