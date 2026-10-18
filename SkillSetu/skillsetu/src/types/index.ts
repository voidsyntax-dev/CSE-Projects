export interface Career {
  id: string;
  name: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  avgSalary: string;
  learningTime: string;
  skills: string[];
}

export interface Subskill {
  id: string;
  name: string;
  resources: Resource[];
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  subskills: Subskill[];
  dependsOn?: string[];
}

export interface Resource {
  id: string;
  type: "video" | "article" | "course" | "book";
  title: string;
  url: string;
  duration?: string;
  difficulty: number;
  rating: number | null;
}

export interface Question {
  id: string;
  skill: string;
  subskill?: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  difficulty: number;
}

export interface SubskillMasteryData {
  score: number;              // 0-100, mastery % at time of last practice
  lastPracticedAt: string;    // ISO timestamp
  attemptCount: number;       // total attempts on this subskill
  correctCount: number;       // total correct answers
  streak: number;             // current consecutive correct answers
}

export type MasteryStore = Record<string, SubskillMasteryData>;
export type MasteryState = Record<string, number>;
export type DecayRisk = "stable" | "medium" | "high";
