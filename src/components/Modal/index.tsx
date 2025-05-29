import React, { useCallback, useEffect, useRef } from "react";
import type { ModalProps } from "./types";

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose = () => {},
    title,
    children,
    submitButtonText,
    cancelButtonText,
    submitButtonProps = { className: "" },
    cancelButtonProps = { className: "" },
    hideActions = false,
    modalBoxClassName,
}) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (isOpen) {
            if (!dialog.open) {
                document.documentElement.style.scrollbarGutter = "auto";
                dialog.showModal();
            }
        } else {
            if (dialog.open) {
                document.documentElement.style.scrollbarGutter = "";
                dialog.close();
            }
        }
    }, [isOpen]);

    const handleClickOutside = useCallback(
        (event: MouseEvent) => {
            if (dialogRef.current?.open) {
                const modalBox = dialogRef.current?.querySelector(".modal-box");
                if (modalBox && !modalBox.contains(event.target as Node)) {
                    onClose();
                    dialogRef.current?.close();
                }
            }
        },
        [onClose]
    );

    useEffect(() => {
        if (!dialogRef.current) return;

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [handleClickOutside, onClose]);

    const handleCancel = useCallback(
        (event: React.SyntheticEvent<HTMLDialogElement, Event>) => {
            event.preventDefault();
            onClose();
        },
        [onClose]
    );

    return (
        <dialog ref={dialogRef} className="modal" onCancel={handleCancel}>
            <div
                className={`modal-box bg-base-200 py-4 px-6 rounded-xl ${
                    modalBoxClassName || ""
                }`}
            >
                {title && (
                    <h3 className="font-semibold text-lg mb-6">{title}</h3>
                )}
                {children}
                {!hideActions && (
                    <div className="modal-action mt-6">
                        <button
                            type="button"
                            className={`btn ${
                                cancelButtonProps.className || ""
                            }`}
                            onClick={() => {
                                onClose();
                                dialogRef.current?.close();
                            }}
                            {...cancelButtonProps}
                        >
                            {cancelButtonProps.children || cancelButtonText}
                        </button>
                        <button
                            type="submit"
                            className={`btn ${
                                submitButtonProps.className || "btn-primary"
                            }`}
                            {...submitButtonProps}
                        >
                            {submitButtonProps.children || submitButtonText}
                        </button>
                    </div>
                )}
            </div>
        </dialog>
    );
};

export default Modal;
