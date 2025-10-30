import { AnswerRecord, Question } from './quiz';

export type AttemptQuestion = Pick<
  Question,
  'id' | 'prompt' | 'options' | 'answerIndex' | 'description' | 'code' | 'topic' | 'explanation'
>;

export interface QuizAttempt {
  id: string;
  timestamp: string;
  difficulty: 'easy' | 'medium' | 'hard';
  score: {
    correct: number;
    total: number;
  };
  streak: number;
  userMode: 'github' | 'guest';
  userLogin: string;
  questions: AttemptQuestion[];
  answers: AnswerRecord[];
}

export type QuizAttemptHistory = QuizAttempt[];
