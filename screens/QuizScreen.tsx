import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewProps,
  Easing,
} from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import {
  IconArrowLeft,
  IconArrowLeftOnRectangle,
  IconArrowRight,
  IconCheck,
  IconTrophy,
} from '../components/icons';
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
import { useAppStore } from '../store/useAppStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  const iconSize = useAppStore((state) => state.iconSize);
  const insets = useSafeAreaInsets();
  const [explanationVisible, setExplanationVisible] = useState(false);
  const explanationAnim = useRef(new Animated.Value(0)).current;

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;

  if (questions.length === 0) {
    return (
      <View style={[styles.root, style, styles.emptyState]} {...rest}>
        <Text style={styles.emptyTitle}>No questions available</Text>
        <Text style={styles.emptySubtitle}>
          Add questions to the bank or choose a different difficulty to begin.
        </Text>
      </View>
    );
  }

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

    if (currentQuestion.explanation) {
      setExplanationVisible(true);
    } else {
      setExplanationVisible(false);
    }

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
      setExplanationVisible(false);
      onComplete(answers);
      return;
    }

    const nextIndex = Math.min(currentIndex + 1, totalQuestions - 1);
    setCurrentIndex(nextIndex);
    setSelectedOption(null);
    setSubmitted(false);
    setExplanationVisible(false);
  };

  const handlePrevious = () => {
    setExplanationVisible(false);
    if (currentIndex === 0) {
      onExit();
      return;
    }

    const prevIndex = Math.max(currentIndex - 1, 0);
    setCurrentIndex(prevIndex);
    setSelectedOption(null);
    setSubmitted(Boolean(answers.some((a) => a.questionId === questions[prevIndex].id)));
  };

  useEffect(() => {
    setExplanationVisible(false);
  }, [currentQuestion.id]);

  const showExplanation =
    explanationVisible &&
    Boolean(currentQuestion.explanation) &&
    Boolean(currentAnswer);

  useEffect(() => {
    if (showExplanation) {
      explanationAnim.setValue(0);
      Animated.timing(explanationAnim, {
        toValue: 1,
        duration: 240,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      explanationAnim.stopAnimation();
      explanationAnim.setValue(0);
    }
  }, [showExplanation, explanationAnim]);

  const handleDismissExplanation = () => {
    setExplanationVisible(false);
  };

  const isPrimaryDisabled =
    (selectedOption == null && !submitted) || showExplanation;

  const renderExplanation = () => {
    if (!showExplanation || !currentAnswer) {
      return null;
    }

    const isCorrect = currentAnswer.isCorrect;
    const selectedLabel =
      currentAnswer.selectedIndex != null
        ? currentQuestion.options[currentAnswer.selectedIndex] ?? '—'
        : '—';
    const correctLabel =
      currentQuestion.options[currentQuestion.answerIndex] ?? '—';

    return (
      <Animated.View
        style={[
          styles.explanationDrawer,
          {
            borderLeftColor: isCorrect ? colors.success : '#EF4444',
            opacity: explanationAnim,
            transform: [
              {
                translateY: explanationAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [40, 0],
                }),
              },
            ],
          },
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
        <Text style={styles.explanationQuestion}>{currentQuestion.prompt}</Text>
        <View style={styles.explanationAnswers}>
          <View style={styles.answerRow}>
            <Text style={styles.answerLabel}>Your answer</Text>
            <Text
              style={[
                styles.answerValue,
                isCorrect
                  ? styles.answerValueCorrect
                  : styles.answerValueIncorrect,
              ]}
            >
              {selectedLabel}
            </Text>
          </View>
          <View style={styles.answerRow}>
            <Text style={styles.answerLabel}>Correct answer</Text>
            <Text
              style={[styles.answerValue, styles.answerValueCorrect]}
            >
              {correctLabel}
            </Text>
          </View>
        </View>
        <Text style={styles.explanationBody}>{currentQuestion.explanation}</Text>
        <Pressable
          style={styles.dismissButton}
          onPress={handleDismissExplanation}
        >
          <Text style={styles.dismissButtonText}>Okay</Text>
        </Pressable>
      </Animated.View>
    );
  };

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
      {showExplanation ? (
        <View
          pointerEvents="auto"
          style={[
            styles.explanationOverlay,
            { paddingTop: insets.top + spacing.xl },
          ]}
        >
          <Pressable
            style={styles.overlayBackdrop}
            onPress={handleDismissExplanation}
          />
          {renderExplanation()}
        </View>
      ) : null}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.container,
          {
            paddingBottom: spacing.xxl * 3 + spacing.xl,
          },
        ]}
        showsVerticalScrollIndicator={false}
        {...rest}
      >
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
      <View
        style={[styles.bottomOverlay, { bottom: insets.bottom }]}
        pointerEvents="box-none"
      >
        <View style={styles.dock}>
          <Pressable
            style={[
              styles.secondaryButton,
              showExplanation ? styles.disabledButton : null,
            ]}
            onPress={handlePrevious}
            disabled={showExplanation}
          >
            <View style={styles.buttonRow}>
              {currentIndex === 0 ? (
                <IconArrowLeftOnRectangle size={iconSize} color={colors.primary} />
              ) : (
                <IconArrowLeft size={iconSize} color={colors.primary} />
              )}
              <Text style={styles.secondaryButtonText}>
                {currentIndex === 0 ? 'Exit' : 'Previous'}
              </Text>
            </View>
          </Pressable>
          <Pressable
            style={[
              styles.primaryButton,
              isPrimaryDisabled ? styles.disabledButton : null,
            ]}
            onPress={handleNext}
            disabled={isPrimaryDisabled}
          >
            <View style={styles.buttonRow}>
              {submitted ? (
                isLastQuestion ? (
                  <IconTrophy size={iconSize} color={colors.textOnPrimary} />
                ) : (
                  <IconArrowRight size={iconSize} color={colors.textOnPrimary} />
                )
              ) : (
                <IconCheck size={iconSize} color={colors.textOnPrimary} />
              )}
              <Text style={styles.primaryButtonText}>
                {submitted ? (isLastQuestion ? 'Finish' : 'Next') : 'Submit'}
              </Text>
            </View>
          </Pressable>
        </View>
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
  scroll: {
    flex: 1,
  },
  container: {
    flex: 1,
    gap: spacing.xl,
  },
  bottomOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    gap: spacing.md,
    // paddingHorizontal: spacing.xl,
  },
  explanationOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-start',
    alignItems: 'center',
    zIndex: 30,
    paddingHorizontal: spacing.xl,
  },
  overlayBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
  },
  dock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    shadowColor: colors.background,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  confettiLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
    elevation: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  emptyTitle: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  option: {
    marginBottom: spacing.md,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  buttonIcon: {
    marginRight: spacing.xs,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    ...typography.heading,
    color: colors.textOnPrimary,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(15, 23, 42, 0.08)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  disabledButton: {
    opacity: 0.4,
  },
  explanationDrawer: {
    width: '100%',
    maxWidth: 560,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    gap: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
    shadowColor: colors.background,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  explanationHeading: {
    ...typography.heading,
  },
  explanationQuestion: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
  explanationAnswers: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  answerRow: {
    gap: spacing.xs,
  },
  answerLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  answerValue: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  answerValueCorrect: {
    color: colors.success,
  },
  answerValueIncorrect: {
    color: '#EF4444',
  },
  explanationBody: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  dismissButton: {
    alignSelf: 'flex-end',
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
  },
  dismissButtonText: {
    ...typography.body,
    color: colors.textOnPrimary,
    fontWeight: '600',
  },
});

export default QuizScreen;
