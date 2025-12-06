import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewProps,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { makeStyles } from './theme';

export interface QuizHeaderProps extends ViewProps {
  title: string;
  subtitle?: string;
  avatarUri?: string;
  initials?: string;
  currentQuestion: number;
  totalQuestions: number;
  timeRemainingLabel?: string;
  onAvatarPress?: () => void;
  showProgress?: boolean;
}

export const QuizHeader: React.FC<QuizHeaderProps> = ({
  title,
  subtitle,
  avatarUri,
  initials,
  currentQuestion,
  totalQuestions,
  timeRemainingLabel,
  onAvatarPress,
  showProgress = true,
  style,
  ...rest
}) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const fallbackInitials = t('common.userInitials');

  return (
    <View style={[styles.container, style]} {...rest}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('common.userProfile')}
        onPress={onAvatarPress}
        disabled={!onAvatarPress}
        style={styles.avatarWrapper}
      >
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarInitials}>{initials ?? fallbackInitials}</Text>
          </View>
        )}
      </Pressable>

      <View style={styles.meta}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      {showProgress ? (
        <View style={styles.status}>
          <Text style={styles.statusPrimary}>
            {currentQuestion}/{totalQuestions}
          </Text>
          {timeRemainingLabel ? (
            <Text style={styles.statusSecondary}>{timeRemainingLabel}</Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
};

const useStyles = makeStyles((theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.lg,
      paddingHorizontal: theme.spacing.xl,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.md,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 2,
    },
    avatarWrapper: {
      paddingRight: theme.spacing.lg,
    },
    avatarImage: {
      width: 40,
      height: 40,
      borderRadius: theme.radius.pill,
    },
    avatarFallback: {
      width: 40,
      height: 40,
      borderRadius: theme.radius.pill,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarInitials: {
      ...theme.typography.caption,
      color: theme.colors.textOnPrimary,
    },
    meta: {
      flex: 1,
      gap: theme.spacing.xs,
    },
    title: {
      ...theme.typography.body,
      color: theme.colors.textPrimary,
      fontWeight: '700',
    },
    subtitle: {
      ...theme.typography.subheading,
      color: theme.colors.textSecondary,
      textTransform: 'none',
    },
    status: {
      alignItems: 'flex-end',
      gap: theme.spacing.xs,
    },
    statusPrimary: {
      ...theme.typography.heading,
      color: theme.colors.primary,
    },
    statusSecondary: {
      ...theme.typography.subheading,
      color: theme.colors.textSecondary,
      textTransform: 'none',
    },
  }),
);

export default QuizHeader;
