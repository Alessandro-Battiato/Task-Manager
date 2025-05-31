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
    isLoading: boolean;
    error: boolean;
    onClose: () => void;
    onProjectSelect: (id: string) => void;
    onAddProject: () => void;
}

export interface DesktopSidebarProps {
    selectedId: string | null;
    isLoading: boolean;
    error: boolean;
    theme: string;
    onProjectSelect: (id: string) => void;
    onAddProject: () => void;
    onThemeChange: (theme: string) => void;
}
