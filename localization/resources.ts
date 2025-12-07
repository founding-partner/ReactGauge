export const resources = {
  en: {
    translation: {
      common: {
        appName: 'ReactGauge',
        guestMode: 'Guest mode',
        guest: 'Guest',
        language: 'Language',
        userProfile: 'User profile',
        userInitials: 'YOU',
        streakDays_one: '{{count}} day streak',
        streakDays_other: '{{count}} day streaks',
        difficulties: {
          easy: 'Easy',
          medium: 'Medium',
          hard: 'Hard',
        },
        actions: {
          back: 'Back',
          signIn: 'Sign in with GitHub',
          signOut: 'Sign out',
          continueGitHub: 'Continue with GitHub',
          continueGuest: 'Continue as Guest',
          startQuiz: "Start Today's Quiz",
          viewHistory: 'View History',
          resetData: 'Reset data',
          refreshQuestion: 'Try Different Question',
          retakeQuiz: 'Retake Quiz',
          reviewAnswers: 'Review Answers',
          backHome: 'Back to Home',
          shareScorecard: 'Share Scorecard',
          preparing: 'Preparing…',
          exit: 'Exit',
          previous: 'Previous',
          next: 'Next',
          finish: 'Finish',
          submit: 'Submit',
          ok: 'Okay',
          clear: 'Clear',
          cancel: 'Cancel',
        },
      },
      alerts: {
        githubLoginFailedTitle: 'GitHub Login Failed',
        genericError: 'Something went wrong.',
        noQuestionsTitle: 'No Questions Available',
        noQuestionsBody:
          'Add more questions to the question bank to start a quiz for this difficulty.',
        shareFailedTitle: 'Share Failed',
        shareFailedBody: 'Unable to share results.',
        shareCaptureError: 'Unable to capture score screenshot.',
        clearHistoryTitle: 'Clear quiz history',
        clearHistoryBody:
          'This will permanently remove all saved attempts. Continue?',
        signOutTitle: 'Sign out?',
        signOutBody:
          'You will be returned to the login screen and local quiz data will be cleared.',
        resetDataTitle: 'Reset your data?',
        resetDataBody:
          'This clears your saved history and resets your progress stats on this device.',
      },
      login: {
        heroTitle: 'Level up your React skills',
        heroSubtitle:
          'Take curated quizzes, review detailed explanations, and track your growth as a React engineer.',
        callouts: {
          curatedTitle: 'Curated Questions',
          curatedBody:
            'Each quiz pulls directly from GitHub to keep content fresh and relevant.',
          offlineTitle: 'Offline Friendly',
          offlineBody:
            'Cache questions and results so you can practice anytime, anywhere.',
        },
        disclaimer:
          'GitHub login is used only to personalize your experience. We never post on your behalf.',
        logoAlt: 'React Gauge Logo',
      },
      home: {
        welcome: 'Welcome back, {{name}}',
        subtitleGuest:
          'You are exploring ReactGauge in guest mode. Sign in to track your growth.',
        subtitleSignedIn:
          'Tune your React instincts with fresh questions each session.',
        guestCardTitle: 'Guest mode enabled',
        guestCardBody:
          'Your progress will reset when you leave. Sign in with GitHub to save results, earn streaks, and sync across devices.',
        progressTitle: 'Progress Overview',
        progressAnswered: 'Questions answered',
        progressCorrect: 'Correct answers',
        progressWeekly: 'Weekly completion',
        difficultyTitle: 'Difficulty',
        difficultyDescription:
          'Choose how many questions you want to tackle. Question bank currently holds {{count}} prompts.',
        difficultyCountLabel: '{{count}} Qs',
        resetDataSubtitle: 'Clear stats and history on this device.',
        signOutSubtitle: 'Return to login and remove local profile.',
        warmupTitle: 'Daily Warm-up',
        warmupSuccess: 'Great job! You nailed it.',
        warmupRetry:
          'Not quite right—review the explanation and take another shot.',
        languageLabel: 'Language',
      },
      quiz: {
        title: 'React Mastery Quiz',
        subtitle: 'Question {{current}} of {{total}}',
        emptyTitle: 'No questions available',
        emptySubtitle:
          'Add questions to the bank or choose a different difficulty to begin.',
        explanationCorrect: 'Correct!',
        explanationReview: 'Let’s review',
        yourAnswer: 'Your answer',
        correctAnswer: 'Correct answer',
        dismiss: 'Okay',
      },
      result: {
        title: 'Quiz Complete',
        subtitle:
          'You answered {{correct}} out of {{total}} questions correctly.',
        guestTitle: 'Guest mode reminder',
        guestBody:
          'Results aren’t stored while in guest mode. Sign in to keep your streaks, sync across devices, and unlock detailed progress analytics.',
        reviewTitle: 'Review answers',
        badgeCorrect: 'Correct',
        badgeIncorrect: 'Incorrect',
        yourAnswer: 'Your answer:',
        correctAnswer: 'Correct answer:',
        explanation: 'Explanation:',
      },
      score: {
        title: 'Score Breakdown',
        subtitle:
          'You answered {{correct}} of {{total}} questions correctly.',
        congrats: 'Great work! You’re leveling up your React skills.',
        byTopic: 'By Topic',
        generalTopic: 'General',
        shareTitle: 'ReactGauge Scorecard',
      },
      history: {
        title: 'Quiz History',
        emptyTitle: 'No attempts yet',
        emptySubtitle: 'Complete a quiz to see your history here.',
        streak: 'Streak {{count}}',
        guestAttempt: 'Guest',
      },
      historyDetail: {
        title: 'Attempt Details',
        guestAttempt: 'Guest attempt',
        signedInAs: 'Signed in as {{user}}',
        streak: 'Streak {{count}}',
        labels: {
          yourAnswer: 'Your answer',
          correctAnswer: 'Correct answer',
          explanation: 'Explanation',
        },
        badges: {
          correct: 'Correct',
          answer: 'Answer',
          yourPick: 'Your pick',
        },
      },
    },
  },
  es: {
    translation: {
      common: {
        appName: 'ReactGauge',
        guestMode: 'Modo invitado',
        guest: 'Invitado',
        language: 'Idioma',
        userProfile: 'Perfil de usuario',
        userInitials: 'TÚ',
        streakDays_one: '{{count}} día de racha',
        streakDays_other: '{{count}} días de racha',
        difficulties: {
          easy: 'Fácil',
          medium: 'Intermedio',
          hard: 'Difícil',
        },
        actions: {
          back: 'Atrás',
          signIn: 'Inicia sesión con GitHub',
          signOut: 'Cerrar sesión',
          continueGitHub: 'Continuar con GitHub',
          continueGuest: 'Continuar como invitado',
          startQuiz: 'Comienza el quiz de hoy',
          viewHistory: 'Ver historial',
          resetData: 'Restablecer datos',
          refreshQuestion: 'Probar otra pregunta',
          retakeQuiz: 'Repetir quiz',
          reviewAnswers: 'Revisar respuestas',
          backHome: 'Volver al inicio',
          shareScorecard: 'Compartir resultados',
          preparing: 'Preparando…',
          exit: 'Salir',
          previous: 'Anterior',
          next: 'Siguiente',
          finish: 'Finalizar',
          submit: 'Enviar',
          ok: 'Aceptar',
          clear: 'Borrar',
          cancel: 'Cancelar',
        },
      },
      alerts: {
        githubLoginFailedTitle: 'Error al iniciar sesión con GitHub',
        genericError: 'Algo salió mal.',
        noQuestionsTitle: 'No hay preguntas disponibles',
        noQuestionsBody:
          'Agrega más preguntas al banco para iniciar un quiz con esta dificultad.',
        shareFailedTitle: 'No se pudo compartir',
        shareFailedBody: 'No fue posible compartir los resultados.',
        shareCaptureError: 'No se pudo capturar la tarjeta de puntuación.',
        clearHistoryTitle: 'Borrar historial de quizzes',
        clearHistoryBody:
          'Esto eliminará permanentemente todos los intentos guardados. ¿Deseas continuar?',
        signOutTitle: '¿Cerrar sesión?',
        signOutBody:
          'Volverás a la pantalla de inicio de sesión y se borrarán los datos locales del quiz.',
        resetDataTitle: '¿Restablecer tus datos?',
        resetDataBody:
          'Esto borrará el historial guardado y restablecerá tus estadísticas en este dispositivo.',
      },
      login: {
        heroTitle: 'Potencia tus habilidades de React',
        heroSubtitle:
          'Resuelve cuestionarios seleccionados, revisa explicaciones detalladas y sigue tu crecimiento como ingeniera o ingeniero React.',
        callouts: {
          curatedTitle: 'Preguntas seleccionadas',
          curatedBody:
            'Cada quiz se alimenta directamente de GitHub para mantener el contenido fresco y relevante.',
          offlineTitle: 'Funciona sin conexión',
          offlineBody:
            'Guarda preguntas y resultados para practicar en cualquier momento y lugar.',
        },
        disclaimer:
          'El inicio de sesión con GitHub solo personaliza tu experiencia. Nunca publicaremos en tu nombre.',
        logoAlt: 'Logotipo de React Gauge',
      },
      home: {
        welcome: 'Bienvenido de nuevo, {{name}}',
        subtitleGuest:
          'Estás explorando ReactGauge en modo invitado. Inicia sesión para registrar tu crecimiento.',
        subtitleSignedIn:
          'Afina tu intuición de React con preguntas nuevas en cada sesión.',
        guestCardTitle: 'Modo invitado activado',
        guestCardBody:
          'Tu progreso se restablecerá al salir. Inicia sesión con GitHub para guardar resultados, sumar rachas y sincronizar tus dispositivos.',
        progressTitle: 'Resumen de progreso',
        progressAnswered: 'Preguntas respondidas',
        progressCorrect: 'Respuestas correctas',
        progressWeekly: 'Avance semanal',
        difficultyTitle: 'Dificultad',
        difficultyDescription:
          'Elige cuántas preguntas quieres resolver. El banco actual tiene {{count}} preguntas.',
        difficultyCountLabel: '{{count}} preg.',
        resetDataSubtitle: 'Borra estadísticas e historial en este dispositivo.',
        signOutSubtitle:
          'Regresa al inicio de sesión y elimina el perfil guardado localmente.',
        warmupTitle: 'Calentamiento diario',
        warmupSuccess: '¡Excelente trabajo! Lo lograste.',
        warmupRetry:
          'Aún no es correcto; revisa la explicación e inténtalo de nuevo.',
        languageLabel: 'Idioma',
      },
      quiz: {
        title: 'Quiz de maestría en React',
        subtitle: 'Pregunta {{current}} de {{total}}',
        emptyTitle: 'No hay preguntas disponibles',
        emptySubtitle:
          'Agrega preguntas al banco o elige otra dificultad para comenzar.',
        explanationCorrect: '¡Correcto!',
        explanationReview: 'Repasemos',
        yourAnswer: 'Tu respuesta',
        correctAnswer: 'Respuesta correcta',
        dismiss: 'Aceptar',
      },
      result: {
        title: 'Quiz completado',
        subtitle:
          'Respondiste {{correct}} de {{total}} preguntas correctamente.',
        guestTitle: 'Recordatorio de modo invitado',
        guestBody:
          'Los resultados no se guardan en modo invitado. Inicia sesión para mantener tus rachas, sincronizar tus dispositivos y desbloquear análisis detallados.',
        reviewTitle: 'Revisar respuestas',
        badgeCorrect: 'Correcta',
        badgeIncorrect: 'Incorrecta',
        yourAnswer: 'Tu respuesta:',
        correctAnswer: 'Respuesta correcta:',
        explanation: 'Explicación:',
      },
      score: {
        title: 'Desglose de puntuación',
        subtitle:
          'Respondiste {{correct}} de {{total}} preguntas correctamente.',
        congrats: '¡Gran trabajo! Estás elevando tus habilidades en React.',
        byTopic: 'Por tema',
        generalTopic: 'General',
        shareTitle: 'Tarjeta de puntuación de ReactGauge',
      },
      history: {
        title: 'Historial de quizzes',
        emptyTitle: 'Aún no hay intentos',
        emptySubtitle: 'Completa un quiz para ver tu historial aquí.',
        streak: 'Racha de {{count}}',
        guestAttempt: 'Invitado',
      },
      historyDetail: {
        title: 'Detalle del intento',
        guestAttempt: 'Intento como invitado',
        signedInAs: 'Sesión iniciada como {{user}}',
        streak: 'Racha de {{count}}',
        labels: {
          yourAnswer: 'Tu respuesta',
          correctAnswer: 'Respuesta correcta',
          explanation: 'Explicación',
        },
        badges: {
          correct: 'Correcta',
          answer: 'Respuesta',
          yourPick: 'Tu elección',
        },
      },
    },
  },
  ta: {
    translation: {
      common: {
        appName: 'ரியாக்ட் கேஜ்',
        guestMode: 'விருந்தினர் பயன்முறை',
        guest: 'விருந்தினர்',
        language: 'மொழி',
        userProfile: 'பயனர் சுயவிவரம்',
        userInitials: 'நீங்கள்',
        streakDays_one: '{{count}} நாள் தொடர்ச்சி',
        streakDays_other: '{{count}} நாட்கள் தொடர்ச்சி',
        difficulties: {
          easy: 'எளிது',
          medium: 'நடுத்தரம்',
          hard: 'கடினம்',
        },
        actions: {
          back: 'பின்னுக்கு',
          signIn: 'GitHub மூலம் உள்நுழை',
          signOut: 'வெளியேறு',
          continueGitHub: 'GitHub மூலம் தொடரவும்',
          continueGuest: 'விருந்தினராக தொடரவும்',
          startQuiz: 'இன்றைய வினாடி வினாவைத் தொடங்குங்கள்',
          viewHistory: 'வரலாற்றைக் காண்க',
          resetData: 'தரவை மீட்டமை',
          refreshQuestion: 'மற்றொரு கேள்வியை முயற்சி செய்',
          retakeQuiz: 'மீண்டும் வினாடி வினாவை செய்',
          reviewAnswers: 'பதில்களை பார்வையிடு',
          backHome: 'முகப்புக்கு திரும்பு',
          shareScorecard: 'மதிப்பெண் அட்டையை பகிர்',
          preparing: 'தயாராகிறது…',
          exit: 'வெளியேறு',
          previous: 'முந்தையது',
          next: 'அடுத்தது',
          finish: 'முடி',
          submit: 'சமர்ப்பி',
          ok: 'சரி',
          clear: 'அழி',
          cancel: 'ரத்து',
        },
      },
      alerts: {
        githubLoginFailedTitle: 'GitHub உள்நுழைவு தோல்வியடைந்தது',
        genericError: 'ஏதோ தவறு நேர்ந்துள்ளது.',
        noQuestionsTitle: 'கேள்விகள் இல்லை',
        noQuestionsBody:
          'இந்த கடினத்திற்குரிய வினாடி வினாவைத் தொடங்க கேள்வி வங்கியில் கூடுதல் கேள்விகளைச் சேர்க்கவும்.',
        shareFailedTitle: 'பகிர்வு தோல்வி',
        shareFailedBody: 'மதிப்பெண்களைப் பகிர இயலவில்லை.',
        shareCaptureError: 'மதிப்பெண் அட்டையைப் பதிவு செய்ய முடியவில்லை.',
        clearHistoryTitle: 'வினாதாள் வரலாற்றை அழிக்கவும்',
        clearHistoryBody:
          'இது சேமிக்கப்பட்ட அனைத்து முயற்சிகளையும் நிரந்தரமாக நீக்கும். தொடர விரும்புகிறீர்களா?',
        signOutTitle: 'வெளியேறவா?',
        signOutBody:
          'நீங்கள் உள்நுழைவு திரைக்கு திருப்பப்படுவீர்கள்; இந்த சாதனத்தில் உள்ள வினாதாள் தரவு அழிக்கப்படும்.',
        resetDataTitle: 'தரவை மீட்டமைக்கவா?',
        resetDataBody:
          'இந்த சாதனத்தில் சேமித்துள்ள வரலாறும் முன்னேற்ற புள்ளிவிவரங்களும் மீட்டமைக்கப்படும்.',
      },
      login: {
        heroTitle: 'உங்கள் React திறன்களை மேம்படுத்துங்கள்',
        heroSubtitle:
          'தேர்ந்தெடுக்கப்பட்ட கேள்விகளைத் தீர்த்து, விளக்கங்களைப் படித்து, உங்கள் வளர்ச்சியை கண்காணியுங்கள்.',
        callouts: {
          curatedTitle: 'தேர்ந்தெடுக்கப்பட்ட கேள்விகள்',
          curatedBody:
            'ஒவ்வொரு வினாதாளமும் GitHub இலிருந்து நேரடியாக கேள்விகளை பெறுகிறது.',
          offlineTitle: 'இணையம் இன்றியும் செயல்',
          offlineBody:
            'எப்போது வேண்டுமானாலும் பயிற்சி செய்ய கேள்விகளைச் சேமித்துக் கொள்ளுங்கள்.',
        },
        disclaimer:
          'GitHub உள்நுழைவு உங்கள் அனுபவத்தை தனிப்பயனாக்க மட்டுமே. உங்கள் பெயரில் எதையும் வெளியிடமாட்டோம்.',
        logoAlt: 'ரியாக்ட் கேஜ் லோகோ',
      },
      home: {
        welcome: 'மீண்டும் வருக, {{name}}',
        subtitleGuest:
          'நீங்கள் விருந்தினர் பயன்முறையில் ReactGauge ஐ ஆராய்கிறீர்கள். உங்கள் முன்னேற்றத்தை சேமிக்க உள்நுழைக.',
        subtitleSignedIn:
          'ஒவ்வொரு அமர்விலும் புதிய கேள்விகளுடன் உங்கள் React உணர்வுகளை தீட்டுங்கள்.',
        guestCardTitle: 'விருந்தினர் பயன்முறை இயக்கப்பட்டுள்ளது',
        guestCardBody:
          'நீங்கள் வெளியேறும்போது உங்கள் முன்னேற்றம் மீட்டமைக்கப்படும். GitHub மூலம் உள்நுழைந்து முடிவுகளை சேமிக்கவும்.',
        progressTitle: 'முன்னேற்ற சுருக்கம்',
        progressAnswered: 'பதிலளித்த கேள்விகள்',
        progressCorrect: 'சரியான பதில்கள்',
        progressWeekly: 'வாராந்திர நிறைவு',
        difficultyTitle: 'கடின நிலை',
        difficultyDescription:
          'எத்தனை கேள்விகளை முயற்சி செய்ய விரும்புகிறீர்கள் என்பதைத் தேர்வு செய்யுங்கள். தற்போது {{count}} கேள்விகள் உள்ளன.',
        difficultyCountLabel: '{{count}} கேள்விகள்',
        resetDataSubtitle:
          'இந்த சாதனத்தில் உள்ள புள்ளிவிவரங்களையும் வரலாறையும் காலி செய்யவும்.',
        signOutSubtitle:
          'உள்நுழைவு திரைக்கு திரும்பி, இந்த சாதனத்தில் உள்ள சுயவிவரத்தை நீக்கவும்.',
        warmupTitle: 'தினசரி முன் பயிற்சி',
        warmupSuccess: 'அற்புதம்! நீங்கள் இதை முடித்துவிட்டீர்கள்.',
        warmupRetry:
          'இன்னும் சரியாக இல்லை—விளக்கத்தைப் படித்து மறுபடியும் முயற்சி செய்க.',
        languageLabel: 'மொழி',
      },
      quiz: {
        title: 'React திறன் வினாதாள்',
        subtitle: 'கேள்வி {{current}} / {{total}}',
        emptyTitle: 'கேள்விகள் இல்லை',
        emptySubtitle:
          'வங்கியில் கேள்விகளைச் சேர்க்கவும் அல்லது தொடங்குவதற்கு வேறு சிரமத்தைத் தேர்வு செய்யவும்.',
        explanationCorrect: 'சரி!',
        explanationReview: 'மீண்டும் பார்க்கலாம்',
        yourAnswer: 'உங்கள் பதில்',
        correctAnswer: 'சரியான பதில்',
        dismiss: 'சரி',
      },
      result: {
        title: 'வினாதாள் நிறைவு',
        subtitle:
          '{{total}} கேள்விகளில் {{correct}} கேள்விகளுக்கு நீங்கள் சரியாக பதிலளித்தீர்கள்.',
        guestTitle: 'விருந்தினர் பயன்முறை நினைவூட்டல்',
        guestBody:
          'விருந்தினர் பயன்முறையில் விளைவுகள் சேமிக்கப்படாது. தொடர்ச்சியைப் பேண உள்நுழைக.',
        reviewTitle: 'பதில்களை மதிப்பாய்வு செய்க',
        badgeCorrect: 'சரி',
        badgeIncorrect: 'தவறு',
        yourAnswer: 'உங்கள் பதில்:',
        correctAnswer: 'சரியான பதில்:',
        explanation: 'விளக்கம்:',
      },
      score: {
        title: 'மதிப்பெண் விவரம்',
        subtitle:
          '{{total}} கேள்விகளில் {{correct}} பதில்கள் சரியானவை.',
        congrats: 'சிறப்பாக செய்கிறீர்கள்! உங்கள் React திறன் உயரும்.',
        byTopic: 'தலைப்புகளின்படி',
        generalTopic: 'பொது',
        shareTitle: 'ReactGauge மதிப்பெண் அட்டை',
      },
      history: {
        title: 'வினாதாள் வரலாறு',
        emptyTitle: 'இன்னும் முயற்சிகள் இல்லை',
        emptySubtitle: 'உங்கள் வரலாற்றை இங்கே காண ஒரு வினாடி வினாவை முடிக்கவும்.',
        streak: 'தொடர் {{count}}',
        guestAttempt: 'விருந்தினர்',
      },
      historyDetail: {
        title: 'முயற்சி விவரங்கள்',
        guestAttempt: 'விருந்தினர் முயற்சி',
        signedInAs: '{{user}} என்று உள்நுழைந்துள்ளார்',
        streak: 'தொடர் {{count}}',
        labels: {
          yourAnswer: 'உங்கள் பதில்',
          correctAnswer: 'சரியான பதில்',
          explanation: 'விளக்கம்',
        },
        badges: {
          correct: 'சரி',
          answer: 'பதில்',
          yourPick: 'உங்கள் தேர்வு',
        },
      },
    },
  },
} as const;

export type AppLanguage = keyof typeof resources;
