import React from 'react';
import { Image, StyleSheet, Text, View, ViewProps } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  IconShieldCheck,
} from '../components/icons';
import {
  Button,
  ProgressBar,
  makeStyles,
  useTheme,
} from '../components';
import { useAppStore } from '../store/useAppStore';
import { SupportedLanguageCode } from '../localization/i18n';
import { QuizAttempt } from '../types/history';

export interface HomeScreenProps extends ViewProps {
  username: string;
  displayName?: string;
  avatarUrl?: string;
  onRequestSignIn?: () => void;
  isGuest?: boolean;
  totalAnswered: number;
  totalCorrect: number;
  streakDays: number;
  completionRatio: number;
  lastAttempt?: QuizAttempt | null;
  onReviewAttempt?: (attempt: QuizAttempt) => void;
  language: SupportedLanguageCode;
  onChangeLanguage: (language: SupportedLanguageCode) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  username,
  displayName,
  avatarUrl,
  onRequestSignIn,
  isGuest = false,
  totalAnswered,
  totalCorrect,
  streakDays,
  completionRatio,
  lastAttempt,
  onReviewAttempt,
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

  return (
    <View style={[styles.container, style]} {...rest}>
      <View style={styles.hero} accessible accessibilityRole="header">
        <Text style={styles.title}>{greeting}</Text>
        {avatarUrl ? (
          <Image
            source={{ uri: avatarUrl }}
            style={styles.avatarImage}
            accessibilityLabel={t('common.userProfile')}
          />
        ) : (<Image
          source={require('../hero.png')}
          style={styles.heroImage}
          resizeMode="contain"
          accessibilityLabel={t('login.logoAlt')}
        />)}
        <Text style={styles.subtitle}>{subtitle}</Text>
        {/* {avatarUrl ? (
          <Image
            source={{ uri: avatarUrl }}
            style={styles.avatarImage}
            accessibilityLabel={t('common.userProfile')}
          />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarInitials}>
              {getInitials(displayName ?? username)}
            </Text>
          </View>
        )} */}
        
        
      </View>

      {isGuest ? (
        // <View style={styles.guestCard}>
        //   <Text style={styles.guestTitle}>{t('home.guestCardTitle')}</Text>
        //   <Text style={styles.guestBody}>{t('home.guestCardBody')}</Text>
          <>{onRequestSignIn ? (
            <Button
              variant="primary"
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
          ) : null}</>
        // </View>
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

      {lastAttempt && !isGuest ? (
        <View style={styles.lastAttemptCard}>
          <View style={styles.lastAttemptHeader}>
            <View style={styles.lastAttemptTitleBlock}>
              <Text style={styles.sectionHeading}>
                {t('home.lastAttemptTitle')}
              </Text>
              <Text style={styles.lastAttemptTimestamp}>
                {new Date(lastAttempt.timestamp).toLocaleString()}
              </Text>
            </View>
            <View style={styles.scorePill}>
              <Text style={styles.scoreText}>
                {lastAttempt.score.correct}/{lastAttempt.score.total}
              </Text>
            </View>
          </View>
          <View style={styles.lastAttemptMetaRow}>
            <Text style={styles.lastAttemptLabel}>
              {t('home.difficultyTitle')}
            </Text>
            <Text style={styles.lastAttemptValue}>
              {t(difficultyLabelKeys[lastAttempt.difficulty])}
            </Text>
          </View>
          <View style={styles.lastAttemptMetaRow}>
            <Text style={styles.lastAttemptLabel}>
              {t('home.progressCorrect')}
            </Text>
            <Text style={styles.lastAttemptValue}>
              {lastAttempt.score.correct}/{lastAttempt.score.total}
            </Text>
          </View>
          {onReviewAttempt ? (
            <Button
              variant="outline"
              size="md"
              fullWidth
              onPress={() => onReviewAttempt(lastAttempt)}
            >
              <Text style={styles.reviewButtonText}>
                {t('common.actions.reviewAnswers')}
              </Text>
            </Button>
          ) : null}
        </View>
      ) : null}
    </View>
  );
};

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

const difficultyLabelKeys: Record<
  QuizAttempt['difficulty'],
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
      gap: theme.spacing.xl,
    },
    hero: {
      gap: theme.spacing.md,
      alignItems: 'center',
    },
    heroImage: {
      width: '100%',
      height: undefined,
      aspectRatio: 1,
      // borderRadius: theme.radius.md,
      // alignSelf: 'stretch',
    },
    avatarImage: {
      width: 128,
      height: 128,
      borderRadius: theme.radius.pill,
    },
    avatarFallback: {
      width: 128,
      height: 128,
      borderRadius: theme.radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primary,
    },
    avatarInitials: {
      ...theme.typography.caption,
      color: theme.colors.textOnPrimary,
    },
    title: {
      ...theme.typography.display,
      color: theme.colors.textPrimary,
      textAlign: 'center',
    },
    subtitle: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: 'center',
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
    lastAttemptCard: {
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
    lastAttemptHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    lastAttemptTitleBlock: {
      gap: theme.spacing.xs,
    },
    lastAttemptTimestamp: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      textTransform: 'none',
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
    lastAttemptMetaRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    lastAttemptLabel: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.4,
    },
    lastAttemptValue: {
      ...theme.typography.body,
      color: theme.colors.textPrimary,
      fontWeight: '600',
    },
    reviewButtonText: {
      ...theme.typography.caption,
      textTransform: 'uppercase',
      color: theme.colors.primary,
      letterSpacing: 0.5,
      fontWeight: '600',
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
  }),
);

export default HomeScreen;
