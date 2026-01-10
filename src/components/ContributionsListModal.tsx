import React, { useEffect } from 'react';
import type { Contribution, Currency } from '../types/index.js';
import { formatCurrency } from '../utils/formatters';
import { MdContentPaste, MdClose, MdCalendarToday } from 'react-icons/md';

interface ContributionsListModalProps {
    isOpen: boolean;
    goalName: string;
    contributions: Contribution[];
    currency: Currency;
    onClose: () => void;
}

export const ContributionsListModal: React.FC<ContributionsListModalProps> = ({
    isOpen,
    goalName,
    contributions,
    currency,
    onClose,
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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        }).format(date);
    };

    // Sort contributions by date (newest first)
    const sortedContributions = [...contributions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-md p-4 animate-fadeIn"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full transform transition-all animate-slideUp border border-gray-200 max-h-[90vh] flex flex-col">
                {/* Header with Gradient */}
                <div className="relative overflow-hidden rounded-t-3xl bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-white flex-shrink-0">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="border border-white bg-opacity-20 backdrop-blur-sm rounded-xl p-2">
                                <MdContentPaste className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">Contributions</h3>
                                <p className="text-sm text-blue-100 mt-1">{goalName}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="group text-white hover:bg-white hover:bg-opacity-20 transition-all p-2 rounded-xl"
                            aria-label="Close modal"
                        >
                            <MdClose className="w-6 h-6 group-hover:text-cyan-600" />
                        </button>
                    </div>
                </div>

                {/* Total Summary */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-4 border-b border-gray-200 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-700">Total Contributions</span>
                        <span className="text-lg font-bold text-blue-600">{contributions.length}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-semibold text-gray-700">Total Amount</span>
                        <span className="text-lg font-bold text-blue-600">
                            {formatCurrency(
                                contributions.reduce((sum, c) => sum + c.amount, 0),
                                currency
                            )}
                        </span>
                    </div>
                </div>

                {/* Contributions List */}
                <div className="overflow-y-auto flex-1 p-6">
                    {sortedContributions.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                                <MdContentPaste className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-medium">No contributions yet</p>
                            <p className="text-sm text-gray-400 mt-1">Start adding contributions to track your progress</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {sortedContributions.map((contribution, index) => (
                                <div
                                    key={contribution.id}
                                    className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors border border-gray-200"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                            #{sortedContributions.length - index}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 text-lg">
                                                {formatCurrency(contribution.amount, currency)}
                                            </p>
                                            <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                                                <MdCalendarToday className="w-4 h-4" />
                                                {formatDate(contribution.date)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
