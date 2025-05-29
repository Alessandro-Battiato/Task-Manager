import React from "react";
import { useFormContext, Controller } from "react-hook-form";

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
        control,
        watch,
        formState: { errors },
    } = useFormContext();

    const selectedLogo = watch("logo");

    return (
        <div className="space-y-6">
            <div>
                <label
                    htmlFor="projectName"
                    className="block text-xs font-medium text-gray-400 mb-2"
                >
                    Project name
                </label>
                <Controller
                    name="projectName"
                    control={control}
                    render={({ field }) => (
                        <input
                            {...field}
                            id="projectName"
                            type="text"
                            placeholder="e.g Default Project"
                            className={`w-full px-3 py-2 border rounded-xl placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.projectName
                                    ? "border-error"
                                    : "border-gray-600"
                            }`}
                        />
                    )}
                />
                {errors.projectName && (
                    <p className="mt-1 text-sm text-error">
                        {errors.projectName.message as string}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-xs font-medium text-gray-400 mb-3">
                    Logo
                </label>
                <Controller
                    name="logo"
                    control={control}
                    render={({ field }) => (
                        <div className="grid grid-cols-8 gap-2">
                            {logoOptions.map((option, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => field.onChange(option)}
                                    className={`flex cursor-pointer items-center justify-center w-8 h-8 text-base rounded-full transition-all duration-200 hover:scale-110 ${
                                        selectedLogo?.color === option.color &&
                                        selectedLogo?.icon === option.icon
                                            ? "ring-2 ring-white ring-offset-2 ring-offset-gray-800"
                                            : "hover:ring-1 hover:ring-gray-400"
                                    }`}
                                    style={{ backgroundColor: option.color }}
                                    aria-label={`Select logo ${option.icon}`}
                                >
                                    {option.icon}
                                </button>
                            ))}
                        </div>
                    )}
                />
                {errors.logo && (
                    <p className="mt-2 text-sm text-error">
                        {errors.logo.message as string}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ProjectForm;
