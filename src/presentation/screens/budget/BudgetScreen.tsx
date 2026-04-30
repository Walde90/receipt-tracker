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
import { useBudgetStore } from '../../stores/budgetStore';
import { BudgetEntry } from '../../../domain/entities/Budget';

const MONTH_LABELS: Record<string, string> = {
  '01': 'Januar',
  '02': 'Februar',
  '03': 'März',
  '04': 'April',
  '05': 'Mai',
  '06': 'Juni',
  '07': 'Juli',
  '08': 'August',
  '09': 'September',
  '10': 'Oktober',
  '11': 'November',
  '12': 'Dezember',
};

function formatMonth(month: string): string {
  const [year, m] = month.split('-');
  return `${MONTH_LABELS[m] ?? m} ${year}`;
}

function formatAmount(amount: number): string {
  return `${amount.toFixed(2).replace('.', ',')} €`;
}

type Props = { navigation: any };

export function BudgetScreen({ navigation }: Props) {
  const { entries, report, selectedMonth, isLoading, load, remove, confirm, setMonth } =
    useBudgetStore();

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = useCallback(
    (id: number) => {
      Alert.alert('Eintrag löschen', 'Wirklich löschen?', [
        { text: 'Abbrechen', style: 'cancel' },
        { text: 'Löschen', style: 'destructive', onPress: () => remove(id) },
      ]);
    },
    [remove]
  );

  const handleConfirm = useCallback(
    (id: number) => {
      Alert.alert('Betrag bestätigen', 'Als manuell bestätigt markieren?', [
        { text: 'Abbrechen', style: 'cancel' },
        { text: 'Bestätigen', onPress: () => confirm(id, 'manual_confirm') },
      ]);
    },
    [confirm]
  );

  const changeMonth = (direction: number) => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const date = new Date(year, month - 1 + direction);
    const newMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    setMonth(newMonth);
  };

  const income = entries.filter((e) => e.type === 'income');
  const expenses = entries.filter((e) => e.type !== 'income');
  const suspicious = expenses.filter((e) => !e.isConfirmed);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.monthSelector}>
        <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.monthArrow}>
          <Text style={styles.monthArrowText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.monthLabel}>{formatMonth(selectedMonth)}</Text>
        <TouchableOpacity onPress={() => changeMonth(1)} style={styles.monthArrow}>
          <Text style={styles.monthArrowText}>›</Text>
        </TouchableOpacity>
      </View>

      {report && (
        <View style={styles.summary}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Einnahmen</Text>
            <Text style={[styles.summaryAmount, styles.income]}>
              {formatAmount(report.totalIncome)}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Ausgaben</Text>
            <Text style={[styles.summaryAmount, styles.expense]}>
              {formatAmount(report.totalExpenses)}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Bilanz</Text>
            <Text
              style={[
                styles.summaryAmount,
                report.totalIncome - report.totalExpenses >= 0 ? styles.income : styles.expense,
              ]}
            >
              {formatAmount(report.totalIncome - report.totalExpenses)}
            </Text>
          </View>
        </View>
      )}

      {suspicious.length > 0 && (
        <View style={styles.suspiciousBanner}>
          <Text style={styles.suspiciousText}>
            ⚠️ {suspicious.length} unbestätigte Ausgabe{suspicious.length > 1 ? 'n' : ''}
          </Text>
        </View>
      )}

      <FlatList
        data={[...income, ...expenses]}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }: { item: BudgetEntry }) => (
          <BudgetEntryRow entry={item} onDelete={handleDelete} onConfirm={handleConfirm} />
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>Noch keine Einträge für diesen Monat.</Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddBudgetEntry')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

function BudgetEntryRow({
  entry,
  onDelete,
  onConfirm,
}: {
  entry: BudgetEntry;
  onDelete: (id: number) => void;
  onConfirm: (id: number) => void;
}) {
  const isSuspicious = entry.type !== 'income' && !entry.isConfirmed;
  const isIncome = entry.type === 'income';

  return (
    <View style={[styles.entryRow, isSuspicious && styles.entryRowSuspicious]}>
      <View style={styles.entryLeft}>
        {isSuspicious && <Text style={styles.suspiciousIcon}>⚠️ </Text>}
        <View>
          <Text style={styles.entryLabel}>{entry.label}</Text>
          <Text style={styles.entryType}>
            {entry.type === 'income'
              ? 'Einnahme'
              : entry.type === 'fixed_expense'
                ? 'Fixkosten'
                : 'Variable Kosten'}
            {entry.recurrence === 'monthly' ? ' · monatlich' : ''}
          </Text>
        </View>
      </View>
      <View style={styles.entryRight}>
        <Text style={[styles.entryAmount, isIncome ? styles.income : styles.expense]}>
          {isIncome ? '+' : '-'} {entry.amount.toFixed(2).replace('.', ',')} €
        </Text>
        <View style={styles.entryActions}>
          {isSuspicious && (
            <TouchableOpacity onPress={() => onConfirm(entry.id)} style={styles.actionBtn}>
              <Text style={styles.confirmText}>✓</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => onDelete(entry.id)} style={styles.actionBtn}>
            <Text style={styles.deleteText}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyText: { color: '#6B7280', fontSize: 14, textAlign: 'center' },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  monthArrow: { padding: 8 },
  monthArrowText: { fontSize: 24, color: '#3B82F6' },
  monthLabel: { fontSize: 17, fontWeight: '600', color: '#111827' },
  summary: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryLabel: { fontSize: 11, color: '#6B7280', marginBottom: 2 },
  summaryAmount: { fontSize: 15, fontWeight: '700' },
  income: { color: '#10B981' },
  expense: { color: '#EF4444' },
  suspiciousBanner: {
    backgroundColor: '#FEF3C7',
    padding: 10,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#FCD34D',
  },
  suspiciousText: { color: '#92400E', fontSize: 13, fontWeight: '600' },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    marginHorizontal: 12,
    marginTop: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  entryRowSuspicious: { borderColor: '#FCD34D', backgroundColor: '#FFFBEB' },
  entryLeft: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  suspiciousIcon: { fontSize: 14 },
  entryLabel: { fontSize: 15, color: '#111827', fontWeight: '500' },
  entryType: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  entryRight: { alignItems: 'flex-end', gap: 4 },
  entryAmount: { fontSize: 15, fontWeight: '700' },
  entryActions: { flexDirection: 'row', gap: 8 },
  actionBtn: { padding: 4 },
  confirmText: { fontSize: 16, color: '#10B981', fontWeight: '700' },
  deleteText: { fontSize: 16, color: '#EF4444' },
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
