import React, { useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewProps,
} from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/useAppStore';
import { Question } from '../types/quiz';
import { Button, OptionButton, QuestionCard, makeStyles, useTheme } from '../components';
import { IconArrowPath } from '../components/icons';

export interface WarmupScreenProps extends ViewProps {
  warmupQuestion: Question | null;
  onRefresh: () => void;
}

export const WarmupScreen: React.FC<WarmupScreenProps> = ({
  warmupQuestion,
  onRefresh,
  style,
  ...rest
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [confettiKey, setConfettiKey] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const iconSize = useAppStore((state) => state.iconSize);
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = useStyles();

  const options = useMemo(
    () => warmupQuestion?.options ?? [],
    [warmupQuestion],
  );

  useEffect(() => {
    setSelectedOption(null);
    setShowConfetti(false);
  }, [warmupQuestion?.id]);

  const handleRefresh = () => {
    setSelectedOption(null);
    setShowConfetti(false);
    onRefresh();
  };

  if (!warmupQuestion) {
    return (
      <View style={[styles.emptyState, style]} {...rest}>
        <Text style={styles.emptyTitle}>{t('quiz.emptyTitle')}</Text>
        <Text style={styles.emptySubtitle}>{t('quiz.emptySubtitle')}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.container, style]}
      showsVerticalScrollIndicator={false}
      {...rest}
    >
      <QuestionCard
        title={t('home.warmupTitle')}
        description={warmupQuestion.description}
        codeSnippet={warmupQuestion.code}
        footer={
          <View style={styles.warmupFooter}>
            <Button
              variant="outline"
              size="md"
              fullWidth
              onPress={handleRefresh}
            >
              <View style={styles.buttonRow}>
                <View style={styles.buttonIconWrapper}>
                  <IconArrowPath size={iconSize} color={theme.colors.primary} />
                </View>
                <Text style={styles.refreshButtonText}>
                  {t('common.actions.refreshQuestion')}
                </Text>
              </View>
            </Button>
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
    </ScrollView>
  );
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
    option: {
      marginBottom: theme.spacing.md,
    },
    warmupFooter: {
      gap: theme.spacing.md,
    },
    refreshButtonText: {
      ...theme.typography.caption,
      textTransform: 'uppercase',
      color: theme.colors.primary,
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
    confettiLayer: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 5,
      pointerEvents: 'none',
    },
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.xl,
      gap: theme.spacing.md,
      backgroundColor: theme.colors.background,
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

export default WarmupScreen;
