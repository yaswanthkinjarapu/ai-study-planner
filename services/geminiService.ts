
import { GoogleGenAI, Type } from "@google/genai";
import type { StudyPlan, QuizQuestion, StudyDay } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const studyPlanSchema = {
  type: Type.OBJECT,
  properties: {
    planName: { type: Type.STRING, description: "A creative and motivating name for the study plan." },
    days: {
      type: Type.ARRAY,
      description: "An array of daily study schedules.",
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.INTEGER, description: "The day number, starting from 1." },
          title: { type: Type.STRING, description: "A concise title for the day's focus." },
          tasks: {
            type: Type.ARRAY,
            description: "A list of specific tasks for the day.",
            items: {
              type: Type.OBJECT,
              properties: {
                task: { type: Type.STRING, description: "A detailed description of the study task." },
              },
              required: ["task"],
            },
          },
        },
        required: ["day", "title", "tasks"],
      },
    },
  },
  required: ["planName", "days"],
};

export const generateStudyPlan = async (subject: string, topics: string, duration: number): Promise<Omit<StudyPlan, 'id' | 'createdAt' | 'subject' | 'topics' | 'duration'>> => {
  try {
    const prompt = `Generate a detailed ${duration}-day study plan for the subject "${subject}". The main topics to cover are: ${topics}. Break it down into daily tasks. The plan should be structured, realistic, and motivating. Provide a creative name for the plan.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: studyPlanSchema,
      },
    });

    const parsedResponse = JSON.parse(response.text);

    // Add id and completed status to tasks
    const planWithIds = {
        ...parsedResponse,
        days: parsedResponse.days.map((day: StudyDay) => ({
            ...day,
            tasks: day.tasks.map((task: { task: string }) => ({
                id: `task-${Math.random().toString(36).substr(2, 9)}`,
                task: task.task,
                completed: false,
            })),
        })),
    };

    return planWithIds;
  } catch (error) {
    console.error("Error generating study plan:", error);
    throw new Error("Failed to generate study plan. Please try again.");
  }
};


const quizSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      question: { type: Type.STRING },
      options: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
      correctAnswer: { type: Type.STRING },
    },
    required: ["question", "options", "correctAnswer"],
  },
};

export const generateQuiz = async (topic: string): Promise<QuizQuestion[]> => {
    try {
        const prompt = `Create a 5-question multiple-choice quiz on the topic of "${topic}". Each question should have 4 options. Ensure one of the options is the correct answer.`;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: quizSchema,
            },
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Error generating quiz:", error);
        throw new Error("Failed to generate quiz. Please try again.");
    }
};

export const getAiAssistance = async (prompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]): Promise<string> => {
    try {
        const chat = ai.chats.create({ 
            model: 'gemini-2.5-flash',
            history
        });
        const response = await chat.sendMessage({ message: prompt });
        return response.text;
    } catch (error) {
        console.error("Error getting AI assistance:", error);
        throw new Error("Failed to get AI assistance. Please try again.");
    }
};
