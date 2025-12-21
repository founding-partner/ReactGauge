import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button } from './Button';
import { makeStyles, useTheme } from './theme';
import {
  IconArrowLeft,
  IconArrowLeftOnRectangle,
  IconArrowRight,
  IconCheck,
  IconTrophy,
} from './icons';
import type { QuizToolbarState } from '../types/quizToolbar';

export type QuizToolbarProps = {
  state: QuizToolbarState;
  iconSize: number;
  onExit?: () => void;
  onPrevious?: () => void;
  onSubmit?: () => void;
  onNext?: () => void;
};

export const QuizToolbar: React.FC<QuizToolbarProps> = ({
  state,
  iconSize,
  onExit,
  onPrevious,
  onSubmit,
  onNext,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = useStyles();

  const showExit = state.showExit && Boolean(onExit);
  const showPrevious = state.showPrevious && Boolean(onPrevious);
  const showSubmit = state.showSubmit && Boolean(onSubmit);
  const showNext = state.showNext && Boolean(onNext);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Button
          variant="tab"
          size="xs"
          style={styles.button}
          onPress={onExit}
          disabled={!showExit}
        >
          <View style={styles.buttonRow}>
            <IconArrowLeftOnRectangle
              size={iconSize}
              color={theme.colors.primary}
            />
            <Text style={styles.secondaryText}>{t('common.actions.exit')}</Text>
          </View>
        </Button>
        <Button
          variant="tab"
          size="xs"
          style={styles.button}
          onPress={onPrevious}
          disabled={!showPrevious}
        >
          <View style={styles.buttonRow}>
            <IconArrowLeft size={iconSize} color={theme.colors.primary} />
            <Text style={styles.secondaryText}>
              {t('common.actions.previous')}
            </Text>
          </View>
        </Button>
        <Button
          variant="tab"
          size="xs"
          style={styles.button}
          onPress={onSubmit}
          disabled={!showSubmit}
        >
          <View style={styles.buttonRow}>
            <IconCheck size={iconSize} color={theme.colors.primary} />
            <Text style={styles.secondaryText}>
              {t('common.actions.submit')}
            </Text>
          </View>
        </Button>
        <Button
          variant="tab"
          size="xs"
          style={styles.button}
          onPress={onNext}
          disabled={!showNext}
        >
          <View style={styles.buttonRow}>
            {state.isLastQuestion ? (
              <IconTrophy size={iconSize} color={theme.colors.primary} />
            ) : (
              <IconArrowRight size={iconSize} color={theme.colors.primary} />
            )}
            <Text style={styles.secondaryText}>
              {state.isLastQuestion
                ? t('common.actions.finish')
                : t('common.actions.next')}
            </Text>
          </View>
        </Button>
      </View>
    </View>
  );
};

const useStyles = makeStyles(theme =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.colors.border,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      // gap: theme.spacing.sm,
      // justifyContent: 'space-between'
    },
    row: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: theme.spacing.sm,
      justifyContent: 'space-around',
    },
    button: {
      flex: 1,
    },
    buttonRow: {
      flexDirection: 'column',
      alignItems: 'center',
      // flex: 1,
      gap: theme.spacing.sm,
      // borderWidth: StyleSheet.hairlineWidth
    },
    primaryText: {
      ...theme.typography.heading,
      color: theme.colors.textOnPrimary,
    },
    secondaryText: {
      ...theme.typography.body,
      color: theme.colors.textPrimary,
    },
  }),
);

export default QuizToolbar;
