import { useState, useCallback } from "react";
import {
    useCreateProjectMutation,
    useGetProjectsQuery,
} from "../../features/api/apiSlice";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { projectSchema } from "../../schemas/projectSchema";
import { logoOptions } from "../../const/logoOptions";

const WORKSPACE_ID = import.meta.env.VITE_WORKSPACE_ID;

export const useSidebar = (handleSelectId: (id: string) => void) => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { isLoading, error } = useGetProjectsQuery(WORKSPACE_ID);

    const [createProject, { isLoading: isCreatingProject }] =
        useCreateProjectMutation();

    const formMethods = useForm({
        resolver: yupResolver(projectSchema),
        defaultValues: {
            projectName: "",
        },
        mode: "onChange",
    });

    const handleProjectSelect = useCallback(
        (id: string) => {
            handleSelectId(id);
            if (isSidebarOpen) setSidebarOpen(false);
        },
        [handleSelectId, isSidebarOpen]
    );

    const toggleModal = useCallback(() => {
        setIsModalOpen((prev) => {
            if (!prev) {
                formMethods.reset({
                    projectName: "",
                });
            }
            return !prev;
        });
    }, [formMethods]);

    const toggleSidebar = useCallback(
        () => setSidebarOpen(!isSidebarOpen),
        [isSidebarOpen]
    );

    const handleCreateProjectSubmit = useCallback(
        async (formData: { logoIndex: null | number; projectName: string }) => {
            const selectedEmoji = logoOptions[formData.logoIndex || 0]?.icon;
            const projectNameWithEmoji = `${selectedEmoji} ${formData.projectName}`;

            const projectPayload = {
                name: projectNameWithEmoji,
                workspace: WORKSPACE_ID,
            };

            try {
                await createProject(projectPayload).unwrap();
                toggleModal();
            } catch (err) {
                console.error(
                    "Something went wrong during the project creation:",
                    err
                );
            }
        },
        [createProject, toggleModal]
    );

    return {
        isLoading,
        error: !!error,
        isSidebarOpen,
        isModalOpen,
        formMethods,
        handleProjectSelect,
        toggleModal,
        toggleSidebar,
        handleCreateProjectSubmit,
        isCreatingProject,
    };
};
