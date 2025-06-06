import React from "react";
import type { MobileSidebarProps } from "./types";
import StateHandler from "./StateHandler";
import ProjectList from "./ProjectList";

const MobileSidebar: React.FC<MobileSidebarProps> = ({
    isOpen,
    selectedId,
    isLoading,
    error,
    onClose,
    onProjectSelect,
    onDeleteProject,
    isRequestLoading,
    onAddProject,
}) => {
    if (!isOpen) return null;

    return (
        <div
            data-testid="mobile-sidebar"
            className="fixed inset-0 md:hidden bg-base-100 z-50 flex flex-col p-4"
        >
            <button
                data-testid="close-sidebar-btn"
                className="self-end btn btn-ghost btn-square"
                onClick={onClose}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>

            <StateHandler isLoading={isLoading} error={error} isMobile />

            {!isLoading && !error && (
                <ProjectList
                    selectedId={selectedId}
                    onProjectSelect={onProjectSelect}
                    onDeleteProject={onDeleteProject}
                    isRequestLoading={isRequestLoading}
                    onAddProject={onAddProject}
                    isMobile
                />
            )}
        </div>
    );
};

export default MobileSidebar;
