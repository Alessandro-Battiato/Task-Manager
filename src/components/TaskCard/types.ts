export interface Task {
    id: string;
    name: string;
    status: "Backlog" | "In Progress" | "In Review" | "Completed";
    tags: string[];
    dueDate?: string;
}
