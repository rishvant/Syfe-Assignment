import React, { useState } from 'react';
import type { Currency } from '../types/index.js';

interface AddGoalFormProps {
    onAddGoal: (name: string, targetAmount: number, currency: Currency) => void;
}

export const AddGoalForm: React.FC<AddGoalFormProps> = ({ onAddGoal }) => {
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [currency, setCurrency] = useState<Currency>('USD');
    const [errors, setErrors] = useState<{ name?: string; targetAmount?: string }>({});

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

        if (validateForm()) {
            onAddGoal(name.trim(), parseFloat(targetAmount), currency);

            // Reset form
            setName('');
            setTargetAmount('');
            setCurrency('USD');
            setErrors({});
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Goal</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="goal-name" className="block text-sm font-semibold text-gray-700 mb-2">
                        Goal Name
                    </label>
                    <input
                        id="goal-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Emergency Fund, Vacation, New Car"
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.name
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                            : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                            }`}
                        maxLength={51}
                    />
                    {errors.name && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            {errors.name}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label htmlFor="target-amount" className="block text-sm font-semibold text-gray-700 mb-2">
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
                            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.targetAmount
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                                }`}
                        />
                        {errors.targetAmount && (
                            <p className="mt-2 text-sm text-red-600 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                {errors.targetAmount}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="currency" className="block text-sm font-semibold text-gray-700 mb-2">
                            Currency
                        </label>
                        <select
                            id="currency"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value as Currency)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-200 transition-all bg-white cursor-pointer"
                        >
                            <option value="USD">USD ($)</option>
                            <option value="INR">INR (₹)</option>
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                >
                    <span className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Goal
                    </span>
                </button>
            </form>
        </div>
    );
};
