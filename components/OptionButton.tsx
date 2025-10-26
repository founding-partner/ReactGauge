import React from 'react';
import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { colors, radius, spacing, typography } from './theme';

type FeedbackStatus = 'default' | 'correct' | 'incorrect';

export interface OptionButtonProps extends Omit<PressableProps, 'style'> {
  label: string;
  description?: string;
  selected?: boolean;
  status?: FeedbackStatus;
  containerStyle?: StyleProp<ViewStyle>;
}

export const OptionButton: React.FC<OptionButtonProps> = ({
  label,
  description,
  selected = false,
  status = 'default',
  containerStyle,
  disabled,
  ...pressableProps
}) => {
  const statusColors = getStatusColors(selected, status);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{
          selected: selected || undefined,
          disabled: disabled ?? undefined,
        }}
        disabled={disabled}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: statusColors.background,
            borderColor: statusColors.border,
            opacity: disabled ? 0.6 : 1,
          },
          pressed && !disabled ? styles.pressed : null,
        ]}
        {...pressableProps}
      >
        <View style={styles.content}>
          <Text
            style={[
              styles.label,
              { color: selected ? colors.textOnPrimary : colors.textPrimary },
            ]}
          >
            {label}
          </Text>
          {description ? (
            <Text
              style={[
                styles.description,
                {
                  color: selected ? colors.surface : colors.textSecondary,
                },
              ]}
            >
              {description}
            </Text>
          ) : null}
        </View>
      </Pressable>
    </View>
  );
};

function getStatusColors(selected: boolean, status: FeedbackStatus) {
  if (status === 'correct') {
    return {
      background: colors.success,
      border: colors.success,
    };
  }

  if (status === 'incorrect') {
    return {
      background: selected ? '#FEE2E2' : colors.surface,
      border: '#EF4444',
    };
  }

  if (selected) {
    return {
      background: colors.primary,
      border: colors.primary,
    };
  }

  return {
    background: colors.surface,
    border: colors.border,
  };
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  button: {
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    minHeight: 48,
    justifyContent: 'center',
  },
  content: {
    gap: spacing.sm,
  },
  label: {
    ...typography.body,
    fontWeight: '600',
  },
  description: {
    ...typography.caption,
    textTransform: 'none',
  },
  pressed: {
    transform: [{ scale: 0.99 }],
  },
});

export default OptionButton;
