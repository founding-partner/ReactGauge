import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewProps,
} from 'react-native';
import { colors, radius, spacing, typography } from './theme';

export interface QuizHeaderProps extends ViewProps {
  title: string;
  subtitle?: string;
  avatarUri?: string;
  initials?: string;
  currentQuestion: number;
  totalQuestions: number;
  timeRemainingLabel?: string;
  onAvatarPress?: () => void;
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
  style,
  ...rest
}) => {
  return (
    <View style={[styles.container, style]} {...rest}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="User profile"
        onPress={onAvatarPress}
        disabled={!onAvatarPress}
        style={styles.avatarWrapper}
      >
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarInitials}>{initials ?? 'YOU'}</Text>
          </View>
        )}
      </Pressable>

      <View style={styles.meta}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      <View style={styles.status}>
        <Text style={styles.statusPrimary}>
          {currentQuestion}/{totalQuestions}
        </Text>
        {timeRemainingLabel ? (
          <Text style={styles.statusSecondary}>{timeRemainingLabel}</Text>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    shadowColor: colors.background,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  avatarWrapper: {
    paddingRight: spacing.lg,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
  },
  avatarFallback: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    ...typography.caption,
    color: colors.textOnPrimary,
  },
  meta: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'none',
  },
  status: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  statusPrimary: {
    ...typography.heading,
    color: colors.primary,
  },
  statusSecondary: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'none',
  },
});

export default QuizHeader;
