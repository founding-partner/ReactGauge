import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Difficulty } from '../store/useAppStore';
import { Button } from './Button';
import { OptionButton } from './OptionButton';
import { Theme, ThemePreference, makeStyles, useTheme } from './theme';
import {
  IconArrowLeft,
  IconArrowLeftOnRectangle,
  IconArrowPath,
  IconWheel,
} from './icons';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = Math.min(width * 0.82, 360);
const ICON_MIN = 16;
const ICON_MAX = 32;
const ICON_STEP = 2;

export type SettingsDrawerProps = {
  visible: boolean;
  onClose: () => void;
  difficulty: Difficulty;
  onSelectDifficulty: (difficulty: Difficulty) => void;
  iconSize: number;
  onChangeIconSize: (size: number) => void;
  themePreference: ThemePreference;
  onSelectTheme: (theme: ThemePreference) => void;
  showDifficulty?: boolean;
  canManageSession?: boolean;
  onResetData?: () => void;
  onSignOut?: () => void;
};

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  visible,
  onClose,
  difficulty,
  onSelectDifficulty,
  iconSize,
  onChangeIconSize,
  themePreference,
  onSelectTheme,
  showDifficulty = true,
  canManageSession = false,
  onResetData,
  onSignOut,
}) => {
  const theme = useTheme();
  const styles = useStyles();
  const { t } = useTranslation();
  const translateX = useRef(new Animated.Value(1)).current;
  const [rendered, setRendered] = useState(visible);
  useEffect(() => {
    if (visible) {
      setRendered(true);
      Animated.timing(translateX, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateX, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setRendered(false);
        }
      });
    }
  }, [translateX, visible]);

  if (!rendered) {
    return null;
  }

  const clampedIcon = Math.min(Math.max(iconSize, ICON_MIN), ICON_MAX);

  const handleAdjustIcon = (delta: number) => {
    const next = Math.min(Math.max(clampedIcon + delta, ICON_MIN), ICON_MAX);
    onChangeIconSize(next);
  };

  const showSessionActions =
    canManageSession && Boolean(onResetData || onSignOut);

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <Button style={styles.backdrop} onPress={onClose} />
      <Animated.View
        style={[
          styles.drawer,
          {
            transform: [
              {
                translateX: translateX.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, DRAWER_WIDTH],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <IconWheel size={18} color={theme.colors.textPrimary} />
            <Text style={styles.headerTitle}>Settings</Text>
          </View>
          <Button
            variant="secondary"
            size="xs"
            radius="md"
            pressedOpacity={0.85}
            style={styles.closeButton}
            onPress={onClose}
            accessibilityLabel="Close settings"
          >
            <IconArrowLeft size={16} color={theme.colors.textPrimary} />
            <Text style={styles.closeButtonText}>Back</Text>
          </Button>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Theme</Text>
            <View style={styles.optionList}>
              {(['system', 'light', 'dark'] as ThemePreference[]).map((entry) => (
                <OptionButton
                  key={entry}
                  label={entry === 'system' ? 'System' : entry.charAt(0).toUpperCase() + entry.slice(1)}
                  description={
                    entry === 'system'
                      ? 'Follow device setting'
                      : entry === 'light'
                      ? 'Bright backgrounds'
                      : 'Dim backgrounds'
                  }
                  selected={themePreference === entry}
                  onPress={() => onSelectTheme(entry)}
                  containerStyle={styles.optionButton}
                />
              ))}
            </View>
          </View>

          {showDifficulty ? (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Difficulty</Text>
              <View style={styles.optionList}>
                {(['easy', 'medium', 'hard'] as Difficulty[]).map((entry) => (
                  <OptionButton
                    key={entry}
                    label={entry.charAt(0).toUpperCase() + entry.slice(1)}
                    description={
                      entry === 'easy'
                        ? '10 Questions'
                        : entry === 'medium'
                        ? '25 Questions'
                        : '50 Questions'
                    }
                    selected={difficulty === entry}
                    onPress={() => onSelectDifficulty(entry)}
                    containerStyle={styles.optionButton}
                  />
                ))}
              </View>
            </View>
          ) : null}

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Icon Size</Text>
            <Text style={styles.sectionHelper}>Adjust hero icon size across the app.</Text>
            <View style={styles.iconSizeRow}>
              <Button
                variant="muted"
                size="none"
                style={styles.iconSizeButton}
                onPress={() => handleAdjustIcon(-ICON_STEP)}
                accessibilityLabel="Reduce icon size"
              >
                <Text style={styles.iconSizeButtonText}>−</Text>
              </Button>
              <Text style={styles.iconSizeValue}>{clampedIcon}px</Text>
              <Button
                variant="muted"
                size="none"
                style={styles.iconSizeButton}
                onPress={() => handleAdjustIcon(ICON_STEP)}
                accessibilityLabel="Increase icon size"
              >
                <Text style={styles.iconSizeButtonText}>+</Text>
              </Button>
            </View>
          </View>

          {showSessionActions ? (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>{t('common.userProfile')}</Text>
              {onResetData ? (
                <Button
                  variant="muted"
                  size="md"
                  style={styles.actionButton}
                  onPress={onResetData}
                >
                  <View style={styles.actionRow}>
                    <View style={[styles.actionIcon, styles.resetIconBg]}>
                      <IconArrowPath size={clampedIcon} color={theme.colors.primary} />
                    </View>
                    <View style={styles.actionTextGroup}>
                      <Text style={styles.actionTitle}>
                        {t('common.actions.resetData')}
                      </Text>
                      <Text style={styles.actionSubtitle}>
                        {t('home.resetDataSubtitle')}
                      </Text>
                    </View>
                  </View>
                </Button>
              ) : null}

              {onSignOut ? (
                <Button
                  variant="danger"
                  size="md"
                  style={styles.actionButton}
                  onPress={onSignOut}
                >
                  <View style={styles.actionRow}>
                    <View style={[styles.actionIcon, styles.signOutIconBg]}>
                      <IconArrowLeftOnRectangle size={clampedIcon} color={theme.colors.danger} />
                    </View>
                    <View style={styles.actionTextGroup}>
                      <Text style={[styles.actionTitle, styles.signOutTitle]}>
                        {t('common.actions.signOut')}
                      </Text>
                      <Text style={styles.actionSubtitle}>
                        {t('home.signOutSubtitle')}
                      </Text>
                    </View>
                  </View>
                </Button>
              ) : null}
            </View>
          ) : null}
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'flex-start',
      alignItems: 'flex-end',
      zIndex: 50,
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor:
        theme.name === 'dark'
          ? 'rgba(0,0,0,0.4)'
          : 'rgba(15,23,42,0.25)',
    },
    drawer: {
      width: DRAWER_WIDTH,
      height: '100%',
      backgroundColor: theme.colors.surface,
      paddingTop: theme.spacing.xxl,
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.xxl,
      borderTopLeftRadius: theme.radius.lg,
      borderBottomLeftRadius: theme.radius.lg,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: -2, height: 4 },
      shadowOpacity: 0.16,
      shadowRadius: 12,
      elevation: 8,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.lg,
    },
    headerTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    headerTitle: {
      ...theme.typography.heading,
      color: theme.colors.textPrimary,
    },
    closeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    closeButtonText: {
      ...theme.typography.caption,
      color: theme.colors.textPrimary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    content: {
      gap: theme.spacing.lg,
      paddingBottom: theme.spacing.xxl,
    },
    section: {
      gap: theme.spacing.sm,
    },
    sectionLabel: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
    },
    sectionHelper: {
      ...theme.typography.subheading,
      color: theme.colors.textSecondary,
    },
    optionList: {
      gap: theme.spacing.sm,
    },
    optionButton: {
      marginBottom: 0,
    },
    iconSizeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    iconSizeButton: {
      width: 44,
      height: 44,
    },
    iconSizeButtonText: {
      ...theme.typography.heading,
      color: theme.colors.textPrimary,
    },
    iconSizeValue: {
      ...theme.typography.heading,
      color: theme.colors.textPrimary,
    },
    actionButton: {
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 3,
      alignItems: 'stretch',
      justifyContent: 'flex-start',
    },
    actionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    actionIcon: {
      width: 44,
      height: 44,
      borderRadius: theme.radius.lg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    resetIconBg: {
      backgroundColor: theme.colors.primaryMuted,
    },
    signOutIconBg: {
      backgroundColor: theme.colors.dangerMuted,
    },
    actionTextGroup: {
      flex: 1,
      gap: theme.spacing.xs / 2,
    },
    actionTitle: {
      ...theme.typography.body,
      color: theme.colors.textPrimary,
      fontWeight: '700',
    },
    actionSubtitle: {
      ...theme.typography.subheading,
      color: theme.colors.textSecondary,
    },
    signOutTitle: {
      color: theme.colors.danger,
    },
  }),
);

export default SettingsDrawer;
