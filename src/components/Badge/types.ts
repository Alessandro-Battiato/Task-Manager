import type { Status } from "../Board/types";

export const statusColorMap: Record<Status, string> = {
    Backlog: "badge-primary",
    "In Progress": "badge-warning",
    "In Review": "badge-info",
    Completed: "badge-success",
};

export interface BadgeProps {
    status: Status;
}
