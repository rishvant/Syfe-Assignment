import { useState, useEffect, useCallback } from 'react';
import type { ExchangeRate } from '../types/index.js';

const API_KEY = import.meta.env.VITE_EXCHANGE_RATE_API_KEY;

const EXCHANGE_RATE_API = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

const CACHE_KEY = 'exchangeRateCache';
const CACHE_DURATION = 60 * 60 * 1000;

interface CachedRate {
    rate: ExchangeRate;
    timestamp: number;
}

export const useExchangeRate = () => {
    const [exchangeRate, setExchangeRate] = useState<ExchangeRate>({
        USD: 1,
        INR: 83.5, // Default fallback rate
        lastUpdated: new Date().toISOString(),
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const loadCachedRate = (): ExchangeRate | null => {
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (!cached) return null;

            const { rate, timestamp }: CachedRate = JSON.parse(cached);
            const now = Date.now();

            if (now - timestamp < CACHE_DURATION) {
                return rate;
            }

            return null;
        } catch (err) {
            console.error('Error loading cached rate:', err);
            return null;
        }
    };

    const saveCachedRate = (rate: ExchangeRate) => {
        try {
            const cacheData: CachedRate = {
                rate,
                timestamp: Date.now(),
            };
            localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
        } catch (err) {
            console.error('Error saving cached rate:', err);
        }
    };

    const fetchExchangeRate = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(EXCHANGE_RATE_API);

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();

            if (data.result === 'error') {
                throw new Error(data['error-type'] || 'API error');
            }
            const rates = data.conversion_rates || data.rates;

            if (!rates || !rates.INR) {
                throw new Error('Invalid API response format');
            }

            const newRate: ExchangeRate = {
                USD: 1,
                INR: rates.INR,
                lastUpdated: data.time_last_update_utc
                    ? new Date(data.time_last_update_utc).toISOString()
                    : new Date().toISOString(),
            };

            setExchangeRate(newRate);
            saveCachedRate(newRate);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch exchange rate';
            setError(errorMessage);
            console.error('Exchange rate fetch error:', err);

            const cached = loadCachedRate();
            if (cached) {
                setExchangeRate(cached);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const cached = loadCachedRate();

        if (cached) {
            setExchangeRate(cached);
            setLoading(false);
        } else {
            fetchExchangeRate();
        }
    }, [fetchExchangeRate]);

    return {
        exchangeRate,
        loading,
        error,
        refreshRate: fetchExchangeRate,
    };
};
