import React from 'react';
import type { Goal } from '../types/index.js';
import { formatCurrency, calculateOverallProgress } from '../utils/formatters';
import { FiRefreshCcw } from "react-icons/fi";
import { HiChartBar } from "react-icons/hi";
import { FaCheckCircle, FaWallet } from "react-icons/fa";
import { MdAccessTime, MdWarning } from "react-icons/md";
import { BiTrendingUp } from "react-icons/bi";

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
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }).format(date);
    };

    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-2xl shadow-xl p-6 text-white">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                    <HiChartBar className="w-5 h-5" />
                    <h2 className="text-base font-semibold">Financial Overview</h2>
                </div>
                <button
                    onClick={onRefreshRate}
                    disabled={exchangeRateInfo.loading}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 bg-opacity-20 hover:bg-opacity-30 disabled:bg-opacity-10 disabled:cursor-not-allowed rounded-lg text-xs font-medium transition-all"
                    title="Refresh exchange rates"
                >
                    <FiRefreshCcw
                        className={`w-3.5 h-3.5 ${exchangeRateInfo.loading ? 'animate-spin' : ''}`}
                    />
                    {exchangeRateInfo.loading ? 'Updating...' : 'Refresh Rates'}
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                {/* Total Targets */}
                <div className="bg-opacity-15 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex items-center gap-1.5 mb-2 text-white text-opacity-90">
                        <FaCheckCircle className="w-4 h-4" />
                        <span className="text-xs font-medium">Total Targets</span>
                    </div>
                    <p className="text-2xl font-bold text-white mb-1">{formatCurrency(totalTargetINR, 'INR')}</p>
                    <p className="text-xs text-white text-opacity-80">{formatCurrency(totalTargetUSD, 'USD')}</p>
                </div>

                {/* Total Saved */}
                <div className="bg-opacity-15 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex items-center gap-1.5 mb-2 text-white text-opacity-90">
                        <FaWallet className="w-4 h-4" />
                        <span className="text-xs font-medium">Total Saved</span>
                    </div>
                    <p className="text-2xl font-bold text-white mb-1">{formatCurrency(totalSavedINR, 'INR')}</p>
                    <p className="text-xs text-white text-opacity-80">{formatCurrency(totalSavedUSD, 'USD')}</p>
                </div>

                {/* Overall Progress */}
                <div className="bg-opacity-15 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex items-center gap-1.5 mb-2 text-white text-opacity-90">
                        <BiTrendingUp className="w-4 h-4" />
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
                    <MdAccessTime className="w-3.5 h-3.5" />
                    Last updated: {formatLastUpdated(exchangeRateInfo.lastUpdated)}
                </div>
            </div>

            {exchangeRateInfo.error && (
                <div className="mt-3 flex items-center gap-1.5 text-xs bg-yellow-500 bg-opacity-20 px-3 py-1.5 rounded-lg">
                    <MdWarning className="w-3.5 h-3.5 text-yellow-200" />
                    <span className="text-yellow-100">Using cached rate</span>
                </div>
            )}
        </div>
    );
};
