import React from "react";
import ThemeSelector from "./ThemeSelector";
import ProjectList from "./ProjectList";
import StateHandler from "./StateHandler";
import type { DesktopSidebarProps } from "./types";

const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
    selectedId,
    isLoading,
    error,
    theme,
    onProjectSelect,
    onAddProject,
    onThemeChange,
}) => {
    return (
        <aside
            data-testid="sidebar"
            className="hidden md:flex w-60 min-w-72 p-4 flex-col"
        >
            <StateHandler isLoading={isLoading} error={error} />

            {!isLoading && !error && (
                <>
                    <ProjectList
                        selectedId={selectedId}
                        onProjectSelect={onProjectSelect}
                        onAddProject={onAddProject}
                    />
                </>
            )}

            <ThemeSelector theme={theme} onThemeChange={onThemeChange} />
        </aside>
    );
};

export default DesktopSidebar;
