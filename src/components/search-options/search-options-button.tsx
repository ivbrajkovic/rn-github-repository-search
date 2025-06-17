import { Ionicons } from '@expo/vector-icons';
import { ComponentProps, PropsWithChildren } from 'react';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

type SearchOptionsButtonProps = PropsWithChildren<{
  isSelected?: boolean;
  icon: ComponentProps<typeof Ionicons>['name'];
  label: string;
  onPress?: () => void;
}>;

export const SearchOptionsButton = ({
  isSelected = false,
  ...other
}: SearchOptionsButtonProps) => {
  return (
    <Pressable onPress={other.onPress}>
      <View style={styles.button(isSelected)}>
        <Ionicons name={other.icon} size={14} style={styles.icon(isSelected)} />
        <Text style={styles.text(isSelected)}>{other.label}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create((theme) => ({
  button: (isSelected: boolean) => ({
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,

    minWidth: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: {
      xs: theme.spacing.xs,
      md: theme.spacing.sm,
    },
    paddingHorizontal: {
      xs: theme.spacing.sm,
      md: theme.spacing.md,
    },
    paddingVertical: {
      xs: theme.spacing.xs,
      md: theme.spacing.sm,
    },
    borderRadius: theme.borderRadius.md,
    // borderWidth: 1,
    backgroundColor: isSelected ? theme.colors.primary : theme.colors.cardBackground,
    borderColor: isSelected ? theme.colors.primary : theme.colors.textSecondary,
  }),
  icon: (isSelected: boolean) => ({
    color: isSelected ? theme.colors.white : theme.colors.primary,
  }),
  text: (isSelected: boolean) => ({
    color: isSelected ? theme.colors.white : theme.colors.text,
    fontSize: {
      xs: theme.typography.fontSizes.xs,
      md: theme.typography.fontSizes.md,
    },
  }),
}));
