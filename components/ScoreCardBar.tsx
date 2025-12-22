import React from 'react';
import { StyleSheet, Text, View, ViewStyle, StyleProp } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button } from './Button';
import { makeStyles, useTheme } from './theme';
import {
  IconArrowPath,
  IconDocumentText,
  IconHome,
  IconShare,
} from './icons';

export type ScoreCardBarProps = {
  iconSize: number;
  onRetakeQuiz: () => void;
  onReviewAnswers: () => void;
  onGoHome: () => void;
  onShare: () => void;
  sharing?: boolean;
  style?: StyleProp<ViewStyle>;
};

export const ScoreCardBar: React.FC<ScoreCardBarProps> = ({
  iconSize,
  onRetakeQuiz,
  onReviewAnswers,
  onGoHome,
  onShare,
  sharing = false,
  style,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = useStyles();

  return (
    <View style={[styles.container, style]}>
      <Button
        variant="tab"
        size="xs"
        onPress={onRetakeQuiz}
        style={styles.button}
      >
        <View style={styles.buttonContent}>
          <View style={styles.buttonIconWrapper}>
            <IconArrowPath size={iconSize} color={theme.colors.textPrimary} />
          </View>
          <Text style={styles.secondaryText}>
            {t('common.actions.retakeQuiz')}
          </Text>
        </View>
      </Button>
      <Button
        variant="tab"
        size="xs"
        onPress={onReviewAnswers}
        style={styles.button}
      >
        <View style={styles.buttonContent}>
          <View style={styles.buttonIconWrapper}>
            <IconDocumentText size={iconSize} color={theme.colors.textPrimary} />
          </View>
          <Text style={styles.secondaryText}>
            {t('common.actions.reviewAnswers')}
          </Text>
        </View>
      </Button>
      <Button
        variant="tab"
        size="xs"
        onPress={onGoHome}
        style={styles.button}
      >
        <View style={styles.buttonContent}>
          <View style={styles.buttonIconWrapper}>
            <IconHome size={iconSize} color={theme.colors.textPrimary} />
          </View>
          <Text style={styles.secondaryText}>{t('common.actions.backHome')}</Text>
        </View>
      </Button>
      <Button
        variant="tab"
        size="xs"
        onPress={onShare}
        disabled={sharing}
        disabledOpacity={0.6}
        style={styles.button}
      >
        <View style={styles.buttonContent}>
          <View style={styles.buttonIconWrapper}>
            <IconShare size={iconSize} color={theme.colors.textPrimary} />
          </View>
          <Text style={styles.secondaryText}>
            {sharing
              ? t('common.actions.preparing')
              : t('common.actions.shareScorecard')}
          </Text>
        </View>
      </Button>
    </View>
  );
};

const useStyles = makeStyles((theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'stretch',
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.xl,
      gap: theme.spacing.xs,
    },
    button: {
      flex: 1,
    },
    buttonContent: {
      flexDirection: 'column',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    buttonIconWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing.xs,
    },
    primaryText: {
      ...theme.typography.heading,
      color: theme.colors.textOnPrimary,
    },
    secondaryText: {
      ...theme.typography.body,
      color: theme.colors.primary,
    },
    tertiaryText: {
      ...theme.typography.heading,
      color: theme.colors.textPrimary,
    },
    shareText: {
      ...theme.typography.heading,
      color: theme.colors.textPrimary,
    },
  }),
);

export default ScoreCardBar;
