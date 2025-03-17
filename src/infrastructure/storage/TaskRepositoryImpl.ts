import { Task } from "../../domain/entities/Task";
import { TaskRepository } from "../../domain/repositories/TaskRepository";

export class TaskRepositoryImpl implements TaskRepository {
  private readonly STORAGE_KEY = "tasks";

  async getAll(): Promise<Task[]> {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return [];
    const tasks: Task[] = JSON.parse(data);
    // Convert dueDate string to Date
    return tasks.map(task => ({
      ...task,
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
    }));
  }

  async add(task: Task): Promise<void> {
    const tasks = await this.getAll();
    tasks.push(task);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
  }

  async update(task: Task): Promise<void> {
    const tasks = await this.getAll();
    const updatedTasks = tasks.map(t => t.id === task.id ? task : t);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedTasks));
  }

  async delete(id: string): Promise<void> {
    const tasks = await this.getAll();
    const updatedTasks = tasks.filter(t => t.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedTasks));
  }
}
