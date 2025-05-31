import * as yup from "yup";

export const projectSchema = yup.object().shape({
    projectName: yup
        .string()
        .required("Project name is required")
        .min(5, "Project name must be at least 5 characters")
        .max(30, "Project name must be less than 30 characters"),
    logoIndex: yup
        .number()
        .required("Select a logo")
        .test("isValidIndex", "Select a logo", (value) => {
            return value !== null && value !== undefined && value >= 0;
        }),
});
