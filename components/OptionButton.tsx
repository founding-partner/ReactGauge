import React, { useRef } from 'react';
import {
  Animated,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { colors, radius, spacing, typography } from './theme';
import Svg, { Circle } from 'react-native-svg';
import { IconCheckCircle } from './icons';
import { useAppStore } from '../store/useAppStore';

type FeedbackStatus = 'default' | 'correct' | 'incorrect';

const DefaultBulletIcon: React.FC<{ color: string; size: number }> = ({
  color,
  size,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="8" stroke={color} strokeWidth={2} fill="none" />
  </Svg>
);

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
  onPressIn,
  onPressOut,
  ...pressableProps
}) => {
  const statusColors = getStatusColors(selected, status);
  const scale = useRef(new Animated.Value(1)).current;
  const iconSize = useAppStore((state) => state.iconSize);

  const animateTo = (value: number) => {
    Animated.spring(scale, {
      toValue: value,
      friction: 7,
      tension: 180,
      useNativeDriver: true,
    }).start();
  };

  const handlePressIn = (event: any) => {
    animateTo(0.97);
    onPressIn?.(event);
  };

  const handlePressOut = (event: any) => {
    animateTo(1);
    onPressOut?.(event);
  };

  return (
    <Animated.View
      style={[styles.wrapper, containerStyle, { transform: [{ scale }] }]}
    >
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
          pressed && !disabled ? styles.pressedBackground : null,
        ]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        {...pressableProps}
      >
        <View style={styles.content}>
          <View style={styles.labelRow}>
            <View style={styles.iconWrapper}>
              {selected ? (
                <IconCheckCircle size={iconSize} color={colors.textOnPrimary} />
              ) : (
                <DefaultBulletIcon color={colors.primary} size={iconSize} />
              )}
            </View>
            <Text
              style={[
                styles.label,
                { color: selected ? colors.textOnPrimary : colors.textPrimary },
              ]}
            >
              {label}
            </Text>
          </View>
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
    </Animated.View>
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
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginRight: 0,
  },
  label: {
    ...typography.body,
    fontWeight: '600',
  },
  description: {
    ...typography.caption,
    textTransform: 'none',
  },
  pressedBackground: {
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
  },
});

export default OptionButton;
