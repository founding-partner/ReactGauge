import React from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewProps,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button, makeStyles, useTheme } from '../components';
import {
  IconFire,
  IconPlayCircle,
  IconContributor,
  IconRocketLaunch,
  IconSparkles,
  IconStar,
} from '../components/icons';
import {
  QUESTION_COUNT_BY_DIFFICULTY,
  useAppStore,
  type Difficulty,
} from '../store/useAppStore';

export interface StartQuizScreenProps extends ViewProps {
  difficulty: Difficulty;
  onSelectDifficulty: (difficulty: Difficulty) => void;
  questionPoolSize: number;
  onStartQuiz: () => void;
}

export const StartQuizScreen: React.FC<StartQuizScreenProps> = ({
  difficulty,
  onSelectDifficulty,
  questionPoolSize,
  onStartQuiz,
  style,
  ...rest
}) => {
  const iconSize = useAppStore((state) => state.iconSize);
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = useStyles();
  const repoUrl = 'https://github.com/founding-partner/ReactGauge';
  const contributeUrl = `${repoUrl}/contribute`;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.container, style]}
      showsVerticalScrollIndicator={false}
      {...rest}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{t('common.actions.startQuiz')}</Text>
        <Text style={styles.subtitle}>
          {t('home.difficultyDescription', { count: questionPoolSize })}
        </Text>
      </View>

      <View style={styles.difficultyCard}>
        <Text style={styles.sectionHeading}>{t('home.difficultyTitle')}</Text>
        <View style={styles.difficultyRow}>
          {difficultyOptions.map((option) => (
            <Button
              key={option.value}
              accessibilityState={{ selected: difficulty === option.value }}
              variant="chipFilled"
              size="md"
              selected={difficulty === option.value}
              style={styles.difficultyChip}
              onPress={() => onSelectDifficulty(option.value)}
            >
              <View style={styles.difficultyContent}>
                <View style={styles.buttonIconWrapper}>
                  {(() => {
                    const IconComponent = difficultyIconMap[option.value];
                    const iconColor =
                      difficulty === option.value
                        ? theme.colors.textOnPrimary
                        : theme.colors.primary;
                    return (
                      <IconComponent size={iconSize} color={iconColor} />
                    );
                  })()}
                </View>
                <View style={styles.difficultyTextGroup}>
                  <Text
                    style={[
                      styles.difficultyChipText,
                      difficulty === option.value &&
                        styles.difficultyChipTextActive,
                    ]}
                  >
                    {t(difficultyTranslationKeys[option.value])}
                  </Text>
                  <Text
                    style={[
                      styles.difficultyChipCount,
                      difficulty === option.value &&
                        styles.difficultyChipTextActive,
                    ]}
                  >
                    {t('home.difficultyCountLabel', { count: option.count })}
                  </Text>
                </View>
              </View>
            </Button>
          ))}
        </View>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onPress={onStartQuiz}
        >
          <View style={styles.buttonRow}>
            <View style={styles.buttonIconWrapper}>
              <IconPlayCircle size={iconSize} color={theme.colors.textOnPrimary} />
            </View>
            <Text style={styles.ctaText}>{t('common.actions.startQuiz')}</Text>
          </View>
        </Button>
      </View>

      <View style={styles.actionCard}>
        <Text style={styles.sectionHeading}>
          {t('common.sectionTitles.actions')}
        </Text>
        <View style={styles.repoActions}>
          <View style={styles.repoActionCard}>
            <Text style={styles.repoDescription}>
              {t('common.actionDescriptions.joinContributor')}
            </Text>
            <Button
              variant="outline"
              size="sm"
              fullWidth
              style={styles.repoButton}
              onPress={() => void Linking.openURL(contributeUrl)}
            >
              <View style={styles.repoButtonContent}>
                <IconContributor size={iconSize + 4} color={theme.colors.primary} />
                <Text style={styles.repoButtonText}>
                  {t('common.actions.joinContributor')}
                </Text>
              </View>
            </Button>
          </View>
          <View style={styles.repoActionCard}>
            <Text style={styles.repoDescription}>
              {t('common.actionDescriptions.starRepo')}
            </Text>
            <Button
              variant="surface"
              size="sm"
              fullWidth
              style={styles.repoButton}
              onPress={() => void Linking.openURL(repoUrl)}
            >
              <View style={styles.repoButtonContent}>
                <IconStar size={iconSize + 4} color={theme.colors.primary} />
                <Text style={styles.repoButtonText}>
                  {t('common.actions.starRepo')}
                </Text>
              </View>
            </Button>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const difficultyOptions = (
  Object.entries(QUESTION_COUNT_BY_DIFFICULTY) as [Difficulty, number][]
).map(([value, count]) => ({ value, count }));

const difficultyTranslationKeys: Record<
  Difficulty,
  'common.difficulties.easy' | 'common.difficulties.medium' | 'common.difficulties.hard'
> = {
  easy: 'common.difficulties.easy',
  medium: 'common.difficulties.medium',
  hard: 'common.difficulties.hard',
};

const difficultyIconMap: Record<Difficulty, typeof IconSparkles> = {
  easy: IconSparkles,
  medium: IconRocketLaunch,
  hard: IconFire,
};

const useStyles = makeStyles((theme) =>
  StyleSheet.create({
    scroll: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    container: {
      flexGrow: 1,
      paddingHorizontal: theme.spacing.xl,
      paddingTop: theme.spacing.xl,
      paddingBottom: theme.spacing.xxl,
      gap: theme.spacing.xl,
    },
    header: {
      gap: theme.spacing.sm,
    },
    title: {
      ...theme.typography.heading,
      color: theme.colors.textPrimary,
    },
    subtitle: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
    },
    difficultyCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.md,
      padding: theme.spacing.xl,
      gap: theme.spacing.lg,
    },
    actionCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.md,
      padding: theme.spacing.xl,
      gap: theme.spacing.lg,
    },
    sectionHeading: {
      ...theme.typography.heading,
      color: theme.colors.textPrimary,
    },
    difficultyRow: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    difficultyChip: {
      flex: 1,
    },
    difficultyContent: {
      flexDirection: 'column',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    difficultyTextGroup: {
      gap: theme.spacing.xs,
    },
    difficultyChipText: {
      ...theme.typography.caption,
      fontSize: 12,
      letterSpacing: 0.2,
      textTransform: 'uppercase',
      color: theme.colors.textPrimary,
    },
    difficultyChipTextActive: {
      color: theme.colors.textOnPrimary,
    },
    difficultyChipCount: {
      ...theme.typography.caption,
      fontSize: 12,
      textAlign: 'center',
      color: theme.colors.textSecondary,
      textTransform: 'none',
    },
    buttonRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    buttonIconWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing.xs,
    },
    repoActions: {
      flexDirection: 'column',
      // gap: theme.spacing.sm,
    },
    repoActionCard: {
      flex: 1,
      gap: theme.spacing.md,
      paddingVertical: theme.spacing.md
    },
    repoButton: {
      flex: 1,
      // gap: theme.spacing.xl,
    },
    repoButtonText: {
      ...theme.typography.caption,
      color: theme.colors.textPrimary,
      textTransform: 'uppercase',
      letterSpacing: 0.4,
      fontWeight: '600',
    },
    repoButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      justifyContent: 'center',
    },
    repoDescription: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      letterSpacing: 0.4,
      textAlign: 'center',
      textTransform: 'none',
    },
    ctaText: {
      ...theme.typography.heading,
      color: theme.colors.textOnPrimary,
    },
  }),
);

export default StartQuizScreen;
