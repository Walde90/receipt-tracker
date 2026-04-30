import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useCategoryStore } from '../../stores/categoryStore';
import { DEFAULT_CATEGORY_COLOR, DEFAULT_CATEGORY_ICON } from '../../../shared/constants';

const COLORS = [
  '#10B981', '#3B82F6', '#F59E0B', '#EF4444',
  '#8B5CF6', '#EC4899', '#6B7280', '#14B8A6',
];

type Props = {
  navigation: any;
  route: { params: { categoryId: number | null } };
};

export function AddEditCategoryScreen({ navigation, route }: Props) {
  const { categoryId } = route.params;
  const { categories, create, update, load } = useCategoryStore();

  const existing = categoryId ? categories.find((c) => c.id === categoryId) : null;

  const [name, setName] = useState(existing?.name ?? '');
  const [color, setColor] = useState(existing?.color ?? DEFAULT_CATEGORY_COLOR);
  const [parentId, setParentId] = useState<number | null>(existing?.parentId ?? null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    load();
  }, [load]);

  const rootCategories = categories.filter((c) => c.parentId === null && c.id !== categoryId);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Fehler', 'Bitte einen Namen eingeben.');
      return;
    }
    setIsSaving(true);
    try {
      if (categoryId) {
        await update(categoryId, { name: name.trim(), color, parentId });
      } else {
        await create({
          name: name.trim(),
          color,
          parentId,
          icon: DEFAULT_CATEGORY_ICON,
          sortOrder: categories.length,
        });
      }
      navigation.goBack();
    } catch {
      Alert.alert('Fehler', 'Speichern fehlgeschlagen.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="z.B. Lebensmittel"
        autoFocus
      />

      <Text style={styles.label}>Farbe</Text>
      <View style={styles.colorRow}>
        {COLORS.map((c) => (
          <TouchableOpacity
            key={c}
            style={[styles.colorOption, { backgroundColor: c }, color === c && styles.colorSelected]}
            onPress={() => setColor(c)}
          />
        ))}
      </View>

      <Text style={styles.label}>Oberkategorie (optional)</Text>
      <TouchableOpacity
        style={[styles.parentOption, parentId === null && styles.parentSelected]}
        onPress={() => setParentId(null)}
      >
        <Text style={styles.parentText}>Keine (Hauptkategorie)</Text>
      </TouchableOpacity>
      {rootCategories.map((cat) => (
        <TouchableOpacity
          key={cat.id}
          style={[styles.parentOption, parentId === cat.id && styles.parentSelected]}
          onPress={() => setParentId(cat.id)}
        >
          <View style={[styles.colorDot, { backgroundColor: cat.color }]} />
          <Text style={styles.parentText}>{cat.name}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={isSaving}
      >
        <Text style={styles.saveButtonText}>{isSaving ? 'Speichert...' : 'Speichern'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { padding: 16, gap: 8 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginTop: 16, marginBottom: 6 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
  },
  colorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  colorOption: { width: 36, height: 36, borderRadius: 18 },
  colorSelected: { borderWidth: 3, borderColor: '#111827' },
  parentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginBottom: 6,
    gap: 8,
  },
  parentSelected: { borderColor: '#3B82F6', backgroundColor: '#EFF6FF' },
  parentText: { fontSize: 14, color: '#374151' },
  colorDot: { width: 10, height: 10, borderRadius: 5 },
  saveButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonDisabled: { backgroundColor: '#93C5FD' },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
