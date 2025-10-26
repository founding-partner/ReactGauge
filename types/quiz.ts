export type QuestionType = 'mcq' | 'boolean' | 'code';

export interface Question {
  id: string;
  type: QuestionType;
  prompt: string;
  description?: string;
  code?: string;
  options: string[];
  answerIndex: number;
  explanation?: string;
}

export interface AnswerRecord {
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
}
