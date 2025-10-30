import React from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewProps,
} from 'react-native';
import { colors, radius, spacing, typography } from '../components';
import { QuizAttempt } from '../types/history';
import { IconArrowLeft, IconArrowRight } from '../components/icons';

export interface HistoryScreenProps extends ViewProps {
  attempts: QuizAttempt[];
  onSelectAttempt: (attempt: QuizAttempt) => void;
  onClearHistory: () => void;
  onClose: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  attempts,
  onSelectAttempt,
  onClearHistory,
  onClose,
  style,
  ...rest
}) => {
  const handleClear = () => {
    if (attempts.length === 0) {
      return;
    }
    Alert.alert(
      'Clear quiz history',
      'This will permanently remove all saved attempts. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: onClearHistory,
        },
      ],
    );
  };

  return (
    <View style={[styles.container, style]} {...rest}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={onClose}>
          <IconArrowLeft size={20} color={colors.surface} />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
        <Text style={styles.title}>Quiz History</Text>
        <Pressable
          style={[styles.clearButton, attempts.length === 0 && styles.clearButtonDisabled]}
          onPress={handleClear}
          disabled={attempts.length === 0}
        >
          <Text style={styles.clearButtonText}>Clear</Text>
        </Pressable>
      </View>

      <FlatList
        data={attempts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No attempts yet</Text>
            <Text style={styles.emptySubtitle}>
              Complete a quiz to see your history here.
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.attemptCard,
              pressed && styles.attemptCardPressed,
            ]}
            onPress={() => onSelectAttempt(item)}
          >
            <View style={styles.attemptHeader}>
              <View style={styles.attemptMeta}>
                <Text style={styles.attemptDifficulty}>{capitalize(item.difficulty)}</Text>
                <Text style={styles.attemptTimestamp}>
                  {new Date(item.timestamp).toLocaleString()}
                </Text>
              </View>
              <View style={styles.scorePill}>
                <Text style={styles.scoreText}>
                  {item.score.correct}/{item.score.total}
                </Text>
              </View>
            </View>
            <View style={styles.attemptFooter}>
              <Text style={styles.attemptDetail}>
                {item.userMode === 'guest' ? 'Guest' : item.userLogin} · Streak {item.streak}
              </Text>
              <IconArrowRight size={18} color={colors.textSecondary} />
            </View>
          </Pressable>
        )}
      />
    </View>
  );
};

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  backButtonText: {
    ...typography.body,
    color: colors.surface,
  },
  title: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  clearButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: 'rgba(220, 38, 38, 0.12)',
    borderRadius: radius.md,
  },
  clearButtonDisabled: {
    opacity: 0.4,
  },
  clearButtonText: {
    ...typography.caption,
    color: '#dc2626',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: spacing.xxl * 2,
    gap: spacing.md,
  },
  attemptCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.sm,
    shadowColor: colors.background,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  attemptCardPressed: {
    backgroundColor: 'rgba(148, 163, 184, 0.16)',
  },
  attemptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attemptMeta: {
    gap: spacing.xs,
  },
  attemptDifficulty: {
    ...typography.caption,
    textTransform: 'uppercase',
    color: colors.primary,
    letterSpacing: 0.6,
    fontWeight: '600',
  },
  attemptTimestamp: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  scorePill: {
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  scoreText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  attemptFooter: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attemptDetail: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  separator: {
    height: spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 2,
    gap: spacing.sm,
  },
  emptyTitle: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default HistoryScreen;
