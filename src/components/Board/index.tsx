import React, { useEffect, useMemo } from "react";
import Lottie from "lottie-react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import emptyState from "../../assets/lottie/emptyState.json";
import type { BoardProps, Status } from "./types";
import { statuses } from "../../data/statuses";
import Column from "../Column";
import { useGetTasksQuery } from "../../features/api/apiSlice";
import Skeleton from "../Skeleton";
import { skeletonCount } from "../../data/skeletonCount";

const Board: React.FC<BoardProps> = ({ selectedId }) => {
    const { isLoading, error } = useGetTasksQuery(selectedId, {
        skip: !selectedId,
    });

    useEffect(() => {
        return monitorForElements({
            onDrop({ source, location }) {
                const destination = location.current.dropTargets[0];
                if (!destination) return;

                const taskId = source.data.taskId as string;
                const newStatus = destination.data.status as Status;

                // TO DO: Restore drag n drop feature once update request is implemented
            },
        });
    }, []);

    const showEmptyState = useMemo(() => !selectedId, [selectedId]);
    const showError = useMemo(() => selectedId && error, [error, selectedId]);
    const showSkeletons = useMemo(
        () => selectedId && isLoading && !error,
        [error, isLoading, selectedId]
    );
    const showColumns = useMemo(
        () => selectedId && !isLoading && !error,
        [error, isLoading, selectedId]
    );

    return (
        <main
            data-testid="board"
            className="flex-1 m-4 md:ml-0 p-4 bg-base-200 overflow-auto rounded-2xl"
        >
            {showEmptyState && (
                <div
                    data-testid="empty-state"
                    className="h-full flex flex-col items-center justify-center text-base-content"
                >
                    <Lottie
                        className="max-w-sm"
                        animationData={emptyState}
                        loop
                    />
                    <p>Create or select a Project to start</p>
                </div>
            )}

            {showError && (
                <div
                    data-testid="error-state"
                    className="h-full flex flex-col items-center justify-center text-base-content"
                >
                    <Lottie
                        className="max-w-sm"
                        animationData={emptyState}
                        loop
                    />
                    <p className="text-error">
                        Something went wrong while loading the tasks!
                    </p>
                </div>
            )}

            {(showSkeletons || showColumns) && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
                    {showSkeletons &&
                        skeletonCount.map((count, i) => (
                            <Skeleton key={i} count={count} />
                        ))}
                    {showColumns &&
                        statuses.map((status) => (
                            <Column
                                key={status}
                                status={status}
                                selectedId={selectedId}
                            />
                        ))}
                </div>
            )}
        </main>
    );
};

export default Board;
