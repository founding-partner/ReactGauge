import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
  ViewProps,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import ConfettiCannon from 'react-native-confetti-cannon';
import {
  OptionButton,
  ProgressBar,
  QuestionCard,
  QuizHeader,
  makeStyles,
  useTheme,
} from '../components';
import { AnswerRecord, Question } from '../types/quiz';
import { QuizToolbarHandlers, QuizToolbarState } from '../types/quizToolbar';
import {
  QuizExplanationHandlers,
  QuizExplanationState,
} from '../types/quizExplanation';

export interface QuizScreenProps extends ViewProps {
  questions: Question[];
  username: string;
  avatarUrl?: string;
  streakDays?: number;
  isGuest?: boolean;
  onExit: () => void;
  onComplete: (answers: AnswerRecord[]) => void;
  onToolbarUpdate?: (
    state: QuizToolbarState,
    handlers: QuizToolbarHandlers,
  ) => void;
  onExplanationUpdate?: (
    state: QuizExplanationState | null,
    handlers: QuizExplanationHandlers,
  ) => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  questions,
  username,
  avatarUrl,
  streakDays = 0,
  isGuest = false,
  onExit,
  onComplete,
  onToolbarUpdate,
  onExplanationUpdate,
  style,
  ...rest
}) => {
  const windowWidth = Dimensions.get('window').width;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [confettiBurst, setConfettiBurst] = useState(0);
  const [explanationVisible, setExplanationVisible] = useState(false);
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = useStyles();

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;

  // if (questions.length === 0) {
  //   return (
  //     <View style={[styles.root, style, styles.emptyState]} {...rest}>
  //       <Text style={styles.emptyTitle}>{t('quiz.emptyTitle')}</Text>
  //       <Text style={styles.emptySubtitle}>{t('quiz.emptySubtitle')}</Text>
  //     </View>
  //   );
  // }

  const progress = (currentIndex + (submitted ? 1 : 0)) / totalQuestions;

  const milestones = useMemo(
    () =>
      questions.map((_, index) => (index + 1) / totalQuestions),
    [questions, totalQuestions],
  );

  const currentAnswer = answers.find(
    (answer) => answer.questionId === currentQuestion.id,
  );

  const effectiveSelectedIndex =
    submitted && currentAnswer
      ? currentAnswer.selectedIndex
      : selectedOption ?? currentAnswer?.selectedIndex ?? null;

  const isLastQuestion = currentIndex === totalQuestions - 1;

  const handleSelectOption = (index: number) => {
    if (submitted) {
      return;
    }
    setSelectedOption(index);
  };

  const handleSubmit = useCallback(() => {
    if (selectedOption == null) {
      return;
    }

    const isCorrect = selectedOption === currentQuestion.answerIndex;
    const record: AnswerRecord = {
      questionId: currentQuestion.id,
      selectedIndex: selectedOption,
      isCorrect,
    };

    setAnswers((prev) => {
      const filtered = prev.filter(
        (entry) => entry.questionId !== currentQuestion.id,
      );
      return [...filtered, record];
    });
    setSubmitted(true);

    if (currentQuestion.explanation) {
      setExplanationVisible(true);
    } else {
      setExplanationVisible(false);
    }

    if (isCorrect) {
      setConfettiBurst((prev) => prev + 1);
    }
  }, [currentQuestion, selectedOption]);

  const handleExit = useCallback(() => {
    setExplanationVisible(false);
    onExit();
  }, [onExit]);

  const handleNext = useCallback(() => {
    if (!submitted) {
      return;
    }

    if (isLastQuestion) {
      setExplanationVisible(false);
      onComplete(answers);
      return;
    }

    const nextIndex = Math.min(currentIndex + 1, totalQuestions - 1);
    setCurrentIndex(nextIndex);
    setSelectedOption(null);
    setSubmitted(Boolean(answers.some((a) => a.questionId === questions[nextIndex].id)));
    setExplanationVisible(false);
  }, [
    answers,
    currentIndex,
    isLastQuestion,
    onComplete,
    questions,
    submitted,
    totalQuestions,
  ]);

  const handlePrevious = useCallback(() => {
    setExplanationVisible(false);
    if (currentIndex === 0) {
      return;
    }

    const prevIndex = Math.max(currentIndex - 1, 0);
    setCurrentIndex(prevIndex);
    setSelectedOption(null);
    setSubmitted(Boolean(answers.some((a) => a.questionId === questions[prevIndex].id)));
  }, [answers, currentIndex, questions]);

  useEffect(() => {
    setExplanationVisible(false);
  }, [currentQuestion.id]);

  const showExplanation =
    explanationVisible &&
    Boolean(currentQuestion.explanation) &&
    Boolean(currentAnswer);

  const handleDismissExplanation = useCallback(() => {
    setExplanationVisible(false);
  }, []);

  const explanationHandlers = useMemo(
    () => ({ onDismiss: handleDismissExplanation }),
    [handleDismissExplanation],
  );

  useEffect(() => {
    if (!onExplanationUpdate) {
      return;
    }

    if (!showExplanation || !currentAnswer) {
      onExplanationUpdate(null, explanationHandlers);
      return;
    }

    const selectedLabel =
      currentAnswer.selectedIndex != null
        ? currentQuestion.options[currentAnswer.selectedIndex] ?? '—'
        : '—';
    const correctLabel =
      currentQuestion.options[currentQuestion.answerIndex] ?? '—';

    onExplanationUpdate(
      {
        prompt: currentQuestion.prompt,
        explanation: currentQuestion.explanation ?? '',
        selectedLabel,
        correctLabel,
        isCorrect: currentAnswer.isCorrect,
      },
      explanationHandlers,
    );
  }, [
    currentAnswer,
    currentQuestion,
    explanationHandlers,
    onExplanationUpdate,
    showExplanation,
  ]);

  const showExit = currentIndex === 0;
  const showPrevious = currentIndex > 0;
  const showSubmit = selectedOption != null && !submitted && !showExplanation;
  const showNext = submitted && !showExplanation;

  useEffect(() => {
    if (!onToolbarUpdate) {
      return;
    }

    onToolbarUpdate(
      {
        showExit,
        showPrevious,
        showSubmit,
        showNext,
        isLastQuestion,
      },
      {
        onExit: handleExit,
        onPrevious: handlePrevious,
        onSubmit: handleSubmit,
        onNext: handleNext,
      },
    );
  }, [
    handleExit,
    handleNext,
    handlePrevious,
    handleSubmit,
    isLastQuestion,
    onToolbarUpdate,
    showExit,
    showNext,
    showPrevious,
    showSubmit,
  ]);

  return (
    <View style={[styles.root, style]}>
      {confettiBurst > 0 ? (
        <View style={styles.confettiLayer} pointerEvents="none">
          <ConfettiCannon
            key={confettiBurst}
            count={100}
            origin={{ x: windowWidth / 2, y: 0 }}
            fadeOut
            explosionSpeed={320}
            fallSpeed={2400}
          />
        </View>
      ) : null}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.container,
          {
            paddingBottom: theme.spacing.xxl,
          },
        ]}
        showsVerticalScrollIndicator={false}
        {...rest}
      >
        <QuizHeader
          title={t('quiz.title')}
          // subtitle={t('quiz.subtitle', {
          //   current: currentIndex + 1,
          //   total: totalQuestions,
          // })}
          subtitle={
            isGuest
              ? t('common.guestMode')
              : t('common.streakDays', { count: Math.max(streakDays, 0) })
          }
          avatarUri={avatarUrl}
          initials={getInitials(username)}
          currentQuestion={currentIndex + 1}
          totalQuestions={totalQuestions}
          // timeRemainingLabel={
          //   isGuest
          //     ? t('common.guestMode')
          //     : t('common.streakDays', { count: Math.max(streakDays, 0) })
          // }
        />

        <ProgressBar progress={progress} milestones={milestones} />

        <QuestionCard
          title={currentQuestion.prompt}
          description={currentQuestion.description}
          codeSnippet={currentQuestion.code}
        >
          {currentQuestion.options.map((option, index) => (
            <OptionButton
              key={option}
              label={option}
              selected={effectiveSelectedIndex === index}
              onPress={() => handleSelectOption(index)}
              disabled={submitted}
              status={deriveStatus({
                index,
                submitted,
                selectedIndex: effectiveSelectedIndex ?? undefined,
                answerIndex: currentQuestion.answerIndex,
              })}
              containerStyle={styles.option}
            />
          ))}
        </QuestionCard>
      </ScrollView>
    </View>
  );
};

function deriveStatus({
  index,
  submitted,
  selectedIndex,
  answerIndex,
}: {
  index: number;
  submitted: boolean;
  selectedIndex?: number;
  answerIndex: number;
}) {
  if (!submitted) {
    return 'default';
  }

  if (index === answerIndex) {
    return 'correct';
  }

  if (selectedIndex === index && selectedIndex !== answerIndex) {
    return 'incorrect';
  }

  return 'default';
}

function getInitials(source: string) {
  const parts = source.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

const useStyles = makeStyles((theme) =>
  StyleSheet.create({
    root: {
      flex: 1,
    },
    scroll: {
      flex: 1,
    },
    container: {
      flex: 1,
      gap: theme.spacing.xl,
    },
    confettiLayer: {
      ...StyleSheet.absoluteFill,
      zIndex: 20,
      elevation: 20,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.xl,
      gap: theme.spacing.md,
    },
    emptyTitle: {
      ...theme.typography.heading,
      color: theme.colors.textPrimary,
    },
    emptySubtitle: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    option: {
      marginBottom: theme.spacing.md,
    },
  }),
);

export default QuizScreen;
