export type QuizToolbarState = {
  showExit: boolean;
  showPrevious: boolean;
  showSubmit: boolean;
  showNext: boolean;
  isLastQuestion: boolean;
};

export type QuizToolbarHandlers = {
  onExit: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
  onNext: () => void;
};
