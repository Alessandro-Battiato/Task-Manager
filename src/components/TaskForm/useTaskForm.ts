import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback } from "react";
import {
    useCreateTaskMutation,
    useUploadAttachmentMutation,
    useGetProjectSectionsQuery,
} from "../../features/api/apiSlice";
import * as yup from "yup";

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
        .mixed<File>()
        .nullable()
        .notRequired()
        .test("fileSize", "The file is too large", (file) =>
            file ? file.size <= 5 * 1024 * 1024 : true
        ),
});

type TaskFormValues = yup.InferType<typeof taskSchema>;

interface UseTaskFormProps {
    projectId: string;
    onSuccess?: () => void;
    initialValues?: Partial<TaskFormValues>;
}

export const useTaskForm = ({
    projectId,
    onSuccess,
    initialValues,
}: UseTaskFormProps) => {
    const [createTask, { isLoading: isCreatingTask }] = useCreateTaskMutation();
    const [uploadAttachment, { isLoading: isUploadingAttachment }] =
        useUploadAttachmentMutation();

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

                if (formData.image && createdTaskResponse.data.gid) {
                    await uploadAttachment({
                        file: formData.image,
                        parent: createdTaskResponse.data.gid,
                    }).unwrap();
                }

                formMethods.reset({
                    taskName: "",
                    status: initialValues?.status || "Backlog",
                    tags: [],
                    image: null,
                });

                onSuccess?.();
            } catch (err) {
                console.error("Task creation failed:", err);
            }
        },
        [
            createTask,
            uploadAttachment,
            projectId,
            formMethods,
            sectionsData,
            initialValues?.status,
            onSuccess,
        ]
    );

    return {
        ...formMethods,
        handleCreateTaskSubmit,
        isCreatingTask:
            isCreatingTask || isUploadingAttachment || sectionsLoading,
    };
};
