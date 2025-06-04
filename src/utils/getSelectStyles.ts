import type { StylesConfig } from "react-select";
import type { Option } from "../components/TaskForm/types";
import { vanillaTagStyles } from "../types/vanillaTagStyles";

export const getSelectStyles = (
    isDark: boolean,
    hasError?: boolean
): StylesConfig<Option, true> => ({
    control: (base, state) => {
        const baseColor = (() => {
            if (hasError) return "#ff637d";
            if (state.isFocused) return isDark ? "#60a5fa" : "#3b82f6";
            return isDark ? "#4b5563" : "#d1d5db";
        })();

        return {
            ...base,
            backgroundColor: "transparent",
            borderWidth: "1px",
            borderColor: baseColor,
            boxShadow: hasError
                ? "0 0 0 1px #ff637d"
                : state.isFocused
                ? `0 0 0 1px ${isDark ? "#60a5fa" : "#3b82f6"}`
                : undefined,
            minHeight: "2.5rem",
            "&:hover": {
                borderColor: baseColor,
            },
        };
    },

    singleValue: (base) => ({
        ...base,
        color: isDark ? "#ffffff" : "#111827",
    }),
    placeholder: (base) => ({
        ...base,
        color: isDark ? "#9ca3af" : "#6b7280",
    }),
    input: (base) => ({
        ...base,
        color: isDark ? "#ffffff" : "#111827",
    }),
    menu: (base) => ({
        ...base,
        backgroundColor: isDark ? "#1f2937" : "#ffffff",
        color: isDark ? "#ffffff" : "#111827",
    }),
    option: (base, { isFocused, isSelected }) => ({
        ...base,
        backgroundColor: isSelected
            ? isDark
                ? "#374151"
                : "#dbeafe"
            : isFocused
            ? isDark
                ? "#4b5563"
                : "#e0f2fe"
            : "transparent",
        color: isDark ? "#ffffff" : "#111827",
    }),
    multiValue: (base, { data }) => {
        const tag = vanillaTagStyles[data.label] || {
            bg: isDark ? "#4b5563" : "#e5e7eb",
            text: isDark ? "#ffffff" : "#111827",
        };

        return {
            ...base,
            backgroundColor: tag.bg,
            color: tag.text,
            borderRadius: "0.375rem",
            fontSize: "0.875rem",
            fontWeight: "500",
        };
    },
    multiValueLabel: (base, { data }) => {
        const labelKey = data.label as string;
        const tag = vanillaTagStyles[labelKey] || {
            text: isDark ? "#ffffff" : "#1f2937",
        };

        return {
            ...base,
            color: tag.text,
            padding: base.padding,
        };
    },
    multiValueRemove: (base) => ({
        ...base,
        borderTopRightRadius: "0.375rem",
        borderBottomRightRadius: "0.375rem",
    }),
});
