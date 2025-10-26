import React, { useMemo, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View, ViewProps } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import {
  OptionButton,
  ProgressBar,
  QuestionCard,
  QuizHeader,
  colors,
  radius,
  spacing,
  typography,
} from '../components';
import { AnswerRecord, Question } from '../types/quiz';

export interface QuizScreenProps extends ViewProps {
  questions: Question[];
  username: string;
  avatarUrl?: string;
  streakDays?: number;
  isGuest?: boolean;
  onExit: () => void;
  onComplete: (answers: AnswerRecord[]) => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  questions,
  username,
  avatarUrl,
  streakDays = 0,
  isGuest = false,
  onExit,
  onComplete,
  style,
  ...rest
}) => {
  const windowWidth = Dimensions.get('window').width;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [confettiBurst, setConfettiBurst] = useState(0);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;

  const progress = (currentIndex + (submitted ? 1 : 0)) / totalQuestions;

  const milestones = useMemo(
    () =>
      questions.map((_, index) => (index + 1) / totalQuestions),
    [questions, totalQuestions],
  );

  const existingAnswer = answers.find(
    (answer) => answer.questionId === currentQuestion.id,
  );

  const effectiveSelectedIndex =
    submitted && existingAnswer
      ? existingAnswer.selectedIndex
      : selectedOption ?? existingAnswer?.selectedIndex ?? null;

  const isLastQuestion = currentIndex === totalQuestions - 1;

  const handleSelectOption = (index: number) => {
    if (submitted) {
      return;
    }
    setSelectedOption(index);
  };

  const handleSubmit = () => {
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

    if (isCorrect) {
      setConfettiBurst((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (!submitted) {
      handleSubmit();
      return;
    }

    if (isLastQuestion) {
      onComplete(answers);
      return;
    }

    const nextIndex = Math.min(currentIndex + 1, totalQuestions - 1);
    setCurrentIndex(nextIndex);
    setSelectedOption(null);
    setSubmitted(false);
  };

  const handlePrevious = () => {
    if (currentIndex === 0) {
      onExit();
      return;
    }

    const prevIndex = Math.max(currentIndex - 1, 0);
    setCurrentIndex(prevIndex);
    setSelectedOption(null);
    setSubmitted(Boolean(answers.some((a) => a.questionId === questions[prevIndex].id)));
  };

  const renderExplanation = () => {
    if (!submitted || !currentQuestion.explanation) {
      return null;
    }

    const lastAnswer = answers.find(
      (answer) => answer.questionId === currentQuestion.id,
    );

    if (!lastAnswer) {
      return null;
    }

    const isCorrect = lastAnswer.isCorrect;
    return (
      <View
        style={[
          styles.explanation,
          { borderColor: isCorrect ? colors.success : '#EF4444' },
        ]}
      >
        <Text
          style={[
            styles.explanationHeading,
            { color: isCorrect ? colors.success : '#EF4444' },
          ]}
        >
          {isCorrect ? 'Correct!' : 'Let’s review'}
        </Text>
        <Text style={styles.explanationBody}>{currentQuestion.explanation}</Text>
      </View>
    );
  };

  const footer = (
    <View style={styles.footer}>
      <Pressable style={styles.secondaryButton} onPress={handlePrevious}>
        <Text style={styles.secondaryButtonText}>
          {currentIndex === 0 ? 'Exit' : 'Previous'}
        </Text>
      </Pressable>
      <Pressable
        style={[
          styles.primaryButton,
          selectedOption == null && !submitted ? styles.disabledButton : null,
        ]}
        onPress={handleNext}
        disabled={selectedOption == null && !submitted}
      >
        <Text style={styles.primaryButtonText}>
          {submitted ? (isLastQuestion ? 'Finish' : 'Next') : 'Submit'}
        </Text>
      </Pressable>
    </View>
  );

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
      <View style={styles.container} {...rest}>
        <QuizHeader
          title="React Mastery Quiz"
          subtitle={`Question ${currentIndex + 1} of ${totalQuestions}`}
          avatarUri={avatarUrl}
          initials={getInitials(username)}
          currentQuestion={currentIndex + 1}
          totalQuestions={totalQuestions}
          timeRemainingLabel={isGuest ? 'Guest mode' : `${streakDays} day streak`}
        />

        <ProgressBar progress={progress} milestones={milestones} />

        <QuestionCard
          title={currentQuestion.prompt}
          description={currentQuestion.description}
          codeSnippet={currentQuestion.code}
          footer={footer}
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

        {renderExplanation()}
      </View>
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

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    gap: spacing.xl,
  },
  confettiLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
    elevation: 20,
  },
  option: {
    marginBottom: spacing.md,
  },
  footer: {
    marginTop: spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.lg,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  primaryButtonText: {
    ...typography.heading,
    color: colors.textOnPrimary,
  },
  secondaryButton: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(15, 23, 42, 0.2)',
  },
  secondaryButtonText: {
    ...typography.body,
    color: colors.surface,
  },
  disabledButton: {
    opacity: 0.4,
  },
  explanation: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.xl,
    backgroundColor: colors.surface,
    gap: spacing.sm,
  },
  explanationHeading: {
    ...typography.heading,
  },
  explanationBody: {
    ...typography.body,
    color: colors.textSecondary,
  },
});

export default QuizScreen;
