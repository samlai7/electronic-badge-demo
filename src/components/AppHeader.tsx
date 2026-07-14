import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type AppHeaderProps = {
  title: string;
  onBack: () => void;
  onAction?: () => void;
  actionLabel?: string;
};

export function AppHeader({ title, onBack, onAction, actionLabel = 'Edit card' }: AppHeaderProps) {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          hitSlop={10}
          onPress={onBack}
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
        >
          <Feather color="#F9F9FC" name="chevron-left" size={26} />
        </Pressable>

        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>

        {onAction ? (
          <Pressable
            accessibilityLabel={actionLabel}
            accessibilityRole="button"
            hitSlop={10}
            onPress={onAction}
            style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
          >
            <Feather color="#F9F9FC" name="more-horizontal" size={25} />
          </Pressable>
        ) : (
          <View style={styles.iconButton} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#14141A',
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#14141A',
    flexDirection: 'row',
    height: 58,
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  iconButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  pressed: {
    opacity: 0.55,
  },
  title: {
    color: '#FFFFFF',
    flex: 1,
    fontSize: 18,
    fontWeight: '400',
    letterSpacing: -0.35,
    textAlign: 'center',
  },
});
