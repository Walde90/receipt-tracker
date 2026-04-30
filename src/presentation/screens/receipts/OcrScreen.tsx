import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { claudeReceiptService } from '../../../data/services/ClaudeReceiptService';
import { ParsedReceipt, ParsedLineItem } from '../../../data/services/OcrParserService';
import { CategoryPickerModal } from '../../components/shared/CategoryPickerModal';
import { Category } from '../../../domain/entities/Category';

type CategoryMap = Record<number, Category>;

export function OcrScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [result, setResult] = useState<ParsedReceipt | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryMap, setCategoryMap] = useState<CategoryMap>({});
  const [pickerItemIndex, setPickerItemIndex] = useState<number | null>(null);

  const pickImage = async (fromCamera: boolean) => {
    const permission = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Berechtigung fehlt', 'Bitte erlaube den Zugriff in den Einstellungen.');
      return;
    }

    const pickerResult = fromCamera
      ? await ImagePicker.launchCameraAsync({ quality: 0.8 })
      : await ImagePicker.launchImageLibraryAsync({ quality: 0.8 });

    if (pickerResult.canceled) return;

    const uri = pickerResult.assets[0].uri;
    setImageUri(uri);
    setResult(null);
    setCategoryMap({});
    await analyze(uri);
  };

  const analyze = async (uri: string) => {
    setIsLoading(true);
    try {
      const parsed = await claudeReceiptService.parseReceiptImage(uri);
      setResult(parsed);
    } catch (e) {
      Alert.alert('Fehler', e instanceof Error ? e.message : 'Unbekannter Fehler');
    } finally {
      setIsLoading(false);
    }
  };

  const assignCategory = (itemIndex: number, category: Category) => {
    setCategoryMap((prev) => ({ ...prev, [itemIndex]: category }));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.actionButton} onPress={() => pickImage(true)}>
          <Text style={styles.actionButtonIcon}>📷</Text>
          <Text style={styles.actionButtonLabel}>Kamera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => pickImage(false)}>
          <Text style={styles.actionButtonIcon}>🖼️</Text>
          <Text style={styles.actionButtonLabel}>Galerie</Text>
        </TouchableOpacity>
      </View>

      {imageUri && <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="contain" />}

      {isLoading && (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Claude liest den Bon aus…</Text>
        </View>
      )}

      {result && !isLoading && (
        <View style={styles.resultBox}>
          <Text style={styles.storeName}>{result.storeName}</Text>

          {result.items.map((item, index) => (
            <LineItemRow
              key={index}
              item={item}
              category={categoryMap[index] ?? null}
              onCategoryPress={() => setPickerItemIndex(index)}
            />
          ))}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Gesamt</Text>
            <Text style={styles.totalAmount}>
              {result.totalAmount.toFixed(2).replace('.', ',')} €
            </Text>
          </View>
        </View>
      )}

      {!imageUri && !isLoading && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🧾</Text>
          <Text style={styles.emptyText}>
            Fotografiere einen Kassenzettel oder wähle ein Bild aus der Galerie.
          </Text>
        </View>
      )}

      <CategoryPickerModal
        visible={pickerItemIndex !== null}
        selectedId={pickerItemIndex !== null ? (categoryMap[pickerItemIndex]?.id ?? null) : null}
        onSelect={(cat) => {
          if (pickerItemIndex !== null) assignCategory(pickerItemIndex, cat);
        }}
        onClose={() => setPickerItemIndex(null)}
      />
    </ScrollView>
  );
}

function LineItemRow({
  item,
  category,
  onCategoryPress,
}: {
  item: ParsedLineItem;
  category: Category | null;
  onCategoryPress: () => void;
}) {
  return (
    <View style={[styles.itemRow, item.isDiscount && styles.itemRowDiscount]}>
      <View style={styles.itemLeft}>
        <Text style={styles.itemName}>{item.rawName}</Text>
        {item.quantity > 1 && (
          <Text style={styles.itemMeta}>
            {item.quantity}x à {item.unitPrice.toFixed(2).replace('.', ',')} €
          </Text>
        )}
        <TouchableOpacity onPress={onCategoryPress} style={styles.categoryBtn}>
          <Text style={[styles.categoryBtnText, category && styles.categoryBtnActive]}>
            {category ? category.name : '+ Kategorie'}
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={[styles.itemPrice, item.isDiscount && styles.discountPrice]}>
        {item.isDiscount ? '- ' : ''}
        {item.totalPrice.toFixed(2).replace('.', ',')} €
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { padding: 16, gap: 12 },
  buttonRow: { flexDirection: 'row', gap: 12 },
  actionButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  actionButtonIcon: { fontSize: 32 },
  actionButtonLabel: { fontSize: 14, fontWeight: '600', color: '#374151' },
  preview: { width: '100%', height: 200, borderRadius: 12, backgroundColor: '#E5E7EB' },
  loadingBox: { alignItems: 'center', padding: 32, gap: 12 },
  loadingText: { color: '#6B7280', fontSize: 14 },
  resultBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  storeName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F3F4F6',
  },
  itemRowDiscount: { backgroundColor: '#FFF7ED' },
  itemLeft: { flex: 1, gap: 4 },
  itemName: { fontSize: 14, color: '#111827' },
  itemMeta: { fontSize: 12, color: '#6B7280' },
  categoryBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginTop: 2,
  },
  categoryBtnText: { fontSize: 11, color: '#9CA3AF' },
  categoryBtnActive: { color: '#3B82F6', fontWeight: '600' },
  itemPrice: { fontSize: 14, fontWeight: '600', color: '#111827', marginTop: 2 },
  discountPrice: { color: '#10B981' },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  totalLabel: { fontSize: 15, fontWeight: '700', color: '#111827' },
  totalAmount: { fontSize: 15, fontWeight: '700', color: '#111827' },
  emptyState: { alignItems: 'center', paddingVertical: 48, gap: 12 },
  emptyIcon: { fontSize: 48 },
  emptyText: { color: '#6B7280', fontSize: 14, textAlign: 'center', lineHeight: 20 },
});
