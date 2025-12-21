import React, { useRef } from 'react';
import {
  Animated,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { Theme, makeStyles, useTheme } from './theme';
import Svg, { Circle } from 'react-native-svg';
import { IconCheckCircle } from './icons';
import { useAppStore } from '../store/useAppStore';
import { Button, type ButtonProps } from './Button';

type FeedbackStatus = 'default' | 'correct' | 'incorrect';

const DefaultBulletIcon: React.FC<{ color: string; size: number }> = ({
  color,
  size,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="8" stroke={color} strokeWidth={2} fill="none" />
  </Svg>
);

export interface OptionButtonProps extends Omit<ButtonProps, 'style'> {
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
  const theme = useTheme();
  const styles = useStyles();
  const statusColors = getStatusColors(theme, selected, status);
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
      <Button
        accessibilityState={{
          selected: selected || undefined,
          disabled: disabled ?? undefined,
        }}
        disabled={disabled}
        pressedStyle={styles.pressedBackground}
        style={[
          styles.button,
          {
            backgroundColor: statusColors.background,
            borderColor: statusColors.border,
            opacity: disabled ? 0.6 : 1,
          },
        ]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        {...pressableProps}
      >
        <View style={styles.content}>
          <View style={styles.labelRow}>
            <View style={styles.iconWrapper}>
              {selected ? (
                <IconCheckCircle
                  size={iconSize}
                  color={theme.colors.textOnPrimary}
                />
              ) : (
                <DefaultBulletIcon color={theme.colors.primary} size={iconSize} />
              )}
            </View>
            <Text
              style={[
                styles.label,
                {
                  color: selected
                    ? theme.colors.textOnPrimary
                    : theme.colors.textPrimary,
                },
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
                  color: selected
                    ? theme.colors.textOnPrimary
                    : theme.colors.textSecondary,
                },
              ]}
            >
              {description}
            </Text>
          ) : null}
        </View>
      </Button>
    </Animated.View>
  );
};

function getStatusColors(theme: Theme, selected: boolean, status: FeedbackStatus) {
  if (status === 'correct') {
    return {
      background: theme.colors.success,
      border: theme.colors.success,
    };
  }

  if (status === 'incorrect') {
    return {
      background: selected ? theme.colors.dangerMuted : theme.colors.surface,
      border: theme.colors.dangerStrong,
    };
  }

  if (selected) {
    return {
      background: theme.colors.primary,
      border: theme.colors.primary,
    };
  }

  return {
    background: theme.colors.surface,
    border: theme.colors.border,
  };
}

const useStyles = makeStyles((theme) =>
  StyleSheet.create({
    wrapper: {
      width: '100%',
    },
    button: {
      borderWidth: 1,
      borderRadius: theme.radius.lg,
      paddingVertical: theme.spacing.lg,
      paddingHorizontal: theme.spacing.xl,
      minHeight: 48,
      justifyContent: 'center',
    },
    content: {
      gap: theme.spacing.sm,
    },
    labelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    iconWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    icon: {
      marginRight: 0,
    },
    label: {
      ...theme.typography.body,
      fontWeight: '600',
    },
    description: {
      ...theme.typography.caption,
      textTransform: 'none',
    },
    pressedBackground: {
      backgroundColor: theme.colors.primaryMuted,
    },
  }),
);

export default OptionButton;
