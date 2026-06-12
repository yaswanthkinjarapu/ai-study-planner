
import React, { useState, useCallback } from 'react';
import type { User, StudyPlan, Page } from './types';
import { Page as PageEnum } from './types';
import LoginScreen from './components/LoginScreen';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import StudyPlannerCreator from './components/StudyPlannerCreator';
import StudyPlanView from './components/StudyPlanView';
import BrainBuzz from './components/BrainBuzz';
import AiAssistant from './components/AiAssistant';
import { MenuIcon, CloseIcon } from './components/icons';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user] = useState<User>({
    name: 'Alex Johnson',
    email: 'alex.j@example.com',
    avatarUrl: 'https://picsum.photos/seed/alex/100/100',
  });
  const [currentPage, setCurrentPage] = useState<Page>(PageEnum.Dashboard);
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  const handlePlanCreated = (plan: StudyPlan) => {
    setStudyPlans(prev => [plan, ...prev]);
    setCurrentPage(PageEnum.Planner);
  };
  
  const handleUpdatePlan = (updatedPlan: StudyPlan) => {
      setStudyPlans(prevPlans => prevPlans.map(p => p.id === updatedPlan.id ? updatedPlan : p));
  };
  
  const handleNavigate = (page: Page) => {
      setCurrentPage(page);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
  };

  const renderPage = () => {
    switch (currentPage) {
      case PageEnum.Dashboard:
        return <Dashboard user={user} plans={studyPlans} onNavigate={setCurrentPage} />;
      case PageEnum.Planner:
        return <StudyPlanView plans={studyPlans} updatePlan={handleUpdatePlan} onNavigate={() => setCurrentPage(PageEnum.NewPlan)} />;
      case PageEnum.NewPlan:
        return <StudyPlannerCreator onPlanCreated={handlePlanCreated} />;
      case PageEnum.BrainBuzz:
        return <BrainBuzz plans={studyPlans} />;
      case PageEnum.AiAssistant:
        return <AiAssistant user={user} />;
      default:
        return <Dashboard user={user} plans={studyPlans} onNavigate={setCurrentPage} />;
    }
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-base-100 text-base-content">
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={handleNavigate} 
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
         <header className="flex md:hidden items-center justify-between p-4 bg-base-200 border-b border-base-300">
            <h1 className="text-lg font-bold">AI Planner</h1>
            <button onClick={() => setSidebarOpen(!isSidebarOpen)}>
                {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
        </header>
        <div className="flex-1 overflow-y-auto">
            {renderPage()}
        </div>
      </main>
    </div>
  );
};

export default App;
