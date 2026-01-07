import React from 'react';
import type { Goal } from '../types/index.js';
import { formatCurrency, calculateOverallProgress } from '../utils/formatters';

interface FinancialOverviewProps {
    goals: Goal[];
    exchangeRateInfo: {
        rate: number;
        lastUpdated: string;
        loading: boolean;
        error: string | null;
    };
    onRefreshRate: () => void;
}

export const FinancialOverview: React.FC<FinancialOverviewProps> = ({
    goals,
    exchangeRateInfo,
    onRefreshRate
}) => {
    const totalTargetINR = goals.reduce((sum, goal) => {
        const amountInINR = goal.currency === 'INR'
            ? goal.targetAmount
            : goal.targetAmount * exchangeRateInfo.rate;
        return sum + amountInINR;
    }, 0);

    const totalSavedINR = goals.reduce((sum, goal) => {
        const amountInINR = goal.currency === 'INR'
            ? goal.currentAmount
            : goal.currentAmount * exchangeRateInfo.rate;
        return sum + amountInINR;
    }, 0);

    const totalTargetUSD = totalTargetINR / exchangeRateInfo.rate;
    const totalSavedUSD = totalSavedINR / exchangeRateInfo.rate;
    const overallProgress = calculateOverallProgress(goals);

    const formatLastUpdated = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        }).format(date);
    };

    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-2xl shadow-xl p-6 text-white">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <h2 className="text-base font-semibold">Financial Overview</h2>
                </div>
                <button
                    onClick={onRefreshRate}
                    disabled={exchangeRateInfo.loading}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-opacity-20 hover:bg-opacity-30 disabled:bg-opacity-10 disabled:cursor-not-allowed rounded-lg text-xs font-medium transition-all"
                    title="Refresh exchange rates"
                >
                    <svg
                        className={`w-3.5 h-3.5 ${exchangeRateInfo.loading ? 'animate-spin' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {exchangeRateInfo.loading ? 'Updating...' : 'Refresh Rates'}
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                {/* Total Targets */}
                <div className="bg-opacity-15 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex items-center gap-1.5 mb-2 text-white text-opacity-90">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-xs font-medium">Total Targets</span>
                    </div>
                    <p className="text-2xl font-bold text-white mb-1">{formatCurrency(totalTargetINR, 'INR')}</p>
                    <p className="text-xs text-white text-opacity-80">{formatCurrency(totalTargetUSD, 'USD')}</p>
                </div>

                {/* Total Saved */}
                <div className="bg-opacity-15 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex items-center gap-1.5 mb-2 text-white text-opacity-90">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-xs font-medium">Total Saved</span>
                    </div>
                    <p className="text-2xl font-bold text-white mb-1">{formatCurrency(totalSavedINR, 'INR')}</p>
                    <p className="text-xs text-white text-opacity-80">{formatCurrency(totalSavedUSD, 'USD')}</p>
                </div>

                {/* Overall Progress */}
                <div className="bg-opacity-15 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex items-center gap-1.5 mb-2 text-white text-opacity-90">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <span className="text-xs font-medium">Overall Progress</span>
                    </div>
                    <p className="text-2xl font-bold text-white mb-1">{overallProgress.toFixed(1)}%</p>

                    {/* Mini Progress Bar */}
                    <div className="mt-3 h-2 bg-white bg-opacity-20 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(overallProgress, 100)}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Exchange Rate Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-4 border-t border-white border-opacity-20 text-xs">
                <div className="text-white text-opacity-90">
                    Exchange Rate: <span className="font-semibold text-white">1 USD = ₹{exchangeRateInfo.rate.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-white text-opacity-70">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Last updated: {formatLastUpdated(exchangeRateInfo.lastUpdated)}
                </div>
            </div>

            {exchangeRateInfo.error && (
                <div className="mt-3 flex items-center gap-1.5 text-xs bg-yellow-500 bg-opacity-20 px-3 py-1.5 rounded-lg">
                    <svg className="w-3.5 h-3.5 text-yellow-200" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-yellow-100">Using cached rate</span>
                </div>
            )}
        </div>
    );
};
