import React from "react";

export interface ProjectButtonProps {
    cta: string;
    onClick: () => void;
    isSelected: boolean;
    icon?: React.ReactNode;
    isCreateButton?: boolean;
    "data-testid"?: string;
}
