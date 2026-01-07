export type Currency = 'INR' | 'USD';

export interface Contribution {
    id: string;
    amount: number;
    date: string;
    createdAt: string;
}

export interface Goal {
    id: string;
    name: string;
    targetAmount: number;
    currency: Currency;
    currentAmount: number;
    contributions: Contribution[];
    createdAt: string;
}

export interface ExchangeRate {
    USD: number;
    INR: number;
    lastUpdated: string;
    error?: string;
}

export interface DashboardSummary {
    totalTarget: number;
    totalSaved: number;
    overallProgress: number;
    goalCount: number;
}
