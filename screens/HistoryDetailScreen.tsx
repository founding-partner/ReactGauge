import React, { useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewProps,
  Pressable,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { makeStyles, useTheme } from '../components';
import { QuizAttempt } from '../types/history';
import { IconArrowLeft } from '../components/icons';
import { Difficulty } from '../store/useAppStore';

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
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = useStyles();

  const deriveOptionStatus = (isSelected: boolean, isCorrect: boolean) => {
    if (isCorrect && isSelected) {
      return {
        container: styles.optionCorrect,
        text: styles.optionTextCorrect,
        label: 'historyDetail.badges.correct',
        badge: styles.badgePositive,
      };
    }

    if (isCorrect) {
      return {
        container: styles.optionHighlight,
        text: styles.optionTextCorrect,
        label: 'historyDetail.badges.answer',
        badge: styles.badgeNeutral,
      };
    }

    if (isSelected) {
      return {
        container: styles.optionIncorrect,
        text: styles.optionTextIncorrect,
        label: 'historyDetail.badges.yourPick',
        badge: styles.badgeWarning,
      };
    }

    return {
      container: undefined,
      text: undefined,
      label: null,
      badge: undefined,
    };
  };

  return (
    <View style={[styles.container, style]} {...rest}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={onClose}>
          <IconArrowLeft size={20} color={theme.colors.textPrimary} />
          <Text style={styles.backButtonText}>{t('common.actions.back')}</Text>
        </Pressable>
        <Text style={styles.title}>{t('historyDetail.title')}</Text>
        <View style={styles.scorePill}>
          <Text style={styles.scoreText}>
            {attempt.score.correct}/{attempt.score.total}
          </Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.metaPrimary}>
          {t(difficultyLabelKeys[attempt.difficulty])}
        </Text>
        <Text style={styles.metaSecondary}>{new Date(attempt.timestamp).toLocaleString()}</Text>
      </View>
      <View style={styles.metaRow}>
        <Text style={styles.metaSecondary}>
          {attempt.userMode === 'guest'
            ? t('historyDetail.guestAttempt')
            : t('historyDetail.signedInAs', { user: attempt.userLogin })}
        </Text>
        <Text style={styles.metaSecondary}>
          {t('historyDetail.streak', { count: attempt.streak })}
        </Text>
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
                        <Text style={[styles.optionBadge, status.badge]}>
                          {t(status.label)}
                        </Text>
                      ) : null}
                    </View>
                  );
                })}
              </View>
              <View style={styles.answerSummary}>
                <Text style={styles.answerLabel}>{t('historyDetail.labels.yourAnswer')}</Text>
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
                <Text style={styles.answerLabel}>{t('historyDetail.labels.correctAnswer')}</Text>
                <Text style={[styles.answerValue, styles.answerValueCorrect]}>
                  {question.options[question.answerIndex]}
                </Text>
              </View>
              {question.explanation ? (
                <View style={styles.explanationBox}>
                  <Text style={styles.answerLabel}>{t('historyDetail.labels.explanation')}</Text>
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

const useStyles = makeStyles((theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: theme.spacing.xl,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.xl,
      marginBottom: theme.spacing.md,
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
    },
    backButtonText: {
      ...theme.typography.body,
      color: theme.colors.textPrimary,
    },
    title: {
      ...theme.typography.heading,
      color: theme.colors.textPrimary,
    },
    scorePill: {
      backgroundColor: theme.colors.primaryMuted,
      borderRadius: theme.radius.pill,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
    },
    scoreText: {
      ...theme.typography.body,
      color: theme.colors.primary,
      fontWeight: '600',
    },
    metaRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.xl,
    },
    metaPrimary: {
      ...theme.typography.caption,
      color: theme.colors.primary,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
      fontWeight: '600',
    },
    metaSecondary: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
    },
    scroll: {
      flex: 1,
      marginTop: theme.spacing.lg,
    },
    content: {
      paddingHorizontal: theme.spacing.xl,
      paddingBottom: theme.spacing.xxl * 2,
      gap: theme.spacing.xl,
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.md,
      padding: theme.spacing.xl,
      gap: theme.spacing.md,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 2,
    },
    cardTitle: {
      ...theme.typography.heading,
      color: theme.colors.textPrimary,
    },
    cardDescription: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
    },
    codeBlock: {
      backgroundColor: theme.colors.codeBackground,
      padding: theme.spacing.md,
      borderRadius: theme.radius.sm,
    },
    codeText: {
      ...theme.typography.mono,
      fontFamily: theme.typography.mono.fontFamily,
      fontSize: 12,
      color: theme.colors.codeText,
    },
    optionsList: {
      gap: theme.spacing.sm,
    },
    optionRow: {
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    optionText: {
      ...theme.typography.body,
      color: theme.colors.textPrimary,
    },
    optionBadge: {
      ...theme.typography.caption,
      textTransform: 'uppercase',
      letterSpacing: 0.4,
      fontWeight: '600',
    },
    optionCorrect: {
      borderColor: theme.colors.success,
      backgroundColor: theme.colors.successMuted,
    },
    optionHighlight: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primaryMuted,
    },
    optionIncorrect: {
      borderColor: theme.colors.dangerStrong,
      backgroundColor: theme.colors.dangerMuted,
    },
    optionTextCorrect: {
      color: theme.colors.success,
    },
    optionTextIncorrect: {
      color: theme.colors.dangerStrong,
    },
    badgePositive: {
      color: theme.colors.success,
    },
    badgeNeutral: {
      color: theme.colors.primary,
    },
    badgeWarning: {
      color: theme.colors.dangerStrong,
    },
    answerSummary: {
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
    explanationBox: {
      gap: theme.spacing.xs,
    },
    explanationText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
    },
  }),
);

const difficultyLabelKeys: Record<
  Difficulty,
  | 'common.difficulties.easy'
  | 'common.difficulties.medium'
  | 'common.difficulties.hard'
> = {
  easy: 'common.difficulties.easy',
  medium: 'common.difficulties.medium',
  hard: 'common.difficulties.hard',
};

export default HistoryDetailScreen;
