import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
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

export const useTaskForm = (initialValues?: Partial<TaskFormValues>) => {
    const form = useForm<TaskFormValues>({
        resolver: yupResolver(taskSchema) as Resolver<TaskFormValues, unknown>,
        defaultValues: {
            taskName: "",
            status: "Backlog",
            tags: [],
            image: undefined,
            ...initialValues,
        },
        mode: "onChange",
    });

    return form;
};
