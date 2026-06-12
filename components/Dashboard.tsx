import React from 'react';
// Fix: 'Page' cannot be used as a value because it was imported using 'import type'.
import { Page, type User, type StudyPlan } from '../types';
import ProgressTracker from './ProgressTracker';
import { PlannerIcon, BrainIcon, AssistantIcon, PlusIcon } from './icons';

interface DashboardProps {
  user: User;
  plans: StudyPlan[];
  onNavigate: (page: Page) => void;
}

const QuickLink: React.FC<{ icon: React.ReactNode; title: string; description: string; onClick: () => void; color: string }> = ({ icon, title, description, onClick, color }) => (
    <button onClick={onClick} className={`bg-base-200 p-6 rounded-xl shadow-lg flex flex-col items-start text-left hover:bg-base-300 transition-colors duration-200 w-full`}>
        <div className={`p-3 rounded-full mb-4`} style={{ backgroundColor: color }}>
            {icon}
        </div>
        <h4 className="text-lg font-bold text-base-content mb-1">{title}</h4>
        <p className="text-sm text-base-content/70 flex-grow">{description}</p>
    </button>
);


const Dashboard: React.FC<DashboardProps> = ({ user, plans, onNavigate }) => {
  const activePlan = plans.length > 0 ? plans[0] : null;

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-base-content">Welcome back, {user.name.split(' ')[0]}!</h1>
        <p className="text-base-content/70 mt-1">Ready to conquer your study goals today?</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProgressTracker plans={plans} />
        </div>
        <div className="bg-secondary text-secondary-content p-6 rounded-xl shadow-lg flex flex-col justify-center items-center text-center">
            <h3 className="text-xl font-bold mb-2">Today's Focus</h3>
            <p className="text-lg">{activePlan ? activePlan.subject : 'No active plan'}</p>
            <p className="text-sm opacity-80">{activePlan ? `${activePlan.days.flatMap(d => d.tasks).filter(t => !t.completed).length} tasks remaining` : 'Create a plan!'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <QuickLink 
            icon={<PlusIcon className="w-6 h-6 text-white"/>}
            title="New Study Plan"
            description="Generate a fresh plan for a new subject."
            onClick={() => onNavigate(Page.NewPlan)}
            color="#6366F1"
        />
         <QuickLink 
            icon={<PlannerIcon className="w-6 h-6 text-white"/>}
            title="View Plans"
            description="Review and update your existing plans."
            onClick={() => onNavigate(Page.Planner)}
            color="#EC4899"
        />
        <QuickLink 
            icon={<BrainIcon className="w-6 h-6 text-white"/>}
            title="Brain Buzz"
            description="Take a quick quiz to refresh your mind."
            onClick={() => onNavigate(Page.BrainBuzz)}
            color="#10B981"
        />
        <QuickLink 
            icon={<AssistantIcon className="w-6 h-6 text-white"/>}
            title="AI Assistant"
            description="Get summaries, tips, and explanations."
            onClick={() => onNavigate(Page.AiAssistant)}
            color="#F59E0B"
        />
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-4">Active Plans</h3>
        <div className="space-y-4">
            {plans.length > 0 ? plans.map(plan => (
                <div key={plan.id} className="bg-base-200 p-4 rounded-lg flex justify-between items-center shadow-md">
                    <div>
                        <h4 className="font-bold">{plan.planName}</h4>
                        <p className="text-sm text-base-content/70">{plan.subject}</p>
                    </div>
                    <button onClick={() => onNavigate(Page.Planner)} className="btn btn-sm bg-primary hover:bg-primary-focus text-primary-content">
                        View
                    </button>
                </div>
            )) : (
                 <div className="bg-base-200 p-6 rounded-lg text-center shadow-md">
                    <p className="text-base-content/70">You have no active study plans.</p>
                    <button onClick={() => onNavigate(Page.NewPlan)} className="btn btn-primary mt-4">Create a Plan</button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;