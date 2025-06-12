import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback } from "react";
import {
    useCreateTaskMutation,
    useUpdateTaskMutation,
    useMoveTaskToSectionMutation,
    useUploadAttachmentMutation,
    useRemoveAttachmentMutation,
    useGetProjectSectionsQuery,
    useAddTagToTaskMutation,
    useRemoveTagFromTaskMutation,
    apiSlice,
} from "../../features/api/apiSlice";
import * as yup from "yup";
import { useDispatch } from "react-redux";

const taskSchema = yup.object({
    taskName: yup
        .string()
        .required("Task name is required")
        .max(100, "Task name must be at most 100 characters"),
    status: yup.string().required("Status is required"),
    tags: yup
        .array()
        .of(yup.string().required())
        .min(4, "At least 4 tags are required"),
    image: yup
        .mixed()
        .nullable()
        .notRequired()
        .test(
            "is-valid-image",
            "Image must be a valid file or a string URL",
            (value) => {
                return (
                    !value || typeof value === "string" || value instanceof File
                );
            }
        )
        .test(
            "fileSize",
            "The file is too large (max 5MB)",
            (file) =>
                !file || !(file instanceof File) || file.size <= 5 * 1024 * 1024
        ),
    removeExistingImage: yup.boolean().default(false),
});

type TaskFormValues = yup.InferType<typeof taskSchema>;

interface UseTaskFormProps {
    projectId: string;
    onSuccess?: () => void;
    initialValues?: Partial<TaskFormValues>;
    isEditing?: boolean;
    taskId?: string;
    currentStatus?: string;
    currentAttachmentId?: string;
}

export const useTaskForm = ({
    projectId,
    onSuccess,
    initialValues,
    isEditing = false,
    taskId,
    currentStatus,
    currentAttachmentId,
}: UseTaskFormProps) => {
    const dispatch = useDispatch();

    const [createTask, { isLoading: isCreatingTask }] = useCreateTaskMutation();
    const [updateTask, { isLoading: isUpdatingTask }] = useUpdateTaskMutation();
    const [moveTaskToSection, { isLoading: isMovingTask }] =
        useMoveTaskToSectionMutation();
    const [uploadAttachment, { isLoading: isUploadingAttachment }] =
        useUploadAttachmentMutation();
    const [removeAttachment, { isLoading: isRemovingAttachment }] =
        useRemoveAttachmentMutation();
    const [addTagToTask, { isLoading: isAddingTag }] =
        useAddTagToTaskMutation();
    const [removeTagFromTask, { isLoading: isRemovingTag }] =
        useRemoveTagFromTaskMutation();

    const handleTagsUpdate = useCallback(
        async (newTags: string[], taskId: string, projectId: string) => {
            if (!initialValues?.tags) return;

            const currentTags = initialValues.tags;
            const newTagsSet = new Set(newTags);
            const currentTagsSet = new Set(currentTags);

            const tagsToAdd = newTags.filter((tag) => !currentTagsSet.has(tag));
            const tagsToRemove = currentTags.filter(
                (tag) => !newTagsSet.has(tag)
            );

            const tagOperations = [
                ...tagsToAdd.map((tagId) =>
                    addTagToTask({
                        taskId,
                        tagId,
                        projectId,
                    })
                        .unwrap()
                        .catch((error) => {
                            console.error(`Failed to add tag ${tagId}:`, error);
                            throw error;
                        })
                ),
                ...tagsToRemove.map((tagId) =>
                    removeTagFromTask({
                        taskId,
                        tagId,
                        projectId,
                    })
                        .unwrap()
                        .catch((error) => {
                            console.error(
                                `Failed to remove tag ${tagId}:`,
                                error
                            );
                            throw error;
                        })
                ),
            ];

            if (tagOperations.length > 0) {
                await Promise.all(tagOperations);
            }
        },
        [addTagToTask, initialValues?.tags, removeTagFromTask]
    );

    const handleImageUpdate = useCallback(
        async (formData: TaskFormValues, taskId: string, projectId: string) => {
            const hasNewImage = formData.image instanceof File;
            const shouldRemoveExisting = formData.removeExistingImage;
            const hasExistingImage = !!currentAttachmentId;

            if (hasNewImage) {
                if (hasExistingImage) {
                    await removeAttachment({
                        attachmentId: currentAttachmentId,
                        projectId,
                    }).unwrap();
                }

                if (!(formData.image instanceof File)) {
                    console.error("Error: Invalid file format");
                    return;
                }

                await uploadAttachment({
                    file: formData.image,
                    parent: taskId,
                    projectId,
                }).unwrap();
                return;
            }

            if (!hasNewImage && hasExistingImage && shouldRemoveExisting) {
                await removeAttachment({
                    attachmentId: currentAttachmentId,
                    projectId,
                }).unwrap();
                return;
            }
        },
        [currentAttachmentId, removeAttachment, uploadAttachment]
    );

    const { data: sectionsData, isLoading: sectionsLoading } =
        useGetProjectSectionsQuery(projectId, {
            skip: !projectId,
        });

    const formMethods = useForm<TaskFormValues>({
        resolver: yupResolver(taskSchema) as Resolver<TaskFormValues, unknown>,
        defaultValues: {
            taskName: "",
            status: "Backlog",
            tags: [],
            image: null,
            removeExistingImage: false,
            ...initialValues,
        },
        mode: "onChange",
    });

    const handleCreateTaskSubmit = useCallback(
        async (formData: TaskFormValues) => {
            if (!sectionsData?.data) {
                console.error(
                    "Project sections not loaded. Cannot create task."
                );
                return;
            }

            const targetSection = sectionsData.data.find(
                (section) => section.name === formData.status
            );

            if (!targetSection) {
                console.error(
                    `Section named "${formData.status}" not found in project ${projectId}.`
                );
                return;
            }
            const sectionGid = targetSection.gid;

            try {
                const taskApiPayload = {
                    name: formData.taskName,
                    tags: formData.tags,
                    memberships: [
                        {
                            project: projectId,
                            section: sectionGid,
                        },
                    ],
                };

                const createdTaskResponse = await createTask({
                    projectId: projectId,
                    taskData: taskApiPayload,
                }).unwrap();

                if (
                    formData.image instanceof File &&
                    createdTaskResponse.data.gid
                ) {
                    await uploadAttachment({
                        file: formData.image,
                        parent: createdTaskResponse.data.gid,
                        projectId,
                    }).unwrap();
                }

                formMethods.reset({
                    taskName: "",
                    status: formData.status,
                    tags: [],
                    image: null,
                    removeExistingImage: false,
                });

                onSuccess?.();
            } catch (err) {
                console.error("Task creation failed:", err);
            } finally {
                dispatch(
                    apiSlice.util.invalidateTags([{ type: "Task", id: "LIST" }])
                );
            }
        },
        [
            createTask,
            uploadAttachment,
            projectId,
            formMethods,
            sectionsData,
            onSuccess,
            dispatch,
        ]
    );

    const handleUpdateTaskSubmit = useCallback(
        async (formData: TaskFormValues) => {
            if (!taskId || !sectionsData?.data) {
                console.error("Task ID or sections data missing for update");
                return;
            }

            try {
                const updatePromises = [];

                updatePromises.push(
                    updateTask({
                        taskId,
                        taskData: { name: formData.taskName },
                        projectId,
                    }).unwrap()
                );

                if (currentStatus && formData.status !== currentStatus) {
                    const targetSection = sectionsData.data.find(
                        (section) => section.name === formData.status
                    );
                    if (targetSection) {
                        updatePromises.push(
                            moveTaskToSection({
                                sectionId: targetSection.gid,
                                taskId,
                                projectId,
                            }).unwrap()
                        );
                    }
                }

                if (formData.tags) {
                    updatePromises.push(
                        handleTagsUpdate(formData.tags, taskId, projectId)
                    );
                }

                updatePromises.push(
                    handleImageUpdate(formData, taskId, projectId)
                );

                await Promise.all(updatePromises);

                onSuccess?.();
            } catch (err) {
                console.error("Task update failed:", err);
                throw err;
            } finally {
                dispatch(
                    apiSlice.util.invalidateTags([{ type: "Task", id: "LIST" }])
                );
            }
        },
        [
            taskId,
            sectionsData?.data,
            updateTask,
            projectId,
            currentStatus,
            onSuccess,
            moveTaskToSection,
            handleTagsUpdate,
            handleImageUpdate,
            dispatch,
        ]
    );

    const handleSubmit = useCallback(
        (onSubmit: (data: TaskFormValues) => void) => {
            return formMethods.handleSubmit(onSubmit);
        },
        [formMethods]
    );

    return {
        ...formMethods,
        handleCreateTaskSubmit,
        handleUpdateTaskSubmit,
        handleSubmit,
        isCreatingTask:
            isCreatingTask ||
            isUpdatingTask ||
            isMovingTask ||
            isUploadingAttachment ||
            isRemovingAttachment ||
            isAddingTag ||
            isRemovingTag ||
            sectionsLoading,
        isEditing,
    };
};
