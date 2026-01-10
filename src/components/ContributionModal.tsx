import React, { useState, useEffect } from 'react';
import type { Currency } from '../types/index.js';
import { formatDateForInput } from '../utils/formatters';
import { IoMdAdd } from 'react-icons/io';
import { MdClose, MdCalendarToday, MdError } from 'react-icons/md';

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
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-md p-4 animate-fadeIn"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full transform transition-all animate-slideUp border border-gray-200">
                {/* Header with Gradient */}
                <div className="relative overflow-hidden rounded-t-3xl bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="border border-white bg-opacity-20 backdrop-blur-sm rounded-xl p-2">
                                <IoMdAdd className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">Add Contribution</h3>
                                <p className="text-sm text-emerald-100 mt-1">{goalName}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="group text-white hover:bg-white hover:bg-opacity-20 transition-all p-2 rounded-xl"
                            aria-label="Close modal"
                        >
                            <MdClose className="w-6 h-6 group-hover:text-emerald-600" />
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
                                <MdError className="w-4 h-4" />
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
                                <MdCalendarToday className="w-5 h-5" />
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
                                <MdError className="w-4 h-4" />
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
