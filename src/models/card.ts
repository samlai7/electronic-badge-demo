export type CardData = {
  name: string;
  employeeId: string;
  avatarUri: string | null;
};

export const DEFAULT_CARD_DATA: CardData = {
  name: 'Demo User',
  employeeId: '00000001',
  avatarUri: null,
};

export const CARD_DATA_KEY = '@demo-badge/profile-v1';

export const validateName = (value: string): string | null => {
  if (!value.trim()) {
    return 'Name is required.';
  }

  if (value.trim().length > 40) {
    return 'Name must be 40 characters or fewer.';
  }

  return null;
};

export const validateEmployeeId = (value: string): string | null => {
  const normalized = value.trim();

  if (!normalized) {
    return 'Demo ID is required.';
  }

  if (!/^[A-Za-z0-9]{4,20}$/.test(normalized)) {
    return 'Use 4–20 letters or numbers only.';
  }

  return null;
};
