import React from 'react';
import { StyleSheet, View } from 'react-native';
import { makeStyles } from './theme';

export interface ProgressBarProps {
  /** Value between 0 and 1 */
  progress: number;
  /** Optional milestone markers expressed as 0-1 values */
  milestones?: number[];
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  milestones = [],
}) => {
  const styles = useStyles();
  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${clampedProgress * 100}%` }]} />
        {milestones.map((milestone) => {
          const position = Math.min(Math.max(milestone, 0), 1) * 100;
          return (
            <View
              key={milestone}
              style={[styles.milestone, { left: `${position}%` }]}
            />
          );
        })}
      </View>
    </View>
  );
};

const useStyles = makeStyles((theme) =>
  StyleSheet.create({
    container: {
      width: '100%',
      paddingVertical: theme.spacing.sm,
    },
    track: {
      height: 4,
      backgroundColor: theme.colors.surfaceMuted,
      borderRadius: theme.radius.sm,
      overflow: 'hidden',
    },
    fill: {
      height: '100%',
      backgroundColor: theme.colors.primary,
    },
    milestone: {
      position: 'absolute',
      top: -theme.spacing.xs,
      width: 8,
      height: 8,
      borderRadius: theme.radius.pill,
      backgroundColor: theme.colors.accent,
      transform: [{ translateX: -4 }],
    },
  }),
);

export default ProgressBar;
