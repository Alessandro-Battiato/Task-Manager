import React from "react";
import type { MobileHeaderProps } from "./types";

const MobileHeader: React.FC<MobileHeaderProps> = ({
    theme,
    onToggleSidebar,
    onToggleTheme,
}) => {
    return (
        <header
            data-testid="mobile-header"
            className="md:hidden flex items-center justify-between p-4"
        >
            <button
                data-testid="mobile-menu-button"
                className="btn btn-square btn-ghost"
                onClick={onToggleSidebar}
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
                    onClick={onToggleTheme}
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
    );
};

export default MobileHeader;
