

# React Skill Tester Agents Spec

This document defines the agents and responsibilities involved in building the React Native (bare) app to assess React.js proficiency through multi-format questions.

---

## 🎯 App Summary

- A mobile app built with the React Native CLI workflow.
- Authenticates users via GitHub OAuth.
- Fetches React-related questions from a public GitHub repository.
- Stores user answers locally using SQLite.
- Tracks user progress and shows results.

---

## 👤 AuthAgent

**Purpose**: Handles GitHub authentication using `react-native-app-auth`.

**Responsibilities**:
- Configure GitHub OAuth credentials.
- Trigger login flow and retrieve access token.
- Store minimal user metadata (e.g., GitHub username).

---

## 📦 QuestionAgent

**Purpose**: Loads questions from a remote GitHub repo.

**Responsibilities**:
- Fetch a `questions.json` file from a public GitHub raw URL.
- Parse and normalize question objects.
- Cache questions in memory or local storage.

**Sample Endpoint**:
```ts
https://raw.githubusercontent.com/<org>/<repo>/main/questions.json
```

---

## 🧠 QuizAgent

**Purpose**: Controls the flow of the quiz.

**Responsibilities**:
- Manage current question state (index, navigation).
- Validate user answer and compare with correct one.
- Provide UI feedback on correctness.

---

## 🗄️ AnswerStorageAgent

**Purpose**: Manages SQLite-based local persistence of answers.

**Responsibilities**:
- Create and migrate `answers` table.
- Insert new answer records.
- Retrieve past results and stats.

**Schema**:
```sql
CREATE TABLE IF NOT EXISTS answers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question_id TEXT,
  user_answer TEXT,
  is_correct INTEGER,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 📊 ResultAgent

**Purpose**: Computes score and presents quiz summary.

**Responsibilities**:
- Calculate correct answers from SQLite.
- Show XP gain or skill progress (if gamified).
- Optionally export result or share.

---

## 🧪 DebugAgent (Optional)

**Purpose**: Helps in previewing, logging, and testing agent behavior.

**Responsibilities**:
- Log fetched questions.
- Output raw JSON and DB entries.
- Trigger clear/reset commands for testing.

---

## 🛠 Future Agents

- **LeaderboardAgent**: Sync scores to remote leaderboard.
- **AdminAgent**: Upload or edit questions.
- **SyncAgent**: Backup data to GitHub Gists or cloud storage.

---

## 🧭 Suggested Agent Flow

```txt
[AuthAgent] → [QuestionAgent] → [QuizAgent]
                      ↓
             [AnswerStorageAgent] → [ResultAgent]
```

---


## 💡 Notes

- Designed for full offline use once questions are fetched.
- Database is packaged and initialized on first launch.
- GitHub login is optional for local-only usage.

---

## 📁 Suggested File Structure

```
/ReactGauge
├── /assets                  # Images, icons, fonts
├── /auth                   # GitHub login logic
│   └── githubAuth.ts
├── /components             # UI components like QuestionCard, Timer
├── /db                     # SQLite setup and helper methods
│   └── database.ts
├── /screens                # App screens
│   ├── HomeScreen.tsx
│   ├── QuizScreen.tsx
│   ├── ResultScreen.tsx
│   └── ReviewScreen.tsx
├── /agents                 # Optional: Logic separation per agent
├── /utils                  # Reusable logic, constants, formatting
└── App.tsx                 # App entry point
```

---

## 🎨 Design Task List

- [ ] Create logo and splash screen
- [ ] Define color palette and typography tokens
- [ ] Use consistent theme (light/dark mode)
- [ ] Build reusable components (e.g., QuestionCard, OptionButton)
- [ ] Implement responsive layout with ScrollViews
- [ ] Add progress indicator during quiz
- [ ] Add toast/snackbar for success/failure feedback

### Foundation

- **Brand Theme**: Aim for a confident, educational feel; pair vibrant accents with calm neutrals.
- **Primary Palette**:
  - `#0F172A` (Deep Navy) – background, headers.
  - `#2563EB` (React Blue) – primary actions, highlights.
  - `#22C55E` (Success Green) – correct feedback, progress completion.
  - `#FACC15` (Energy Yellow) – XP/achievement highlights.
  - `#F1F5F9` (Cool Mist) – surfaces, cards.
- **Typography Tokens**:
  - `display`: Inter Bold, 28px, line-height 36px.
  - `heading`: Inter SemiBold, 20px, line-height 28px.
  - `body`: Inter Regular, 16px, line-height 24px.
  - `caption`: Inter Medium, 14px, line-height 20px, uppercase for labels.
- **Spacing Scale**: 4pt base with steps (4, 8, 12, 16, 24, 32).
- **Elevation**: Use subtle shadow (2dp) for cards, 0dp on base background.

### Components & Layout

- **QuestionCard**: Rounded corners (12px), padding 20px, uses `heading` for prompt, `body` for description, optional code block styled with monospaced font (`JetBrains Mono` fallback).
- **OptionButton**: Full-width, 48px height, 14px radius, default border `#CBD5F5`, selected state fills with `#2563EB` and sets text to white, disabled state reduces opacity to 60%.
- **QuizHeader**: Horizontal layout with avatar (40px pill), title `heading`, subtext `caption` indicating question count and timer.
- **Screen Layout**:
  - Wrap primary content in `SafeAreaView` + `ScrollView`.
  - Apply horizontal padding 20px, vertical padding 24px.
  - Use 16px spacing between stacked components; 24px between sections.
- **HomeScreen**: Hero section with gradient from `#2563EB` to `#22C55E`, overlay text in white, CTA button anchored below fold.
- **ResultScreen**: Use segmented cards for summary stats, apply `#FACC15` accent for XP badge, include sparkline placeholder for progress trend.
- **ReviewScreen**: Tabbed navigation (All / Correct / Needs Practice), sticky tab bar with light shadow, content cards using `OptionButton` styles to display chosen vs correct answers.

### Feedback, Motion & Assets

- **Progress Indicator**: Horizontal bar at top of QuizScreen, 4px height, background `#E2E8F0`, fill animates to `#2563EB`; add milestone dots every 5 questions using `#FACC15`.
- **Toasts/Snackbars**: Bottom-aligned, use semi-transparent `#0F172A` background (90%), rounded 16px, include icon left: checkmark in `#22C55E` for success, warning in `#F97316` for caution, auto-dismiss after 3s.
- **Answer Feedback**: After submission, highlight selected option border in `#22C55E` if correct, `#EF4444` if incorrect, show inline caption (`caption` style) explaining answer rationale.
- **Animations**: Keep under 250ms; use ease-in-out transitions for state changes on cards and buttons; progress bar uses linear timing.
- **Logo Direction**: Circular mark combining React atom silhouette with gauge needle pointing upward; primary usage on dark background (`#0F172A`) with accent `#2563EB`.
- **Splash Screen**: Solid `#0F172A` background, centered logo (180px width), subtle concentric rings at 20% opacity to suggest radar/gauge motif.
- **Asset Export**: Provide SVG for logo, 3x PNG for splash (Light/Dark), include typography license notes in `/assets/README.md`.

---

## 🛠️ Development Task List

### Phase 1 – Setup & Auth
- [ ] Initialize React Native CLI project
- [ ] Set up GitHub OAuth via `react-native-app-auth`
- [ ] Store authenticated user data securely

### Phase 2 – Questions & Quiz Flow
- [ ] Fetch `questions.json` from GitHub raw URL
- [ ] Render questions by type (MCQ, T/F, code)
- [ ] Enable navigation (Next, Previous)
- [ ] Show correctness feedback

### Phase 3 – Local Answer Storage
- [ ] Set up SQLite using `react-native-sqlite-storage`
- [ ] Create schema for storing user answers
- [ ] Insert answers on submit
- [ ] Query answers for result screen

### Phase 4 – Results & Review
- [ ] Calculate score and XP
- [ ] Display quiz results
- [ ] Add review screen with explanations
