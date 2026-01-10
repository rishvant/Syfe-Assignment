import React, { useEffect } from 'react';
import { MdWarning, MdClose, MdErrorOutline } from 'react-icons/md';

interface DeleteConfirmModalProps {
    isOpen: boolean;
    goalName: string;
    onClose: () => void;
    onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
    isOpen,
    goalName,
    onClose,
    onConfirm,
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-md p-4 animate-fadeIn"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full transform transition-all animate-slideUp border border-gray-200">
                {/* Header with Red Gradient (Danger) */}
                <div className="relative overflow-hidden rounded-t-3xl bg-gradient-to-r from-red-600 to-rose-600 p-6 text-white">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="border border-white bg-opacity-20 backdrop-blur-sm rounded-xl p-2">
                                <MdWarning className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold">Delete Goal</h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="group text-white hover:bg-white hover:bg-opacity-20 transition-all p-2 rounded-xl"
                            aria-label="Close modal"
                        >
                            <MdClose className="w-6 h-6 group-hover:text-rose-600" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8">
                    <div className="mb-6">
                        <p className="text-gray-700 text-base mb-4">
                            Are you sure you want to delete <span className="font-bold text-gray-900">"{goalName}"</span>?
                        </p>
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                            <div className="flex gap-3">
                                <MdErrorOutline className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-bold text-red-900 mb-1">Warning</p>
                                    <p className="text-sm text-red-700">
                                        This action cannot be undone. All contributions associated with this goal will be permanently deleted.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3.5 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            Delete Goal
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
