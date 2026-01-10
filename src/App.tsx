import { useState } from 'react';
import type { Goal, Currency, Contribution } from './types/index.js';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useExchangeRate } from './hooks/useExchangeRate';
import { FinancialOverview } from './components/FinancialOverview';
import { GoalCard } from './components/GoalCard';
import { ContributionModal } from './components/ContributionModal';
import { AddGoalModal } from './components/AddGoalModal';
import { EditGoalModal } from './components/EditGoalModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { ContributionsListModal } from './components/ContributionsListModal';
import { EmptyState } from './components/EmptyState';
import { FaPlus } from "react-icons/fa6";
import { TbCoinRupee } from "react-icons/tb";

function App() {
  const [goals, setGoals] = useLocalStorage<Goal[]>('savings-goals', []);

  const { exchangeRate, loading: rateLoading, error: rateError, refreshRate } = useExchangeRate();

  // Modal states
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  const [isEditGoalModalOpen, setIsEditGoalModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);
  const [isContributionsListModalOpen, setIsContributionsListModalOpen] = useState(false);
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

  const handleOpenContributionsListModal = (goalId: string) => {
    setSelectedGoalId(goalId);
    setIsContributionsListModalOpen(true);
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

  const handleOpenEditModal = (goalId: string) => {
    setSelectedGoalId(goalId);
    setIsEditGoalModalOpen(true);
  };

  const handleEditGoal = (goalId: string, name: string, targetAmount: number, currency: Currency) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        return {
          ...goal,
          name,
          targetAmount,
          currency,
        };
      }
      return goal;
    }));
  };

  const handleOpenDeleteConfirm = (goalId: string) => {
    setSelectedGoalId(goalId);
    setIsDeleteConfirmModalOpen(true);
  };

  const handleDeleteGoal = () => {
    if (!selectedGoalId) return;
    setGoals(goals.filter(goal => goal.id !== selectedGoalId));
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
                <TbCoinRupee className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-indigo-600">
                Syfe Savings Planner
              </h1>
            </div>
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
              <FaPlus />
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
                  onViewContributions={handleOpenContributionsListModal}
                  onEditGoal={handleOpenEditModal}
                  onDeleteGoal={handleOpenDeleteConfirm}
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
        currency={selectedGoal?.currency || 'USD'}
        onClose={() => {
          setIsContributionModalOpen(false);
          setSelectedGoalId(null);
        }}
        onAddContribution={handleAddContribution}
      />

      {/* Contributions List Modal */}
      <ContributionsListModal
        isOpen={isContributionsListModalOpen}
        goalName={selectedGoal?.name || ''}
        contributions={selectedGoal?.contributions || []}
        currency={selectedGoal?.currency || 'USD'}
        onClose={() => {
          setIsContributionsListModalOpen(false);
          setSelectedGoalId(null);
        }}
      />

      {/* Edit Goal Modal */}
      <EditGoalModal
        isOpen={isEditGoalModalOpen}
        goal={selectedGoal || null}
        onClose={() => {
          setIsEditGoalModalOpen(false);
          setSelectedGoalId(null);
        }}
        onEditGoal={handleEditGoal}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteConfirmModalOpen}
        goalName={selectedGoal?.name || ''}
        onClose={() => {
          setIsDeleteConfirmModalOpen(false);
          setSelectedGoalId(null);
        }}
        onConfirm={handleDeleteGoal}
      />
    </div>
  );
}

export default App;
