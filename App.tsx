import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  ThemeProvider,
  useTheme,
  makeStyles,
  ThemePreference,
  Button,
  BottomTabBar,
  QuizToolbar,
} from './components';
import type { TabKey } from './components';
import { signInWithGitHub } from './auth/githubAuth';
import { HomeScreen } from './screens/HomeScreen';
import { LoginScreen } from './screens/LoginScreen';
import { QuizScreen } from './screens/QuizScreen';
import { ResultScreen } from './screens/ResultScreen';
import { ScoreScreen } from './screens/ScoreScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { HistoryDetailScreen } from './screens/HistoryDetailScreen';
import { WarmupScreen } from './screens/WarmupScreen';
import { AnswerRecord, Question } from './types/quiz';
import './localization/i18n';
import { useTranslation } from 'react-i18next';
import {
  LOCAL_QUESTIONS,
  REMOTE_QUESTIONS_URL,
  useAppStore,
} from './store/useAppStore';
import { UserProfile } from './types/user';
import { QuizAttempt, QuizAttemptHistory, AttemptQuestion } from './types/history';
import { loadUserProfile, saveUserProfile } from './storage/userStorage';
import {
  appendAttempt,
  clearHistory as clearHistoryStorage,
  loadHistory,
} from './storage/historyStorage';
import {
  loadLanguagePreference,
  saveLanguagePreference,
  loadThemePreference,
  saveThemePreference,
} from './storage/settingsStorage';
import { SettingsDrawer } from './components/SettingsDrawer';
import { IconWheel } from './components/icons';
import type {
  QuizToolbarHandlers,
  QuizToolbarState,
} from './types/quizToolbar';

type ActiveScreen =
  | 'home'
  | 'quiz'
  | 'score'
  | 'result'
  | 'history'
  | 'historyDetail'
  | 'warmup';
type AppContentProps = {
  themePreference: ThemePreference;
  onSelectTheme: (theme: ThemePreference) => void;
};

function AppContent({
  themePreference,
  onSelectTheme,
}: AppContentProps): React.JSX.Element {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const styles = useStyles();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('home');
  const [profileHydrated, setProfileHydrated] = useState(false);
  const [languageHydrated, setLanguageHydrated] = useState(false);
  const [historyAttempts, setHistoryAttempts] = useState<QuizAttemptHistory>([]);
  const [selectedAttempt, setSelectedAttempt] = useState<QuizAttempt | null>(null);
  const [quizToolbarState, setQuizToolbarState] =
    useState<QuizToolbarState | null>(null);
  const quizToolbarHandlers = useRef<QuizToolbarHandlers | null>(null);
  const setQuestions = useAppStore((state) => state.setQuestions);
  const allQuestions = useAppStore((state) => state.allQuestions);
  const difficulty = useAppStore((state) => state.difficulty);
  const setDifficulty = useAppStore((state) => state.setDifficulty);
  const language = useAppStore((state) => state.language);
  const setLanguageCode = useAppStore((state) => state.setLanguage);
  const dailyWarmupQuestion = useAppStore((state) => state.dailyWarmupQuestion);
  const refreshWarmupQuestion = useAppStore(
    (state) => state.refreshWarmupQuestion,
  );
  const pickQuestionsForDifficulty = useAppStore(
    (state) => state.pickQuestionsForDifficulty,
  );
  const activeQuestions = useAppStore((state) => state.activeQuestions);
  const setActiveQuestions = useAppStore((state) => state.setActiveQuestions);
  const completedQuestions = useAppStore((state) => state.completedQuestions);
  const setCompletedQuestions = useAppStore(
    (state) => state.setCompletedQuestions,
  );
  const quizAnswers = useAppStore((state) => state.quizAnswers);
  const setQuizAnswers = useAppStore((state) => state.setQuizAnswers);
  const iconSize = useAppStore((state) => state.iconSize);
  const setIconSize = useAppStore((state) => state.setIconSize);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const isQuizScreen = activeScreen === 'quiz';
  const showTabs =
    Boolean(user) &&
    (activeScreen === 'home' ||
      activeScreen === 'history' ||
      activeScreen === 'historyDetail' ||
      activeScreen === 'warmup');
  const showToolbar = Boolean(user) && !isQuizScreen && !showTabs;
  const activeTab: TabKey = settingsOpen
    ? 'settings'
    : activeScreen === 'historyDetail'
    ? 'history'
    : activeScreen === 'history'
    ? 'history'
    : activeScreen === 'warmup'
    ? 'warmup'
    : 'home';

  const updateQuizToolbar = useCallback(
    (state: QuizToolbarState, handlers: QuizToolbarHandlers) => {
      quizToolbarHandlers.current = handlers;
      setQuizToolbarState((prev) => {
        if (
          prev &&
          prev.showExit === state.showExit &&
          prev.showPrevious === state.showPrevious &&
          prev.showSubmit === state.showSubmit &&
          prev.showNext === state.showNext &&
          prev.isLastQuestion === state.isLastQuestion
        ) {
          return prev;
        }
        return state;
      });
    },
    [],
  );

  useEffect(() => {
    if (activeScreen !== 'quiz') {
      quizToolbarHandlers.current = null;
      setQuizToolbarState(null);
    }
  }, [activeScreen]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const storedProfile = await loadUserProfile();
      if (mounted && storedProfile) {
        setUser(storedProfile);
      }
      if (mounted) {
        setProfileHydrated(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const storedLanguage = await loadLanguagePreference();
      if (mounted && storedLanguage) {
        setLanguageCode(storedLanguage);
      }
      if (mounted) {
        setLanguageHydrated(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [setLanguageCode]);

  useEffect(() => {
    if (!profileHydrated) {
      return;
    }
    void saveUserProfile(user);
  }, [user, profileHydrated]);

  useEffect(() => {
    if (!language) {
      return;
    }
    i18n
      .changeLanguage(language)
      .catch((error) =>
        console.warn('[ReactGauge] Unable to switch language', error),
      );
    if (languageHydrated) {
      void saveLanguagePreference(language);
    }
  }, [language, languageHydrated, i18n]);


  useEffect(() => {
    let mounted = true;
    (async () => {
      const storedHistory = await loadHistory();
      if (mounted) {
        setHistoryAttempts(storedHistory);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (isQuizScreen && settingsOpen) {
      setSettingsOpen(false);
    }
  }, [isQuizScreen, settingsOpen]);

  const warmupQuestion = useMemo(
    () => dailyWarmupQuestion ?? allQuestions[0],
    [allQuestions, dailyWarmupQuestion],
  );

  const latestSetQuestions = useRef(setQuestions);
  useEffect(() => {
    latestSetQuestions.current = setQuestions;
  }, [setQuestions]);

  useEffect(() => {
    let cancelled = false;

    const applyQuestions = (questions: Question[]) => {
      if (!cancelled) {
        latestSetQuestions.current(questions);
      }
    };

    const fetchLatestQuestions = async () => {
      try {
        const response = await fetch(REMOTE_QUESTIONS_URL, {
          headers: { Accept: 'application/json' },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch questions (${response.status})`);
        }

        const data = (await response.json()) as unknown;

        if (!Array.isArray(data)) {
          throw new Error('Questions payload is not an array.');
        }

        applyQuestions(data as Question[]);
      } catch (error) {
        console.warn(
          '[ReactGauge] Unable to load latest questions, using local fallback.',
          error,
        );
        if (useAppStore.getState().allQuestions !== LOCAL_QUESTIONS) {
          applyQuestions([...LOCAL_QUESTIONS]);
        }
      }
    };

    fetchLatestQuestions();

    return () => {
      cancelled = true;
    };
  }, [setQuestions]);

  const handleSignIn = async () => {
    try {
      setAuthLoading(true);
      const session = await signInWithGitHub();

      setUser((previous) => {
        const answered = previous?.answered ?? 0;
        const correct = previous?.correct ?? 0;
        const streak = Math.max(previous?.streak ?? 1, 1);
        const completion = answered ? correct / answered : 0;

        return {
          mode: 'github',
          login: session.user.login,
          name: session.user.name ?? session.user.login,
          avatarUrl: session.user.avatarUrl,
          answered,
          correct,
          streak,
          completion,
        };
      });
      setActiveScreen('home');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t('alerts.genericError');
      Alert.alert(t('alerts.githubLoginFailedTitle'), message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleContinueAsGuest = () => {
    setUser({
      mode: 'guest',
      login: 'guest',
      name: 'Guest',
      avatarUrl: undefined,
      answered: 0,
      correct: 0,
      streak: 0,
      completion: 0,
    });
    setActiveScreen('home');
  };

  const handleStartQuiz = () => {
    setQuizAnswers([]);
    const selected = pickQuestionsForDifficulty(difficulty);
    if (selected.length === 0) {
      Alert.alert(
        t('alerts.noQuestionsTitle'),
        t('alerts.noQuestionsBody'),
      );
      return;
    }
    setActiveQuestions(selected);
    setActiveScreen('quiz');
  };

  const handleExitQuiz = () => {
    setActiveScreen('home');
    refreshWarmupQuestion();
  };

  const handleQuizComplete = (answers: AnswerRecord[]) => {
    setQuizAnswers(answers);
    setCompletedQuestions(activeQuestions);
    setActiveScreen('score');

    const correctCount = answers.filter((answer) => answer.isCorrect).length;

    setUser((prev) => {
      if (!prev) {
        return prev;
      }
      const nextProfile: UserProfile = {
        ...prev,
        answered: prev.answered + answers.length,
        correct: prev.correct + correctCount,
        completion: answers.length
          ? correctCount / answers.length
          : prev.completion,
      };
      if (profileHydrated) {
        void saveUserProfile(nextProfile);
      }
      return nextProfile;
    });

    const attempt: QuizAttempt = {
      id: `${Date.now()}`,
      timestamp: new Date().toISOString(),
      difficulty,
      score: {
        correct: correctCount,
        total: answers.length,
      },
      streak: user?.streak ?? 0,
      userMode: user?.mode ?? 'guest',
      userLogin: user?.login ?? 'guest',
      questions: activeQuestions.map((question) => {
        const mapped: AttemptQuestion = {
          id: question.id,
          prompt: question.prompt,
          options: question.options,
          answerIndex: question.answerIndex,
          description: question.description,
          code: question.code,
          topic: question.topic,
          explanation: question.explanation,
        };
        return mapped;
      }),
      answers,
    };

    setHistoryAttempts((prev) => [attempt, ...prev]);
    void appendAttempt(attempt);
    refreshWarmupQuestion();
  };

  const handleRetryQuiz = () => {
    setQuizAnswers([]);
    const selected = pickQuestionsForDifficulty(difficulty);
    setActiveQuestions(selected);
    setActiveScreen('quiz');
  };

  const resetLocalQuizState = useCallback(() => {
    setActiveScreen('home');
    setActiveQuestions([]);
    setCompletedQuestions([]);
    setQuizAnswers([]);
    setSelectedAttempt(null);
  }, [
    setActiveQuestions,
    setActiveScreen,
    setCompletedQuestions,
    setQuizAnswers,
    setSelectedAttempt,
  ]);

  const performSignOut = useCallback(async () => {
    resetLocalQuizState();
    setHistoryAttempts([]);
    setUser(null);
    await saveUserProfile(null);
    await clearHistoryStorage();
    refreshWarmupQuestion();
  }, [
    refreshWarmupQuestion,
    resetLocalQuizState,
    setHistoryAttempts,
    setUser,
  ]);

  const handleSignOut = () => {
    Alert.alert(t('alerts.signOutTitle'), t('alerts.signOutBody'), [
      { text: t('common.actions.cancel'), style: 'cancel' },
      {
        text: t('common.actions.signOut'),
        style: 'destructive',
        onPress: () => {
          void performSignOut();
        },
      },
    ]);
  };

  const performResetData = useCallback(async () => {
    resetLocalQuizState();
    setHistoryAttempts([]);
    await clearHistoryStorage();
    setUser((prev) => {
      if (!prev) {
        return prev;
      }
      const resetProfile: UserProfile = {
        ...prev,
        answered: 0,
        correct: 0,
        streak: 0,
        completion: 0,
      };
      if (profileHydrated) {
        void saveUserProfile(resetProfile);
      }
      return resetProfile;
    });
    refreshWarmupQuestion();
  }, [
    profileHydrated,
    refreshWarmupQuestion,
    resetLocalQuizState,
    setHistoryAttempts,
    setUser,
  ]);

  const handleResetData = () => {
    Alert.alert(t('alerts.resetDataTitle'), t('alerts.resetDataBody'), [
      { text: t('common.actions.cancel'), style: 'cancel' },
      {
        text: t('common.actions.resetData'),
        style: 'destructive',
        onPress: () => {
          void performResetData();
        },
      },
    ]);
  };

  const handleCloseResults = () => {
    setActiveScreen('home');
  };

  const handleReviewAnswers = () => {
    setActiveScreen('result');
  };

  const handleScoreGoHome = () => {
    setActiveScreen('home');
  };

  const handleOpenHistory = () => {
    setActiveScreen('history');
  };

  const handleCloseHistory = () => {
    setActiveScreen('home');
  };

  const handleSelectHistoryAttempt = (attempt: QuizAttempt) => {
    setSelectedAttempt(attempt);
    setActiveScreen('historyDetail');
  };

  const handleCloseHistoryDetail = () => {
    setSelectedAttempt(null);
    setActiveScreen('history');
  };

  const handleClearHistory = () => {
    setHistoryAttempts([]);
    setSelectedAttempt(null);
    void clearHistoryStorage();
  };

  const handleTabPress = useCallback(
    (tab: TabKey) => {
      if (tab === 'settings') {
        setSettingsOpen((prev) => !prev);
        return;
      }

      setSettingsOpen(false);
      setSelectedAttempt(null);

      if (tab === 'history') {
        setActiveScreen('history');
        return;
      }

      if (tab === 'warmup') {
        setActiveScreen('warmup');
        return;
      }

      setActiveScreen('home');
    },
    [setActiveScreen, setSelectedAttempt, setSettingsOpen],
  );

  const renderScreen = () => {
    if (!user) {
      return (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.contentContainer, styles.centerContent]}
          showsVerticalScrollIndicator={false}
        >
          <LoginScreen
            onSignIn={handleSignIn}
            onContinueAsGuest={handleContinueAsGuest}
            loading={authLoading}
          />
        </ScrollView>
      );
    }

    if (activeScreen === 'score') {
      return (
        <ScoreScreen
          questions={completedQuestions}
          answers={quizAnswers}
          onReviewAnswers={handleReviewAnswers}
          onRetakeQuiz={handleRetryQuiz}
          onGoHome={handleScoreGoHome}
        />
      );
    }

    if (activeScreen === 'result') {
      return (
        <ResultScreen
          answers={quizAnswers}
          questions={completedQuestions}
          onRetry={handleRetryQuiz}
          onClose={handleCloseResults}
          isGuest={user.mode === 'guest'}
          onRequestSignIn={user.mode === 'guest' ? handleSignIn : undefined}
        />
      );
    }

    if (activeScreen === 'history') {
      return (
        <HistoryScreen
          attempts={historyAttempts}
          onSelectAttempt={handleSelectHistoryAttempt}
          onClose={handleCloseHistory}
          onClearHistory={handleClearHistory}
        />
      );
    }

    if (activeScreen === 'historyDetail') {
      if (!selectedAttempt) {
        return (
          <HistoryScreen
            attempts={historyAttempts}
            onSelectAttempt={handleSelectHistoryAttempt}
            onClose={handleCloseHistory}
            onClearHistory={handleClearHistory}
          />
        );
      }

      return (
        <HistoryDetailScreen
          attempt={selectedAttempt}
          onClose={handleCloseHistoryDetail}
        />
      );
    }

    if (activeScreen === 'warmup') {
      return (
        <WarmupScreen
          warmupQuestion={warmupQuestion ?? null}
          onRefresh={refreshWarmupQuestion}
        />
      );
    }

    const isHome = activeScreen === 'home';
    const content = isHome ? (
      <HomeScreen
        username={user.login}
        displayName={user.name}
        avatarUrl={user.avatarUrl}
        onStartQuiz={handleStartQuiz}
        onRequestSignIn={user.mode === 'guest' ? handleSignIn : undefined}
        isGuest={user.mode === 'guest'}
        difficulty={difficulty}
        onSelectDifficulty={setDifficulty}
        questionPoolSize={allQuestions.length}
        warmupQuestion={warmupQuestion}
        onRefreshWarmup={refreshWarmupQuestion}
        totalAnswered={user.answered}
        totalCorrect={user.correct}
        streakDays={user.streak}
        completionRatio={user.completion}
        onOpenHistory={handleOpenHistory}
        language={language}
        onChangeLanguage={setLanguageCode}
      />
    ) : (
      <QuizScreen
        questions={activeQuestions}
        username={user.name ?? user.login}
        avatarUrl={user.avatarUrl}
        streakDays={user.streak}
        isGuest={user.mode === 'guest'}
        onExit={handleExitQuiz}
        onComplete={handleQuizComplete}
        onToolbarUpdate={updateQuizToolbar}
      />
    );

    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          isHome ? null : styles.quizContent,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {content}
      </ScrollView>
    );
  };

  const canManageSession = Boolean(user && user.mode !== 'guest');
  const showQuizToolbar =
    activeScreen === 'quiz' &&
    quizToolbarState != null &&
    (quizToolbarState.showExit ||
      quizToolbarState.showPrevious ||
      quizToolbarState.showSubmit ||
      quizToolbarState.showNext);

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={theme.name === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <View style={styles.background}>
        <SafeAreaView style={styles.safeArea}>
          {showToolbar ? (
            <View style={styles.toolbar}>
              <Button
                variant="elevated"
                size="sm"
                style={styles.settingsButton}
                onPress={() => setSettingsOpen(true)}
              >
                <IconWheel size={18} color={theme.colors.textPrimary} />
                <Text style={styles.settingsButtonText}>
                  {t('common.tabs.settings')}
                </Text>
              </Button>
            </View>
          ) : null}
          <View style={styles.screen}>
            {renderScreen()}
          </View>
          {showQuizToolbar && quizToolbarState ? (
            <QuizToolbar
              state={quizToolbarState}
              iconSize={iconSize}
              onExit={() => quizToolbarHandlers.current?.onExit()}
              onPrevious={() => quizToolbarHandlers.current?.onPrevious()}
              onSubmit={() => quizToolbarHandlers.current?.onSubmit()}
              onNext={() => quizToolbarHandlers.current?.onNext()}
            />
          ) : showTabs ? (
            <BottomTabBar
              activeTab={activeTab}
              onTabPress={handleTabPress}
            />
          ) : null}
        </SafeAreaView>
        <SettingsDrawer
          visible={settingsOpen && !isQuizScreen}
          onClose={() => setSettingsOpen(false)}
          showDifficulty={activeScreen !== 'quiz'}
          difficulty={difficulty}
          onSelectDifficulty={setDifficulty}
          iconSize={iconSize}
          onChangeIconSize={setIconSize}
          themePreference={themePreference}
          onSelectTheme={onSelectTheme}
          canManageSession={canManageSession}
          onResetData={canManageSession ? handleResetData : undefined}
          onSignOut={canManageSession ? handleSignOut : undefined}
        />
      </View>
    </SafeAreaProvider>
  );
}

function App(): React.JSX.Element {
  const [themePreference, setThemePreference] = useState<ThemePreference>('system');
  const [themeHydrated, setThemeHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const storedTheme = await loadThemePreference();
      if (mounted) {
        setThemePreference(storedTheme);
        setThemeHydrated(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!themeHydrated) {
      return;
    }
    void saveThemePreference(themePreference);
  }, [themeHydrated, themePreference]);

  return (
    <ThemeProvider mode={themePreference}>
      <AppContent
        themePreference={themePreference}
        onSelectTheme={setThemePreference}
      />
    </ThemeProvider>
  );
}

const useStyles = makeStyles((theme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    toolbar: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      paddingHorizontal: theme.spacing.xl,
      paddingTop: theme.spacing.xl / 2,
      paddingBottom: theme.spacing.md,
    },
    settingsButton: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    settingsButtonText: {
      ...theme.typography.caption,
      color: theme.colors.textPrimary,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
    },
    screen: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    contentContainer: {
      flexGrow: 1,
      paddingHorizontal: theme.spacing.xl,
      paddingBottom: theme.spacing.xxl,
      gap: theme.spacing.xl,
    },
    centerContent: {
      justifyContent: 'center',
    },
    quizContent: {
      paddingTop: theme.spacing.xl,
    },
    background: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
  }),
);

export default App;
