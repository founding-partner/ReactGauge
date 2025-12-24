import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  ThemeProvider,
  useTheme,
  makeStyles,
  ThemePreference,
  BottomTabBar,
  ScoreCardBar,
  QuizExplanationDrawer,
  QuizToolbar,
} from './components';
import type { TabKey } from './components';
import Share from 'react-native-share';
import { captureRef } from 'react-native-view-shot';
import type ViewShot from 'react-native-view-shot';
import { signInWithGitHub } from './auth/githubAuth';
import { HomeScreen } from './screens/HomeScreen';
import { LoginScreen } from './screens/LoginScreen';
import { QuizScreen } from './screens/QuizScreen';
import { ResultScreen } from './screens/ResultScreen';
import { ScoreScreen } from './screens/ScoreScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { HistoryDetailScreen } from './screens/HistoryDetailScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { StartQuizScreen } from './screens/StartQuizScreen';
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
import type {
  QuizToolbarHandlers,
  QuizToolbarState,
} from './types/quizToolbar';
import type {
  QuizExplanationHandlers,
  QuizExplanationState,
} from './types/quizExplanation';

type ActiveScreen =
  | 'home'
  | 'quiz'
  | 'score'
  | 'result'
  | 'history'
  | 'historyDetail'
  | 'warmup'
  | 'settings'
  | 'startQuiz';
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
  const [quizExplanationState, setQuizExplanationState] =
    useState<QuizExplanationState | null>(null);
  const quizExplanationHandlers = useRef<QuizExplanationHandlers | null>(null);
  const scoreCardRef = useRef<ViewShot | null>(null);
  const [scoreSharing, setScoreSharing] = useState(false);
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
  // const isQuizScreen = activeScreen === 'quiz';
  const isGuestUser = user?.mode === 'guest';
  const showTabs =
    Boolean(user) &&
    (activeScreen === 'home' ||
      activeScreen === 'startQuiz' ||
      activeScreen === 'history' ||
      activeScreen === 'historyDetail' ||
      activeScreen === 'warmup' ||
      activeScreen === 'settings');
  const activeTab: TabKey = activeScreen === 'historyDetail'
    ? 'history'
    : activeScreen === 'history'
    ? 'history'
    : activeScreen === 'warmup'
    ? 'warmup'
    : activeScreen === 'settings'
    ? 'settings'
    : activeScreen === 'startQuiz'
    ? 'startQuiz'
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

  const updateQuizExplanation = useCallback(
    (state: QuizExplanationState | null, handlers: QuizExplanationHandlers) => {
      quizExplanationHandlers.current = handlers;
      setQuizExplanationState(state);
    },
    [],
  );

  useEffect(() => {
    if (activeScreen !== 'quiz') {
      quizToolbarHandlers.current = null;
      setQuizToolbarState(null);
      quizExplanationHandlers.current = null;
      setQuizExplanationState(null);
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

  const handleShareScorecard = useCallback(async () => {
    if (scoreSharing) {
      return;
    }

    if (!scoreCardRef.current) {
      Alert.alert(t('alerts.shareFailedTitle'), t('alerts.shareCaptureError'));
      return;
    }

    try {
      setScoreSharing(true);
      const uri = await captureRef(scoreCardRef, {
        format: 'png',
        quality: 0.92,
      });

      if (!uri) {
        throw new Error(t('alerts.shareCaptureError'));
      }

      const shareUrl = Platform.OS === 'android' ? `file://${uri}` : uri;

      await Share.open({
        url: shareUrl,
        type: 'image/png',
        title: t('score.shareTitle'),
        failOnCancel: false,
      });
    } catch (error) {
      const isCancelled =
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        (error as { message?: string }).message?.includes('User did not share');

      if (!isCancelled) {
        const message =
          error instanceof Error ? error.message : t('alerts.shareFailedBody');
        Alert.alert(t('alerts.shareFailedTitle'), message);
      }
    } finally {
      setScoreSharing(false);
    }
  }, [scoreSharing, t]);

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
      setSelectedAttempt(null);

      if (tab === 'settings') {
        setActiveScreen('settings');
        return;
      }

      if (tab === 'history') {
        if (isGuestUser) {
          return;
        }
        setActiveScreen('history');
        return;
      }

      if (tab === 'startQuiz') {
        setActiveScreen('startQuiz');
        return;
      }

      if (tab === 'warmup') {
        setActiveScreen('warmup');
        return;
      }

      setActiveScreen('home');
    },
    [isGuestUser, setActiveScreen, setSelectedAttempt],
  );

  const canManageSession = Boolean(user && user.mode !== 'guest');

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
          viewShotRef={scoreCardRef}
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

    if (activeScreen === 'settings') {
      return (
        <SettingsScreen
          onClose={() => setActiveScreen('home')}
          iconSize={iconSize}
          onChangeIconSize={setIconSize}
          themePreference={themePreference}
          onSelectTheme={onSelectTheme}
          canManageSession={canManageSession}
          onResetData={canManageSession ? handleResetData : undefined}
          onSignOut={canManageSession ? handleSignOut : undefined}
        />
      );
    }

    if (activeScreen === 'startQuiz') {
      return (
        <StartQuizScreen
          difficulty={difficulty}
          onSelectDifficulty={setDifficulty}
          questionPoolSize={allQuestions.length}
          onStartQuiz={handleStartQuiz}
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
        onRequestSignIn={user.mode === 'guest' ? handleSignIn : undefined}
        isGuest={user.mode === 'guest'}
        totalAnswered={user.answered}
        totalCorrect={user.correct}
        streakDays={user.streak}
        completionRatio={user.completion}
        lastAttempt={historyAttempts[0] ?? null}
        onReviewAttempt={handleSelectHistoryAttempt}
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
        onExplanationUpdate={updateQuizExplanation}
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

  const handleDismissExplanation = useCallback(() => {
    setQuizExplanationState(null);
    quizExplanationHandlers.current?.onDismiss();
  }, []);

  const showQuizToolbar =
    activeScreen === 'quiz' &&
    quizToolbarState != null &&
    (quizToolbarState.showExit ||
      quizToolbarState.showPrevious ||
      quizToolbarState.showSubmit ||
      quizToolbarState.showNext);
  const showScoreCardBar = activeScreen === 'score';

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={theme.name === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <View style={styles.background}>
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
          <View style={styles.screen}>
            {renderScreen()}
          </View>
        </SafeAreaView>
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
            isGuest={isGuestUser}
          />
        ) : null}
        {showScoreCardBar ? (
          <ScoreCardBar
            iconSize={iconSize}
            onRetakeQuiz={handleRetryQuiz}
            onReviewAnswers={handleReviewAnswers}
            onGoHome={handleScoreGoHome}
            onShare={handleShareScorecard}
            sharing={scoreSharing}
          />
        ) : null}
        <QuizExplanationDrawer
          state={quizExplanationState}
          onDismiss={handleDismissExplanation}
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
