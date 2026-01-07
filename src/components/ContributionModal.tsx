import React, { useState, useEffect } from 'react';
import type { Currency } from '../types/index.js';
import { formatDateForInput } from '../utils/formatters';

interface ContributionModalProps {
    isOpen: boolean;
    goalName: string;
    currency: Currency;
    onClose: () => void;
    onAddContribution: (amount: number, date: string) => void;
}

export const ContributionModal: React.FC<ContributionModalProps> = ({
    isOpen,
    goalName,
    currency,
    onClose,
    onAddContribution,
}) => {
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(formatDateForInput());
    const [errors, setErrors] = useState<{ amount?: string; date?: string }>({});

    useEffect(() => {
        if (isOpen) {
            setAmount('');
            setDate(formatDateForInput());
            setErrors({});
        }
    }, [isOpen]);

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

    const validateForm = (): boolean => {
        const newErrors: { amount?: string; date?: string } = {};

        // Validate amount
        const contributionAmount = parseFloat(amount);
        if (!amount) {
            newErrors.amount = 'Contribution amount is required';
        } else if (isNaN(contributionAmount) || contributionAmount <= 0) {
            newErrors.amount = 'Amount must be a positive number';
        } else if (contributionAmount > 1000000000) {
            newErrors.amount = 'Amount is too large';
        }

        // Validate date
        if (!date) {
            newErrors.date = 'Date is required';
        } else {
            const selectedDate = new Date(date);
            const today = new Date();
            today.setHours(23, 59, 59, 999);

            if (selectedDate > today) {
                newErrors.date = 'Date cannot be in the future';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            onAddContribution(parseFloat(amount), date);
            onClose();
        }
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-md p-4 animate-fadeIn"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full transform transition-all animate-slideUp border border-gray-200">
                {/* Header with Gradient */}
                <div className="relative overflow-hidden rounded-t-3xl bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">Add Contribution</h3>
                                <p className="text-sm text-emerald-100 mt-1">{goalName}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-white hover:bg-opacity-20 transition-all p-2 rounded-xl"
                            aria-label="Close modal"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div>
                        <label htmlFor="contribution-amount" className="block text-sm font-bold text-gray-700 mb-2">
                            Contribution Amount
                        </label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-bold text-lg">
                                {currency === 'USD' ? '$' : '₹'}
                            </div>
                            <input
                                id="contribution-amount"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                autoFocus
                                className={`w-full pl-10 pr-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all font-medium text-lg ${errors.amount
                                    ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                                    : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-100'
                                    }`}
                            />
                        </div>
                        {errors.amount && (
                            <p className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.amount}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="contribution-date" className="block text-sm font-bold text-gray-700 mb-2">
                            Date
                        </label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <input
                                id="contribution-date"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                max={formatDateForInput()}
                                className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all font-medium ${errors.date
                                    ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                                    : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-100'
                                    }`}
                            />
                        </div>
                        {errors.date && (
                            <p className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.date}
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3.5 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all btn-press"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl btn-press"
                        >
                            Add Contribution
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
