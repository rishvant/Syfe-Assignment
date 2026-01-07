import React from 'react';
import type { Goal, Currency } from '../types/index.js';
import { formatCurrency, convertCurrency, calculateProgress } from '../utils/formatters';

interface GoalCardProps {
    goal: Goal;
    exchangeRates: { USD: number; INR: number };
    onAddContribution: (goalId: string) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, exchangeRates, onAddContribution }) => {
    const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
    const otherCurrency: Currency = goal.currency === 'USD' ? 'INR' : 'USD';
    const convertedAmount = convertCurrency(
        goal.targetAmount,
        goal.currency,
        otherCurrency,
        exchangeRates
    );
    const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

    return (
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-5 border border-gray-100">
            <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex-1">{goal.name}</h3>
                <div className="bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-lg text-sm font-bold ml-2">
                    {progress.toFixed(0)}%
                </div>
            </div>

            {/* Target Amount */}
            <div className="mb-4">
                <p className="text-2xl font-bold text-indigo-600">
                    {formatCurrency(goal.targetAmount, goal.currency)}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">
                    {formatCurrency(convertedAmount, otherCurrency)}
                </p>
            </div>

            {/* Progress Section */}
            <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                    <span className="font-medium">Progress</span>
                    <span className="font-semibold text-gray-900">
                        {formatCurrency(goal.currentAmount, goal.currency)} saved
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="absolute top-0 left-0 h-full bg-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-200">
                <div>
                    <p className="text-xs text-gray-500 mb-0.5">Contributions</p>
                    <p className="text-base font-bold text-gray-900">{goal.contributions.length}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-500 mb-0.5">Remaining</p>
                    <p className="text-base font-bold text-gray-900">{formatCurrency(remaining, goal.currency)}</p>
                </div>
            </div>

            {/* Add Contribution Button */}
            <button
                onClick={() => onAddContribution(goal.id)}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Contribution
            </button>
        </div>
    );
};
