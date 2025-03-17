import { Task } from "../entities/Task";
import { TaskRepository } from "../repositories/TaskRepository";

export class TaskUseCases {
  constructor(private taskRepo: TaskRepository) {}

  async getTasks(): Promise<Task[]> {
    return await this.taskRepo.getAll();
  }

  async addTask(task: Task): Promise<void> {
    await this.taskRepo.add(task);
  }

  async toggleTaskCompletion(id: string): Promise<void> {
    const tasks = await this.taskRepo.getAll();
    const task = tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      await this.taskRepo.update(task);
    }
  }

  async deleteTask(id: string): Promise<void> {
    await this.taskRepo.delete(id);
  }
}
