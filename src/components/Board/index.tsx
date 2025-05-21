import React from "react";
import Lottie from "lottie-react";
import emptyState from "../../assets/lottie/emptyState.json";
import type { BoardProps, Status } from "./types";
import type { Task } from "../../types/task";
import Badge from "../Badge";
import TaskCard from "../TaskCard";

const mockTasks: Task[] = [
    {
        id: "t1",
        name: "Implement CRUD operations",
        status: "Backlog",
        tags: ["Technical"],
    },
    {
        id: "t2",
        name: "Investigate Framer-Motion",
        status: "Backlog",
        tags: ["Concept"],
    },
    {
        id: "t3",
        name: "Implement edit task",
        status: "In Progress",
        tags: ["Technical", "Front-end"],
    },
    {
        id: "t4",
        name: "Implement delete task",
        status: "In Review",
        tags: ["Technical"],
    },
    {
        id: "t5",
        name: "Create component skeleton",
        status: "Completed",
        tags: ["Design"],
    },
];

const statuses: Status[] = ["Backlog", "In Progress", "In Review", "Completed"];

const tasksByStatus = statuses.reduce((acc, status) => {
    acc[status] = mockTasks.filter((t) => t.status === status);
    return acc;
}, {} as Record<Status, Task[]>);

const Board: React.FC<BoardProps> = ({ selectedId }) => {
    return (
        <main className="flex-1 m-4 md:ml-0 p-4 bg-base-200 overflow-auto rounded-2xl">
            {!selectedId ? (
                <div className="h-full flex flex-col items-center justify-center text-base-content">
                    <Lottie
                        className="max-w-sm"
                        animationData={emptyState}
                        loop
                    />
                    <p>Create or select a Project to start</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
                    {statuses.map((status) => (
                        <section
                            key={status}
                            className="flex flex-col overflow-hidden gap-6"
                        >
                            <div className="flex items-center gap-2">
                                <Badge status={status} />
                                <h3 className="text-lg font-semibold">
                                    {status} ({tasksByStatus[status].length})
                                </h3>
                            </div>
                            <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                                {tasksByStatus[status].map((task) => (
                                    <TaskCard
                                        key={task.id}
                                        title={task.name}
                                        tags={task.tags}
                                    />
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            )}
        </main>
    );
};

export default Board;
