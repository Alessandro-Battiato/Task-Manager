import React, { useCallback, useState, useMemo } from "react";
import type { SidebarProps } from "./types";
import ProjectButton from "../ProjectButton";
import { useGetProjectsQuery } from "../../features/api/apiSlice";

const WORKSPACE_ID = import.meta.env.VITE_WORSKPACE_ID;

const Sidebar: React.FC<SidebarProps> = ({
    selectedId,
    handleSelectId,
    toggle,
    theme,
}) => {
    const { data, isLoading, error } = useGetProjectsQuery(WORKSPACE_ID);

    const projects = useMemo(() => data?.data, [data]) ?? [];

    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const handleProjectSelect = useCallback(
        (id: string) => {
            handleSelectId(id);
            if (isSidebarOpen) setSidebarOpen(false);
        },
        [handleSelectId, isSidebarOpen]
    );

    const toggleSidebar = useCallback(
        () => setSidebarOpen(!isSidebarOpen),
        [isSidebarOpen]
    );

    // Direct theme set instead of toggle to ensure proper behavior
    const setTheme = useCallback(
        (newTheme: string) => {
            if (newTheme !== theme) {
                toggle();
            }
        },
        [theme, toggle]
    );

    return (
        <>
            <header
                data-testid="mobile-header"
                className="md:hidden flex items-center justify-between p-4"
            >
                <button
                    data-testid="mobile-menu-button"
                    className="btn btn-square btn-ghost"
                    onClick={toggleSidebar}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>
                <label className="toggle text-base-content">
                    <input
                        data-testid="mobile-theme-toggle"
                        type="checkbox"
                        defaultChecked={theme === "light"}
                        className="theme-controller"
                        onClick={toggle}
                    />
                    <svg
                        aria-label="sun"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                    >
                        <g
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            strokeWidth="2"
                            fill="none"
                            stroke="currentColor"
                        >
                            <circle cx="12" cy="12" r="4"></circle>
                            <path d="M12 2v2"></path>
                            <path d="M12 20v2"></path>
                            <path d="m4.93 4.93 1.41 1.41"></path>
                            <path d="m17.66 17.66 1.41 1.41"></path>
                            <path d="M2 12h2"></path>
                            <path d="M20 12h2"></path>
                            <path d="m6.34 17.66-1.41 1.41"></path>
                            <path d="m19.07 4.93-1.41 1.41"></path>
                        </g>
                    </svg>
                    <svg
                        aria-label="moon"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                    >
                        <g
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            strokeWidth="2"
                            fill="none"
                            stroke="currentColor"
                        >
                            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                        </g>
                    </svg>
                </label>
            </header>

            <aside
                data-testid="sidebar"
                className="hidden md:flex w-60 min-w-72 p-4 flex-col"
            >
                {isLoading || error ? (
                    <div className="flex-1 flex items-center justify-center">
                        {isLoading ? (
                            <span
                                data-testid="projects-loading"
                                className="loading loading-spinner loading-lg"
                            ></span>
                        ) : (
                            <p
                                data-testid="projects-error"
                                className="text-error font-semibold"
                            >
                                Failed to load projects
                            </p>
                        )}
                    </div>
                ) : (
                    <>
                        <h2 className="text-lg font-bold mb-4">Projects</h2>
                        <ul
                            data-testid="projects-list"
                            className="space-y-2 flex-1 overflow-auto"
                        >
                            {projects.map((p) => (
                                <li data-testid={p.gid} key={p.gid}>
                                    <ProjectButton
                                        onClick={() =>
                                            handleProjectSelect(p.gid)
                                        }
                                        isSelected={selectedId === p.gid}
                                        cta={p.name}
                                    />
                                </li>
                            ))}
                        </ul>
                    </>
                )}
                <div className="flex justify-center">
                    <div className="tabs tabs-box w-full rounded-xl">
                        <label
                            htmlFor="tab-dark"
                            className="tab font-semibold gap-2 flex-1 !rounded-lg"
                        >
                            <svg
                                className="h-5 w-5 fill-current"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                            >
                                <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                            </svg>
                            <input
                                data-testid="theme-dark"
                                type="radio"
                                id="tab-dark"
                                name="theme_tabs"
                                checked={theme === "dark"}
                                onChange={() => setTheme("dark")}
                            />
                            Dark
                        </label>
                        <label
                            htmlFor="tab-light"
                            className="tab font-semibold gap-2 flex-1 !rounded-lg"
                        >
                            <svg
                                className="h-5 w-5 fill-current"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                            >
                                <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                            </svg>
                            <input
                                data-testid="theme-light"
                                type="radio"
                                id="tab-light"
                                name="theme_tabs"
                                checked={theme === "light"}
                                onChange={() => setTheme("light")}
                            />
                            Light
                        </label>
                    </div>
                </div>
            </aside>

            {isSidebarOpen && (
                <div
                    data-testid="mobile-sidebar"
                    className="fixed inset-0 bg-base-200 z-50 flex flex-col p-4"
                >
                    <button
                        data-testid="close-sidebar-btn"
                        className="self-end btn btn-ghost btn-square"
                        onClick={toggleSidebar}
                    >
                        ✕
                    </button>
                    {isLoading ? (
                        <div className="flex-1 flex justify-center items-center">
                            <span
                                data-testid="mobile-projects-loading"
                                className="loading loading-spinner loading-lg"
                            ></span>
                        </div>
                    ) : error ? (
                        <div
                            data-testid="mobile-projects-error"
                            className="flex-1 flex flex-col justify-center items-center text-error"
                        >
                            <p className="font-semibold mb-2">
                                Failed to load projects
                            </p>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-lg font-bold mb-4">Projects</h2>
                            <ul className="space-y-2 flex-1 overflow-auto">
                                {projects.map((p) => (
                                    <li data-testid={p.gid} key={p.gid}>
                                        <ProjectButton
                                            data-testid={`project-${p.gid}`}
                                            onClick={() =>
                                                handleProjectSelect(p.gid)
                                            }
                                            isSelected={selectedId === p.gid}
                                            cta={p.name}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            )}
        </>
    );
};

export default Sidebar;
