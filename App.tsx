import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { DEFAULT_CARD_DATA, type CardData } from './src/models/card';
import { CardScreen } from './src/screens/CardScreen';
import { EditCardScreen } from './src/screens/EditCardScreen';
import { loadCardData, saveCardData } from './src/storage/cardStorage';

export default function App() {
  const [cardData, setCardData] = useState<CardData>(DEFAULT_CARD_DATA);
  const [screen, setScreen] = useState<'card' | 'edit'>('card');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCardData()
      .then(setCardData)
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async (nextData: CardData) => {
    await saveCardData(nextData);
    setCardData(nextData);
    setScreen('card');
  };

  const handleBackFromCard = () => {
    if (Platform.OS === 'android') {
      BackHandler.exitApp();
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#54D448" />
        </View>
      ) : screen === 'card' ? (
        <CardScreen
          cardData={cardData}
          onBack={handleBackFromCard}
          onEdit={() => setScreen('edit')}
        />
      ) : (
        <EditCardScreen
          cardData={cardData}
          onCancel={() => setScreen('card')}
          onSave={handleSave}
        />
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: '#28263A',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
