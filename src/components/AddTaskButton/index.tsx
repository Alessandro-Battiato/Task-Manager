import React from "react";
import type { AddTaskButtonProps } from "./types";

const AddTaskButton: React.FC<AddTaskButtonProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="
                btn bg-[#D6E2F7] hover:bg-[#C0D3F2] 
                border-none text-primary font-semibold 
                rounded-xl shadow-md
                text-base
                flex items-center justify-between 
                w-full
            "
        >
            <span className="truncate">Add new task card</span>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                />
            </svg>
        </button>
    );
};

export default AddTaskButton;
