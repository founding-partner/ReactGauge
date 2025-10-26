import React from 'react';
import { ScrollView, StyleSheet, Text, View, ViewProps } from 'react-native';
import { colors, radius, spacing, typography } from './theme';

export interface CodeBlockProps extends ViewProps {
  code: string;
  language?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'tsx',
  style,
  ...rest
}) => {
  return (
    <View style={[styles.wrapper, style]} {...rest}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Text style={styles.codeText}>{code.trimEnd()}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    padding: spacing.lg,
  },
  codeText: {
    ...typography.mono,
    fontFamily: typography.mono.fontFamily,
    color: colors.surface,
  },
});

export default CodeBlock;
