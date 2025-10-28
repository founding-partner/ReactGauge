import React, { useState } from 'react';
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
import questionsData from './data/questions.json';
import { HomeScreen } from './screens/HomeScreen';
import { LoginScreen } from './screens/LoginScreen';
import { QuizScreen } from './screens/QuizScreen';
import { ResultScreen } from './screens/ResultScreen';
import { ScoreScreen } from './screens/ScoreScreen';
import { AnswerRecord, Question } from './types/quiz';

type UserProfile = {
  mode: 'github' | 'guest';
  login: string;
  name?: string;
  avatarUrl?: string;
  answered: number;
  correct: number;
  streak: number;
  completion: number;
};

type ActiveScreen = 'home' | 'quiz' | 'score' | 'result';
type Difficulty = 'easy' | 'medium' | 'hard';

const QUESTIONS: Question[] = questionsData as Question[];
const QUESTION_COUNT_BY_DIFFICULTY: Record<Difficulty, number> = {
  easy: 10,
  medium: 25,
  hard: 50,
};

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('home');
  const [quizAnswers, setQuizAnswers] = useState<AnswerRecord[]>([]);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [completedQuestions, setCompletedQuestions] = useState<Question[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [dailyWarmupQuestion, setDailyWarmupQuestion] = useState<Question>(() =>
    pickRandomQuestion(),
  );

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
    setDailyWarmupQuestion(pickRandomQuestion());
  };

  const handleQuizComplete = (answers: AnswerRecord[]) => {
    setQuizAnswers(answers);
    setCompletedQuestions(activeQuestions);
    setActiveScreen('score');

    const correctCount = answers.filter((answer) => answer.isCorrect).length;

    setUser((prev) =>
      prev
        ? {
            ...prev,
            answered: prev.answered + answers.length,
            correct: prev.correct + correctCount,
            completion: answers.length
              ? correctCount / answers.length
              : prev.completion,
          }
        : prev,
    );
    setDailyWarmupQuestion(pickRandomQuestion());
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
        questionPoolSize={QUESTIONS.length}
        warmupQuestion={dailyWarmupQuestion}
        onRefreshWarmup={() => setDailyWarmupQuestion(pickRandomQuestion())}
        totalAnswered={user.answered}
        totalCorrect={user.correct}
        streakDays={user.streak}
        completionRatio={user.completion}
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

function pickQuestionsForDifficulty(difficulty: Difficulty): Question[] {
  const desiredCount = QUESTION_COUNT_BY_DIFFICULTY[difficulty];
  const pool = [...QUESTIONS];
  const maxCount = Math.min(desiredCount, pool.length);
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, maxCount);
}

function pickRandomQuestion(): Question {
  const index = Math.floor(Math.random() * QUESTIONS.length);
  return QUESTIONS[index];
}
