import React from 'react';
import type { Goal, Currency } from '../types/index.js';
import { formatCurrency, convertCurrency, calculateProgress } from '../utils/formatters';

interface GoalCardProps {
    goal: Goal;
    exchangeRates: { USD: number; INR: number };
    onAddContribution: (goalId: string) => void;
    onViewContributions: (goalId: string) => void;
    onEditGoal: (goalId: string) => void;
    onDeleteGoal: (goalId: string) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, exchangeRates, onAddContribution, onViewContributions, onEditGoal, onDeleteGoal }) => {
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
                <div className="flex items-center gap-2">
                    {/* Edit button */}
                    <button
                        onClick={() => onEditGoal(goal.id)}
                        className="text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 p-1.5 rounded-lg transition-all"
                        aria-label="Edit goal"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    {/* Delete button */}
                    <button
                        onClick={() => onDeleteGoal(goal.id)}
                        className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-all"
                        aria-label="Delete goal"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                    {/* Progress badge */}
                    <div className="bg-green-100 text-green-700 px-2.5 py-1 rounded-lg text-sm font-bold ml-1">
                        {progress.toFixed(0)}%
                    </div>
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
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-200">
                <button
                    onClick={() => onViewContributions(goal.id)}
                    className="text-left hover:bg-blue-50 rounded-lg p-2 -m-2 transition-colors group cursor-pointer"
                >
                    <p className="text-xs text-gray-500 mb-0.5 flex items-center gap-1">
                        Contributions
                        <svg className="w-3 h-3 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </p>
                    <p className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{goal.contributions.length}</p>
                </button>
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
