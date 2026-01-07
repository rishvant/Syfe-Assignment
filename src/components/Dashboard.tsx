import React from 'react';
import type { Goal } from '../types/index.js';
import { formatCurrency, calculateOverallProgress } from '../utils/formatters';

interface DashboardProps {
    goals: Goal[];
    exchangeRateInfo: {
        rate: number;
        lastUpdated: string;
        loading: boolean;
        error: string | null;
    };
    onRefreshRate: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ goals, exchangeRateInfo, onRefreshRate }) => {
    const totalTarget = goals.reduce((sum, goal) => {
        const amountInUSD = goal.currency === 'USD'
            ? goal.targetAmount
            : goal.targetAmount / exchangeRateInfo.rate;
        return sum + amountInUSD;
    }, 0);

    const totalSaved = goals.reduce((sum, goal) => {
        const amountInUSD = goal.currency === 'USD'
            ? goal.currentAmount
            : goal.currentAmount / exchangeRateInfo.rate;
        return sum + amountInUSD;
    }, 0);

    const overallProgress = calculateOverallProgress(goals);

    const formatLastUpdated = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 60) {
            if (diffMins < 1) return 'Just now';
            return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
        }

        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        }).format(date);
    };

    return (
        <div className="space-y-6">
            {/* Exchange Rate Info */}
            <div className="bg-white rounded-2xl shadow-lg p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Exchange Rate</p>
                                <p className="font-bold text-gray-800">
                                    1 USD = ₹{exchangeRateInfo.rate.toFixed(2)}
                                </p>
                            </div>
                        </div>

                        {!exchangeRateInfo.loading && !exchangeRateInfo.error && (
                            <div className="hidden sm:block text-xs text-gray-500">
                                Last updated: {formatLastUpdated(exchangeRateInfo.lastUpdated)}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        {exchangeRateInfo.error && (
                            <p className="text-xs text-red-600 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                Using cached rate
                            </p>
                        )}

                        <button
                            onClick={onRefreshRate}
                            disabled={exchangeRateInfo.loading}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white text-sm font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:scale-100 shadow-md"
                        >
                            <svg
                                className={`w-4 h-4 ${exchangeRateInfo.loading ? 'animate-spin' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            {exchangeRateInfo.loading ? 'Updating...' : 'Refresh Rate'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Summary Dashboard */}
            <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl p-8 text-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                    <h2 className="text-2xl font-bold mb-2 sm:mb-0">Savings Dashboard</h2>
                    <div className="flex items-center space-x-2 text-sm bg-white bg-opacity-20 px-4 py-2 rounded-lg backdrop-blur-sm">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <span className="font-semibold">{goals.length} {goals.length === 1 ? 'Goal' : 'Goals'}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Total Target */}
                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-5 border border-white border-opacity-20">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-blue-100">Total Target</span>
                            <svg className="w-5 h-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-3xl font-bold">{formatCurrency(totalTarget, 'USD')}</p>
                    </div>

                    {/* Total Saved */}
                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-5 border border-white border-opacity-20">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-green-100">Total Saved</span>
                            <svg className="w-5 h-5 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-3xl font-bold">{formatCurrency(totalSaved, 'USD')}</p>
                    </div>

                    {/* Overall Progress */}
                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-5 border border-white border-opacity-20">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-purple-100">Overall Progress</span>
                            <svg className="w-5 h-5 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                        <p className="text-3xl font-bold">{overallProgress.toFixed(2)}%</p>

                        {/* Mini Progress Bar */}
                        <div className="mt-3 h-2 bg-white bg-opacity-20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-green-400 to-emerald-400 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(overallProgress, 100)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
