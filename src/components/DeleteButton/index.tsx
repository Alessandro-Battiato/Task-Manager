import React, { useCallback } from "react";
import type { DeleteButtonProps } from "./types";

const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
};

const DeleteButton: React.FC<DeleteButtonProps> = ({
    onClick,
    "data-testid": dataTestId,
    className = "",
    size = "md",
}) => {
    const handleClick = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            onClick();
        },
        [onClick]
    );

    return (
        <button
            data-testid={dataTestId}
            onClick={handleClick}
            className={`text-error cursor-pointer p-1 rounded-full hover:bg-error/10 transition-all lg:group-hover:opacity-100 lg:opacity-0 ${className}`}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className={sizeClasses[size]}
                viewBox="0 0 24 24"
                fill="currentColor"
            >
                <path d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
            </svg>
        </button>
    );
};

export default DeleteButton;
