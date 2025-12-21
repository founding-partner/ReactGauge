import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewProps,
  Easing,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import ConfettiCannon from 'react-native-confetti-cannon';
import {
  IconArrowLeft,
  IconArrowLeftOnRectangle,
  IconArrowRight,
  IconCheck,
  IconTrophy,
} from '../components/icons';
import {
  Button,
  OptionButton,
  ProgressBar,
  QuestionCard,
  QuizHeader,
  makeStyles,
  useTheme,
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
    const emphasisColor = isCorrect ? theme.colors.success : theme.colors.dangerStrong;

    return (
      <Animated.View
        style={[
          styles.explanationDrawer,
          {
            borderLeftColor: emphasisColor,
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
              { color: emphasisColor },
            ]}
          >
            {isCorrect ? t('quiz.explanationCorrect') : t('quiz.explanationReview')}
          </Text>
        <Text style={styles.explanationQuestion}>{currentQuestion.prompt}</Text>
        <View style={styles.explanationAnswers}>
          <View style={styles.answerRow}>
            <Text style={styles.answerLabel}>{t('quiz.yourAnswer')}</Text>
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
            <Text style={styles.answerLabel}>{t('quiz.correctAnswer')}</Text>
            <Text
              style={[styles.answerValue, styles.answerValueCorrect]}
            >
              {correctLabel}
            </Text>
          </View>
        </View>
        <Text style={styles.explanationBody}>{currentQuestion.explanation}</Text>
        <Button
          variant="primary"
          size="sm"
          radius="md"
          style={styles.dismissButton}
          onPress={handleDismissExplanation}
        >
          <Text style={styles.dismissButtonText}>{t('quiz.dismiss')}</Text>
        </Button>
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
            { paddingTop: insets.top + theme.spacing.xl },
          ]}
        >
          <Button
            variant="unstyled"
            size="none"
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
            paddingBottom: theme.spacing.xxl * 3 + theme.spacing.xl,
          },
        ]}
        showsVerticalScrollIndicator={false}
        {...rest}
      >
        <QuizHeader
          title={t('quiz.title')}
          subtitle={t('quiz.subtitle', {
            current: currentIndex + 1,
            total: totalQuestions,
          })}
          avatarUri={avatarUrl}
          initials={getInitials(username)}
          currentQuestion={currentIndex + 1}
          totalQuestions={totalQuestions}
          timeRemainingLabel={
            isGuest
              ? t('common.guestMode')
              : t('common.streakDays', { count: Math.max(streakDays, 0) })
          }
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
          <Button
            variant="muted"
            size="md"
            style={styles.dockButton}
            onPress={handlePrevious}
            disabled={showExplanation}
            disabledOpacity={0.4}
          >
            <View style={styles.buttonRow}>
              {currentIndex === 0 ? (
                <IconArrowLeftOnRectangle
                  size={iconSize}
                  color={theme.colors.primary}
                />
              ) : (
                <IconArrowLeft size={iconSize} color={theme.colors.primary} />
              )}
              <Text style={styles.secondaryButtonText}>
                {currentIndex === 0
                  ? t('common.actions.exit')
                  : t('common.actions.previous')}
              </Text>
            </View>
          </Button>
          <Button
            variant="primary"
            size="md"
            style={styles.dockButton}
            onPress={handleNext}
            disabled={isPrimaryDisabled}
            disabledOpacity={0.4}
          >
            <View style={styles.buttonRow}>
              {submitted ? (
                isLastQuestion ? (
                  <IconTrophy size={iconSize} color={theme.colors.textOnPrimary} />
                ) : (
                  <IconArrowRight
                    size={iconSize}
                    color={theme.colors.textOnPrimary}
                  />
                )
              ) : (
                <IconCheck size={iconSize} color={theme.colors.textOnPrimary} />
              )}
              <Text style={styles.primaryButtonText}>
                {submitted
                  ? isLastQuestion
                    ? t('common.actions.finish')
                    : t('common.actions.next')
                  : t('common.actions.submit')}
              </Text>
            </View>
          </Button>
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
    bottomOverlay: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      gap: theme.spacing.md,
    },
    explanationOverlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'flex-start',
      alignItems: 'center',
      zIndex: 30,
      paddingHorizontal: theme.spacing.xl,
    },
    overlayBackdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor:
        theme.name === 'dark'
          ? 'rgba(0, 0, 0, 0.55)'
          : 'rgba(15, 23, 42, 0.55)',
    },
    dock: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.md,
      shadowColor: theme.colors.shadow,
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
    buttonRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    buttonIcon: {
      marginRight: theme.spacing.xs,
    },
    dockButton: {
      flex: 1,
    },
    primaryButtonText: {
      ...theme.typography.heading,
      color: theme.colors.textOnPrimary,
    },
    secondaryButtonText: {
      ...theme.typography.body,
      color: theme.colors.textPrimary,
    },
    explanationDrawer: {
      width: '100%',
      maxWidth: 560,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.xl,
      gap: theme.spacing.md,
      borderLeftWidth: 4,
      borderLeftColor: 'transparent',
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 4,
    },
    explanationHeading: {
      ...theme.typography.heading,
      color: theme.colors.textPrimary,
    },
    explanationQuestion: {
      ...theme.typography.body,
      color: theme.colors.textPrimary,
      fontWeight: '600',
      marginTop: theme.spacing.xs,
    },
    explanationAnswers: {
      marginTop: theme.spacing.md,
      gap: theme.spacing.sm,
    },
    answerRow: {
      gap: theme.spacing.xs,
    },
    answerLabel: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    answerValue: {
      ...theme.typography.body,
      fontWeight: '600',
      color: theme.colors.textPrimary,
    },
    answerValueCorrect: {
      color: theme.colors.success,
    },
    answerValueIncorrect: {
      color: theme.colors.dangerStrong,
    },
    explanationBody: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.md,
    },
    dismissButton: {
      alignSelf: 'flex-end',
      marginTop: theme.spacing.lg,
    },
    dismissButtonText: {
      ...theme.typography.body,
      color: theme.colors.textOnPrimary,
      fontWeight: '600',
    },
  }),
);

export default QuizScreen;
