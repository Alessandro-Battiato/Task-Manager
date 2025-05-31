import React from "react";
import type { SidebarProps } from "./types";
import Modal from "../Modal";
import { FormProvider } from "react-hook-form";
import ProjectForm from "../../ProjectForm";
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
        toggleModal,
        toggleSidebar,
    } = useSidebar(handleSelectId);

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
                onAddProject={toggleModal}
            />

            <Modal
                title="New Project"
                isOpen={isModalOpen}
                onClose={toggleModal}
                cancelButtonText="Cancel"
                submitButtonText="Create Project"
            >
                <FormProvider {...formMethods}>
                    <ProjectForm />
                </FormProvider>
            </Modal>
        </>
    );
};

export default Sidebar;
