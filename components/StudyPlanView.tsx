
import React, { useState } from 'react';
import type { StudyPlan, StudyDay, StudyTask } from '../types';
import { ChevronDownIcon, PlusIcon } from './icons';

const DayAccordion: React.FC<{ day: StudyDay; onTaskToggle: (dayIndex: number, taskId: string) => void }> = ({ day, onTaskToggle }) => {
    const [isOpen, setIsOpen] = useState(day.day === 1);
    const completedTasks = day.tasks.filter(t => t.completed).length;
    const totalTasks = day.tasks.length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return (
        <div className="bg-base-200 rounded-lg shadow-md overflow-hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full p-4 flex justify-between items-center text-left">
                <div className="flex-grow">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold">Day {day.day}: {day.title}</h3>
                         <span className="text-sm font-medium text-base-content/70">{completedTasks} / {totalTasks} tasks</span>
                    </div>
                    <div className="w-full bg-base-300 rounded-full h-2 mt-2">
                        <div className="bg-success h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
                <ChevronDownIcon className={`w-6 h-6 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="p-4 border-t border-base-300">
                    <ul className="space-y-3">
                        {day.tasks.map(task => (
                            <li key={task.id} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={task.id}
                                    checked={task.completed}
                                    onChange={() => onTaskToggle(day.day - 1, task.id)}
                                    className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <label htmlFor={task.id} className={`ml-3 text-base-content ${task.completed ? 'line-through text-base-content/50' : ''}`}>
                                    {task.task}
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};


interface StudyPlanViewProps {
  plans: StudyPlan[];
  updatePlan: (updatedPlan: StudyPlan) => void;
  onNavigate: (page: 'NewPlan') => void;
}

const StudyPlanView: React.FC<StudyPlanViewProps> = ({ plans, updatePlan, onNavigate }) => {
  const [activePlanId, setActivePlanId] = useState<string | null>(plans.length > 0 ? plans[0].id : null);

  const handleTaskToggle = (planId: string, dayIndex: number, taskId: string) => {
    const planToUpdate = plans.find(p => p.id === planId);
    if (!planToUpdate) return;

    const updatedDays = [...planToUpdate.days];
    const updatedTasks = [...updatedDays[dayIndex].tasks];
    const taskIndex = updatedTasks.findIndex(t => t.id === taskId);

    if (taskIndex !== -1) {
      updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], completed: !updatedTasks[taskIndex].completed };
      updatedDays[dayIndex] = { ...updatedDays[dayIndex], tasks: updatedTasks };
      updatePlan({ ...planToUpdate, days: updatedDays });
    }
  };
  
  const activePlan = plans.find(p => p.id === activePlanId);

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
            <h1 className="text-3xl font-bold">Your Study Plans</h1>
            <p className="text-base-content/70 mt-1">Stay on track with your personalized schedules.</p>
        </div>
        <button onClick={() => onNavigate('NewPlan')} className="btn btn-primary bg-primary hover:bg-primary-focus text-primary-content flex items-center gap-2">
            <PlusIcon />
            Create New Plan
        </button>
      </div>

      {plans.length > 0 ? (
        <>
        <div className="mb-6">
            <select
                value={activePlanId || ''}
                onChange={(e) => setActivePlanId(e.target.value)}
                className="w-full md:w-auto bg-base-200 border-base-300 rounded-lg p-3 focus:ring-primary focus:border-primary"
            >
                {plans.map(plan => (
                    <option key={plan.id} value={plan.id}>{plan.planName} - {plan.subject}</option>
                ))}
            </select>
        </div>

        {activePlan && (
            <div className="space-y-4">
                {activePlan.days.map(day => (
                    <DayAccordion key={day.day} day={day} onTaskToggle={(dayIndex, taskId) => handleTaskToggle(activePlan.id, dayIndex, taskId)} />
                ))}
            </div>
        )}
        </>
      ) : (
        <div className="text-center bg-base-200 p-12 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-2">No Plans Yet!</h2>
            <p className="text-base-content/70 mb-6">It looks like you haven't created any study plans. Let's make one!</p>
            <button onClick={() => onNavigate('NewPlan')} className="btn btn-primary bg-primary hover:bg-primary-focus text-primary-content">
                Create Your First Plan
            </button>
        </div>
      )}
    </div>
  );
};

export default StudyPlanView;
