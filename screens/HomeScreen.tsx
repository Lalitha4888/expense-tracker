import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { SwipeListView } from 'react-native-swipe-list-view';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
  useExpenseStore,
  Category,
  DateRange,
  Expense,
} from '../store/expenseStore';
import type { RootStackParamList } from '../App';
import { useTheme } from '../theme/ThemeContext';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const nav = useNavigation<Nav>();
  const { theme, toggle } = useTheme();

  const expenses = useExpenseStore((s) => s.expenses);
  const deleteExpense = useExpenseStore((s) => s.deleteExpense);
  const setFilterStore = useExpenseStore((s) => s.setFilter);

  const [category, setCategory] = useState<Category | undefined>(undefined);
  const [range, setRange] = useState<DateRange>('all');

  const filtered: Expense[] = useMemo(() => {
    const now = new Date();
    return expenses.filter((e) => {
      const catOK = !category || e.category === category;
      if (range === 'all') return catOK;

      const days = (now.valueOf() - new Date(e.date).valueOf()) / 86_400_000;
      const rangeOK =
        (range === 'day' && days < 1) ||
        (range === 'week' && days < 7) ||
        (range === 'month' &&
          new Date(e.date).getMonth() === now.getMonth() &&
          new Date(e.date).getFullYear() === now.getFullYear());
      return catOK && rangeOK;
    });
  }, [expenses, category, range]);

  const total = useMemo(
    () => filtered.reduce((sum, e) => sum + e.amount, 0),
    [filtered]
  );

  const applyFilter = (c: Category | undefined, r: DateRange) => {
    setCategory(c);
    setRange(r);
    setFilterStore({ category: c, range: r });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>My Expenses</Text>
        <Button title={theme.text === '#f2f2f7' ? '☀️' : '🌙'} onPress={toggle} />
      </View>

      <Text style={[styles.total, { color: theme.text }]}>Total: ₹{total}</Text>

      <View style={styles.filters}>
        <RNPickerSelect
          onValueChange={(val) => applyFilter(val || undefined, range)}
          items={[
            { label: 'All', value: '' },
            ...['Food', 'Transport', 'Shopping', 'Bills', 'Other'].map((l) => ({
              label: l,
              value: l,
            })),
          ]}
          value={category || ''}
          placeholder={{}}
          style={{ inputIOS: styles.picker, inputAndroid: styles.picker }}
        />
        <RNPickerSelect
          onValueChange={(val) => applyFilter(category, val)}
          items={[
            { label: 'All Time', value: 'all' },
            { label: 'Today', value: 'day' },
            { label: 'This Week', value: 'week' },
            { label: 'This Month', value: 'month' },
          ]}
          value={range}
          placeholder={{}}
          style={{ inputIOS: styles.picker, inputAndroid: styles.picker }}
        />
      </View>

      <SwipeListView<Expense>
        data={filtered}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.rowFront, { backgroundColor: theme.card }]}
            onPress={() => nav.navigate('EditExpense', { id: item.id })}
          >
            <Text style={{ color: theme.text, fontWeight: 'bold' }}>{item.title}</Text>
            <Text style={{ color: theme.text }}>₹{item.amount} • {item.category}</Text>
            <Text style={{ color: theme.text }}>{new Date(item.date).toLocaleDateString()}</Text>
          </TouchableOpacity>
        )}
        renderHiddenItem={(data, rowMap) => (
          <View style={[styles.rowBack, { backgroundColor: theme.danger }]}>
            <View style={{ flex: 1 }} />
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => {
                rowMap[data.index]?.closeRow();
                deleteExpense(data.item.id);
              }}
            >
              <Text style={{ color: '#fff' }}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        rightOpenValue={-120}
        disableRightSwipe
      />

      <Button title="Add Expense" onPress={() => nav.navigate('AddExpense')} />
      <View style={{ height: 10 }} />
      <Button title="Analytics" onPress={() => nav.navigate('Chart')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' },
  total: { fontSize: 18, fontWeight: '600', marginVertical: 10 },
  filters: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  picker: { borderWidth: 1, padding: 6, width: 150, fontSize: 14 },
  rowFront: {
    borderRadius: 6,
    padding: 16,
    marginBottom: 10,
    elevation: 2,
  },
  rowBack: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 6,
    marginBottom: 10,
    alignItems: 'center',
  },
  deleteBtn: {
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
});
