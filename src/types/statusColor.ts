import type { Status } from "../components/Board/types";

export const statusColorMap: Record<Status, string> = {
    Backlog: "badge-primary",
    "In Progress": "badge-warning",
    "In Review": "badge-info",
    Completed: "badge-success",
};
