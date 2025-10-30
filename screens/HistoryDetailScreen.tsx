import React, { useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewProps,
  Pressable,
} from 'react-native';
import { colors, radius, spacing, typography } from '../components';
import { QuizAttempt } from '../types/history';
import { IconArrowLeft } from '../components/icons';

export interface HistoryDetailScreenProps extends ViewProps {
  attempt: QuizAttempt;
  onClose: () => void;
}

export const HistoryDetailScreen: React.FC<HistoryDetailScreenProps> = ({
  attempt,
  onClose,
  style,
  ...rest
}) => {
  const answerLookup = useMemo(() => {
    return new Map(attempt.answers.map((answer) => [answer.questionId, answer]));
  }, [attempt.answers]);

  return (
    <View style={[styles.container, style]} {...rest}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={onClose}>
          <IconArrowLeft size={20} color={colors.textPrimary} />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
        <Text style={styles.title}>Attempt Details</Text>
        <View style={styles.scorePill}>
          <Text style={styles.scoreText}>
            {attempt.score.correct}/{attempt.score.total}
          </Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.metaPrimary}>{formatDifficulty(attempt.difficulty)}</Text>
        <Text style={styles.metaSecondary}>{new Date(attempt.timestamp).toLocaleString()}</Text>
      </View>
      <View style={styles.metaRow}>
        <Text style={styles.metaSecondary}>
          {attempt.userMode === 'guest' ? 'Guest attempt' : `Signed in as ${attempt.userLogin}`}
        </Text>
        <Text style={styles.metaSecondary}>Streak {attempt.streak}</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {attempt.questions.map((question) => {
          const answer = answerLookup.get(question.id);
          return (
            <View key={question.id} style={styles.card}>
              <Text style={styles.cardTitle}>{question.prompt}</Text>
              {question.description ? (
                <Text style={styles.cardDescription}>{question.description}</Text>
              ) : null}
              {question.code ? (
                <View style={styles.codeBlock}>
                  <Text style={styles.codeText}>{question.code}</Text>
                </View>
              ) : null}
              <View style={styles.optionsList}>
                {question.options.map((option, index) => {
                  const isCorrect = index === question.answerIndex;
                  const isSelected = answer?.selectedIndex === index;
                  const status = deriveOptionStatus(isSelected, isCorrect);
                  return (
                    <View
                      key={`${question.id}-${option}`}
                      style={[styles.optionRow, status.container]}
                    >
                      <Text style={[styles.optionText, status.text]}>{option}</Text>
                      {status.label ? (
                        <Text style={[styles.optionBadge, status.badge]}>{status.label}</Text>
                      ) : null}
                    </View>
                  );
                })}
              </View>
              <View style={styles.answerSummary}>
                <Text style={styles.answerLabel}>Your answer</Text>
                <Text
                  style={[
                    styles.answerValue,
                    answer?.isCorrect ? styles.answerValueCorrect : styles.answerValueIncorrect,
                  ]}
                >
                  {answer != null && answer.selectedIndex != null
                    ? question.options[answer.selectedIndex]
                    : '—'}
                </Text>
              </View>
              <View style={styles.answerSummary}>
                <Text style={styles.answerLabel}>Correct answer</Text>
                <Text style={[styles.answerValue, styles.answerValueCorrect]}>
                  {question.options[question.answerIndex]}
                </Text>
              </View>
              {question.explanation ? (
                <View style={styles.explanationBox}>
                  <Text style={styles.answerLabel}>Explanation</Text>
                  <Text style={styles.explanationText}>{question.explanation}</Text>
                </View>
              ) : null}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

function formatDifficulty(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function deriveOptionStatus(isSelected: boolean, isCorrect: boolean) {
  if (isCorrect && isSelected) {
    return {
      container: styles.optionCorrect,
      text: styles.optionTextCorrect,
      label: 'Correct',
      badge: styles.badgePositive,
    };
  }

  if (isCorrect) {
    return {
      container: styles.optionHighlight,
      text: styles.optionTextCorrect,
      label: 'Answer',
      badge: styles.badgeNeutral,
    };
  }

  if (isSelected) {
    return {
      container: styles.optionIncorrect,
      text: styles.optionTextIncorrect,
      label: 'Your pick',
      badge: styles.badgeWarning,
    };
  }

  return {
    container: undefined,
    text: undefined,
    label: null,
    badge: undefined,
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  backButtonText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  title: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  scorePill: {
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  scoreText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  metaPrimary: {
    ...typography.caption,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontWeight: '600',
  },
  metaSecondary: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  scroll: {
    flex: 1,
    marginTop: spacing.lg,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl * 2,
    gap: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.xl,
    gap: spacing.md,
    shadowColor: colors.background,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  cardDescription: {
    ...typography.body,
    color: colors.textSecondary,
  },
  codeBlock: {
    backgroundColor: '#0f172a',
    padding: spacing.md,
    borderRadius: radius.sm,
  },
  codeText: {
    fontFamily: 'Menlo',
    fontSize: 12,
    color: '#e2e8f0',
  },
  optionsList: {
    gap: spacing.sm,
  },
  optionRow: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  optionBadge: {
    ...typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    fontWeight: '600',
  },
  optionCorrect: {
    borderColor: colors.success,
    backgroundColor: 'rgba(34,197,94,0.1)',
  },
  optionHighlight: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(37,99,235,0.08)',
  },
  optionIncorrect: {
    borderColor: '#ef4444',
    backgroundColor: 'rgba(239,68,68,0.08)',
  },
  optionTextCorrect: {
    color: colors.success,
  },
  optionTextIncorrect: {
    color: '#ef4444',
  },
  badgePositive: {
    color: colors.success,
  },
  badgeNeutral: {
    color: colors.primary,
  },
  badgeWarning: {
    color: '#ef4444',
  },
  answerSummary: {
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
    color: '#ef4444',
  },
  explanationBox: {
    gap: spacing.xs,
  },
  explanationText: {
    ...typography.body,
    color: colors.textSecondary,
  },
});

export default HistoryDetailScreen;
