import React from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
  ViewProps,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button, makeStyles, useTheme } from '../components';
import { QuizAttempt } from '../types/history';
import { IconArrowLeft, IconArrowRight } from '../components/icons';
import { Difficulty } from '../store/useAppStore';

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
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = useStyles();
  const handleClear = () => {
    if (attempts.length === 0) {
      return;
    }
    Alert.alert(
      t('alerts.clearHistoryTitle'),
      t('alerts.clearHistoryBody'),
      [
        { text: t('common.actions.cancel'), style: 'cancel' },
        {
          text: t('common.actions.clear'),
          style: 'destructive',
          onPress: onClearHistory,
        },
      ],
    );
  };

  return (
    <View style={[styles.container, style]} {...rest}>
      {/* <View style={styles.header}>
        <Button variant="ghost" size="sm" style={styles.backButton} onPress={onClose}>
          <IconArrowLeft size={20} color={theme.colors.textPrimary} />
          <Text style={styles.backButtonText}>{t('common.actions.back')}</Text>
        </Button>
        <Text style={styles.title}>{t('history.title')}</Text>
        <Button
          variant="danger"
          size="sm"
          radius="md"
          disabledOpacity={0.4}
          onPress={handleClear}
          disabled={attempts.length === 0}
        >
          <Text style={styles.clearButtonText}>{t('common.actions.clear')}</Text>
        </Button>
      </View> */}

      <FlatList
        data={attempts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>{t('history.emptyTitle')}</Text>
            <Text style={styles.emptySubtitle}>
              {t('history.emptySubtitle')}
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <Button
            variant="card"
            size="lg"
            style={styles.attemptCard}
            onPress={() => onSelectAttempt(item)}
          >
            <View style={styles.attemptHeader}>
              <View style={styles.attemptMeta}>
                <Text style={styles.attemptDifficulty}>
                  {t(difficultyLabelKeys[item.difficulty])}
                </Text>
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
                {item.userMode === 'guest'
                  ? t('history.guestAttempt')
                  : item.userLogin}{' '}
                · {t('history.streak', { count: item.streak })}
              </Text>
              <IconArrowRight size={18} color={theme.colors.textSecondary} />
            </View>
          </Button>
        )}
      />
    </View>
  );
};

const difficultyLabelKeys: Record<
  Difficulty,
  | 'common.difficulties.easy'
  | 'common.difficulties.medium'
  | 'common.difficulties.hard'
> = {
  easy: 'common.difficulties.easy',
  medium: 'common.difficulties.medium',
  hard: 'common.difficulties.hard',
};

const useStyles = makeStyles((theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.spacing.xl,
      paddingTop: theme.spacing.xl,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.lg,
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    backButtonText: {
      ...theme.typography.body,
      color: theme.colors.textPrimary,
    },
    title: {
      ...theme.typography.heading,
      color: theme.colors.textPrimary,
    },
    clearButtonText: {
      ...theme.typography.caption,
      color: theme.colors.danger,
      textTransform: 'uppercase',
      letterSpacing: 0.4,
      fontWeight: '600',
    },
    listContent: {
      paddingBottom: theme.spacing.xxl * 2,
      gap: theme.spacing.md,
    },
    attemptCard: {
      gap: theme.spacing.sm,
    },
    attemptHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    attemptMeta: {
      gap: theme.spacing.xs,
    },
    attemptDifficulty: {
      ...theme.typography.caption,
      textTransform: 'uppercase',
      color: theme.colors.primary,
      letterSpacing: 0.6,
      fontWeight: '600',
    },
    attemptTimestamp: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
    },
    scorePill: {
      backgroundColor: theme.colors.primaryMuted,
      borderRadius: theme.radius.pill,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
    },
    scoreText: {
      ...theme.typography.body,
      color: theme.colors.primary,
      fontWeight: '600',
    },
    attemptFooter: {
      marginTop: theme.spacing.sm,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    attemptDetail: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
    },
    separator: {
      height: theme.spacing.sm,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.xl * 2,
      gap: theme.spacing.sm,
    },
    emptyTitle: {
      ...theme.typography.heading,
      color: theme.colors.textPrimary,
    },
    emptySubtitle: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
  }),
);

export default HistoryScreen;
