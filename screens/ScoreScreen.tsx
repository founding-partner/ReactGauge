import React, { useMemo, useRef, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import ViewShot, { captureRef } from 'react-native-view-shot';
import Share from 'react-native-share';
import {
  IconArrowPath,
  IconDocumentText,
  IconHome,
  IconShare,
} from '../components/icons';
import { ProgressBar, colors, radius, spacing, typography } from '../components';
import { AnswerRecord, Question } from '../types/quiz';
import { useAppStore } from '../store/useAppStore';

interface TopicStat {
  topic: string;
  total: number;
  correct: number;
}

export interface ScoreScreenProps {
  questions: Question[];
  answers: AnswerRecord[];
  onReviewAnswers: () => void;
  onRetakeQuiz: () => void;
  onGoHome: () => void;
}

export const ScoreScreen: React.FC<ScoreScreenProps> = ({
  questions,
  answers,
  onReviewAnswers,
  onRetakeQuiz,
  onGoHome,
}) => {
  const iconSize = useAppStore((state) => state.iconSize);
  const { t } = useTranslation();
  const { topicStats, totalCorrect, totalQuestions } = useMemo(
    () => deriveTopicStats(questions, answers),
    [questions, answers],
  );

  const overallPercentage = totalQuestions
    ? Math.round((totalCorrect / totalQuestions) * 100)
    : 0;

  const viewShotRef = useRef<ViewShot | null>(null);
  const [sharing, setSharing] = useState(false);

  const handleShare = async () => {
    if (sharing) {
      return;
    }

    try {
      setSharing(true);
      const uri = await captureRef(viewShotRef, {
        format: 'png',
        quality: 0.92,
      });

      if (!uri) {
        throw new Error(t('alerts.shareCaptureError'));
      }

      const shareUrl = Platform.OS === 'android' ? 'file://' + uri : uri;

      await Share.open({
        url: shareUrl,
        type: 'image/png',
        title: t('score.shareTitle'),
        failOnCancel: false,
      });
    } catch (error) {
      const isCancelled =
        typeof error === 'object' && error !== null && 'message' in error &&
        (error as { message?: string }).message?.includes('User did not share');

      if (!isCancelled) {
        const message = error instanceof Error ? error.message : t('alerts.shareFailedBody');
        Alert.alert(t('alerts.shareFailedTitle'), message);
      }
    } finally {
      setSharing(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <ViewShot
        ref={viewShotRef}
        style={styles.viewShot}
        options={{ format: 'png', quality: 0.92 }}
      >
        <View style={styles.capturableContent}>
          <View style={styles.headerCard}>
            <Text style={styles.headerTitle}>{t('score.title')}</Text>
            <Text style={styles.headerSubtitle}>
              {t('score.subtitle', {
                correct: totalCorrect,
                total: totalQuestions,
              })}
            </Text>
            <View style={styles.overallBadge}>
              <Text style={styles.overallScore}>{overallPercentage}</Text>
              <Text style={styles.overallSuffix}>%</Text>
            </View>
            {overallPercentage >= 60 ? (
              <View style={styles.congratsWrapper}>
                <Text style={styles.congratsEmoji}>🎉</Text>
                <Text style={styles.congratsText}>{t('score.congrats')}</Text>
                <Image
                  source={require('../app.png')}
                  style={styles.congratsLogo}
                  resizeMode="contain"
                  accessibilityLabel={t('login.logoAlt')}
                />
              </View>
            ) : null}
          </View>

          <View style={styles.topicCard}>
            <Text style={styles.topicHeading}>{t('score.byTopic')}</Text>
            {topicStats.map((stat) => {
              const progress = stat.total ? stat.correct / stat.total : 0;
              const topicLabel =
                stat.topic === 'General' ? t('score.generalTopic') : stat.topic;
              return (
                <View key={stat.topic} style={styles.topicRow}>
                  <View style={styles.topicHeader}>
                    <Text style={styles.topicTitle}>{topicLabel}</Text>
                    <Text style={styles.topicCount}>
                      {stat.correct}/{stat.total}
                    </Text>
                  </View>
                  <ProgressBar progress={progress} />
                </View>
              );
            })}
          </View>
        </View>
      </ViewShot>

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryPressed]}
          onPress={onRetakeQuiz}
        >
          <View style={styles.buttonContent}>
            <View style={styles.buttonIconWrapper}>
              <IconArrowPath size={iconSize} color={colors.textOnPrimary} />
            </View>
            <Text style={styles.primaryText}>{t('common.actions.retakeQuiz')}</Text>
          </View>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.secondaryPressed]}
          onPress={onReviewAnswers}
        >
          <View style={styles.buttonContent}>
            <View style={styles.buttonIconWrapper}>
              <IconDocumentText size={iconSize} color={colors.primary} />
            </View>
            <Text style={styles.secondaryText}>{t('common.actions.reviewAnswers')}</Text>
          </View>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.tertiaryButton, pressed && styles.tertiaryPressed]}
          onPress={onGoHome}
        >
          <View style={styles.buttonContent}>
            <View style={styles.buttonIconWrapper}>
              <IconHome size={iconSize} color={colors.surface} />
            </View>
            <Text style={styles.tertiaryText}>{t('common.actions.backHome')}</Text>
          </View>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.shareButton,
            pressed && styles.sharePressed,
            sharing && styles.shareDisabled,
          ]}
          onPress={handleShare}
          disabled={sharing}
        >
          <View style={styles.buttonContent}>
            <View style={styles.buttonIconWrapper}>
              <IconShare size={iconSize} color={colors.surface} />
            </View>
            <Text style={styles.shareText}>
              {sharing ? t('common.actions.preparing') : t('common.actions.shareScorecard')}
            </Text>
          </View>
        </Pressable>
      </View>
    </ScrollView>
  );
};

function deriveTopicStats(questions: Question[], answers: AnswerRecord[]) {
  const map = new Map<string, TopicStat>();
  const answerLookup = new Map(answers.map((answer) => [answer.questionId, answer]));

  questions.forEach((question) => {
    const topic = question.topic ?? 'General';
    if (!map.has(topic)) {
      map.set(topic, { topic, total: 0, correct: 0 });
    }
    const stat = map.get(topic)!;
    stat.total += 1;
    const answer = answerLookup.get(question.id);
    if (answer?.isCorrect) {
      stat.correct += 1;
    }
  });

  const topicStats = Array.from(map.values()).sort((a, b) => a.topic.localeCompare(b.topic));
  const totalQuestions = questions.length;
  const totalCorrect = answers.filter((answer) => answer.isCorrect).length;

  return { topicStats, totalQuestions, totalCorrect };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
    gap: spacing.xl,
  },
  viewShot: {
    marginHorizontal: spacing.xl,
    marginTop: spacing.xl,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  capturableContent: {
    backgroundColor: colors.background,
    paddingBottom: spacing.xl,
  },
  headerCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    padding: spacing.xl,
    gap: spacing.md,
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.display,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  congratsWrapper: {
    marginTop: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  congratsEmoji: {
    fontSize: 32,
  },
  congratsText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  congratsLogo: {
    width: 120,
    height: 120,
    borderRadius: radius.md,
  },
  overallBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.xs,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    marginTop: spacing.md,
  },
  overallScore: {
    ...typography.display,
    color: colors.textOnPrimary,
  },
  overallSuffix: {
    ...typography.heading,
    color: colors.textOnPrimary,
  },
  topicCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    padding: spacing.xl,
    gap: spacing.lg,
  },
  topicHeading: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  topicRow: {
    gap: spacing.sm,
  },
  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topicTitle: {
    ...typography.body,
    color: colors.textPrimary,
  },
  topicCount: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  actions: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    gap: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  primaryPressed: {
    backgroundColor: '#1d4ed8',
  },
  primaryText: {
    ...typography.heading,
    color: colors.textOnPrimary,
  },
  secondaryButton: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  secondaryPressed: {
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
  },
  secondaryText: {
    ...typography.heading,
    color: colors.primary,
  },
  tertiaryButton: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.surface,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  tertiaryPressed: {
    backgroundColor: 'rgba(241, 245, 249, 0.15)',
  },
  tertiaryText: {
    ...typography.heading,
    color: colors.surface,
  },
  shareButton: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.surface,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  sharePressed: {
    backgroundColor: 'rgba(241, 245, 249, 0.15)',
  },
  shareText: {
    ...typography.heading,
    color: colors.surface,
  },
  shareDisabled: {
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  buttonIconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.xs,
  },
});

export default ScoreScreen;
