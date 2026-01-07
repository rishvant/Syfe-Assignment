import type { Currency, Goal } from '../types/index.js';

export const formatCurrency = (amount: number, currency: Currency): string => {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return formatter.format(amount);
};

export const convertCurrency = (
    amount: number,
    fromCurrency: Currency,
    toCurrency: Currency,
    exchangeRates: { USD: number; INR: number }
): number => {
    if (fromCurrency === toCurrency) return amount;

    const amountInUSD = fromCurrency === 'USD'
        ? amount
        : amount / exchangeRates.INR;
    const convertedAmount = toCurrency === 'USD'
        ? amountInUSD
        : amountInUSD * exchangeRates.INR;

    return convertedAmount;
};

export const calculateProgress = (current: number, target: number): number => {
    if (target === 0) return 0;
    const progress = (current / target) * 100;
    return Math.min(Math.round(progress * 100) / 100, 100);
};

export const calculateOverallProgress = (goals: Goal[]): number => {
    if (goals.length === 0) return 0;

    const totalProgress = goals.reduce((sum, goal) => {
        return sum + calculateProgress(goal.currentAmount, goal.targetAmount);
    }, 0);

    return Math.round((totalProgress / goals.length) * 100) / 100;
};

export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
};

export const formatDateForInput = (date: Date = new Date()): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
