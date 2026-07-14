import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '../components/AppHeader';
import { ElectronicCard } from '../components/ElectronicCard';
import { TimeBanner } from '../components/TimeBanner';
import type { CardData } from '../models/card';

type CardScreenProps = {
  cardData: CardData;
  onBack: () => void;
  onEdit: () => void;
};

const DISCLAIMER =
  'Visual demo only. Not an identity credential, access pass, attendance card, or payment card.';

export function CardScreen({ cardData, onBack, onEdit }: CardScreenProps) {
  const { height, width } = useWindowDimensions();
  const horizontalPadding = width < 360 ? 18 : 24;
  const maxContentWidth = Math.min(width - horizontalPadding * 2, 350);
  const cardWidth = Math.min(maxContentWidth, width * 0.74, height < 700 ? 266 : 295);

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.screen}>
      <AppHeader actionLabel="Edit demo badge" onAction={onEdit} onBack={onBack} title="Demo Badge" />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingHorizontal: horizontalPadding }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.timeContainer, { width: cardWidth }]}>
          <TimeBanner />
        </View>

        <ElectronicCard cardData={cardData} width={cardWidth} />

        <Text style={[styles.disclaimer, { maxWidth: 365 }]}>{DISCLAIMER}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#28263A',
    flex: 1,
  },
  content: {
    alignItems: 'center',
    flexGrow: 1,
    paddingBottom: 28,
    paddingTop: 55,
  },
  timeContainer: {
    marginBottom: 9,
    width: '100%',
  },
  disclaimer: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: -0.1,
    lineHeight: 15.5,
    marginTop: 4,
    paddingHorizontal: 1,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
