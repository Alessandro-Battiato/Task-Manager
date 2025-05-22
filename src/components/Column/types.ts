import type { Task } from "../../types/task";
import type { Status } from "../Board/types";

export interface ColumnProps {
    status: Status;
    tasks: Task[];
}
