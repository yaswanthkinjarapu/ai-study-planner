
import React, { useState } from 'react';
import type { StudyPlan } from '../types';
import { generateStudyPlan } from '../services/geminiService';
import { PlannerIcon } from './icons';

interface StudyPlannerCreatorProps {
  onPlanCreated: (plan: StudyPlan) => void;
}

const StudyPlannerCreator: React.FC<StudyPlannerCreatorProps> = ({ onPlanCreated }) => {
  const [subject, setSubject] = useState('');
  const [topics, setTopics] = useState('');
  const [duration, setDuration] = useState(7);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !topics || duration <= 0) {
      setError("Please fill in all fields and set a valid duration.");
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const generatedPart = await generateStudyPlan(subject, topics, duration);
      const newPlan: StudyPlan = {
        id: `plan-${Date.now()}`,
        subject,
        topics,
        duration,
        createdAt: new Date().toISOString(),
        ...generatedPart
      };
      onPlanCreated(newPlan);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
            <PlannerIcon className="w-12 h-12 mx-auto text-primary mb-2" />
            <h1 className="text-3xl font-bold">Create a New Study Plan</h1>
            <p className="text-base-content/70 mt-2">Let our AI craft the perfect study schedule for you.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-base-200 p-8 rounded-xl shadow-lg space-y-6">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-base-content/80 mb-2">Subject</label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Modern History"
              className="w-full bg-base-300 border-base-300 rounded-lg p-3 focus:ring-primary focus:border-primary"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="topics" className="block text-sm font-medium text-base-content/80 mb-2">Key Topics</label>
            <textarea
              id="topics"
              rows={4}
              value={topics}
              onChange={(e) => setTopics(e.target.value)}
              placeholder="e.g., World War I, The Cold War, Post-War Reconstruction"
              className="w-full bg-base-300 border-base-300 rounded-lg p-3 focus:ring-primary focus:border-primary"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-base-content/80 mb-2">Duration (in days)</label>
            <input
              type="number"
              id="duration"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value, 10))}
              min="1"
              max="90"
              className="w-full bg-base-300 border-base-300 rounded-lg p-3 focus:ring-primary focus:border-primary"
              disabled={isLoading}
            />
          </div>

          {error && <p className="text-error text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full btn btn-primary bg-primary hover:bg-primary-focus text-primary-content font-bold py-3 rounded-lg shadow-lg flex items-center justify-center disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? (
                <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Plan...
                </>
            ) : "Generate My Plan"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudyPlannerCreator;
