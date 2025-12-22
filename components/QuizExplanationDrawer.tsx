import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button } from './Button';
import { makeStyles, useTheme } from './theme';
import type { QuizExplanationState } from '../types/quizExplanation';

export type QuizExplanationDrawerProps = {
  state: QuizExplanationState | null;
  onDismiss?: () => void;
};

export const QuizExplanationDrawer: React.FC<QuizExplanationDrawerProps> = ({
  state,
  onDismiss,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = useStyles();
  const explanationAnim = useRef(new Animated.Value(0)).current;
  const isVisible = Boolean(state);

  useEffect(() => {
    if (isVisible) {
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
  }, [explanationAnim, isVisible]);

  if (!state) {
    return null;
  }

  const emphasisColor = state.isCorrect
    ? theme.colors.success
    : theme.colors.dangerStrong;

  return (
    <View pointerEvents="auto" style={styles.overlay}>
      <Button
        variant="unstyled"
        size="none"
        style={styles.overlayBackdrop}
        onPress={onDismiss}
      />
      <Animated.View
        style={[
          styles.drawer,
          {
            borderLeftColor: emphasisColor,
            opacity: explanationAnim,
            transform: [
              {
                translateY: explanationAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [160, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={[styles.heading, { color: emphasisColor }]}>
          {state.isCorrect
            ? t('quiz.explanationCorrect')
            : t('quiz.explanationReview')}
        </Text>
        <Text style={styles.question}>{state.prompt}</Text>
        <View style={styles.answers}>
          <View style={styles.answerRow}>
            <Text style={styles.answerLabel}>{t('quiz.yourAnswer')}</Text>
            <Text
              style={[
                styles.answerValue,
                state.isCorrect
                  ? styles.answerValueCorrect
                  : styles.answerValueIncorrect,
              ]}
            >
              {state.selectedLabel}
            </Text>
          </View>
          <View style={styles.answerRow}>
            <Text style={styles.answerLabel}>{t('quiz.correctAnswer')}</Text>
            <Text style={[styles.answerValue, styles.answerValueCorrect]}>
              {state.correctLabel}
            </Text>
          </View>
        </View>
        <Text style={styles.body}>{state.explanation}</Text>
        <Button
          variant="primary"
          size="sm"
          radius="md"
          style={styles.dismissButton}
          onPress={onDismiss}
        >
          <Text style={styles.dismissButtonText}>{t('quiz.dismiss')}</Text>
        </Button>
      </Animated.View>
    </View>
  );
};

const useStyles = makeStyles((theme) =>
  StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'space-around',
      alignItems: 'center',
      zIndex: 40,
      elevation: 40,
      paddingHorizontal: theme.spacing.xl,
      paddingBottom: theme.spacing.xl,
    },
    overlayBackdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor:
        theme.name === 'dark'
          ? 'rgba(135, 29, 29, 0.55)'
          : 'rgba(25, 70, 175, 0.55)',
    },
    drawer: {
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
    heading: {
      ...theme.typography.heading,
      color: theme.colors.textPrimary,
    },
    question: {
      ...theme.typography.body,
      color: theme.colors.textPrimary,
      fontWeight: '600',
      marginTop: theme.spacing.xs,
    },
    answers: {
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
    body: {
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

export default QuizExplanationDrawer;
