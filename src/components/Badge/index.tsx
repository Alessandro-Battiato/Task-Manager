import React, { useMemo } from "react";
import { type BadgeProps } from "./types";
import { statusColorMap } from "../../types/statusColor";

const Badge: React.FC<BadgeProps> = ({ status }) => {
    const colorClass = useMemo(
        () => statusColorMap[status] || "badge-neutral",
        [status]
    );
    return <span className={`badge rounded-full h-2 p-1 ${colorClass}`} />;
};

export default Badge;
