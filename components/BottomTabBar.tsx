import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/useAppStore';
import { Button } from './Button';
import {
  IconDocumentText,
  IconHome,
  IconPlayCircle,
  IconSparkles,
  IconWheel,
} from './icons';
import { makeStyles, useTheme } from './theme';

export type TabKey = 'home' | 'startQuiz' | 'history' | 'warmup' | 'settings';

export type BottomTabBarProps = {
  activeTab: TabKey;
  onTabPress: (tab: TabKey) => void;
};

const tabs: Array<{ key: TabKey; icon: typeof IconHome; labelKey: string }> = [
  { key: 'home', icon: IconHome, labelKey: 'common.tabs.home' },
  { key: 'warmup', icon: IconSparkles, labelKey: 'common.tabs.warmup' },
  { key: 'startQuiz', icon: IconPlayCircle, labelKey: 'common.tabs.startQuiz' },
  { key: 'history', icon: IconDocumentText, labelKey: 'common.tabs.history' },
  { key: 'settings', icon: IconWheel, labelKey: 'common.tabs.settings' },
];

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onTabPress,
}) => {
  const theme = useTheme();
  const styles = useStyles();
  const { t } = useTranslation();
  const iconSize = useAppStore((state) => state.iconSize);

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        const color = isActive ? theme.colors.primary : theme.colors.textSecondary;
        return (
          <Button
            key={tab.key}
            variant="tab"
            size="xs"
            selected={isActive}
            style={styles.tabButton}
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={t(tab.labelKey)}
            onPress={() => onTabPress(tab.key)}
          >
            <View style={styles.tabContent}>
              <tab.icon size={iconSize} color={color} />
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {t(tab.labelKey)}
              </Text>
            </View>
          </Button>
        );
      })}
    </View>
  );
};

const useStyles = makeStyles((theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.surface,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.colors.border,
    },
    tabButton: {
      flex: 1,
    },
    tabContent: {
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.xs,
    },
    tabLabel: {
      ...theme.typography.caption,
      fontSize: 11,
      textTransform: 'none',
      color: theme.colors.textSecondary,
    },
    tabLabelActive: {
      color: theme.colors.primary,
    },
  }),
);

export default BottomTabBar;
