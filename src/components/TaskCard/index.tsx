import React from "react";
import type { Task } from "./types";

const TaskCard: React.FC<{ task: Task }> = ({ task }) => (
    <div className="bg-gray-700 text-gray-100 rounded p-4 space-y-2">
        <h3 className="font-semibold">{task.name}</h3>
        <div className="flex flex-wrap gap-1">
            {task.tags.map((tag) => (
                <span
                    key={tag}
                    className="bg-blue-600 text-xs px-2 py-1 rounded-full"
                >
                    {tag}
                </span>
            ))}
        </div>
    </div>
);

export default TaskCard;
