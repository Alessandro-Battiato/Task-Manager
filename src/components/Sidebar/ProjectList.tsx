import React from "react";
import ProjectButton from "../ProjectButton";
import type { ProjectListProps } from "./types";
import { useGetProjectsQuery } from "../../features/api/apiSlice";

const WORKSPACE_ID = import.meta.env.VITE_WORKSPACE_ID;

const ProjectList: React.FC<ProjectListProps> = ({
    selectedId,
    onProjectSelect,
    onAddProject,
    isMobile = false,
}) => {
    const { data } = useGetProjectsQuery(WORKSPACE_ID);

    return (
        <>
            <h2 className="text-lg font-bold mb-4">Projects</h2>
            <ul
                data-testid={isMobile ? "mobile-project-list" : "project-list"}
                className="space-y-2 flex-1 overflow-auto"
            >
                {(data?.data ?? []).map((p) => (
                    <li data-testid={p.gid} key={p.gid}>
                        <ProjectButton
                            {...(isMobile && {
                                "data-testid": `project-${p.gid}`,
                            })}
                            onClick={() => onProjectSelect(p.gid)}
                            isSelected={selectedId === p.gid}
                            cta={p.name}
                        />
                    </li>
                ))}

                <ProjectButton
                    onClick={onAddProject}
                    data-testid={
                        isMobile
                            ? "create-project-btn-mobile"
                            : "create-project-btn-desktop"
                    }
                    cta="Add new Project"
                    isSelected={false}
                    isCreateButton
                    icon={
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                    }
                />
            </ul>
        </>
    );
};

export default ProjectList;
