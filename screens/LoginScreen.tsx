import React from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewProps,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button, makeStyles, useTheme } from '../components';
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
  const theme = useTheme();
  const styles = useStyles();

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
        <Button
          accessibilityState={{ busy: loading, disabled: loading }}
          variant="surface"
          size="lg"
          fullWidth
          onPress={onSignIn}
          disabled={loading}
          disabledOpacity={0.7}
        >
          {loading ? (
            <ActivityIndicator color={theme.colors.primary} />
          ) : (
              <View style={styles.buttonRow}>
                <View style={styles.buttonIconWrapper}>
                  <IconLockClosed size={iconSize} color={theme.colors.primary} />
                </View>
                <Text style={styles.signInText}>
                  {t('common.actions.continueGitHub')}
                </Text>
              </View>
          )}
        </Button>

        <Button
          variant="muted"
          size="lg"
          fullWidth
          onPress={onContinueAsGuest}
          disabled={loading}
          disabledOpacity={0.7}
        >
          <View style={styles.buttonRow}>
            <View style={styles.buttonIconWrapper}>
              <IconBeaker size={iconSize} color={theme.colors.primary} />
            </View>
            <Text style={styles.guestButtonText}>
              {t('common.actions.continueGuest')}
            </Text>
          </View>
        </Button>
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

const useStyles = makeStyles((theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: theme.spacing.xl,
      paddingHorizontal: theme.spacing.xl,
      paddingBottom: theme.spacing.xxl,
      gap: theme.spacing.xl,
      backgroundColor: theme.colors.background,
    },
    hero: {
      gap: theme.spacing.md,
      alignItems: 'center',
    },
    logoImage: {
      width: '100%',
      height: undefined,
      aspectRatio: 1,
      borderRadius: theme.radius.md,
    },
    title: {
      ...theme.typography.display,
      color: theme.colors.textPrimary,
      textAlign: 'center',
    },
    subtitle: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    callouts: {
      gap: theme.spacing.md,
    },
    callout: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius.md,
      padding: theme.spacing.xl,
      gap: theme.spacing.sm,
    },
    calloutTitle: {
      ...theme.typography.heading,
      color: theme.colors.textOnPrimary,
    },
    calloutBody: {
      ...theme.typography.body,
      color: theme.colors.textOnPrimary,
      opacity: 0.92,
    },
    actions: {
      gap: theme.spacing.md,
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
    signInText: {
      ...theme.typography.heading,
      color: theme.colors.textPrimary,
    },
    guestButtonText: {
      ...theme.typography.heading,
      color: theme.colors.textPrimary,
    },
    disclaimer: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
  }),
);

export default LoginScreen;
