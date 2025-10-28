import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ViewProps,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { colors, radius, spacing, typography } from './theme';
import { CodeBlock } from './CodeBlock';

interface QuestionCardProps extends ViewProps {
  title: string;
  description?: string;
  codeSnippet?: string;
  footer?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  title,
  description,
  codeSnippet,
  footer,
  containerStyle,
  style,
  children,
  ...viewProps
}) => {
  return (
    <View
      style={[styles.card, containerStyle, style]}
      accessibilityRole="summary"
      {...viewProps}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>

      {codeSnippet ? <CodeBlock code={codeSnippet} style={styles.codeBlock} /> : null}

      {children ? <View style={styles.body}>{children}</View> : null}

      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.xl,
    gap: spacing.lg,
    position: 'relative',
    shadowColor: colors.background,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  header: {
    gap: spacing.sm,
  },
  title: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
  },
  codeBlock: {},
  body: {
    gap: spacing.md,
  },
  footer: {
    paddingTop: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#CBD5F5',
  },
});

export default QuestionCard;
