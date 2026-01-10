import React from 'react';
import { FaRupeeSign } from "react-icons/fa";

export const EmptyState: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="text-center max-w-md">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="bg-indigo-100 rounded-2xl p-6">
                        <FaRupeeSign className="w-16 h-16 text-indigo-600" />
                    </div>
                </div>

                {/* Text Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No Goals Yet</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                    Create your first savings goal and start tracking your progress towards financial success.
                </p>

                {/* Info Box */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 text-left">
                    <p className="text-sm font-semibold text-gray-900 mb-3">Get started:</p>
                    <div className="space-y-2.5">
                        <div className="flex items-start gap-2.5 text-sm text-gray-700">
                            <div className="bg-indigo-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</div>
                            <p>Click the <strong>"Add Goal"</strong> button above</p>
                        </div>
                        <div className="flex items-start gap-2.5 text-sm text-gray-700">
                            <div className="bg-indigo-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</div>
                            <p>Set your target amount in <strong>USD or INR</strong></p>
                        </div>
                        <div className="flex items-start gap-2.5 text-sm text-gray-700">
                            <div className="bg-indigo-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</div>
                            <p>Track progress by adding contributions</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
