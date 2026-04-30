import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Switch,
} from 'react-native';
import { useBudgetStore } from '../../stores/budgetStore';
import { BudgetEntryType, Recurrence } from '../../../domain/entities/Budget';

type Props = { navigation: any };

const TYPE_OPTIONS: { value: BudgetEntryType; label: string }[] = [
  { value: 'income', label: 'Einnahme' },
  { value: 'fixed_expense', label: 'Fixkosten' },
  { value: 'variable_expense', label: 'Variable Kosten' },
];

export function AddBudgetEntryScreen({ navigation }: Props) {
  const { selectedMonth, create } = useBudgetStore();

  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<BudgetEntryType>('fixed_expense');
  const [isMonthly, setIsMonthly] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!label.trim()) {
      Alert.alert('Fehler', 'Bitte eine Bezeichnung eingeben.');
      return;
    }
    const parsedAmount = parseFloat(amount.replace(',', '.'));
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Fehler', 'Bitte einen gültigen Betrag eingeben.');
      return;
    }

    setIsSaving(true);
    try {
      await create({
        month: selectedMonth,
        type,
        label: label.trim(),
        amount: parsedAmount,
        categoryId: null,
        isConfirmed: type === 'income',
        confirmationSource: type === 'income' ? 'manual_confirm' : null,
        recurrence: isMonthly ? 'monthly' : 'once',
      });
      navigation.goBack();
    } catch {
      Alert.alert('Fehler', 'Speichern fehlgeschlagen.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Bezeichnung</Text>
      <TextInput
        style={styles.input}
        value={label}
        onChangeText={setLabel}
        placeholder="z.B. Miete, Gehalt, Einkauf"
        autoFocus
      />

      <Text style={styles.label}>Betrag (€)</Text>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        placeholder="0,00"
        keyboardType="decimal-pad"
      />

      <Text style={styles.label}>Typ</Text>
      <View style={styles.typeRow}>
        {TYPE_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            style={[styles.typeOption, type === opt.value && styles.typeSelected]}
            onPress={() => setType(opt.value)}
          >
            <Text style={[styles.typeText, type === opt.value && styles.typeTextSelected]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Monatlich wiederholen</Text>
        <Switch value={isMonthly} onValueChange={setIsMonthly} trackColor={{ true: '#3B82F6' }} />
      </View>

      {type !== 'income' && (
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            ⚠️ Ausgaben werden als <Text style={styles.infoBold}>unbestätigt</Text> markiert bis ein
            Beleg oder Bankbeleg vorliegt.
          </Text>
        </View>
      )}

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
  typeRow: { flexDirection: 'row', gap: 8 },
  typeOption: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  typeSelected: { borderColor: '#3B82F6', backgroundColor: '#EFF6FF' },
  typeText: { fontSize: 12, color: '#374151', textAlign: 'center' },
  typeTextSelected: { color: '#3B82F6', fontWeight: '600' },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginTop: 16,
  },
  switchLabel: { fontSize: 15, color: '#374151' },
  infoBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  infoText: { fontSize: 13, color: '#92400E' },
  infoBold: { fontWeight: '700' },
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
