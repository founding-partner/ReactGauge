export type QuizExplanationState = {
  prompt: string;
  explanation: string;
  selectedLabel: string;
  correctLabel: string;
  isCorrect: boolean;
};

export type QuizExplanationHandlers = {
  onDismiss: () => void;
};
