import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from './components';
import { signInWithGitHub } from './auth/githubAuth';
import { HomeScreen } from './screens/HomeScreen';
import { LoginScreen } from './screens/LoginScreen';
import { QuizScreen } from './screens/QuizScreen';
import { ResultScreen } from './screens/ResultScreen';
import { ScoreScreen } from './screens/ScoreScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { HistoryDetailScreen } from './screens/HistoryDetailScreen';
import { AnswerRecord, Question } from './types/quiz';
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

type ActiveScreen = 'home' | 'quiz' | 'score' | 'result' | 'history' | 'historyDetail';
function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('home');
  const [profileHydrated, setProfileHydrated] = useState(false);
  const [historyAttempts, setHistoryAttempts] = useState<QuizAttemptHistory>([]);
  const [selectedAttempt, setSelectedAttempt] = useState<QuizAttempt | null>(null);
  const setQuestions = useAppStore((state) => state.setQuestions);
  const allQuestions = useAppStore((state) => state.allQuestions);
  const difficulty = useAppStore((state) => state.difficulty);
  const setDifficulty = useAppStore((state) => state.setDifficulty);
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
    if (!profileHydrated) {
      return;
    }
    void saveUserProfile(user);
  }, [user, profileHydrated]);

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
        error instanceof Error ? error.message : 'Something went wrong.';
      Alert.alert('GitHub Login Failed', message);
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
        'No Questions Available',
        'Add more questions to the question bank to start a quiz for this difficulty.',
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

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <View style={styles.background}>
        <SafeAreaView style={styles.safeArea}>
          {renderScreen()}
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
    gap: spacing.xl,
  },
  centerContent: {
    justifyContent: 'center',
  },
  quizContent: {
    paddingTop: spacing.xl,
  },
  background: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

export default App;
