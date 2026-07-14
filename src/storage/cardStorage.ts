import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  CARD_DATA_KEY,
  DEFAULT_CARD_DATA,
  type CardData,
  validateEmployeeId,
  validateName,
} from '../models/card';

const isCardData = (value: unknown): value is CardData => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<CardData>;
  return (
    typeof candidate.name === 'string' &&
    typeof candidate.employeeId === 'string' &&
    (candidate.avatarUri === null || typeof candidate.avatarUri === 'string') &&
    !validateName(candidate.name) &&
    !validateEmployeeId(candidate.employeeId)
  );
};

export const loadCardData = async (): Promise<CardData> => {
  try {
    const storedValue = await AsyncStorage.getItem(CARD_DATA_KEY);
    if (!storedValue) {
      return DEFAULT_CARD_DATA;
    }

    const parsedValue: unknown = JSON.parse(storedValue);
    return isCardData(parsedValue) ? parsedValue : DEFAULT_CARD_DATA;
  } catch {
    return DEFAULT_CARD_DATA;
  }
};

export const saveCardData = async (data: CardData): Promise<void> => {
  await AsyncStorage.setItem(CARD_DATA_KEY, JSON.stringify(data));
};
