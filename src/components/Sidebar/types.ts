export interface SidebarProps {
    selectedId: string | null;
    handleSelectId: (id: string) => void;
    toggle: () => void;
    theme: string;
}
