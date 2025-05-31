import React, { useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { logoOptions } from "../const/logoOptions";

const ProjectForm: React.FC = () => {
    const {
        watch,
        register,
        setValue,
        formState: { errors },
    } = useFormContext();

    const selectedIdx = watch("logoIndex");

    const handleLogoSelect = useCallback(
        (idx: number) => {
            setValue("logoIndex", idx, { shouldValidate: true });
        },
        [setValue]
    );

    return (
        <div className="space-y-6">
            <div>
                <label
                    htmlFor="projectName"
                    className="block text-xs font-medium text-gray-400 mb-2"
                >
                    Project name
                </label>
                <input
                    {...register("projectName")}
                    id="projectName"
                    type="text"
                    placeholder="e.g Default Project"
                    className={`
                        w-full px-3 py-2 border rounded-xl placeholder:text-gray-600
                        focus:outline-none focus:ring-2 focus:ring-blue-500
                        ${
                            errors.projectName
                                ? "border-error"
                                : "border-gray-600"
                        }
                    `}
                />
                {errors.projectName && (
                    <p className="mt-1 text-sm text-error">
                        {errors.projectName?.message as string}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-xs font-medium text-gray-400 mb-3">
                    Logo
                </label>
                <input
                    {...register("logoIndex", { valueAsNumber: true })}
                    type="hidden"
                />
                <div className="grid grid-cols-5 sm:grid-cols-8 gap-2">
                    {logoOptions.map((option, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => handleLogoSelect(idx)}
                            className={`
                                flex cursor-pointer items-center justify-center w-8 h-8 text-base rounded-full
                                transition-all duration-200 hover:scale-110
                                ${
                                    selectedIdx === idx
                                        ? "ring-2 ring-white ring-offset-2 ring-offset-gray-800"
                                        : "hover:ring-1 hover:ring-gray-400"
                                }
                            `}
                            style={{ backgroundColor: option.color }}
                            aria-label={`Select logo ${option.icon}`}
                        >
                            {option.icon}
                        </button>
                    ))}
                </div>
                {errors.logoIndex && (
                    <p className="mt-2 text-sm text-error">
                        {errors.logoIndex?.message as string}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ProjectForm;
