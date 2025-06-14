import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import Badge from "../Badge";
import TaskCard from "../TaskCard";
import type { ColumnProps } from "./types";
import { useSelector } from "react-redux";
import {
    selectSectionIdByStatus,
    selectTasksByProjectId,
} from "../../features/api/selectors";
import AddTaskButton from "../AddTaskButton";
import TaskForm from "../TaskForm";
import { FormProvider } from "react-hook-form";
import { useTaskForm } from "../TaskForm/useTaskForm";
import Modal from "../Modal";
import type { Task } from "../../types/task";

const generateTestId = (status: string) => {
    return `column-${status.replace(/ /g, "")}`;
};

const Column: React.FC<ColumnProps> = ({ status, selectedId }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDraggedOver, setIsDraggedOver] = useState(false);
    const [editingTask, setEditingTask] = useState<Task>();
    const [taskToDelete, setTaskToDelete] = useState<Task>();

    const toggleModal = useCallback(() => {
        setIsModalOpen((prev) => !prev);
    }, []);

    const sectionId = useSelector(selectSectionIdByStatus(selectedId, status));
    const tasks = useSelector(selectTasksByProjectId(selectedId));

    const filteredTasks = useMemo(
        () =>
            tasks.filter((task) => task.memberships[0].section.name === status),
        [status, tasks]
    );

    const initialValues = useMemo(() => {
        if (editingTask) {
            return {
                taskName: editingTask.name,
                status: editingTask.memberships[0].section.name,
                tags: editingTask.tags.map((tag) => tag.gid),
                image: editingTask?.attachments?.[0]?.download_url,
                removeExistingImage: false,
            };
        }
        return {
            status,
            taskName: "",
            tags: [],
            image: null,
            removeExistingImage: false,
        };
    }, [editingTask, status]);

    const {
        getValues,
        handleSubmit,
        handleCreateTaskSubmit,
        handleUpdateTaskSubmit,
        handleDeleteTask,
        isCreatingTask,
        isDeletingTask,
        reset,
        watch,
        ...restFormMethods
    } = useTaskForm({
        projectId: selectedId,
        onSuccess: toggleModal,
        initialValues,
        isEditing: !!editingTask,
        taskId: editingTask?.gid,
        currentStatus: editingTask?.memberships[0].section.name,
        currentAttachmentId: editingTask?.attachments?.[0]?.gid,
    });

    const watchedValues = watch();

    const handleTaskCardClick = useCallback((task: Task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    }, []);

    const handleDeleteTaskCard = useCallback((task: Task) => {
        setTaskToDelete(task);
    }, []);

    const handleAddTaskClick = useCallback(() => {
        setEditingTask(undefined);
        setIsModalOpen(true);
    }, []);

    const hasChanges = useMemo(() => {
        if (!editingTask) return true;

        const currentValues = watchedValues;

        const nameChanged = currentValues.taskName !== initialValues.taskName;
        const statusChanged = currentValues.status !== initialValues.status;
        const tagsChanged =
            JSON.stringify(currentValues.tags?.sort()) !==
            JSON.stringify(initialValues.tags?.sort());

        const imageChanged = currentValues.image !== initialValues.image;
        const imageRemoved = currentValues.removeExistingImage;

        return (
            nameChanged ||
            statusChanged ||
            tagsChanged ||
            imageChanged ||
            imageRemoved
        );
    }, [
        editingTask,
        initialValues.image,
        initialValues.status,
        initialValues.tags,
        initialValues.taskName,
        watchedValues,
    ]);

    const onModalConfirmSubmit = useCallback(() => {
        if (editingTask) {
            handleSubmit(handleUpdateTaskSubmit)();
        } else {
            handleSubmit(handleCreateTaskSubmit)();
        }
    }, [
        editingTask,
        handleSubmit,
        handleUpdateTaskSubmit,
        handleCreateTaskSubmit,
    ]);

    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        return dropTargetForElements({
            element,
            getData: () => ({ status, sectionId }),
            onDragEnter: () => setIsDraggedOver(true),
            onDragLeave: () => setIsDraggedOver(false),
            onDrop: () => setIsDraggedOver(false),
        });
    }, [sectionId, status]);

    useEffect(() => {
        reset(initialValues);
    }, [editingTask, reset, initialValues]);

    const formProviderMethods = {
        getValues,
        handleSubmit,
        handleCreateTaskSubmit,
        handleUpdateTaskSubmit,
        isCreatingTask,
        reset,
        watch,
        ...restFormMethods,
    };

    return (
        <section
            ref={ref}
            data-testid={generateTestId(status)}
            className={`flex flex-col overflow-hidden gap-6 min-h-96 p-2 rounded-lg transition-colors ${
                isDraggedOver
                    ? "bg-primary/10 border-2 border-primary border-dashed"
                    : ""
            }`}
        >
            <div data-testid="status-badge" className="flex items-center gap-2">
                <Badge status={status} />
                <h3 className="text-lg font-semibold">
                    {status} ({filteredTasks.length})
                </h3>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                {filteredTasks.map((task) => (
                    <TaskCard
                        key={task.gid}
                        taskId={task.gid}
                        title={task.name}
                        tags={task.tags}
                        status={status}
                        img={task.attachments?.[0]?.download_url}
                        onClick={() => handleTaskCardClick(task)}
                        onDelete={() => handleDeleteTaskCard(task)}
                    />
                ))}

                {status === "Backlog" && (
                    <AddTaskButton onClick={handleAddTaskClick} />
                )}
            </div>

            <Modal
                title={editingTask ? "Edit Task" : "Task details"}
                isOpen={isModalOpen}
                onClose={toggleModal}
                isRequestLoading={
                    isCreatingTask || (!!editingTask && !hasChanges)
                }
                onConfirm={onModalConfirmSubmit}
                cancelButtonText="Cancel"
                submitButtonText={editingTask ? "Update" : "Save"}
                submitButtonProps={{
                    "data-testid": editingTask
                        ? "update-task-submit"
                        : "create-task-submit",
                }}
            >
                <FormProvider {...formProviderMethods}>
                    <TaskForm />
                </FormProvider>
            </Modal>

            <Modal
                isOpen={!!taskToDelete}
                onClose={() => setTaskToDelete(undefined)}
                onConfirm={() => taskToDelete && handleDeleteTask(taskToDelete)}
                isRequestLoading={isDeletingTask}
                title="Confirm Delete"
                submitButtonText="Confirm"
                submitButtonProps={{
                    "data-testid": "confirm-delete-btn",
                }}
                cancelButtonText="Cancel"
                cancelButtonProps={{
                    "data-testid": "cancel-delete-btn",
                }}
            >
                <p>
                    Are you sure you want to delete the task "
                    {taskToDelete?.name}"?
                </p>
            </Modal>
        </section>
    );
};

export default Column;
