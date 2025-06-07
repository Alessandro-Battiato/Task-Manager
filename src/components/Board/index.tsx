import React, { useEffect, useMemo, useState } from "react";
import Lottie from "lottie-react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import emptyState from "../../assets/lottie/emptyState.json";
import type { BoardProps, Status } from "./types";
import { statuses } from "../../data/statuses";
import Column from "../Column";
import {
    apiSlice,
    useGetTasksQuery,
    useMoveTaskToSectionMutation,
} from "../../features/api/apiSlice";
import Skeleton from "../Skeleton";
import { skeletonCount } from "../../data/skeletonCount";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../features/store";

const Board: React.FC<BoardProps> = ({ selectedId }) => {
    const {
        isLoading,
        isFetching,
        error,
        data: tasks,
    } = useGetTasksQuery(selectedId, {
        skip: !selectedId,
    });
    const [moveTaskToSection] = useMoveTaskToSectionMutation();
    const dispatch = useDispatch<AppDispatch>();

    const [isDragUpdateInProgress, setIsDragUpdateInProgress] = useState(false);

    useEffect(() => {
        return monitorForElements({
            onDrop({ source, location }) {
                const destination = location.current.dropTargets[0];
                if (!destination) return;

                const taskId = source.data.taskId as string;
                const startStatus = source.data.status as Status;
                const newStatus = destination.data.status as Status;
                const sectionId = destination.data.sectionId as string;

                if (startStatus === newStatus || !sectionId) return;

                setIsDragUpdateInProgress(true);

                const patchResult = dispatch(
                    apiSlice.util.updateQueryData(
                        "getTasks",
                        selectedId,
                        (draft) => {
                            const task = draft.data.find(
                                (t) => t.gid === taskId
                            );
                            if (task) {
                                task.memberships[0].section.name = newStatus;
                            }
                        }
                    )
                );

                moveTaskToSection({
                    taskId,
                    sectionId,
                    projectId: selectedId,
                })
                    .unwrap()
                    .catch(() => {
                        patchResult.undo();
                    });
            },
        });
    }, [dispatch, selectedId, tasks, moveTaskToSection]);

    useEffect(() => {
        if (!isFetching) {
            setIsDragUpdateInProgress(false);
        }
    }, [isFetching]);

    const showEmptyState = useMemo(() => !selectedId, [selectedId]);
    const showError = useMemo(() => selectedId && error, [error, selectedId]);

    const showSkeletons = useMemo(
        () => isLoading || (isFetching && !isDragUpdateInProgress),
        [isLoading, isFetching, isDragUpdateInProgress]
    );

    const showColumns = useMemo(
        () => !showSkeletons && !!tasks && !error,
        [showSkeletons, tasks, error]
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
                    {(!isFetching || isDragUpdateInProgress) &&
                        showColumns &&
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
