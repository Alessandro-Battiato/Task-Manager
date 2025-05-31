import type { ReactNode } from "react";

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    isRequestLoading: boolean;
    children?: ReactNode;
    submitButtonText?: string;
    cancelButtonText?: string;
    submitButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    cancelButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    hideActions?: boolean;
    modalBoxClassName?: string;
}
