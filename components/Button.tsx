import React, { useMemo } from 'react';
import {
  Pressable,
  PressableProps,
  PressableStateCallbackType,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Theme, useTheme } from './theme';

export type ButtonVariant =
  | 'unstyled'
  | 'primary'
  | 'secondary'
  | 'surface'
  | 'muted'
  | 'outline'
  | 'outlineInverse'
  | 'danger'
  | 'ghost'
  | 'elevated'
  | 'card'
  | 'tab'
  | 'chip'
  | 'chipFilled';

export type ButtonSize = 'none' | 'xs' | 'sm' | 'md' | 'lg';

export type ButtonProps = Omit<PressableProps, 'style'> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  selected?: boolean;
  radius?: keyof Theme['radius'];
  pressedStyle?: StyleProp<ViewStyle>;
  pressedOpacity?: number;
  disabledStyle?: StyleProp<ViewStyle>;
  disabledOpacity?: number;
  style?: StyleProp<ViewStyle> | ((state: PressableStateCallbackType) => StyleProp<ViewStyle>);
};

export const Button = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  ButtonProps
>(
  (
    {
      children,
      variant = 'unstyled',
      size = 'md',
      fullWidth = false,
      selected = false,
      radius,
      pressedStyle,
      pressedOpacity,
      disabledStyle,
      disabledOpacity,
      style,
      disabled,
      accessibilityRole = 'button',
      accessibilityState,
      ...pressableProps
    },
    ref,
  ) => {
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const resolvedRadius = radius ? styles.radius[radius] : undefined;

    const {
      baseStyle,
      pressedStyle: variantPressedStyle,
    } = resolveVariantStyles(theme, variant, selected);

    const sizeStyle =
      variant !== 'unstyled' && size !== 'none'
        ? styles.size[size]
        : undefined;

    const mergedAccessibilityState = {
      ...accessibilityState,
      disabled: disabled ?? accessibilityState?.disabled,
    };

    const resolveStyle = (state: PressableStateCallbackType) => {
      const { pressed } = state;
      const appliedStyle =
        typeof style === 'function' ? style(state) : style;

      return [
        baseStyle,
        sizeStyle,
        fullWidth ? styles.fullWidth : null,
        resolvedRadius,
        appliedStyle,
        pressed && !disabled ? variantPressedStyle : null,
        pressed && !disabled && pressedStyle ? pressedStyle : null,
        pressed && !disabled && pressedOpacity != null
          ? { opacity: pressedOpacity }
          : null,
        disabled
          ? disabledStyle ?? (disabledOpacity != null ? { opacity: disabledOpacity } : styles.disabled)
          : null,
      ];
    };

    return (
      <Pressable
        accessibilityRole={accessibilityRole}
        accessibilityState={mergedAccessibilityState}
        ref={ref}
        disabled={disabled}
        style={resolveStyle}
        {...pressableProps}
      >
        {children}
      </Pressable>
    );
  },
);

Button.displayName = 'Button';

export default Button;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    size: {
      none: {},
      xs: {
        paddingVertical: theme.spacing.xs,
        paddingHorizontal: theme.spacing.sm,
      },
      sm: {
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
      },
      md: {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
      },
      lg: {
        paddingVertical: theme.spacing.lg,
        paddingHorizontal: theme.spacing.lg,
      },
    },
    fullWidth: {
      width: '100%',
    },
    disabled: {
      opacity: 0.6,
    },
    radius: {
      sm: { borderRadius: theme.radius.sm },
      md: { borderRadius: theme.radius.md },
      lg: { borderRadius: theme.radius.lg },
      pill: { borderRadius: theme.radius.pill },
    },
  });

const resolveVariantStyles = (
  theme: Theme,
  variant: ButtonVariant,
  selected: boolean,
): { baseStyle: ViewStyle; pressedStyle?: ViewStyle } => {
  const centerAlign: ViewStyle = { alignItems: 'center', justifyContent: 'center' };
  const shadowSm: ViewStyle = {
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1,
  };
  const shadowMd: ViewStyle = {
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  };

  if (variant === 'primary') {
    return {
      baseStyle: {
        ...centerAlign,
        backgroundColor: theme.colors.primary,
        borderWidth: 0,
        borderColor: 'transparent',
        borderRadius: theme.radius.lg,
      },
      pressedStyle: { opacity: 0.9 },
    };
  }

  if (variant === 'secondary') {
    return {
      baseStyle: {
        ...centerAlign,
        backgroundColor: theme.colors.surfaceMuted,
        borderWidth: 0,
        borderColor: 'transparent',
        borderRadius: theme.radius.lg,
      },
      pressedStyle: { opacity: 0.9 },
    };
  }

  if (variant === 'surface') {
    return {
      baseStyle: {
        ...centerAlign,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.radius.lg,
      },
      pressedStyle: { opacity: 0.9 },
    };
  }

  if (variant === 'muted') {
    return {
      baseStyle: {
        ...centerAlign,
        backgroundColor: theme.colors.surfaceMuted,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.radius.lg,
      },
      pressedStyle: { backgroundColor: theme.colors.primaryMuted },
    };
  }

  if (variant === 'outline') {
    return {
      baseStyle: {
        ...centerAlign,
        backgroundColor: theme.colors.primaryMuted,
        borderWidth: 1,
        borderColor: theme.colors.primary,
        borderRadius: theme.radius.lg,
      },
      pressedStyle: { opacity: 0.9 },
    };
  }

  if (variant === 'outlineInverse') {
    return {
      baseStyle: {
        ...centerAlign,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.textOnPrimary,
        borderRadius: theme.radius.lg,
      },
      pressedStyle: { backgroundColor: theme.colors.primaryMuted },
    };
  }

  if (variant === 'danger') {
    return {
      baseStyle: {
        ...centerAlign,
        backgroundColor: theme.colors.dangerMuted,
        borderWidth: 1,
        borderColor: theme.colors.dangerStrong,
        borderRadius: theme.radius.lg,
      },
      pressedStyle: { opacity: 0.92 },
    };
  }

  if (variant === 'ghost') {
    return {
      baseStyle: {
        ...centerAlign,
        backgroundColor: 'transparent',
        borderWidth: 0,
        borderRadius: theme.radius.lg,
      },
      pressedStyle: { opacity: 0.85 },
    };
  }

  if (variant === 'elevated') {
    return {
      baseStyle: {
        ...centerAlign,
        ...shadowSm,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.radius.lg,
      },
      pressedStyle: { opacity: 0.9 },
    };
  }

  if (variant === 'card') {
    return {
      baseStyle: {
        ...shadowMd,
        alignItems: 'stretch',
        backgroundColor: theme.colors.surface,
        borderWidth: 0,
        borderRadius: theme.radius.md,
      },
      pressedStyle: { backgroundColor: theme.colors.surfaceMuted },
    };
  }

  if (variant === 'tab') {
    return {
      baseStyle: {
        ...centerAlign,
        backgroundColor: selected ? theme.colors.primaryMuted : 'transparent',
        borderWidth: 0,
        borderRadius: theme.radius.lg,
      },
      pressedStyle: { backgroundColor: theme.colors.primaryMuted },
    };
  }

  if (variant === 'chip' || variant === 'chipFilled') {
    const isFilled = variant === 'chipFilled';
    const baseBackground = isFilled ? theme.colors.surfaceMuted : 'transparent';
    return {
      baseStyle: {
        ...centerAlign,
        backgroundColor: selected ? theme.colors.primary : baseBackground,
        borderWidth: 1,
        borderColor: selected ? theme.colors.primary : theme.colors.border,
        borderRadius: theme.radius.lg,
      },
      pressedStyle: { backgroundColor: theme.colors.primaryMuted },
    };
  }

  return {
    baseStyle: {
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
  };
};
