import { useState, useCallback } from "react";
import { useGetProjectsQuery } from "../../features/api/apiSlice";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { projectSchema } from "../../schemas/projectSchema";

const WORKSPACE_ID = import.meta.env.VITE_WORSKPACE_ID;

export const useSidebar = (handleSelectId: (id: string) => void) => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { isLoading, error } = useGetProjectsQuery(WORKSPACE_ID);

    const formMethods = useForm({
        resolver: yupResolver(projectSchema),
    });

    const handleProjectSelect = useCallback(
        (id: string) => {
            handleSelectId(id);
            if (isSidebarOpen) setSidebarOpen(false);
        },
        [handleSelectId, isSidebarOpen]
    );

    const toggleModal = useCallback(() => {
        setIsModalOpen((prev) => !prev);
    }, []);

    const toggleSidebar = useCallback(
        () => setSidebarOpen(!isSidebarOpen),
        [isSidebarOpen]
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
    };
};
