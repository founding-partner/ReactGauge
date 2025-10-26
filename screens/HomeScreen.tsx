import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View, ViewProps } from 'react-native';
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

const SAMPLE_OPTIONS = [
  'useMemo memoizes the result of a calculation so long as dependencies are stable.',
  'useMemo ensures a value recomputes on every render regardless of dependencies.',
  'useMemo returns a memoized function rather than a value.',
  'useMemo is only intended for primitive values such as strings or numbers.',
];

export interface HomeScreenProps extends ViewProps {
  username: string;
  displayName?: string;
  avatarUrl?: string;
  onStartQuiz: () => void;
  onRequestSignIn?: () => void;
  isGuest?: boolean;
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
  totalAnswered,
  totalCorrect,
  streakDays,
  completionRatio,
  style,
  ...rest
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

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
            <Pressable style={styles.guestSignInButton} onPress={onRequestSignIn}>
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

      <QuestionCard
        title="Daily Warm-up"
        description="Try this sample question to prep your brain before starting the full quiz."
        codeSnippet={`const memoizedValue = useMemo(() => heavyWork(data), [data]);`}
        footer={
          <Pressable style={styles.cta} onPress={onStartQuiz}>
            <Text style={styles.ctaText}>Start Today&apos;s Quiz</Text>
          </Pressable>
        }
      >
        {SAMPLE_OPTIONS.map((option, index) => (
          <OptionButton
            key={option}
            label={option}
            selected={selectedOption === index}
            onPress={() => setSelectedOption(index)}
            containerStyle={index < SAMPLE_OPTIONS.length - 1 && styles.option}
          />
        ))}
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
});

export default HomeScreen;
