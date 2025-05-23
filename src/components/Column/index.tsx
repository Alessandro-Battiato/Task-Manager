import React, { useEffect, useMemo, useRef, useState } from "react";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import Badge from "../Badge";
import TaskCard from "../TaskCard";
import type { ColumnProps } from "./types";
import { useSelector } from "react-redux";
import { selectTasksByProjectId } from "../../features/api/selectors";

const Column: React.FC<ColumnProps> = ({ status, selectedId }) => {
    const [isDraggedOver, setIsDraggedOver] = useState(false);

    const tasks = useSelector(selectTasksByProjectId(selectedId));
    const filteredTasks = useMemo(
        () =>
            tasks.filter((task) => task.memberships[0].section.name === status),
        [status, tasks]
    );

    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        return dropTargetForElements({
            element,
            getData: () => ({ status }),
            onDragEnter: () => setIsDraggedOver(true),
            onDragLeave: () => setIsDraggedOver(false),
            onDrop: () => setIsDraggedOver(false),
        });
    }, [status]);

    return (
        <section
            ref={ref}
            className={`flex flex-col overflow-hidden gap-6 min-h-96 p-2 rounded-lg transition-colors ${
                isDraggedOver
                    ? "bg-primary/10 border-2 border-primary border-dashed"
                    : ""
            }`}
        >
            <div className="flex items-center gap-2">
                <Badge status={status} />
                <h3 className="text-lg font-semibold">
                    {status} ({tasks.length})
                </h3>
            </div>
            <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                {filteredTasks.map((task) => (
                    <TaskCard
                        key={task.gid}
                        taskId={task.gid}
                        title={task.name}
                        tags={task.tags}
                        status={status}
                    />
                ))}
            </div>
        </section>
    );
};

export default Column;
