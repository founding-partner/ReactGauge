import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CodeBlock, colors, radius, spacing, typography } from '../components';
import { AnswerRecord, Question } from '../types/quiz';

export interface ResultScreenProps {
  answers: AnswerRecord[];
  questions: Question[];
  onRetry: () => void;
  onClose: () => void;
  isGuest?: boolean;
  onRequestSignIn?: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  answers,
  questions,
  onRetry,
  onClose,
  isGuest = false,
  onRequestSignIn,
}) => {
  const totalQuestions = questions.length;
  const correctCount = answers.filter((answer) => answer.isCorrect).length;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerCard}>
        <Text style={styles.title}>Quiz Complete</Text>
        <Text style={styles.subtitle}>
          You answered {correctCount} out of {totalQuestions} questions correctly.
        </Text>
        <View style={styles.scorePill}>
          <Text style={styles.scorePillValue}>{percentage}</Text>
          <Text style={styles.scorePillSuffix}>%</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.primaryButton} onPress={onRetry}>
          <Text style={styles.primaryButtonText}>Retake Quiz</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={onClose}>
          <Text style={styles.secondaryButtonText}>Back to Home</Text>
        </Pressable>
      </View>

      {isGuest ? (
        <View style={styles.guestNotice}>
          <Text style={styles.guestHeading}>Guest mode reminder</Text>
          <Text style={styles.guestBody}>
            Results aren&apos;t stored while in guest mode. Sign in to keep your
            streaks, sync across devices, and unlock detailed progress analytics.
          </Text>
          {onRequestSignIn ? (
            <Pressable style={styles.guestButton} onPress={onRequestSignIn}>
              <Text style={styles.guestButtonText}>Sign in with GitHub</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}

      <View style={styles.reviewCard}>
        <Text style={styles.reviewTitle}>Review answers</Text>
        {questions.map((question) => {
          const answer = answers.find(
            (entry) => entry.questionId === question.id,
          );

          if (!answer) {
            return null;
          }

          const isCorrect = answer.isCorrect;
          const selectedOption = question.options[answer.selectedIndex];
          const correctOption = question.options[question.answerIndex];

          return (
            <View key={question.id} style={styles.reviewRow}>
              <Text style={styles.questionPrompt}>{question.prompt}</Text>
              {question.code ? (
                <CodeBlock code={question.code} style={styles.reviewCode} />
              ) : null}
              <View
                style={[
                  styles.badge,
                  { backgroundColor: isCorrect ? colors.success : '#EF4444' },
                ]}
              >
                <Text style={styles.badgeText}>
                  {isCorrect ? 'Correct' : 'Incorrect'}
                </Text>
              </View>

              <Text style={styles.label}>Your answer:</Text>
              <Text style={styles.answerText}>{selectedOption}</Text>

              {!isCorrect ? (
                <>
                  <Text style={styles.label}>Correct answer:</Text>
                  <Text style={styles.correctAnswerText}>{correctOption}</Text>
                </>
              ) : null}

              {question.explanation ? (
                <>
                  <Text style={styles.label}>Explanation:</Text>
                  <Text style={styles.explanation}>
                    {question.explanation}
                  </Text>
                </>
              ) : null}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
    gap: spacing.xl,
  },
  headerCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.xl,
    gap: spacing.md,
    alignItems: 'center',
  },
  title: {
    ...typography.display,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    marginTop: spacing.md,
  },
  scorePillValue: {
    ...typography.display,
    color: colors.textOnPrimary,
  },
  scorePillSuffix: {
    ...typography.heading,
    color: colors.textOnPrimary,
    marginLeft: spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
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
    flex: 1,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.2)',
  },
  secondaryButtonText: {
    ...typography.heading,
    color: colors.surface,
  },
  guestNotice: {
    backgroundColor: '#172554',
    borderRadius: radius.md,
    padding: spacing.xl,
    gap: spacing.md,
  },
  guestHeading: {
    ...typography.heading,
    color: colors.surface,
  },
  guestBody: {
    ...typography.body,
    color: colors.surface,
    opacity: 0.9,
  },
  guestButton: {
    alignSelf: 'flex-start',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.surface,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  guestButtonText: {
    ...typography.caption,
    color: colors.surface,
    textTransform: 'uppercase',
  },
  reviewCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.xl,
    gap: spacing.xl,
  },
  reviewTitle: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  reviewRow: {
    gap: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#CBD5F5',
    paddingBottom: spacing.lg,
  },
  questionPrompt: {
    ...typography.body,
    color: colors.textPrimary,
  },
  reviewCode: {
    marginTop: spacing.sm,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  badgeText: {
    ...typography.caption,
    color: colors.textOnPrimary,
    textTransform: 'uppercase',
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  answerText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  correctAnswerText: {
    ...typography.body,
    color: colors.success,
    fontWeight: '600',
  },
  explanation: {
    ...typography.body,
    color: colors.textSecondary,
  },
});

export default ResultScreen;
