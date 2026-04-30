import React, { useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useCategoryStore } from '../../stores/categoryStore';
import { Category } from '../../../domain/entities/Category';

type Props = {
  visible: boolean;
  selectedId: number | null;
  onSelect: (category: Category) => void;
  onClose: () => void;
};

export function CategoryPickerModal({ visible, selectedId, onSelect, onClose }: Props) {
  const { categories, load } = useCategoryStore();

  useEffect(() => {
    if (visible && categories.length === 0) load();
  }, [visible, categories.length, load]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Kategorie wählen</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeBtn}>Fertig</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={categories}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.row, item.id === selectedId && styles.rowSelected]}
              onPress={() => {
                onSelect(item);
                onClose();
              }}
            >
              {item.parentId && <Text style={styles.indent}> </Text>}
              <Text style={[styles.rowText, item.id === selectedId && styles.rowTextSelected]}>
                {item.name}
              </Text>
              {item.id === selectedId && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  title: { fontSize: 17, fontWeight: '600', color: '#111827' },
  closeBtn: { fontSize: 16, color: '#3B82F6', fontWeight: '600' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  rowSelected: { backgroundColor: '#EFF6FF' },
  indent: { color: '#6B7280' },
  rowText: { flex: 1, fontSize: 15, color: '#111827' },
  rowTextSelected: { color: '#3B82F6', fontWeight: '600' },
  checkmark: { fontSize: 16, color: '#3B82F6' },
  separator: { height: StyleSheet.hairlineWidth, backgroundColor: '#E5E7EB', marginLeft: 16 },
});
