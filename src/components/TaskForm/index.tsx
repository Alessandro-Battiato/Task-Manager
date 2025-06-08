import React, { useCallback, useMemo } from "react";
import { useFormContext, Controller } from "react-hook-form";
import Select from "react-select";
import { tagStyles } from "../../types/tagStyles";
import { statuses } from "../../data/statuses";
import { getSelectStyles } from "../../utils/getSelectStyles";
import { useGetTagsQuery } from "../../features/api/apiSlice";
import CustomSingleValue from "./CustomSingleValue";
import CustomOption from "./CustomOption";

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

    const image = watch("image") as File | string | null;
    const removeExistingImage = watch("removeExistingImage");

    const tagOptions = useMemo(() => {
        if (!tagsData?.data) return [];
        return tagsData.data
            .filter((tag) => tagStyles[tag.name])
            .map((tag) => ({
                label: tag.name,
                value: tag.gid,
                dataTestId: tag.name,
            }));
    }, [tagsData]);

    const handleImageChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                setValue("image", file);
                setValue("removeExistingImage", false); // Reset remove flag quando si seleziona una nuova immagine
            }
        },
        [setValue]
    );

    const handleRemoveImage = useCallback(() => {
        const currentImage = watch("image");

        if (typeof currentImage === "string") {
            setValue("removeExistingImage", true);
        }

        setValue("image", null);
    }, [setValue, watch]);

    const shouldShowImage = image && !removeExistingImage;

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                {shouldShowImage ? (
                    <div className="relative">
                        <img
                            data-testid="image-preview"
                            src={
                                typeof image === "string"
                                    ? image
                                    : URL.createObjectURL(image as File)
                            }
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
                        data-testid="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="file-input w-full"
                    />
                )}
            </div>

            <div>
                <label
                    htmlFor="taskName"
                    className="block text-xs font-medium text-gray-400 mb-2"
                >
                    Task name
                </label>
                <input
                    {...register("taskName")}
                    name="taskName"
                    id="taskName"
                    data-testid="task-name-input"
                    type="text"
                    placeholder="Enter task name here"
                    className={`input bg-transparent text-base w-full font-light ${
                        errors.taskName ? "input-error" : ""
                    }`}
                />
                {errors.taskName && (
                    <p
                        data-testid="task-name-input-error"
                        className="text-sm text-error mt-1"
                    >
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
                        <div data-testid="status-select">
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
                                        .find(
                                            (opt) => opt.value === field.value
                                        ) || null
                                }
                                onChange={(selected) =>
                                    field.onChange(
                                        (
                                            selected as unknown as {
                                                value: string;
                                            }
                                        )?.value
                                    )
                                }
                                styles={getSelectStyles(isDark)}
                                components={{
                                    SingleValue: CustomSingleValue,
                                    Option: CustomOption,
                                }}
                            />
                        </div>
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
                        <div data-testid="tags-select">
                            <Select
                                isMulti
                                isClearable={false}
                                options={tagOptions}
                                isLoading={tagsLoading}
                                placeholder="Select one or more tags"
                                value={tagOptions.filter(
                                    (opt) =>
                                        Array.isArray(field.value) &&
                                        field.value.includes(opt.value)
                                )}
                                onChange={(selected) => {
                                    const values = selected
                                        ? selected.map((opt) => opt.value)
                                        : [];
                                    field.onChange(values);
                                }}
                                onBlur={field.onBlur}
                                styles={getSelectStyles(isDark, !!errors.tags)}
                                components={{
                                    Option: CustomOption,
                                }}
                            />
                        </div>
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
