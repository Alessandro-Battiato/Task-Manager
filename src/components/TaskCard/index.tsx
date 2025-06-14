import React, { useEffect, useRef, useState } from "react";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import type { TaskCardProps } from "./types";
import { tagStyles } from "../../types/tagStyles";
import DeleteButton from "../DeleteButton";

const style = (tag: string): { text: string; bg: string } =>
    tagStyles[tag] || {
        text: "text-neutral",
        bg: "bg-base-200",
    };

const TaskCard: React.FC<TaskCardProps> = ({
    taskId,
    title,
    img,
    tags,
    status,
    onClick,
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        return draggable({
            element,
            getInitialData: () => ({ taskId, status }),
            onDragStart: () => setIsDragging(true),
            onDrop: () => setIsDragging(false),
        });
    }, [taskId, status]);

    const handleClick = (e: React.MouseEvent) => {
        if (isDragging) return;

        e.preventDefault();
        e.stopPropagation();

        if (onClick) {
            onClick();
        }
    };

    return (
        <div
            ref={ref}
            onClick={handleClick}
            data-testid={`task-card-${taskId}`}
            className={`card rounded-2xl shadow bg-base-100 cursor-pointer transition-transform hover:scale-85 ${
                isDragging ? "opacity-50 rotate-2 scale-90" : ""
            }`}
        >
            <div className="card-body relative group gap-3 p-4">
                {!!img && (
                    <img
                        draggable="false"
                        className="object-cover w-full max-h-32 rounded-2xl pointer-events-none"
                        src={img}
                        alt="Card image"
                    />
                )}
                <h3 className="font-medium text-sm sm:text-lg truncate">
                    {title}
                </h3>
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => {
                        const tagStyle = style(tag.name);
                        return (
                            <span
                                key={tag.gid}
                                className={`badge font-semibold text-xs sm:text-sm ${tagStyle.text} ${tagStyle.bg}`}
                            >
                                {tag.name}
                            </span>
                        );
                    })}
                </div>
                <div className="absolute top-2 right-2">
                    <DeleteButton
                        // onClick={() => onDelete?.(taskId)}
                        data-testid={`delete-task-${taskId}`}
                        size="lg"
                    />
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
