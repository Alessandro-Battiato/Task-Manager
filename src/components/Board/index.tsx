import React, { useEffect, useState, useMemo } from "react";
import Lottie from "lottie-react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import emptyState from "../../assets/lottie/emptyState.json";
import type { BoardProps, Status } from "./types";
import type { Task } from "../../types/task";
import { statuses } from "../../data/statuses";
import Column from "../Column";

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
        tags: ["Technical", "Front-End"],
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

const Board: React.FC<BoardProps> = ({ selectedId }) => {
    const [tasks, setTasks] = useState<Task[]>(mockTasks);

    const tasksByStatus = useMemo(
        () =>
            statuses.reduce((acc, status) => {
                acc[status] = tasks.filter((t) => t.status === status);
                return acc;
            }, {} as Record<Status, Task[]>),
        [tasks]
    );

    useEffect(() => {
        return monitorForElements({
            onDrop({ source, location }) {
                const destination = location.current.dropTargets[0];
                if (!destination) return;

                const taskId = source.data.taskId as string;
                const newStatus = destination.data.status as Status;

                setTasks((prevTasks) =>
                    prevTasks.map((task) =>
                        task.id === taskId
                            ? { ...task, status: newStatus }
                            : task
                    )
                );
            },
        });
    }, []);

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
                    {statuses.map((status) => (
                        <Column
                            key={status}
                            status={status}
                            tasks={tasksByStatus[status]}
                        />
                    ))}
                </div>
            )}
        </main>
    );
};

export default Board;
