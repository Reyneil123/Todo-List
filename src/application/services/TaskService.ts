import { TaskRepositoryImpl } from "../../infrastructure/storage/TaskRepositoryImpl";
import { TaskUseCases } from "../../domain/usecases/TaskUseCases";

const taskRepository = new TaskRepositoryImpl();
export const taskService = new TaskUseCases(taskRepository);
