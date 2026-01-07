import { useState } from 'react';
import type { Goal, Currency, Contribution } from './types/index.js';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useExchangeRate } from './hooks/useExchangeRate';
import { FinancialOverview } from './components/FinancialOverview';
import { GoalCard } from './components/GoalCard';
import { ContributionModal } from './components/ContributionModal';
import { AddGoalModal } from './components/AddGoalModal';
import { EmptyState } from './components/EmptyState';

function App() {
  const [goals, setGoals] = useLocalStorage<Goal[]>('savings-goals', []);

  const { exchangeRate, loading: rateLoading, error: rateError, refreshRate } = useExchangeRate();

  // Modal states
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

  const handleAddGoal = (name: string, targetAmount: number, currency: Currency) => {
    const newGoal: Goal = {
      id: crypto.randomUUID(),
      name,
      targetAmount,
      currency,
      currentAmount: 0,
      contributions: [],
      createdAt: new Date().toISOString(),
    };

    setGoals([...goals, newGoal]);
  };

  const handleOpenContributionModal = (goalId: string) => {
    setSelectedGoalId(goalId);
    setIsContributionModalOpen(true);
  };

  const handleAddContribution = (amount: number, date: string) => {
    if (!selectedGoalId) return;

    const contribution: Contribution = {
      id: crypto.randomUUID(),
      amount,
      date,
      createdAt: new Date().toISOString(),
    };

    setGoals(goals.map(goal => {
      if (goal.id === selectedGoalId) {
        return {
          ...goal,
          currentAmount: goal.currentAmount + amount,
          contributions: [...goal.contributions, contribution],
        };
      }
      return goal;
    }));
  };

  const selectedGoal = goals.find(g => g.id === selectedGoalId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="bg-indigo-600 rounded-lg p-1.5">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-indigo-600">
                Syfe Savings Planner
              </h1>
            </div>
            <p className="text-sm text-gray-600">Track your financial goals and build your future</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Financial Overview */}
        <FinancialOverview
          goals={goals}
          exchangeRateInfo={{
            rate: exchangeRate.INR,
            lastUpdated: exchangeRate.lastUpdated,
            loading: rateLoading,
            error: rateError,
          }}
          onRefreshRate={refreshRate}
        />

        {/* Your Goals Section */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Your Goals</h2>
              <p className="text-sm text-gray-600 mt-0.5">Manage and track your savings objectives</p>
            </div>
            <button
              onClick={() => setIsAddGoalModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm hover:shadow"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Goal
            </button>
          </div>

          {/* Goals Grid or Empty State */}
          {goals.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {goals.map(goal => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  exchangeRates={exchangeRate}
                  onAddContribution={handleOpenContributionModal}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add Goal Modal */}
      <AddGoalModal
        isOpen={isAddGoalModalOpen}
        onClose={() => setIsAddGoalModalOpen(false)}
        onAddGoal={handleAddGoal}
      />

      {/* Contribution Modal */}
      <ContributionModal
        isOpen={isContributionModalOpen}
        goalName={selectedGoal?.name || ''}
        onClose={() => {
          setIsContributionModalOpen(false);
          setSelectedGoalId(null);
        }}
        onAddContribution={handleAddContribution}
      />

      {/* Footer */}
      <footer className="mt-12 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-xs text-gray-500">
            Built with React 18, TypeScript & Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
