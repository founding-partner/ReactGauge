import React, { useMemo, useRef, useState } from 'react';
import {
  Alert,
  Platform,
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
import { Button, ProgressBar, makeStyles, useTheme } from '../components';
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
  const theme = useTheme();
  const styles = useStyles();
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
        <Button
          variant="primary"
          size="lg"
          onPress={onRetakeQuiz}
        >
          <View style={styles.buttonContent}>
            <View style={styles.buttonIconWrapper}>
              <IconArrowPath size={iconSize} color={theme.colors.textOnPrimary} />
            </View>
            <Text style={styles.primaryText}>{t('common.actions.retakeQuiz')}</Text>
          </View>
        </Button>
        <Button
          variant="outline"
          size="lg"
          onPress={onReviewAnswers}
        >
          <View style={styles.buttonContent}>
            <View style={styles.buttonIconWrapper}>
              <IconDocumentText size={iconSize} color={theme.colors.primary} />
            </View>
            <Text style={styles.secondaryText}>{t('common.actions.reviewAnswers')}</Text>
          </View>
        </Button>
        <Button
          variant="surface"
          size="lg"
          onPress={onGoHome}
        >
          <View style={styles.buttonContent}>
            <View style={styles.buttonIconWrapper}>
              <IconHome size={iconSize} color={theme.colors.textOnPrimary} />
            </View>
            <Text style={styles.tertiaryText}>{t('common.actions.backHome')}</Text>
          </View>
        </Button>
        <Button
          variant="surface"
          size="lg"
          onPress={handleShare}
          disabled={sharing}
          disabledOpacity={0.6}
        >
          <View style={styles.buttonContent}>
            <View style={styles.buttonIconWrapper}>
              <IconShare size={iconSize} color={theme.colors.textOnPrimary} />
            </View>
            <Text style={styles.shareText}>
              {sharing ? t('common.actions.preparing') : t('common.actions.shareScorecard')}
            </Text>
          </View>
        </Button>
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

const useStyles = makeStyles((theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      paddingBottom: theme.spacing.xxl,
      gap: theme.spacing.xl,
    },
    viewShot: {
      marginHorizontal: theme.spacing.xl,
      marginTop: theme.spacing.xl,
      borderRadius: theme.radius.md,
      overflow: 'hidden',
      backgroundColor: 'transparent',
    },
    capturableContent: {
      backgroundColor: theme.colors.background,
      paddingBottom: theme.spacing.xl,
    },
    headerCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.md,
      marginHorizontal: theme.spacing.lg,
      marginTop: theme.spacing.lg,
      padding: theme.spacing.xl,
      gap: theme.spacing.md,
      alignItems: 'center',
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 2,
    },
    headerTitle: {
      ...theme.typography.display,
      color: theme.colors.textPrimary,
    },
    headerSubtitle: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    congratsWrapper: {
      marginTop: theme.spacing.lg,
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    congratsEmoji: {
      fontSize: 32,
    },
    congratsText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    congratsLogo: {
      width: 120,
      height: 120,
      borderRadius: theme.radius.md,
    },
    overallBadge: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: theme.spacing.xs,
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.radius.pill,
      marginTop: theme.spacing.md,
    },
    overallScore: {
      ...theme.typography.display,
      color: theme.colors.textOnPrimary,
    },
    overallSuffix: {
      ...theme.typography.heading,
      color: theme.colors.textOnPrimary,
    },
    topicCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.md,
      marginHorizontal: theme.spacing.lg,
      marginTop: theme.spacing.xl,
      padding: theme.spacing.xl,
      gap: theme.spacing.lg,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 2,
    },
    topicHeading: {
      ...theme.typography.heading,
      color: theme.colors.textPrimary,
    },
    topicRow: {
      gap: theme.spacing.sm,
    },
    topicHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    topicTitle: {
      ...theme.typography.body,
      color: theme.colors.textPrimary,
    },
    topicCount: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
    },
    actions: {
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.xl,
      gap: theme.spacing.md,
    },
    primaryText: {
      ...theme.typography.heading,
      color: theme.colors.textOnPrimary,
    },
    secondaryText: {
      ...theme.typography.heading,
      color: theme.colors.primary,
    },
    tertiaryText: {
      ...theme.typography.heading,
      color: theme.colors.textPrimary,
    },
    shareText: {
      ...theme.typography.heading,
      color: theme.colors.textPrimary,
    },
    buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    buttonIconWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing.xs,
    },
  }),
);

export default ScoreScreen;
