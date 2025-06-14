import React from "react";
import type { ProjectButtonProps } from "./types";

const ProjectButton: React.FC<ProjectButtonProps> = ({
    cta,
    isSelected,
    isCreateButton = false,
    icon,
    onClick = () => {},
    onDeleteClick = () => {},
    "data-testid": dataTestId,
}) => {
    return (
        <button
            data-testid={dataTestId}
            className={`btn btn-ghost rounded-3xl border-2 w-full justify-start group ${
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

            <span className="flex-1 truncate text-left">{cta}</span>

            {!icon && (
                <span
                    data-testid={`${dataTestId}-delete-btn`}
                    onClick={(e) => {
                        e.stopPropagation();
                        onDeleteClick();
                    }}
                    className="ml-2 text-error cursor-pointer p-1 rounded-full hover:bg-error/10 transition-all items-center
                    lg:group-hover:opacity-100 lg:opacity-0
                "
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                    </svg>
                </span>
            )}
        </button>
    );
};

export default ProjectButton;
