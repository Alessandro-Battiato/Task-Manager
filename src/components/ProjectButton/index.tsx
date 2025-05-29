import React from "react";
import type { ProjectButtonProps } from "./types";

const ProjectButton: React.FC<ProjectButtonProps> = ({
    cta,
    isSelected,
    isCreateButton = false,
    icon,
    onClick,
}) => {
    return (
        <button
            className={`btn btn-ghost rounded-3xl border-2 w-full justify-start ${
                isSelected
                    ? "border-primary"
                    : "hover:border-transparent focus:border-transparent"
            }`}
            onClick={onClick}
        >
            {icon && (
                <span
                    className={`rounded-full mr-1 ${
                        isCreateButton ? "bg-base-content text-base-100" : "p-1"
                    }`}
                >
                    {icon}
                </span>
            )}

            <span>{cta}</span>
        </button>
    );
};

export default ProjectButton;
