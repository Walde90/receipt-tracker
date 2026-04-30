import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useCategoryStore } from '../../stores/categoryStore';
import { CategoryTreeItem } from '../../components/shared/CategoryTreeItem';
import { CategoryTree } from '../../../domain/entities/Category';

type Props = {
  navigation: any;
};

export function CategoryManagerScreen({ navigation }: Props) {
  const { tree, isLoading, error, load, remove } = useCategoryStore();

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = useCallback(
    (id: number) => {
      Alert.alert('Kategorie löschen', 'Wirklich löschen?', [
        { text: 'Abbrechen', style: 'cancel' },
        { text: 'Löschen', style: 'destructive', onPress: () => remove(id) },
      ]);
    },
    [remove]
  );

  const handleEdit = useCallback(
    (id: number) => {
      navigation.navigate('AddEditCategory', { categoryId: id });
    },
    [navigation]
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tree}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }: { item: CategoryTree }) => (
          <CategoryTreeItem
            node={item}
            depth={0}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>Noch keine Kategorien.</Text>
          </View>
        }
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddEditCategory', { categoryId: null })}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { color: '#EF4444', fontSize: 14 },
  emptyText: { color: '#6B7280', fontSize: 14 },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 32 },
});
