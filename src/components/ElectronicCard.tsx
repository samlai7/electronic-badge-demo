import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, View } from 'react-native';
import Barcode from 'react-native-barcode-svg';

import type { CardData } from '../models/card';

type ElectronicCardProps = {
  cardData: CardData;
  width: number;
};

export function ElectronicCard({ cardData, width }: ElectronicCardProps) {
  const height = width / 0.66;
  const scale = width / 340;
  const nameFontSize = cardData.name.length > 18 ? 19 : cardData.name.length > 12 ? 22 : 27;

  return (
    <View
      accessibilityLabel={`Visual demo badge for ${cardData.name}, demo ID ${cardData.employeeId}. Not a real credential.`}
      style={[styles.card, { height, width }]}
    >
      <View
        style={[
          styles.brandMark,
          {
            height: 76 * scale,
            left: 17 * scale,
            top: 27 * scale,
            width: 68 * scale,
          },
        ]}
      >
        <View
          style={[
            styles.brandMarkIcon,
            { borderRadius: 10 * scale, height: 44 * scale, width: 44 * scale },
          ]}
        >
          <Text style={[styles.brandMarkLetters, { fontSize: 17 * scale }]}>DB</Text>
        </View>
        <Text style={[styles.brandMarkLabel, { fontSize: 9 * scale }]}>DEMO</Text>
      </View>

      <View style={[styles.verticalLabelSlot, { left: -60 * scale, top: 226 * scale, width: 220 * scale }]}>
        <Text style={[styles.verticalLabel, { fontSize: 25 * scale, letterSpacing: 1.1 * scale }]}>
          DEMO BADGE
        </Text>
      </View>

      <View
        style={[
          styles.photoFrame,
          {
            height: 278 * scale,
            left: 98 * scale,
            top: 53 * scale,
            width: 218 * scale,
          },
        ]}
      >
        {cardData.avatarUri ? (
          <Image resizeMode="cover" source={{ uri: cardData.avatarUri }} style={styles.photo} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <View style={[styles.avatarCircle, { height: 124 * scale, width: 124 * scale }]}>
              <Ionicons color="#FFFFFF" name="person" size={93 * scale} />
            </View>
            <Text style={[styles.demoLabel, { fontSize: 11 * scale }]}>DEMO PHOTO</Text>
          </View>
        )}
      </View>

      <View
        style={[
          styles.identityBlock,
          {
            left: 91 * scale,
            right: 18 * scale,
            top: 338 * scale,
          },
        ]}
      >
        <Text
          adjustsFontSizeToFit
          minimumFontScale={0.76}
          numberOfLines={1}
          style={[styles.name, { fontSize: nameFontSize * scale, lineHeight: 33 * scale }]}
        >
          {cardData.name}
        </Text>
        <Text
          adjustsFontSizeToFit
          minimumFontScale={0.82}
          numberOfLines={1}
          style={[styles.employeeId, { fontSize: 19 * scale, lineHeight: 27 * scale, marginTop: 12 * scale }]}
        >
          {cardData.employeeId}
        </Text>
        <View style={[styles.barcode, { height: 51 * scale, marginTop: 4 * scale }]}>
          <Barcode
            backgroundColor="#F9F5F7"
            format="CODE128"
            height={49 * scale}
            lineColor="#101010"
            maxWidth={210 * scale}
            singleBarWidth={1.75 * scale}
            value={`DEMO-${cardData.employeeId}`}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F9F5F7',
    borderColor: 'rgba(255, 255, 255, 0.75)',
    borderRadius: 13,
    borderWidth: 1,
    elevation: 4,
    overflow: 'hidden',
    shadowColor: '#05040B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.34,
    shadowRadius: 6,
  },
  brandMark: {
    alignItems: 'center',
    position: 'absolute',
  },
  brandMarkIcon: {
    alignItems: 'center',
    backgroundColor: '#5652D6',
    justifyContent: 'center',
  },
  brandMarkLetters: {
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  brandMarkLabel: {
    color: '#37334A',
    fontWeight: '800',
    letterSpacing: 1.2,
    marginTop: 3,
  },
  verticalLabelSlot: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    transform: [{ rotate: '90deg' }],
  },
  verticalLabel: {
    color: '#161316',
    fontWeight: '700',
    textAlign: 'center',
  },
  photoFrame: {
    backgroundColor: '#D9DBE2',
    overflow: 'hidden',
    position: 'absolute',
  },
  photo: {
    height: '100%',
    width: '100%',
  },
  avatarPlaceholder: {
    alignItems: 'center',
    backgroundColor: '#D8DAE0',
    flex: 1,
    justifyContent: 'center',
  },
  avatarCircle: {
    alignItems: 'center',
    backgroundColor: '#A3A7B3',
    borderRadius: 999,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  demoLabel: {
    bottom: 10,
    color: '#6E727E',
    fontWeight: '700',
    letterSpacing: 1.2,
    position: 'absolute',
  },
  identityBlock: {
    alignItems: 'center',
    position: 'absolute',
  },
  name: {
    color: '#111013',
    fontWeight: '400',
    letterSpacing: -0.45,
    textAlign: 'center',
    width: '100%',
  },
  employeeId: {
    color: '#111013',
    fontVariant: ['tabular-nums'],
    fontWeight: '400',
    letterSpacing: 0.45,
    textAlign: 'center',
    width: '100%',
  },
  barcode: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    width: '100%',
  },
});
