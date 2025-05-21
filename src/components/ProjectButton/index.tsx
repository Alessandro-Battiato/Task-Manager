import React from "react";
import type { ProjectButtonProps } from "./types";

const ProjectButton: React.FC<ProjectButtonProps> = ({
    cta,
    isSelected,
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
            {cta}
        </button>
    );
};

export default ProjectButton;
