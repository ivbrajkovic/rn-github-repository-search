import { Ionicons } from '@expo/vector-icons';
import { ComponentProps, PropsWithChildren } from 'react';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

type ButtonIconProps = ComponentProps<typeof Ionicons> & {
  isSelected?: boolean;
};

const ButtonIcon = (props: ButtonIconProps) => {
  const style = useUnistyles();
  return (
    <Ionicons
      {...props}
      size={14}
      color={props.isSelected ? style.theme.colors.white : style.theme.colors.primary}
    />
  );
};

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
        <ButtonIcon isSelected={isSelected} name={other.icon} size={14} />
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
  text: (isSelected: boolean) => ({
    color: isSelected ? theme.colors.white : theme.colors.text,
    fontSize: {
      xs: theme.typography.fontSizes.xs,
      md: theme.typography.fontSizes.md,
    },
  }),
}));
