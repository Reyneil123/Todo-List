import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Task } from "../../domain/entities/Task";
import { taskService } from "../../application/services/TaskService";

type FilterType = "ALL" | "INCOMPLETE" | "COMPLETED" | "OVERDUE";

interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  filter: FilterType;
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
  filter: "ALL", // default filter
};



// Async Thunks
export const loadTasks = createAsyncThunk("tasks/load", async () => {
  return await taskService.getTasks();
});

export const addTask = createAsyncThunk(
  "tasks/add",
  async (taskData: { title: string; dueDate?: string }) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: taskData.title,
      completed: false,
      dueDate: taskData.dueDate,
    };
    await taskService.addTask(newTask);
    return await taskService.getTasks();
  }
);



export const toggleTask = createAsyncThunk("tasks/toggle", async (id: string) => {
  await taskService.toggleTaskCompletion(id);
  return await taskService.getTasks();
});

export const deleteTask = createAsyncThunk("tasks/delete", async (id: string) => {
  await taskService.deleteTask(id);
  return await taskService.getTasks();
});

// Slice
const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<FilterType>) {
      state.filter = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadTasks.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(loadTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to load tasks";
      })
      .addCase(addTask.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.tasks = action.payload;
      })
      .addCase(toggleTask.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.tasks = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.tasks = action.payload;
      });
      
  },
});

export const { setFilter } = tasksSlice.actions;
export default tasksSlice.reducer;
