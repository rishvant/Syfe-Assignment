import React, { useState, useEffect } from 'react';
import type { Currency, Goal } from '../types/index.js';
import { MdEdit, MdClose, MdError } from 'react-icons/md';

interface EditGoalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onEditGoal: (goalId: string, name: string, targetAmount: number, currency: Currency) => void;
    goal: Goal | null;
}

export const EditGoalModal: React.FC<EditGoalModalProps> = ({ isOpen, onClose, onEditGoal, goal }) => {
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [currency, setCurrency] = useState<Currency>('USD');
    const [errors, setErrors] = useState<{ name?: string; targetAmount?: string }>({});

    const isCurrencyLocked = !!(goal && goal.contributions.length > 0);

    useEffect(() => {
        if (isOpen && goal) {
            setName(goal.name);
            setTargetAmount(goal.targetAmount.toString());
            setCurrency(goal.currency);
            setErrors({});
        }
    }, [isOpen, goal]);

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
        const newErrors: { name?: string; targetAmount?: string } = {};

        // Validate name
        if (!name.trim()) {
            newErrors.name = 'Goal name is required';
        } else if (name.trim().length > 50) {
            newErrors.name = 'Goal name must be 50 characters or less';
        }

        // Validate target amount
        const amount = parseFloat(targetAmount);
        if (!targetAmount) {
            newErrors.targetAmount = 'Target amount is required';
        } else if (isNaN(amount) || amount <= 0) {
            newErrors.targetAmount = 'Target amount must be a positive number';
        } else if (amount > 1000000000) {
            newErrors.targetAmount = 'Target amount is too large';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm() && goal) {
            onEditGoal(goal.id, name.trim(), parseFloat(targetAmount), currency);
            onClose();
        }
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen || !goal) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-md p-4 animate-fadeIn"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full transform transition-all animate-slideUp border border-gray-200">
                {/* Header with Gradient */}
                <div className="relative overflow-hidden rounded-t-3xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="border border-white bg-opacity-20 backdrop-blur-sm rounded-xl p-2">
                                <MdEdit className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold">Edit Goal</h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="group text-white hover:bg-white hover:bg-opacity-20 transition-all p-2 rounded-xl"
                            aria-label="Close modal"
                        >
                            <MdClose className="w-6 h-6 group-hover:text-purple-600" />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div>
                        <label htmlFor="goal-name" className="block text-sm font-bold text-gray-700 mb-2">
                            Goal Name
                        </label>
                        <input
                            id="goal-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Trip to Japan, Emergency Fund"
                            autoFocus
                            className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all font-medium ${errors.name
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                                : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-100'
                                }`}
                            maxLength={51}
                        />
                        {errors.name && (
                            <p className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1">
                                <MdError className="w-4 h-4" />
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="target-amount" className="block text-sm font-bold text-gray-700 mb-2">
                            Target Amount
                        </label>
                        <input
                            id="target-amount"
                            type="number"
                            value={targetAmount}
                            onChange={(e) => setTargetAmount(e.target.value)}
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all font-medium ${errors.targetAmount
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                                : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-100'
                                }`}
                        />
                        {errors.targetAmount && (
                            <p className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1">
                                <MdError className="w-4 h-4" />
                                {errors.targetAmount}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="currency" className="block text-sm font-bold text-gray-700 mb-2">
                            Currency
                            {isCurrencyLocked && (
                                <span className="text-xs text-amber-600 ml-2 font-normal">
                                    (locked - goal has contributions)
                                </span>
                            )}
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => !isCurrencyLocked && setCurrency('USD')}
                                disabled={isCurrencyLocked}
                                className={`px-4 py-3.5 border-2 rounded-xl font-bold transition-all ${currency === 'USD'
                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                    } ${isCurrencyLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <span className="text-xl">$</span>
                                    <span>USD</span>
                                </div>
                            </button>
                            <button
                                type="button"
                                onClick={() => !isCurrencyLocked && setCurrency('INR')}
                                disabled={isCurrencyLocked}
                                className={`px-4 py-3.5 border-2 rounded-xl font-bold transition-all ${currency === 'INR'
                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                    } ${isCurrencyLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <span className="text-xl">₹</span>
                                    <span>INR</span>
                                </div>
                            </button>
                        </div>
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
                            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl btn-press"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
