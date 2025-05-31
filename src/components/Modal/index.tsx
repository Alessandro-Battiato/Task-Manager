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
                className={`modal-box relative bg-base-200 py-4 px-6 rounded-xl ${
                    modalBoxClassName || ""
                }`}
            >
                <button
                    className="absolute self-end btn btn-ghost btn-square top-4 right-4"
                    onClick={() => {
                        onClose();
                        dialogRef.current?.close();
                    }}
                    aria-label="Close modal"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>

                {title && (
                    <h3 className="font-semibold text-lg mb-6">{title}</h3>
                )}
                {children}

                {!hideActions && (
                    <div className="modal-action justify-start mt-6 space-x-3">
                        <button
                            type="submit"
                            {...submitButtonProps}
                            className={`btn btn-primary font-normal h-8.5 rounded-full ${submitButtonProps.className}`}
                        >
                            {submitButtonProps.children || submitButtonText}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4"
                                viewBox="0 0 24 24"
                                fill="white"
                            >
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                                dialogRef.current?.close();
                            }}
                            {...cancelButtonProps}
                            className={`btn btn-outline btn-neutral-content font-normal h-8.5 rounded-full ${cancelButtonProps.className}`}
                        >
                            {cancelButtonProps.children || cancelButtonText}
                        </button>
                    </div>
                )}
            </div>
        </dialog>
    );
};

export default Modal;
