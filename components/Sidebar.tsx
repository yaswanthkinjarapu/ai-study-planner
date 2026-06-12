
import React from 'react';
import { Page } from '../types';
import { DashboardIcon, PlannerIcon, BrainIcon, AssistantIcon, LogoutIcon } from './icons';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  isOpen: boolean;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <li>
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-primary text-primary-content shadow-md'
          : 'text-base-content/70 hover:bg-base-300 hover:text-base-content'
      }`}
    >
      {icon}
      <span className="ml-4 font-medium">{label}</span>
    </a>
  </li>
);

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, onLogout, isOpen }) => {
  return (
    <aside className={`absolute md:relative z-20 bg-base-200 h-full flex-shrink-0 transition-all duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-0 overflow-hidden md:w-20'}`}>
        <div className={`p-4 h-full flex flex-col ${isOpen ? '' : 'md:items-center'}`}>
            <div className={`flex items-center mb-10 ${isOpen ? 'justify-start' : 'md:justify-center'}`}>
                <div className="bg-primary p-2 rounded-lg">
                    <BrainIcon className="w-8 h-8 text-primary-content" />
                </div>
                {isOpen && <h1 className="text-xl font-bold ml-3">AI Planner</h1>}
            </div>

            <nav className="flex-grow">
                <ul>
                    <NavItem icon={<DashboardIcon />} label="Dashboard" isActive={currentPage === Page.Dashboard} onClick={() => onNavigate(Page.Dashboard)} />
                    <NavItem icon={<PlannerIcon />} label="Study Planner" isActive={currentPage === Page.Planner} onClick={() => onNavigate(Page.Planner)} />
                    <NavItem icon={<BrainIcon />} label="Brain Buzz" isActive={currentPage === Page.BrainBuzz} onClick={() => onNavigate(Page.BrainBuzz)} />
                    <NavItem icon={<AssistantIcon />} label="AI Assistant" isActive={currentPage === Page.AiAssistant} onClick={() => onNavigate(Page.AiAssistant)} />
                </ul>
            </nav>

            <div className="mt-auto">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onLogout();
                  }}
                  className="flex items-center p-3 rounded-lg text-base-content/70 hover:bg-error hover:text-white transition-colors duration-200"
                >
                    <LogoutIcon />
                    {isOpen && <span className="ml-4 font-medium">Logout</span>}
                </a>
            </div>
        </div>
    </aside>
  );
};

export default Sidebar;
