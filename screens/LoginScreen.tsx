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
import { useTranslation } from 'react-i18next';
import { colors, radius, spacing, typography } from '../components';
import { IconLockClosed, IconBeaker } from '../components/icons';
import { useAppStore } from '../store/useAppStore';

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
  const iconSize = useAppStore((state) => state.iconSize);
  const { t } = useTranslation();

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
          accessibilityLabel={t('login.logoAlt')}
        />
        <Text style={styles.title}>{t('login.heroTitle')}</Text>
        <Text style={styles.subtitle}>{t('login.heroSubtitle')}</Text>
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
                  <IconLockClosed size={iconSize} color={colors.background} />
                </View>
                <Text style={styles.signInText}>
                  {t('common.actions.continueGitHub')}
                </Text>
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
              <IconBeaker size={iconSize} color={colors.surface} />
            </View>
            <Text style={styles.guestButtonText}>
              {t('common.actions.continueGuest')}
            </Text>
          </View>
        </Pressable>
      </View>

      <View style={styles.callouts}>
        <View style={styles.callout}>
          <Text style={styles.calloutTitle}>
            {t('login.callouts.curatedTitle')}
          </Text>
          <Text style={styles.calloutBody}>
            {t('login.callouts.curatedBody')}
          </Text>
        </View>
        <View style={styles.callout}>
          <Text style={styles.calloutTitle}>
            {t('login.callouts.offlineTitle')}
          </Text>
          <Text style={styles.calloutBody}>
            {t('login.callouts.offlineBody')}
          </Text>
        </View>
      </View>

      <Text style={styles.disclaimer}>{t('login.disclaimer')}</Text>
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
