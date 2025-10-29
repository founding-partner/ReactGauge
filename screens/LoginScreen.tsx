import React from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewProps,
} from 'react-native';
import { colors, radius, spacing, typography } from '../components';
import { IconLockClosed, IconBeaker } from '../components/icons';

export interface LoginScreenProps extends ViewProps {
  onSignIn: () => void;
  onContinueAsGuest: () => void;
  loading?: boolean;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onSignIn,
  onContinueAsGuest,
  loading = false,
  style,
  ...rest
}) => {
  return (
    <ScrollView
      style={style}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      {...rest}
    >
      <View style={styles.hero} accessible accessibilityRole="header">
        <Image
          source={require('../app.png')}
          style={styles.logoImage}
          resizeMode="contain"
          accessibilityLabel="React Gauge Logo"
        />
        <Text style={styles.title}>Level up your React skills</Text>
        <Text style={styles.subtitle}>
          Take curated quizzes, review detailed explanations, and track your
          growth as a React engineer.
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ busy: loading, disabled: loading }}
          style={({ pressed }) => [
            styles.signInButton,
            pressed && !loading ? styles.signInButtonPressed : null,
            loading ? styles.signInButtonDisabled : null,
          ]}
          onPress={onSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <View style={styles.buttonRow}>
              <View style={styles.buttonIconWrapper}>
                <IconLockClosed size={20} color={colors.background} />
              </View>
              <Text style={styles.signInText}>Continue with GitHub</Text>
            </View>
          )}
        </Pressable>

        <Pressable
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.guestButton,
            pressed ? styles.guestButtonPressed : null,
          ]}
          onPress={onContinueAsGuest}
          disabled={loading}
        >
          <View style={styles.buttonRow}>
            <View style={styles.buttonIconWrapper}>
              <IconBeaker size={20} color={colors.surface} />
            </View>
            <Text style={styles.guestButtonText}>Continue as Guest</Text>
          </View>
        </Pressable>
      </View>

      <View style={styles.callouts}>
        <View style={styles.callout}>
          <Text style={styles.calloutTitle}>Curated Questions</Text>
          <Text style={styles.calloutBody}>
            Each quiz pulls directly from GitHub to keep content fresh and
            relevant.
          </Text>
        </View>
        <View style={styles.callout}>
          <Text style={styles.calloutTitle}>Offline Friendly</Text>
          <Text style={styles.calloutBody}>
            Cache questions and results so you can practice anytime, anywhere.
          </Text>
        </View>
      </View>

      <Text style={styles.disclaimer}>
        GitHub login is used only to personalize your experience. We never post
        on your behalf.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
    gap: spacing.xl,
  },
  hero: {
    gap: spacing.md,
    alignItems: 'center',
  },
  logoImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    borderRadius: radius.md,
  },
  title: {
    ...typography.display,
    color: colors.surface,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.surface,
    opacity: 0.8,
    textAlign: 'center',
  },
  callouts: {
    gap: spacing.md,
  },
  callout: {
    backgroundColor: '#172554',
    borderRadius: radius.md,
    padding: spacing.xl,
    gap: spacing.sm,
  },
  calloutTitle: {
    ...typography.heading,
    color: colors.surface,
  },
  calloutBody: {
    ...typography.body,
    color: colors.surface,
    opacity: 0.9,
  },
  actions: {
    gap: spacing.md,
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
  signInButton: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInText: {
    ...typography.heading,
    color: colors.background,
  },
  signInButtonPressed: {
    opacity: 0.85,
  },
  signInButtonDisabled: {
    opacity: 0.7,
  },
  guestButton: {
    borderColor: colors.surface,
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestButtonText: {
    ...typography.heading,
    color: colors.surface,
  },
  guestButtonPressed: {
    opacity: 0.8,
  },
  disclaimer: {
    ...typography.caption,
    color: colors.surface,
    opacity: 0.7,
    textAlign: 'center',
  },
});

export default LoginScreen;
