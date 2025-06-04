import React, { useCallback, useMemo } from "react";
import { useFormContext, Controller } from "react-hook-form";
import Select from "react-select";
import { tagStyles } from "../../types/tagStyles";
import { statuses } from "../../data/statuses";
import { getSelectStyles } from "../../utils/getSelectStyles";
import { useGetTagsQuery } from "../../features/api/apiSlice";
import CustomSingleValue from "./CustomSingleValue";

const WORKSPACE_ID = import.meta.env.VITE_WORKSPACE_ID;

const TaskForm: React.FC = () => {
    const theme = localStorage.getItem("theme");
    const isDark = useMemo(() => theme === "dark", [theme]);

    const { data: tagsData, isLoading: tagsLoading } =
        useGetTagsQuery(WORKSPACE_ID);

    const {
        register,
        control,
        setValue,
        watch,
        formState: { errors },
    } = useFormContext();

    const image = watch("image") as File | null;

    const tagOptions = useMemo(() => {
        if (!tagsData?.data) return [];

        return tagsData.data
            .filter((tag) => tagStyles[tag.name])
            .map((tag) => ({
                label: tag.name,
                value: tag.gid,
            }));
    }, [tagsData]);

    const handleImageChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) setValue("image", file);
        },
        [setValue]
    );

    const handleRemoveImage = useCallback(() => {
        setValue("image", null);
    }, [setValue]);

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                {image ? (
                    <div className="relative">
                        <img
                            src={URL.createObjectURL(image)}
                            alt="Preview"
                            className="w-full h-24 object-cover rounded-md"
                        />
                        <button
                            type="button"
                            className="absolute cursor-pointer top-1 right-1 bg-error/20 text-white rounded-full p-1 hover:bg-error/90"
                            onClick={handleRemoveImage}
                            aria-label="Remove image"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                            </svg>
                        </button>
                    </div>
                ) : (
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="file-input w-full"
                    />
                )}
            </div>

            <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">
                    Task name
                </label>
                <input
                    {...register("taskName")}
                    type="text"
                    placeholder="Enter task name here"
                    className={`input bg-transparent text-base w-full font-light ${
                        errors.taskName ? "input-error" : ""
                    }`}
                />
                {errors.taskName && (
                    <p className="text-sm text-error mt-1">
                        {errors.taskName.message as string}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">
                    Status
                </label>
                <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                        <Select
                            options={statuses.map((status) => ({
                                label: status,
                                value: status,
                            }))}
                            value={
                                statuses
                                    .map((status) => ({
                                        label: status,
                                        value: status,
                                    }))
                                    .find((opt) => opt.value === field.value) ||
                                null
                            }
                            onChange={(selected) =>
                                field.onChange(
                                    (selected as unknown as { value: string })
                                        .value
                                )
                            }
                            styles={getSelectStyles(isDark)}
                            components={{
                                SingleValue: CustomSingleValue,
                            }}
                        />
                    )}
                />
                {errors.status && (
                    <p className="text-sm text-error mt-1">
                        {errors.status.message as string}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">
                    Tags
                </label>
                <Controller
                    name="tags"
                    control={control}
                    render={({ field }) => (
                        <Select
                            isMulti
                            isClearable={false}
                            options={tagOptions}
                            isLoading={tagsLoading}
                            placeholder="Select one or more tags"
                            value={tagOptions.filter((opt) =>
                                field.value?.includes(opt.value)
                            )}
                            onChange={(selected) =>
                                field.onChange(selected.map((opt) => opt.value))
                            }
                            onBlur={field.onBlur}
                            styles={getSelectStyles(isDark, !!errors.tags)}
                        />
                    )}
                />
                {errors.tags && (
                    <p className="text-sm text-error mt-1">
                        {errors.tags.message as string}
                    </p>
                )}
            </div>
        </div>
    );
};

export default TaskForm;
