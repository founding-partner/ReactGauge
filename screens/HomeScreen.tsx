import React from 'react';
import { StyleSheet, Text, View, ViewProps } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  IconFire,
  IconPlayCircle,
  IconRocketLaunch,
  IconShieldCheck,
  IconSparkles,
} from '../components/icons';
import {
  Button,
  ProgressBar,
  QuizHeader,
  makeStyles,
  useTheme,
} from '../components';
import { QUESTION_COUNT_BY_DIFFICULTY, useAppStore, type Difficulty } from '../store/useAppStore';
import { SupportedLanguageCode, supportedLanguages } from '../localization/i18n';

export interface HomeScreenProps extends ViewProps {
  username: string;
  displayName?: string;
  avatarUrl?: string;
  onStartQuiz: () => void;
  onRequestSignIn?: () => void;
  isGuest?: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  onSelectDifficulty: (difficulty: 'easy' | 'medium' | 'hard') => void;
  questionPoolSize: number;
  totalAnswered: number;
  totalCorrect: number;
  streakDays: number;
  completionRatio: number;
  language: SupportedLanguageCode;
  onChangeLanguage: (language: SupportedLanguageCode) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  username,
  displayName,
  avatarUrl,
  onStartQuiz,
  onRequestSignIn,
  isGuest = false,
  difficulty,
  onSelectDifficulty,
  questionPoolSize,
  totalAnswered,
  totalCorrect,
  streakDays,
  completionRatio,
  language,
  onChangeLanguage,
  style,
  ...rest
}) => {
  const iconSize = useAppStore((state) => state.iconSize);
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = useStyles();

  const greeting = t('home.welcome', { name: displayName ?? username });
  const subtitle = isGuest
    ? t('home.subtitleGuest')
    : t('home.subtitleSignedIn');

  const streakLabel = isGuest
    ? t('common.guestMode')
    : t('common.streakDays', { count: Math.max(streakDays, 0) });

  return (
    <View style={[styles.container, style]} {...rest}>
      <QuizHeader
        title={greeting}
        subtitle={subtitle}
        avatarUri={avatarUrl}
        initials={getInitials(displayName ?? username)}
        currentQuestion={Math.max(1, Math.round(completionRatio * 10))}
        totalQuestions={10}
        timeRemainingLabel={streakLabel}
        showProgress={false}
      />
      {/* <View style={styles.languageSection}>
        <Text style={styles.languageLabel}>{t('home.languageLabel')}</Text>
        <View style={styles.languageRow}>
          {supportedLanguages.map((entry) => {
            const isActive = entry.code === language;
            return (
              <Button
                key={entry.code}
                accessibilityState={{ selected: isActive }}
                variant="chip"
                size="sm"
                selected={isActive}
                style={styles.languageChip}
                onPress={() => {
                  if (!isActive) {
                    onChangeLanguage(entry.code);
                  }
                }}
              >
                <Text
                  style={[
                    styles.languageChipText,
                    isActive && styles.languageChipTextActive,
                  ]}
                >
                  {entry.label}
                </Text>
              </Button>
            );
          })}
        </View>
      </View> */}

      {isGuest ? (
        <View style={styles.guestCard}>
          <Text style={styles.guestTitle}>{t('home.guestCardTitle')}</Text>
          <Text style={styles.guestBody}>{t('home.guestCardBody')}</Text>
          {onRequestSignIn ? (
            <Button
              variant="outlineInverse"
              size="md"
              fullWidth
              style={styles.guestSignInButton}
              onPress={onRequestSignIn}
            >
              <View style={styles.buttonRow}>
                <View style={styles.buttonIconWrapper}>
                  <IconShieldCheck size={iconSize} color={theme.colors.textOnPrimary} />
                </View>
                <Text style={styles.guestSignInText}>
                  {t('common.actions.signIn')}
                </Text>
              </View>
            </Button>
          ) : null}
        </View>
      ) : (
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>{t('home.progressTitle')}</Text>
          <ProgressRow label={t('home.progressAnswered')} value={totalAnswered} />
          <ProgressRow label={t('home.progressCorrect')} value={totalCorrect} />
          <View style={styles.progressBlock}>
            <Text style={styles.progressLabel}>{t('home.progressWeekly')}</Text>
            <ProgressBar
              progress={completionRatio}
              milestones={[0.25, 0.5, 0.75, 1]}
            />
          </View>
        </View>
      )}

      <View style={styles.difficultyCard}>
        <Text style={styles.sectionHeading}>{t('home.difficultyTitle')}</Text>
        <Text style={styles.difficultySubtext}>
          {t('home.difficultyDescription', { count: questionPoolSize })}
        </Text>
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
                <View style={styles.difficultyTextGroup}>
                {(() => {
                  const IconComponent = difficultyIconMap[option.value];
                  const iconColor =
                    difficulty === option.value
                      ? theme.colors.textOnPrimary
                      : theme.colors.primary;
                  return (
                    <View style={styles.buttonIconWrapper}>
                      <IconComponent size={iconSize} color={iconColor} />
                    </View>
                  );
                })()}
                
                  <Text
                    style={[
                      styles.difficultyChipText,
                      difficulty === option.value && styles.difficultyChipTextActive,
                    ]}
                  >
                    {t(difficultyTranslationKeys[option.value])}
                  </Text>
                  <Text
                    style={[
                      styles.difficultyChipCount,
                      difficulty === option.value && styles.difficultyChipTextActive,
                    ]}
                  >
                    {t('home.difficultyCountLabel', { count: option.count })}
                  </Text>
                </View>
              </View>
            </Button>
          ))}
        </View>

        <View style={styles.primaryActionColumn}>
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
      </View>
    </View>
  );
};

function getInitials(source: string) {
  if (!source) {
    return 'YOU';
  }

  const parts = source.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
}

const ProgressRow = ({
  label,
  value,
}: {
  label: string;
  value: number;
}) => {
  const styles = useStyles();

  return (
    <View style={styles.progressRow}>
      <Text style={styles.progressRowLabel}>{label}</Text>
      <Text style={styles.progressRowValue}>{value}</Text>
    </View>
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
    container: {
      flex: 1,
      gap: theme.spacing.xl,
    },
    section: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.md,
      padding: theme.spacing.xl,
      gap: theme.spacing.md,
      elevation: 2,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
    },
    languageSection: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.md,
      padding: theme.spacing.lg,
      gap: theme.spacing.sm,
      elevation: 1,
    },
    languageLabel: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    languageRow: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    languageChip: {
      flex: 1,
    },
    languageChipText: {
      ...theme.typography.caption,
      color: theme.colors.textPrimary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      fontWeight: '600',
    },
    languageChipTextActive: {
      color: theme.colors.textOnPrimary,
    },
    sectionHeading: {
      ...theme.typography.heading,
      color: theme.colors.textPrimary,
    },
    guestCard: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius.md,
      padding: theme.spacing.xl,
      gap: theme.spacing.md,
    },
    guestTitle: {
      ...theme.typography.heading,
      color: theme.colors.textOnPrimary,
    },
    guestBody: {
      ...theme.typography.body,
      color: theme.colors.textOnPrimary,
      opacity: 0.92,
    },
    guestSignInButton: {
      marginTop: theme.spacing.sm,
    },
    guestSignInText: {
      ...theme.typography.caption,
      textTransform: 'uppercase',
      color: theme.colors.textOnPrimary,
    },
    primaryActionColumn: {
      marginTop: theme.spacing.lg,
      gap: theme.spacing.md,
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
    difficultyCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.md,
      padding: theme.spacing.xl,
      gap: theme.spacing.md,
    },
    difficultySubtext: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
    },
    difficultyRow: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    difficultyChip: {
      flex: 1,
    },
    difficultyContent: {
      flexDirection: 'row',
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
    progressBlock: {
      gap: theme.spacing.sm,
    },
    progressLabel: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      textTransform: 'none',
    },
    progressRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    progressRowLabel: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      lineHeight: 18,
    },
    progressRowValue: {
      ...theme.typography.heading,
      color: theme.colors.primary,
      lineHeight: 18,
    },
    ctaText: {
      ...theme.typography.heading,
      color: theme.colors.textOnPrimary,
    },
  }),
);

export default HomeScreen;
