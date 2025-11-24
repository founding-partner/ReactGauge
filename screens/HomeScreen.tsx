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
  colors,
  radius,
  spacing,
  typography,
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
                <IconArrowPath size={iconSize} color={colors.primary} />
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
                <IconArrowLeftOnRectangle size={iconSize} color={colors.danger} />
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
                  <IconShieldCheck size={iconSize} color={colors.surface} />
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
                    difficulty === option.value ? colors.textOnPrimary : colors.primary;
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
                <IconPlayCircle size={iconSize} color={colors.textOnPrimary} />
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
                <IconDocumentText size={iconSize} color={colors.primary} />
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
                  <IconArrowPath size={iconSize} color={colors.primary} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing.xl,
  },
  sessionActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  sessionButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.background,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  sessionButtonPressed: {
    backgroundColor: 'rgba(148, 163, 184, 0.12)',
  },
  sessionIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  resetIconBg: {
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
  },
  signOutIconBg: {
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
  },
  sessionTextGroup: {
    flexShrink: 1,
    gap: spacing.xs / 2,
  },
  sessionButtonTitle: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  sessionButtonSubtitle: {
    ...typography.subheading,
    color: colors.textSecondary,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.xl,
    gap: spacing.md,
    elevation: 2,
    shadowColor: colors.background,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  languageSection: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.sm,
    elevation: 1,
  },
  languageLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  languageRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  languageChip: {
    flex: 1,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  languageChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  languageChipPressed: {
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
  },
  languageChipText: {
    ...typography.caption,
    color: colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  languageChipTextActive: {
    color: colors.textOnPrimary,
  },
  sectionHeading: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  guestCard: {
    backgroundColor: '#172554',
    borderRadius: radius.md,
    padding: spacing.xl,
    gap: spacing.md,
  },
  guestTitle: {
    ...typography.heading,
    color: colors.surface,
  },
  guestBody: {
    ...typography.body,
    color: colors.surface,
    opacity: 0.9,
  },
  guestSignInButton: {
    marginTop: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.surface,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignSelf: 'flex-start',
  },
  guestSignInText: {
    ...typography.caption,
    textTransform: 'uppercase',
    color: colors.surface,
  },
  primaryActionColumn: {
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  historyButton: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  historyButtonPressed: {
    backgroundColor: 'rgba(37, 99, 235, 0.16)',
  },
  historyButtonText: {
    ...typography.caption,
    textTransform: 'uppercase',
    color: colors.primary,
    letterSpacing: 0.6,
    fontWeight: '600'
  },
  guestSignInButtonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  buttonIconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.xs,
  },
  difficultyCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.xl,
    gap: spacing.md,
  },
  difficultySubtext: {
    ...typography.body,
    color: colors.textSecondary,
  },
  difficultyRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  difficultyChip: {
    flex: 1,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
  },
  difficultyChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  difficultyChipPressed: {
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
  },
  difficultyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  difficultyTextGroup: {
    gap: spacing.xs,
  },
  difficultyChipText: {
    ...typography.caption,
    fontSize: 12,
    letterSpacing: 0.2,
    textTransform: 'uppercase',
    color: colors.textPrimary,
  },
  difficultyChipTextActive: {
    color: colors.textOnPrimary,
  },
  difficultyChipCount: {
    ...typography.caption,
    fontSize: 12,
    color: colors.textSecondary,
    textTransform: 'none',
  },
  progressBlock: {
    gap: spacing.sm,
  },
  progressLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'none',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressRowLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  progressRowValue: {
    ...typography.heading,
    color: colors.primary,
  },
  option: {
    marginBottom: spacing.md,
  },
  warmupFooter: {
    gap: spacing.md,
  },
  refreshButton: {
    alignSelf: 'flex-start',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  refreshButtonText: {
    ...typography.caption,
    textTransform: 'uppercase',
    color: colors.primary
  },
  refreshButtonPressed: {
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
  },
  cta: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  ctaText: {
    ...typography.heading,
    color: colors.textOnPrimary,
  },
  ctaPressed: {
    backgroundColor: '#1d4ed8',
  },
  warmupPrompt: {
    ...typography.body,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  warmupFeedback: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  confettiLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 5,
    pointerEvents: 'none',
  },
});

export default HomeScreen;
