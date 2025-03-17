export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: Date | string; // Allow both Date and string
}
