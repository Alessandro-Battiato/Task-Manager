import React from "react";
import type { TaskCardProps } from "./types";

const TaskCard: React.FC<TaskCardProps> = ({
    title,
    img = "https://cataas.com/cat",
    tags,
}) => (
    <div className="card rounded-2xl shadow bg-base-100">
        <div className="card-body gap-3 p-4">
            {!!img && (
                <img
                    className="object-cover w-full max-h-32 rounded-2xl"
                    src={img}
                    alt="Card image"
                />
            )}
            <h3 className="font-medium text-sm sm:text-lg">{title}</h3>
            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <span
                        key={tag}
                        className="badge badge-outline text-xs sm:text-sm"
                    >
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    </div>
);

export default TaskCard;
