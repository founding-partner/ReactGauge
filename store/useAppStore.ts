import { create } from 'zustand';
import questionsData from '../data/questions.json';
import { AnswerRecord, Question } from '../types/quiz';

export type Difficulty = 'easy' | 'medium' | 'hard';

export const REMOTE_QUESTIONS_URL =
  'https://raw.githubusercontent.com/founding-partner/ReactGauge/refs/heads/main/data/questions.json';

const localQuestions = questionsData as Question[];
export const LOCAL_QUESTIONS = localQuestions;

type AppStore = {
  allQuestions: Question[];
  difficulty: Difficulty;
  iconSize: number;
  activeQuestions: Question[];
  completedQuestions: Question[];
  quizAnswers: AnswerRecord[];
  dailyWarmupQuestion: Question | null;
  setQuestions: (questions: Question[]) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setIconSize: (size: number) => void;
  setActiveQuestions: (questions: Question[]) => void;
  setCompletedQuestions: (questions: Question[]) => void;
  setQuizAnswers: (answers: AnswerRecord[]) => void;
  refreshWarmupQuestion: () => void;
  pickQuestionsForDifficulty: (difficulty: Difficulty) => Question[];
};

const DEFAULT_ICON_SIZE = 24;
const QUESTION_COUNT_BY_DIFFICULTY: Record<Difficulty, number> = {
  easy: 10,
  medium: 25,
  hard: 50,
};

const pickRandomQuestion = (pool: Question[]): Question | null => {
  if (pool.length === 0) {
    return null;
  }
  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
};

const shuffleQuestions = (pool: Question[]) => {
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool;
};

export const useAppStore = create<AppStore>((set, get) => ({
  allQuestions: localQuestions,
  difficulty: 'easy',
  iconSize: DEFAULT_ICON_SIZE,
  activeQuestions: [],
  completedQuestions: [],
  quizAnswers: [],
  dailyWarmupQuestion: pickRandomQuestion(localQuestions),
  setQuestions: (questions) =>
    set(() => ({
      allQuestions: questions,
      dailyWarmupQuestion: pickRandomQuestion(questions),
    })),
  setDifficulty: (difficulty) => set({ difficulty }),
  setIconSize: (size) => set({ iconSize: size }),
  setActiveQuestions: (questions) => set({ activeQuestions: questions }),
  setCompletedQuestions: (questions) => set({ completedQuestions: questions }),
  setQuizAnswers: (answers) => set({ quizAnswers: answers }),
  refreshWarmupQuestion: () => {
    const questions = get().allQuestions;
    const next = pickRandomQuestion(questions);
    if (next) {
      set({ dailyWarmupQuestion: next });
    }
  },
  pickQuestionsForDifficulty: (difficulty) => {
    const pool = shuffleQuestions([...get().allQuestions]);
    const desiredCount = QUESTION_COUNT_BY_DIFFICULTY[difficulty];
    const maxCount = Math.min(desiredCount, pool.length);
    return pool.slice(0, maxCount);
  },
}));

export const getQuestionCountForDifficulty = (difficulty: Difficulty) =>
  QUESTION_COUNT_BY_DIFFICULTY[difficulty];
