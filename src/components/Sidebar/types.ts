export interface SidebarProps {
    selectedId: string | null;
    handleSelectId: (id: string) => void;
    toggle: () => void;
    theme: string;
}

export interface MobileHeaderProps {
    theme: string;
    onToggleSidebar: () => void;
    onToggleTheme: () => void;
}

export interface ProjectListProps {
    selectedId: string | null;
    isRequestLoading: boolean;
    onDeleteProject: (id: string) => Promise<true | undefined>;
    onProjectSelect: (id: string) => void;
    onAddProject: () => void;
    isMobile?: boolean;
}

export interface ThemeSelectorProps {
    theme: string;
    onThemeChange: (theme: string) => void;
}

export interface StateHandlerProps {
    isLoading: boolean;
    error: boolean;
    isMobile?: boolean;
}

export interface MobileSidebarProps {
    isOpen: boolean;
    selectedId: string | null;
    isRequestLoading: boolean;
    isLoading: boolean;
    error: boolean;
    onClose: () => void;
    onDeleteProject: (id: string) => Promise<true | undefined>;
    onProjectSelect: (id: string) => void;
    onAddProject: () => void;
}

export interface DesktopSidebarProps {
    selectedId: string | null;
    isLoading: boolean;
    isRequestLoading: boolean;
    error: boolean;
    theme: string;
    onDeleteProject: (id: string) => Promise<true | undefined>;
    onProjectSelect: (id: string) => void;
    onAddProject: () => void;
    onThemeChange: (theme: string) => void;
}
