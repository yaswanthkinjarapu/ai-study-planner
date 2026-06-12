
import React from 'react';
import { BrainIcon } from './icons';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="inline-block bg-primary p-4 rounded-full mb-6 animate-bounce">
            <BrainIcon className="w-16 h-16 text-primary-content" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-base-content mb-2">
          AI Study Planner
        </h1>
        <p className="text-lg text-base-content/70 mb-8">
          Unlock your potential. Your personalized, intelligent study partner awaits.
        </p>
        <button
          onClick={onLogin}
          className="btn btn-primary bg-primary hover:bg-primary-focus text-primary-content font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out text-lg w-full max-w-xs"
        >
          Sign In & Start Learning
        </button>
      </div>
    </div>
  );
};

export default LoginScreen;
