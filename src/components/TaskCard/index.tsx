import React from "react";
import type { TaskCardProps } from "./types";
import { statuses } from "../../data/statuses";
import { tagStyles } from "../../types/tagStyles";

const style = (tag: string): { text: string; bg: string } =>
    tagStyles[tag] || {
        text: "text-neutral",
        bg: "bg-base-200",
    };

const TaskCard: React.FC<TaskCardProps> = ({
    title,
    img,
    tags,
    status,
    onClick,
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
                {tags.map((tag) => {
                    const tagStyle = style(tag);
                    return (
                        <span
                            key={tag}
                            className={`badge font-semibold text-xs sm:text-sm ${tagStyle.text} ${tagStyle.bg}`}
                        >
                            {tag}
                        </span>
                    );
                })}
            </div>
            <select
                className="select w-fit mt-2 md:hidden"
                value={status}
                onChange={(e) => onClick(e.target.value)}
            >
                {statuses.map((el) => (
                    <option disabled={el === status} key={el} value={el}>
                        {el}
                    </option>
                ))}
            </select>
        </div>
    </div>
);

export default TaskCard;
