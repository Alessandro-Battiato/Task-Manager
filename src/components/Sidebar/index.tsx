import React, { useCallback } from "react";
import type { SidebarProps } from "./types";
import Modal from "../Modal";
import { FormProvider } from "react-hook-form";
import ProjectForm from "../ProjectForm/index";
import { useSidebar } from "./useSidebar";
import MobileHeader from "./MobileHeader";
import DesktopSidebar from "./DesktopSidebar";
import MobileSidebar from "./MobileSidebar";

const Sidebar: React.FC<SidebarProps> = ({
    selectedId,
    handleSelectId,
    toggle,
    theme,
}) => {
    const {
        isLoading,
        error,
        isSidebarOpen,
        isModalOpen,
        formMethods,
        handleProjectSelect,
        handleDeleteProject,
        toggleModal,
        toggleSidebar,
        handleCreateProjectSubmit,
        isCreatingProject,
        isCreatingSections,
        isDeletingProject,
    } = useSidebar(handleSelectId);

    const onModalConfirmSubmit = useCallback(() => {
        formMethods.handleSubmit((data) => handleCreateProjectSubmit(data))();
    }, [formMethods, handleCreateProjectSubmit]);

    return (
        <>
            <MobileHeader
                theme={theme}
                onToggleSidebar={toggleSidebar}
                onToggleTheme={toggle}
            />

            <DesktopSidebar
                selectedId={selectedId}
                isLoading={isLoading}
                error={error}
                theme={theme}
                onProjectSelect={handleProjectSelect}
                onDeleteProject={handleDeleteProject}
                isRequestLoading={isDeletingProject}
                onAddProject={toggleModal}
                onThemeChange={toggle}
            />

            <MobileSidebar
                isOpen={isSidebarOpen}
                selectedId={selectedId}
                isLoading={isLoading}
                error={error}
                onClose={toggleSidebar}
                onProjectSelect={handleProjectSelect}
                onDeleteProject={handleDeleteProject}
                isRequestLoading={isDeletingProject}
                onAddProject={toggleModal}
            />

            <Modal
                title="New Project"
                isOpen={isModalOpen}
                onClose={toggleModal}
                isRequestLoading={isCreatingProject || isCreatingSections}
                onConfirm={onModalConfirmSubmit}
                cancelButtonText="Cancel"
                submitButtonText="Create Project"
                submitButtonProps={{
                    "data-testid": "create-project-submit",
                }}
                modalBoxClassName="data-[testid=create-project-modal]"
            >
                <FormProvider {...formMethods}>
                    <ProjectForm />
                </FormProvider>
            </Modal>
        </>
    );
};

export default Sidebar;
