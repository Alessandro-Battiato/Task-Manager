import React, { useMemo } from "react";
import { statusColorMap, type BadgeProps } from "./types";

const Badge: React.FC<BadgeProps> = ({ status }) => {
    const colorClass = useMemo(
        () => statusColorMap[status] || "badge-neutral",
        [status]
    );
    return <span className={`badge rounded-full h-2 p-1 ${colorClass}`} />;
};

export default Badge;
