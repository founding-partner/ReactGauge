import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ViewProps,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { makeStyles } from './theme';
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
  const styles = useStyles();

  return (
    <View
      style={[styles.card, containerStyle, style]}
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

const useStyles = makeStyles((theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.md,
      padding: theme.spacing.xl,
      gap: theme.spacing.lg,
      position: 'relative',
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 6,
      elevation: 2,
    },
    header: {
      gap: theme.spacing.sm,
    },
    title: {
      ...theme.typography.heading,
      color: theme.colors.textPrimary,
    },
    description: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
    },
    codeBlock: {},
    body: {
      gap: theme.spacing.md,
    },
    footer: {
      paddingTop: theme.spacing.lg,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.colors.border,
    },
  }),
);

export default QuestionCard;
