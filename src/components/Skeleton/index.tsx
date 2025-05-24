import React from "react";
import type { SkeletonProps } from "./SkeletonProps";

const Skeleton: React.FC<SkeletonProps> = ({ count }) => (
    <div
        data-testid="loading-skeleton"
        className="bg-base-100 p-4 rounded-xl shadow space-y-2"
    >
        <div className="font-bold text-lg">Loading...</div>
        {Array.from({ length: count }).map((_, index) => (
            <div key={index} className="skeleton h-24 w-full rounded-xl" />
        ))}
    </div>
);

export default Skeleton;
