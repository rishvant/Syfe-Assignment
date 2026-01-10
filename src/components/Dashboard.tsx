import React from 'react';
import type { Goal } from '../types/index.js';
import { formatCurrency, calculateOverallProgress } from '../utils/formatters';
import { TbCurrencyDollar } from 'react-icons/tb';
import { MdCancel } from 'react-icons/md';
import { FiRefreshCw } from 'react-icons/fi';
import { FaCheckCircle, FaCheck } from 'react-icons/fa';
import { BiTrendingUp } from 'react-icons/bi';

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
                                <TbCurrencyDollar className="w-6 h-6 text-white" />
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
                                <MdCancel className="w-4 h-4 mr-1" />
                                Using cached rate
                            </p>
                        )}

                        <button
                            onClick={onRefreshRate}
                            disabled={exchangeRateInfo.loading}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white text-sm font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:scale-100 shadow-md"
                        >
                            <FiRefreshCw className={`w-4 h-4 ${exchangeRateInfo.loading ? 'animate-spin' : ''}`} />
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
                        <BiTrendingUp className="w-5 h-5" />
                        <span className="font-semibold">{goals.length} {goals.length === 1 ? 'Goal' : 'Goals'}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Total Target */}
                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-5 border border-white border-opacity-20">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-blue-100">Total Target</span>
                            <FaCheckCircle className="w-5 h-5 text-blue-200" />
                        </div>
                        <p className="text-3xl font-bold">{formatCurrency(totalTarget, 'USD')}</p>
                    </div>

                    {/* Total Saved */}
                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-5 border border-white border-opacity-20">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-green-100">Total Saved</span>
                            <FaCheck className="w-5 h-5 text-green-200" />
                        </div>
                        <p className="text-3xl font-bold">{formatCurrency(totalSaved, 'USD')}</p>
                    </div>

                    {/* Overall Progress */}
                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-5 border border-white border-opacity-20">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-purple-100">Overall Progress</span>
                            <BiTrendingUp className="w-5 h-5 text-purple-200" />
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
