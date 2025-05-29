import * as yup from "yup";
import { noEmojiRegex } from "../validations/regex";

export const projectSchema = yup.object({
    projectName: yup
        .string()
        .required("Project name is required")
        .min(5, "Project name must be at least 5 characters")
        .max(50, "Project name must be less than 50 characters")
        .matches(noEmojiRegex, "Project name must not contain emojis"),
    logo: yup.string().required("Please select a logo"),
});
