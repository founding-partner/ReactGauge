import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View, ViewProps } from 'react-native';
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
import { Question } from '../types/quiz';

export interface HomeScreenProps extends ViewProps {
  username: string;
  displayName?: string;
  avatarUrl?: string;
  onStartQuiz: () => void;
  onRequestSignIn?: () => void;
  isGuest?: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  onSelectDifficulty: (difficulty: 'easy' | 'medium' | 'hard') => void;
  questionPoolSize: number;
  warmupQuestion: Question;
  onRefreshWarmup: () => void;
  totalAnswered: number;
  totalCorrect: number;
  streakDays: number;
  completionRatio: number;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  username,
  displayName,
  avatarUrl,
  onStartQuiz,
  onRequestSignIn,
  isGuest = false,
  difficulty,
  onSelectDifficulty,
  questionPoolSize,
  warmupQuestion,
  onRefreshWarmup,
  totalAnswered,
  totalCorrect,
  streakDays,
  completionRatio,
  style,
  ...rest
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [confettiKey, setConfettiKey] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const options = useMemo(() => warmupQuestion.options, [warmupQuestion]);

  useEffect(() => {
    setSelectedOption(null);
    setShowConfetti(false);
  }, [warmupQuestion.id]);

  const subtitle = isGuest
    ? 'You are exploring ReactGauge in guest mode. Sign in to track your growth.'
    : 'Tune your React instincts with fresh questions each session.';

  const streakLabel = isGuest
    ? 'Guest mode'
    : `${streakDays} day streak`;

  return (
    <View style={[styles.container, style]} {...rest}>
      <QuizHeader
        title={`Welcome back, ${displayName ?? username}`}
        subtitle={subtitle}
        avatarUri={avatarUrl}
        initials={getInitials(displayName ?? username)}
        currentQuestion={Math.max(1, Math.round(completionRatio * 10))}
        totalQuestions={10}
        timeRemainingLabel={streakLabel}
      />

      {isGuest ? (
        <View style={styles.guestCard}>
          <Text style={styles.guestTitle}>Guest mode enabled</Text>
          <Text style={styles.guestBody}>
            Your progress will reset when you leave. Sign in with GitHub to save
            results, earn streaks, and sync across devices.
          </Text>
          {onRequestSignIn ? (
            <Pressable
              style={({ pressed }) => [
                styles.guestSignInButton,
                pressed && styles.guestSignInButtonPressed,
              ]}
              onPress={onRequestSignIn}
            >
              <Text style={styles.guestSignInText}>Sign in with GitHub</Text>
            </Pressable>
          ) : null}
        </View>
      ) : (
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Progress Overview</Text>
          <ProgressRow label="Questions answered" value={totalAnswered} />
          <ProgressRow label="Correct answers" value={totalCorrect} />
          <View style={styles.progressBlock}>
            <Text style={styles.progressLabel}>Weekly completion</Text>
            <ProgressBar
              progress={completionRatio}
              milestones={[0.25, 0.5, 0.75, 1]}
            />
          </View>
        </View>
      )}

      <View style={styles.difficultyCard}>
        <Text style={styles.sectionHeading}>Difficulty</Text>
        <Text style={styles.difficultySubtext}>
          Choose how many questions you want to tackle. Question bank currently holds {questionPoolSize} prompts.
        </Text>
        <View style={styles.difficultyRow}>
          {difficultyOptions.map((option) => (
            <Pressable
              key={option.value}
              accessibilityRole="button"
              accessibilityState={{ selected: difficulty === option.value }}
              style={({ pressed }) => [
                styles.difficultyChip,
                difficulty === option.value && styles.difficultyChipActive,
                pressed && styles.difficultyChipPressed,
              ]}
              onPress={() => onSelectDifficulty(option.value)}
            >
              <Text
                style={[
                  styles.difficultyChipText,
                  difficulty === option.value && styles.difficultyChipTextActive,
                ]}
              >
                {option.label}
              </Text>
              <Text
                style={[
                  styles.difficultyChipCount,
                  difficulty === option.value && styles.difficultyChipTextActive,
                ]}
              >
                {option.count} Qs
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <QuestionCard
        title="Daily Warm-up"
        description={warmupQuestion.description}
        codeSnippet={warmupQuestion.code}
        footer={
          <View style={styles.warmupFooter}>
            <Pressable
              style={({ pressed }) => [
                styles.refreshButton,
                pressed && styles.refreshButtonPressed,
              ]}
              onPress={() => {
                setSelectedOption(null);
                setShowConfetti(false);
                onRefreshWarmup();
              }}
            >
              <Text style={styles.refreshButtonText}>Try Different Question</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.cta,
                pressed && styles.ctaPressed,
              ]}
              onPress={onStartQuiz}
            >
              <Text style={styles.ctaText}>Start Today&apos;s Quiz</Text>
            </Pressable>
          </View>
        }
      >
        {showConfetti ? (
          <View pointerEvents="none" style={styles.confettiLayer}>
            <ConfettiCannon
              key={confettiKey}
              count={30}
              origin={{ x: 0, y: 0 }}
              fadeOut
              explosionSpeed={220}
              fallSpeed={1800}
            />
          </View>
        ) : null}
        <Text style={styles.warmupPrompt}>{warmupQuestion.prompt}</Text>
        {options.map((option, index) => (
          <OptionButton
            key={option}
            label={option}
            selected={selectedOption === index}
            onPress={() => {
              setSelectedOption(index);
              if (index === warmupQuestion.answerIndex) {
                setConfettiKey((prev) => prev + 1);
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 1200);
              } else {
                setShowConfetti(false);
              }
            }}
            containerStyle={index < options.length - 1 && styles.option}
          />
        ))}
        {selectedOption != null ? (
          <Text style={styles.warmupFeedback}>
            {selectedOption === warmupQuestion.answerIndex
              ? 'Great job! You nailed it.'
              : 'Not quite right—review the explanation and take another shot.'}
          </Text>
        ) : null}
      </QuestionCard>
    </View>
  );
};

function getInitials(source: string) {
  if (!source) {
    return 'YOU';
  }

  const parts = source.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
}

const ProgressRow = ({
  label,
  value,
}: {
  label: string;
  value: number;
}) => {
  return (
    <View style={styles.progressRow}>
      <Text style={styles.progressRowLabel}>{label}</Text>
      <Text style={styles.progressRowValue}>{value}</Text>
    </View>
  );
};

const difficultyOptions = [
  { value: 'easy' as const, label: 'Easy', count: 10 },
  { value: 'medium' as const, label: 'Medium', count: 25 },
  { value: 'hard' as const, label: 'Hard', count: 50 },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing.xl,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.xl,
    gap: spacing.md,
    elevation: 2,
    shadowColor: colors.background,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  sectionHeading: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  guestCard: {
    backgroundColor: '#172554',
    borderRadius: radius.md,
    padding: spacing.xl,
    gap: spacing.md,
  },
  guestTitle: {
    ...typography.heading,
    color: colors.surface,
  },
  guestBody: {
    ...typography.body,
    color: colors.surface,
    opacity: 0.9,
  },
  guestSignInButton: {
    marginTop: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.surface,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignSelf: 'flex-start',
  },
  guestSignInText: {
    ...typography.caption,
    textTransform: 'uppercase',
    color: colors.surface,
  },
  guestSignInButtonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  difficultyCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.xl,
    gap: spacing.md,
  },
  difficultySubtext: {
    ...typography.body,
    color: colors.textSecondary,
  },
  difficultyRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  difficultyChip: {
    flex: 1,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
  },
  difficultyChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  difficultyChipPressed: {
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
  },
  difficultyChipText: {
    ...typography.caption,
    fontSize: 12,
    letterSpacing: 0.2,
    textTransform: 'uppercase',
    color: colors.textPrimary,
  },
  difficultyChipTextActive: {
    color: colors.textOnPrimary,
  },
  difficultyChipCount: {
    ...typography.caption,
    fontSize: 12,
    color: colors.textSecondary,
    textTransform: 'none',
  },
  progressBlock: {
    gap: spacing.sm,
  },
  progressLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'none',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressRowLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  progressRowValue: {
    ...typography.heading,
    color: colors.primary,
  },
  option: {
    marginBottom: spacing.md,
  },
  warmupFooter: {
    gap: spacing.md,
  },
  refreshButton: {
    alignSelf: 'flex-start',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  refreshButtonText: {
    ...typography.caption,
    textTransform: 'uppercase',
    color: colors.primary,
  },
  refreshButtonPressed: {
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
  },
  cta: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    ...typography.heading,
    color: colors.textOnPrimary,
  },
  ctaPressed: {
    backgroundColor: '#1d4ed8',
  },
  warmupPrompt: {
    ...typography.body,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  warmupFeedback: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  confettiLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 5,
    pointerEvents: 'none',
  },
});

export default HomeScreen;
