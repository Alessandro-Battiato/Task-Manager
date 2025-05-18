import React, { useState } from "react";

type Project = { id: string; name: string };

const mockProjects: Project[] = [
    { id: "p1", name: "Design Board" },
    { id: "p2", name: "Learning Board" },
];

const Sidebar: React.FC<{
    projects: Project[];
    selectedId: string | null;
    onSelect: (id: string) => void;
}> = ({ selectedId, handleSelectId, toggle }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const [projects] = useState<Project[]>(mockProjects);

    const handleProjectSelect = (id: string) => {
        handleSelectId(id);
        if (isSidebarOpen) setSidebarOpen(false);
    };
    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    return (
        <>
            <header className="md:hidden flex items-center justify-between bg-base-200 p-4">
                <button
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
                <h1 className="text-lg font-bold">Tasks Manager</h1>
                <label className="flex cursor-pointer gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="12" cy="12" r="5" />
                        <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                    </svg>
                    <input
                        onClick={toggle}
                        type="checkbox"
                        className="toggle theme-controller"
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                </label>
            </header>

            <aside className="hidden md:flex w-60 bg-base-200 p-4 flex-col">
                <h2 className="text-lg font-bold mb-4">Projects</h2>
                <ul className="space-y-2 flex-1 overflow-auto">
                    {projects.map((p) => (
                        <li key={p.id}>
                            <button
                                className={`btn btn-ghost w-full justify-start ${
                                    selectedId === p.id
                                        ? "bg-primary text-primary-content"
                                        : ""
                                }`}
                                onClick={() => handleProjectSelect(p.id)}
                            >
                                {p.name}
                            </button>
                        </li>
                    ))}
                </ul>
                <div className="flex justify-center">
                    <div className="tabs tabs-box">
                        <label htmlFor="tab-dark" className="tab gap-2">
                            <svg
                                className="swap-on h-5 w-5 fill-current"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                            >
                                <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                            </svg>
                            <input
                                type="radio"
                                id="tab-dark"
                                name="theme_tabs"
                                onClick={toggle}
                            />
                            Dark
                        </label>
                        <label htmlFor="tab-light" className="tab gap-2">
                            <svg
                                className="swap-off h-5 w-5 fill-current"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                            >
                                <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                            </svg>
                            <input
                                type="radio"
                                id="tab-light"
                                name="theme_tabs"
                                onClick={toggle}
                            />
                            Light
                        </label>
                    </div>
                </div>
            </aside>

            {isSidebarOpen && (
                <div className="fixed inset-0 bg-base-200 bg-opacity-95 z-50 flex flex-col p-4 animate-fade-in">
                    <button
                        className="self-end btn btn-ghost btn-square"
                        onClick={toggleSidebar}
                    >
                        ✕
                    </button>
                    <h2 className="text-lg font-bold mb-4">Projects</h2>
                    <ul className="space-y-2 flex-1 overflow-auto">
                        {projects.map((p) => (
                            <li key={p.id}>
                                <button
                                    className={`btn btn-ghost w-full justify-start ${
                                        selectedId === p.id
                                            ? "bg-primary text-primary-content"
                                            : ""
                                    }`}
                                    onClick={() => handleProjectSelect(p.id)}
                                >
                                    {p.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
};

export default Sidebar;
