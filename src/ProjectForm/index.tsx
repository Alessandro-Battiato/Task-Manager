import React from "react";
import { useFormContext } from "react-hook-form";

const logoOptions = [
    { color: "#FF6B6B", icon: "🛠️" },
    { color: "#4ECDC4", icon: "⚙️" },
    { color: "#45B7D1", icon: "🚀" },
    { color: "#96CEB4", icon: "🔑" },
    { color: "#FFEAA7", icon: "⏰" },
    { color: "#DDA0DD", icon: "🍄" },
    { color: "#98D8C8", icon: "👨‍🚀" },
    { color: "#F7DC6F", icon: "👀" },
    { color: "#BB8FCE", icon: "🔘" },
    { color: "#85C1E9", icon: "✈️" },
    { color: "#F8C471", icon: "👨‍💻" },
    { color: "#82E0AA", icon: "⭐" },
    { color: "#F1948A", icon: "📚" },
];

const ProjectForm: React.FC = () => {
    const {
        watch,
        register,
        setValue,
        formState: { errors },
    } = useFormContext();

    const selectedIdx = watch("logoIndex");

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
                    type="hidden"
                    {...register("logoIndex", {
                        required: "Select a logo",
                    })}
                />
                <div className="grid grid-cols-5 sm:grid-cols-8 gap-2">
                    {logoOptions.map((option, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() =>
                                setValue("logoIndex", idx, {
                                    shouldValidate: true,
                                })
                            }
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
