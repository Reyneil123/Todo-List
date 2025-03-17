import { Task } from "../entities/Task";
export interface TaskRepository {
    getAll(): Promise<Task[]>;
    add(task:Task): Promise<void>;
    update(task: Task): Promise<void>;
    delete(id: string): Promise<void>;
}