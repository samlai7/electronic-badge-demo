import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { File, Paths } from 'expo-file-system';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '../components/AppHeader';
import {
  DEFAULT_CARD_DATA,
  type CardData,
  validateEmployeeId,
  validateName,
} from '../models/card';

type EditCardScreenProps = {
  cardData: CardData;
  onCancel: () => void;
  onSave: (data: CardData) => Promise<void>;
};

type FieldErrors = {
  name?: string;
  employeeId?: string;
};

export function EditCardScreen({ cardData, onCancel, onSave }: EditCardScreenProps) {
  const [draft, setDraft] = useState<CardData>(cardData);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }

    ImagePicker.getPendingResultAsync().then((result) => {
      if (result && 'canceled' in result && !result.canceled) {
        persistSelectedImage(result.assets[0].uri).then((avatarUri) => {
          setDraft((current) => ({ ...current, avatarUri }));
        });
      }
    });
  }, []);

  const persistSelectedImage = async (sourceUri: string): Promise<string> => {
    const source = new File(sourceUri);
    const destination = new File(Paths.document, 'demo-badge-avatar.jpg');
    await source.copy(destination, { overwrite: true });
    return destination.uri;
  };

  const choosePhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Photo permission needed',
        'Allow photo access to choose an image for this local visual demo.',
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 5],
      mediaTypes: ['images'],
      quality: 0.9,
    });

    if (!result.canceled) {
      try {
        const avatarUri = await persistSelectedImage(result.assets[0].uri);
        setDraft((current) => ({ ...current, avatarUri }));
      } catch {
        Alert.alert('Photo not saved', 'Please choose a different image and try again.');
      }
    }
  };

  const validate = (): boolean => {
    const nextErrors: FieldErrors = {};
    const nameError = validateName(draft.name);
    const employeeIdError = validateEmployeeId(draft.employeeId);

    if (nameError) nextErrors.name = nameError;
    if (employeeIdError) nextErrors.employeeId = employeeIdError;

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const save = async () => {
    if (!validate()) return;

    setIsSaving(true);
    try {
      await onSave({
        avatarUri: draft.avatarUri,
        employeeId: draft.employeeId.trim().toUpperCase(),
        name: draft.name.trim(),
      });
    } catch {
      Alert.alert('Could not save', 'Your changes were not saved. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const restoreDefault = () => {
    Alert.alert('Restore demo data?', 'This replaces the current photo, name, and demo ID.', [
      { text: 'Keep editing', style: 'cancel' },
      {
        text: 'Restore',
        style: 'destructive',
        onPress: () => {
          setDraft(DEFAULT_CARD_DATA);
          setErrors({});
        },
      },
    ]);
  };

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.screen}>
      <AppHeader onBack={onCancel} title="Edit Demo Badge" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Pressable
            accessibilityLabel="Choose profile photo"
            accessibilityRole="button"
            onPress={choosePhoto}
            style={({ pressed }) => [styles.photoButton, pressed && styles.pressed]}
          >
            {draft.avatarUri ? (
              <Image resizeMode="cover" source={{ uri: draft.avatarUri }} style={styles.photo} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Ionicons color="#FFFFFF" name="person" size={76} />
              </View>
            )}
            <View style={styles.cameraBadge}>
              <Ionicons color="#FFFFFF" name="images-outline" size={19} />
            </View>
          </Pressable>
          <Text style={styles.photoHint}>Choose or change photo</Text>

          <View style={styles.formCard}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              accessibilityLabel="Name"
              autoCapitalize="words"
              maxLength={40}
              onBlur={() => setErrors((current) => ({ ...current, name: validateName(draft.name) ?? undefined }))}
              onChangeText={(name) => {
                setDraft((current) => ({ ...current, name }));
                if (errors.name) setErrors((current) => ({ ...current, name: undefined }));
              }}
              placeholder="Demo User"
              placeholderTextColor="#777383"
              selectionColor="#58D64D"
              style={[styles.input, errors.name && styles.inputError]}
              value={draft.name}
            />
            {errors.name ? <Text style={styles.error}>{errors.name}</Text> : null}

            <Text style={[styles.label, styles.secondLabel]}>Demo ID</Text>
            <TextInput
              accessibilityLabel="Demo ID"
              autoCapitalize="characters"
              autoCorrect={false}
              maxLength={20}
              onBlur={() =>
                setErrors((current) => ({
                  ...current,
                  employeeId: validateEmployeeId(draft.employeeId) ?? undefined,
                }))
              }
              onChangeText={(employeeId) => {
                setDraft((current) => ({ ...current, employeeId }));
                if (errors.employeeId) {
                  setErrors((current) => ({ ...current, employeeId: undefined }));
                }
              }}
              placeholder="00000001"
              placeholderTextColor="#777383"
              selectionColor="#58D64D"
              style={[styles.input, errors.employeeId && styles.inputError]}
              value={draft.employeeId}
            />
            {errors.employeeId ? <Text style={styles.error}>{errors.employeeId}</Text> : null}
            <Text style={styles.helper}>4–20 letters or numbers. Used only to draw the demo barcode.</Text>
          </View>

          <Pressable
            accessibilityRole="button"
            disabled={isSaving}
            onPress={save}
            style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed, isSaving && styles.disabled]}
          >
            <Text style={styles.primaryButtonText}>{isSaving ? 'Saving…' : 'Save changes'}</Text>
          </Pressable>

          <View style={styles.secondaryActions}>
            <Pressable
              accessibilityRole="button"
              onPress={onCancel}
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
            >
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={restoreDefault}
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
            >
              <Text style={styles.restoreText}>Restore demo</Text>
            </Pressable>
          </View>

          <Text style={styles.privacyNote}>
            Stored only on this device. No access system, NFC, identity verification, attendance, or payment service is connected.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#28263A',
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    paddingBottom: 32,
    paddingHorizontal: 24,
    paddingTop: 27,
  },
  photoButton: {
    borderColor: 'rgba(255, 255, 255, 0.78)',
    borderRadius: 58,
    borderWidth: 2,
    height: 116,
    position: 'relative',
    width: 116,
  },
  photo: {
    borderRadius: 56,
    height: '100%',
    width: '100%',
  },
  photoPlaceholder: {
    alignItems: 'center',
    backgroundColor: '#9B9BA8',
    borderRadius: 56,
    flex: 1,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  cameraBadge: {
    alignItems: 'center',
    backgroundColor: '#4FD145',
    borderColor: '#28263A',
    borderRadius: 18,
    borderWidth: 3,
    bottom: -2,
    height: 36,
    justifyContent: 'center',
    position: 'absolute',
    right: -2,
    width: 36,
  },
  photoHint: {
    color: '#DCD9E7',
    fontSize: 14,
    marginBottom: 24,
    marginTop: 10,
  },
  formCard: {
    backgroundColor: '#353247',
    borderColor: 'rgba(255, 255, 255, 0.09)',
    borderRadius: 16,
    borderWidth: 1,
    maxWidth: 430,
    padding: 18,
    width: '100%',
  },
  label: {
    color: '#F8F7FC',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  secondLabel: {
    marginTop: 18,
  },
  input: {
    backgroundColor: '#211F30',
    borderColor: '#5E5A70',
    borderRadius: 10,
    borderWidth: 1,
    color: '#FFFFFF',
    fontSize: 17,
    height: 50,
    paddingHorizontal: 14,
  },
  inputError: {
    borderColor: '#FF7C83',
  },
  error: {
    color: '#FF9DA2',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 6,
  },
  helper: {
    color: '#B8B4C5',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 7,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#50D246',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    marginTop: 22,
    maxWidth: 430,
    width: '100%',
  },
  primaryButtonText: {
    color: '#10200F',
    fontSize: 17,
    fontWeight: '700',
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
    maxWidth: 430,
    width: '100%',
  },
  secondaryButton: {
    alignItems: 'center',
    borderColor: '#5D596C',
    borderRadius: 11,
    borderWidth: 1,
    flex: 1,
    height: 48,
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#F2F0F8',
    fontSize: 15,
    fontWeight: '600',
  },
  restoreText: {
    color: '#FFB0B4',
    fontSize: 15,
    fontWeight: '600',
  },
  privacyNote: {
    color: '#AAA6B6',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 20,
    maxWidth: 410,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.67,
  },
  disabled: {
    opacity: 0.55,
  },
});
