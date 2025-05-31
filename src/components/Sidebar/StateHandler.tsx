import React from "react";
import type { StateHandlerProps } from "./types";

const StateHandler: React.FC<StateHandlerProps> = ({
    isLoading,
    error,
    isMobile = false,
}) => {
    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <span
                    data-testid={
                        isMobile
                            ? "mobile-projects-loading"
                            : "projects-loading"
                    }
                    className="loading loading-spinner loading-lg"
                />
            </div>
        );
    }

    if (error) {
        return (
            <div
                data-testid={
                    isMobile ? "mobile-projects-error" : "projects-error"
                }
                className={`flex-1 flex ${
                    isMobile ? "flex-col" : ""
                } justify-center items-center text-error`}
            >
                <p className="font-semibold mb-2">Failed to load projects</p>
            </div>
        );
    }

    return null;
};

export default StateHandler;
