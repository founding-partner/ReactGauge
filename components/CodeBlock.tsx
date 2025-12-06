import React from 'react';
import { ScrollView, StyleSheet, Text, View, ViewProps } from 'react-native';
import { makeStyles, useTheme } from './theme';

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
  const theme = useTheme();
  const styles = useStyles();

  return (
    <View style={[styles.wrapper, style]} {...rest}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Text style={styles.codeText}>{code.trimEnd()}</Text>
      </ScrollView>
    </View>
  );
};

const useStyles = makeStyles((theme) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: theme.colors.codeBackground,
      borderRadius: theme.radius.sm,
      padding: theme.spacing.lg,
    },
    codeText: {
      ...theme.typography.mono,
      fontFamily: theme.typography.mono.fontFamily,
      color: theme.colors.codeText,
    },
  }),
);

export default CodeBlock;
