import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { CodeBlock, makeStyles, useTheme } from '../components';
import {
  IconShieldCheck,
} from '../components/icons';
import { AnswerRecord, Question } from '../types/quiz';
import { useAppStore } from '../store/useAppStore';

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
  const iconSize = useAppStore((state) => state.iconSize);
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = useStyles();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerCard}>
        <Text style={styles.title}>{t('result.title')}</Text>
        <Text style={styles.subtitle}>
          {t('result.subtitle', { correct: correctCount, total: totalQuestions })}
        </Text>
        <View style={styles.scorePill}>
          <Text style={styles.scorePillValue}>{percentage}</Text>
          <Text style={styles.scorePillSuffix}>%</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.primaryButton} onPress={onRetry}>
          <Text style={styles.primaryButtonText}>
            {t('common.actions.retakeQuiz')}
          </Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={onClose}>
          <Text style={styles.secondaryButtonText}>
            {t('common.actions.backHome')}
          </Text>
        </Pressable>
      </View>

      {isGuest ? (
        <View style={styles.guestNotice}>
          <Text style={styles.guestHeading}>{t('result.guestTitle')}</Text>
          <Text style={styles.guestBody}>{t('result.guestBody')}</Text>
          {onRequestSignIn ? (
            <Pressable style={styles.guestButton} onPress={onRequestSignIn}>
              <View style={styles.buttonRow}>
                <View style={styles.buttonIconWrapper}>
                  <IconShieldCheck size={iconSize} color={theme.colors.textOnPrimary} />
                </View>
                <Text style={styles.guestButtonText}>
                  {t('common.actions.signIn')}
                </Text>
              </View>
            </Pressable>
          ) : null}
        </View>
      ) : null}

      <View style={styles.reviewCard}>
        <Text style={styles.reviewTitle}>{t('result.reviewTitle')}</Text>
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
                  {
                    backgroundColor: isCorrect
                      ? theme.colors.success
                      : theme.colors.dangerStrong,
                  },
                ]}
              >
                <Text style={styles.badgeText}>
                  {isCorrect ? t('result.badgeCorrect') : t('result.badgeIncorrect')}
                </Text>
              </View>

              <Text style={styles.label}>{t('result.yourAnswer')}</Text>
              <Text style={styles.answerText}>{selectedOption}</Text>

              {!isCorrect ? (
                <>
                  <Text style={styles.label}>{t('result.correctAnswer')}</Text>
                  <Text style={styles.correctAnswerText}>{correctOption}</Text>
                </>
              ) : null}

              {question.explanation ? (
                <>
                  <Text style={styles.label}>{t('result.explanation')}</Text>
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

const useStyles = makeStyles((theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    contentContainer: {
      paddingHorizontal: theme.spacing.xl,
      paddingBottom: theme.spacing.xxl,
      gap: theme.spacing.xl,
    },
    headerCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.md,
      padding: theme.spacing.xl,
      gap: theme.spacing.md,
      alignItems: 'center',
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 2,
    },
    title: {
      ...theme.typography.display,
      color: theme.colors.textPrimary,
    },
    subtitle: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    scorePill: {
      flexDirection: 'row',
      alignItems: 'baseline',
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.radius.pill,
      marginTop: theme.spacing.md,
    },
    scorePillValue: {
      ...theme.typography.display,
      color: theme.colors.textOnPrimary,
    },
    scorePillSuffix: {
      ...theme.typography.heading,
      color: theme.colors.textOnPrimary,
      marginLeft: theme.spacing.xs,
    },
    actions: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    primaryButton: {
      flex: 1,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius.lg,
      paddingVertical: theme.spacing.lg,
      alignItems: 'center',
    },
    primaryButtonText: {
      ...theme.typography.heading,
      color: theme.colors.textOnPrimary,
    },
    secondaryButton: {
      flex: 1,
      borderRadius: theme.radius.lg,
      paddingVertical: theme.spacing.lg,
      alignItems: 'center',
      backgroundColor: theme.colors.surfaceMuted,
    },
    secondaryButtonText: {
      ...theme.typography.heading,
      color: theme.colors.textPrimary,
    },
    guestNotice: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius.md,
      padding: theme.spacing.xl,
      gap: theme.spacing.md,
    },
    guestHeading: {
      ...theme.typography.heading,
      color: theme.colors.textOnPrimary,
    },
    guestBody: {
      ...theme.typography.body,
      color: theme.colors.textOnPrimary,
      opacity: 0.92,
    },
    guestButton: {
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.textOnPrimary,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
    guestButtonText: {
      ...theme.typography.caption,
      color: theme.colors.textOnPrimary,
      textTransform: 'uppercase',
    },
    buttonRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    buttonIconWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing.xs,
    },
    reviewCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.md,
      padding: theme.spacing.xl,
      gap: theme.spacing.xl,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 2,
    },
    reviewTitle: {
      ...theme.typography.heading,
      color: theme.colors.textPrimary,
    },
    reviewRow: {
      gap: theme.spacing.sm,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.border,
      paddingBottom: theme.spacing.lg,
    },
    questionPrompt: {
      ...theme.typography.body,
      color: theme.colors.textPrimary,
    },
    reviewCode: {
      marginTop: theme.spacing.sm,
    },
    badge: {
      alignSelf: 'flex-start',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radius.pill,
    },
    badgeText: {
      ...theme.typography.caption,
      color: theme.colors.textOnPrimary,
      textTransform: 'uppercase',
    },
    label: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      textTransform: 'uppercase',
    },
    answerText: {
      ...theme.typography.body,
      color: theme.colors.textPrimary,
    },
    correctAnswerText: {
      ...theme.typography.body,
      color: theme.colors.success,
      fontWeight: '600',
    },
    explanation: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
    },
  }),
);

export default ResultScreen;
