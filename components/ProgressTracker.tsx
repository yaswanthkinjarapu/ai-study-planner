
import React from 'react';
import type { StudyPlan } from '../types';

interface ProgressTrackerProps {
  plans: StudyPlan[];
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ plans }) => {
  if (plans.length === 0) {
    return (
      <div className="bg-base-200 p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold mb-2">Overall Progress</h3>
        <p className="text-base-content/70">No active study plans. Create one to get started!</p>
      </div>
    );
  }

  const totalTasks = plans.reduce((acc, plan) => acc + plan.days.flatMap(d => d.tasks).length, 0);
  const completedTasks = plans.reduce((acc, plan) => acc + plan.days.flatMap(d => d.tasks).filter(t => t.completed).length, 0);
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="bg-base-200 p-6 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Overall Progress</h3>
        <span className="font-bold text-primary text-lg">{progressPercentage}%</span>
      </div>
      <div className="w-full bg-base-300 rounded-full h-4">
        <div
          className="bg-primary h-4 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <p className="text-sm text-base-content/70 mt-2">
        You've completed {completedTasks} out of {totalTasks} tasks. Keep up the great work!
      </p>
    </div>
  );
};

export default ProgressTracker;
