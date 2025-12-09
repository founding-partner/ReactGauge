import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View, ViewProps } from 'react-native';
import { useTranslation } from 'react-i18next';
import ConfettiCannon from 'react-native-confetti-cannon';
import {
  IconArrowPath,
  IconFire,
  IconArrowLeftOnRectangle,
  IconPlayCircle,
  IconRocketLaunch,
  IconShieldCheck,
  IconSparkles,
  IconDocumentText,
} from '../components/icons';
import {
  OptionButton,
  ProgressBar,
  QuestionCard,
  QuizHeader,
  makeStyles,
  useTheme,
} from '../components';
import { Question } from '../types/quiz';
import { useAppStore } from '../store/useAppStore';
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
  warmupQuestion: Question;
  onRefreshWarmup: () => void;
  totalAnswered: number;
  totalCorrect: number;
  streakDays: number;
  completionRatio: number;
  onOpenHistory: () => void;
  onSignOut: () => void;
  onResetData: () => void;
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
  warmupQuestion,
  onRefreshWarmup,
  totalAnswered,
  totalCorrect,
  streakDays,
  completionRatio,
  onOpenHistory,
  onSignOut,
  onResetData,
  language,
  onChangeLanguage,
  style,
  ...rest
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [confettiKey, setConfettiKey] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const options = useMemo(() => warmupQuestion.options, [warmupQuestion]);
  const iconSize = useAppStore((state) => state.iconSize);
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = useStyles();

  useEffect(() => {
    setSelectedOption(null);
    setShowConfetti(false);
  }, [warmupQuestion.id]);

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
      {!isGuest && (
        <View style={styles.sessionActions}>
          <Pressable
            style={({ pressed }) => [
              styles.sessionButton,
              pressed && styles.sessionButtonPressed,
            ]}
            onPress={onResetData}
          >
            <View style={styles.buttonRow}>
              <View style={[styles.sessionIconWrapper, styles.resetIconBg]}>
                <IconArrowPath size={iconSize} color={theme.colors.primary} />
              </View>
              <View style={styles.sessionTextGroup}>
                <Text style={styles.sessionButtonTitle}>
                  {t('common.actions.resetData')}
                </Text>
                <Text style={styles.sessionButtonSubtitle}>
                  {t('home.resetDataSubtitle')}
                </Text>
              </View>
            </View>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.sessionButton,
              pressed && styles.sessionButtonPressed,
            ]}
            onPress={onSignOut}
          >
            <View style={styles.buttonRow}>
              <View style={[styles.sessionIconWrapper, styles.signOutIconBg]}>
                <IconArrowLeftOnRectangle size={iconSize} color={theme.colors.danger} />
              </View>
              <View style={styles.sessionTextGroup}>
                <Text style={styles.sessionButtonTitle}>
                  {t('common.actions.signOut')}
                </Text>
                <Text style={styles.sessionButtonSubtitle}>
                  {t('home.signOutSubtitle')}
                </Text>
              </View>
            </View>
          </Pressable>
        </View>
      )}
      {/* <View style={styles.languageSection}>
        <Text style={styles.languageLabel}>{t('home.languageLabel')}</Text>
        <View style={styles.languageRow}>
          {supportedLanguages.map((entry) => {
            const isActive = entry.code === language;
            return (
              <Pressable
                key={entry.code}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
                style={({ pressed }) => [
                  styles.languageChip,
                  isActive && styles.languageChipActive,
                  pressed && styles.languageChipPressed,
                ]}
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
              </Pressable>
            );
          })}
        </View>
      </View> */}

      {isGuest ? (
        <View style={styles.guestCard}>
          <Text style={styles.guestTitle}>{t('home.guestCardTitle')}</Text>
          <Text style={styles.guestBody}>{t('home.guestCardBody')}</Text>
          {onRequestSignIn ? (
            <Pressable
              style={({ pressed }) => [
                styles.guestSignInButton,
                pressed && styles.guestSignInButtonPressed,
              ]}
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
            </Pressable>
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
            <Pressable
              key={option.value}
              accessibilityRole="button"
              accessibilityState={{ selected: difficulty === option.value }}
              style={({ pressed }) => [
                styles.difficultyChip,
                difficulty === option.value && styles.difficultyChipActive,
                pressed && styles.difficultyChipPressed,
              ]}
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
            </Pressable>
          ))}
        </View>

        <View style={styles.primaryActionColumn}>
          <Pressable
            style={({ pressed }) => [
              styles.cta,
              pressed && styles.ctaPressed,
            ]}
            onPress={onStartQuiz}
          >
            <View style={styles.buttonRow}>
              <View style={styles.buttonIconWrapper}>
                <IconPlayCircle size={iconSize} color={theme.colors.textOnPrimary} />
              </View>
              <Text style={styles.ctaText}>{t('common.actions.startQuiz')}</Text>
            </View>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.historyButton,
              pressed && styles.historyButtonPressed,
            ]}
            onPress={onOpenHistory}
          >
            <View style={styles.buttonRow}>
              <View style={styles.buttonIconWrapper}>
                <IconDocumentText size={iconSize} color={theme.colors.primary} />
              </View>
              <Text style={styles.historyButtonText}>{t('common.actions.viewHistory')}</Text>
            </View>
          </Pressable>
        </View>
      </View>

      <QuestionCard
        title={t('home.warmupTitle')}
        description={warmupQuestion.description}
        codeSnippet={warmupQuestion.code}
        footer={
          <View style={styles.warmupFooter}>
            <Pressable
              style={({ pressed }) => [
                styles.refreshButton,
                pressed && styles.refreshButtonPressed,
              ]}
              onPress={() => {
                setSelectedOption(null);
                setShowConfetti(false);
                onRefreshWarmup();
              }}
            >
              <View style={styles.buttonRow}>
                <View style={styles.buttonIconWrapper}>
                  <IconArrowPath size={iconSize} color={theme.colors.primary} />
                </View>
                <Text style={styles.refreshButtonText}>{t('common.actions.refreshQuestion')}</Text>
              </View>
            </Pressable>
          </View>
        }
      >
        {showConfetti ? (
          <View pointerEvents="none" style={styles.confettiLayer}>
            <ConfettiCannon
              key={confettiKey}
              count={30}
              origin={{ x: 0, y: 0 }}
              fadeOut
              explosionSpeed={220}
              fallSpeed={1800}
            />
          </View>
        ) : null}
        <Text style={styles.warmupPrompt}>{warmupQuestion.prompt}</Text>
        {options.map((option, index) => (
          <OptionButton
            key={option}
            label={option}
            selected={selectedOption === index}
            onPress={() => {
              setSelectedOption(index);
              if (index === warmupQuestion.answerIndex) {
                setConfettiKey((prev) => prev + 1);
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 1200);
              } else {
                setShowConfetti(false);
              }
            }}
            containerStyle={index < options.length - 1 && styles.option}
          />
        ))}
        {selectedOption != null ? (
          <Text style={styles.warmupFeedback}>
            {selectedOption === warmupQuestion.answerIndex
              ? t('home.warmupSuccess')
              : t('home.warmupRetry')}
          </Text>
        ) : null}
      </QuestionCard>
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

const difficultyOptions = [
  { value: 'easy' as const, count: 10 },
  { value: 'medium' as const, count: 25 },
  { value: 'hard' as const, count: 50 },
];

const difficultyTranslationKeys: Record<
  (typeof difficultyOptions)[number]['value'],
  | 'common.difficulties.easy'
  | 'common.difficulties.medium'
  | 'common.difficulties.hard'
> = {
  easy: 'common.difficulties.easy',
  medium: 'common.difficulties.medium',
  hard: 'common.difficulties.hard',
};

const difficultyIconMap = {
  easy: IconSparkles,
  medium: IconRocketLaunch,
  hard: IconFire,
} as const;

const useStyles = makeStyles((theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      gap: theme.spacing.xl,
    },
    sessionActions: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    sessionButton: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.md,
      padding: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    sessionButtonPressed: {
      backgroundColor: theme.colors.surfaceMuted,
    },
    sessionIconWrapper: {
      width: 40,
      height: 40,
      borderRadius: theme.radius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.sm,
    },
    resetIconBg: {
      backgroundColor: theme.colors.primaryMuted,
    },
    signOutIconBg: {
      backgroundColor: theme.colors.dangerMuted,
    },
    sessionTextGroup: {
      flexShrink: 1,
      gap: theme.spacing.xs / 2,
    },
    sessionButtonTitle: {
      ...theme.typography.body,
      color: theme.colors.textPrimary,
      fontWeight: '700',
    },
    sessionButtonSubtitle: {
      ...theme.typography.subheading,
      color: theme.colors.textSecondary,
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
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingVertical: theme.spacing.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },
    languageChipActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    languageChipPressed: {
      backgroundColor: theme.colors.primaryMuted,
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
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.textOnPrimary,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
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
    historyButton: {
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primaryMuted,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
    historyButtonPressed: {
      opacity: 0.9,
    },
    historyButtonText: {
      ...theme.typography.caption,
      textTransform: 'uppercase',
      color: theme.colors.primary,
      letterSpacing: 0.6,
      fontWeight: '600',
    },
    guestSignInButtonPressed: {
      backgroundColor: theme.colors.primaryMuted,
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
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      alignItems: 'center',
      gap: theme.spacing.xs,
      backgroundColor: theme.colors.surfaceMuted,
    },
    difficultyChipActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    difficultyChipPressed: {
      backgroundColor: theme.colors.primaryMuted,
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
    option: {
      marginBottom: theme.spacing.md,
    },
    warmupFooter: {
      gap: theme.spacing.md,
    },
    refreshButton: {
      alignSelf: 'flex-start',
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      backgroundColor: theme.colors.primaryMuted,
    },
    refreshButtonText: {
      ...theme.typography.caption,
      textTransform: 'uppercase',
      color: theme.colors.primary,
    },
    refreshButtonPressed: {
      opacity: 0.9,
    },
    cta: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius.lg,
      paddingVertical: theme.spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
    ctaText: {
      ...theme.typography.heading,
      color: theme.colors.textOnPrimary,
    },
    ctaPressed: {
      opacity: 0.9,
    },
    warmupPrompt: {
      ...theme.typography.body,
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.md,
    },
    warmupFeedback: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.md,
    },
    confettiLayer: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 5,
      pointerEvents: 'none',
    },
  }),
);

export default HomeScreen;
