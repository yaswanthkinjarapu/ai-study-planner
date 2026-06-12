
export interface User {
  name: string;
  email: string;
  avatarUrl: string;
}

export interface StudyTask {
  id: string;
  task: string;
  completed: boolean;
}

export interface StudyDay {
  day: number;
  title: string;
  tasks: StudyTask[];
}

export interface StudyPlan {
  id: string;
  subject: string;
  topics: string;
  duration: number;
  planName: string;
  days: StudyDay[];
  createdAt: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Quiz {
  topic: string;
  questions: QuizQuestion[];
}

export interface AiAssistantMessage {
  role: 'user' | 'assistant';
  content: string;
}

export enum Page {
  Dashboard,
  Planner,
  BrainBuzz,
  AiAssistant,
  NewPlan,
}
