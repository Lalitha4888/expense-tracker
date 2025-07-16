import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';

import { useExpenseStore, Category } from '../store/expenseStore';
import type { RootStackParamList } from '../navigationTypes';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Nav = NativeStackNavigationProp<RootStackParamList, 'EditExpense'>;

const categories: Category[] = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Other',
];

export default function EditExpenseScreen() {
  const nav = useNavigation<Nav>();
  const { params } = useRoute();
  const { id } = params as { id: string };

  const expense = useExpenseStore((s) =>
    s.expenses.find((e) => e.id === id)
  );
  const updateExpense = useExpenseStore((s) => s.updateExpense);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('Food');
  const [date, setDate] = useState<Date>(new Date());
  const [showDate, setShowDate] = useState(false);

  useEffect(() => {
    if (expense) {
      setTitle(expense.title);
      setAmount(String(expense.amount));
      setCategory(expense.category);
      setDate(new Date(expense.date));
    }
  }, [expense]);

  const save = () => {
    updateExpense({
      id,
      title,
      amount: parseFloat(amount),
      category,
      date: date.toISOString(),
    });
    nav.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Expense</Text>

      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Title"
        style={styles.input}
      />
      <TextInput
        value={amount}
        onChangeText={setAmount}
        placeholder="Amount"
        keyboardType="numeric"
        style={styles.input}
      />

      <RNPickerSelect
        onValueChange={(val) => setCategory(val as Category)}
        items={categories.map((c) => ({ label: c, value: c }))}
        value={category}
        style={{ inputIOS: styles.input, inputAndroid: styles.input }}
      />

      {/* Date button */}
      <TouchableOpacity onPress={() => setShowDate(true)} style={styles.dateBtn}>
        <Text style={styles.dateBtnText}>{date.toDateString()}</Text>
      </TouchableOpacity>

      {showDate && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(_, d) => {
            setShowDate(false);
            if (d) setDate(d);
          }}
        />
      )}

      <Button title="Save Changes" onPress={save} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 20, fontWeight: '600', marginBottom: 15 },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  dateBtn: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 5,
    padding: 12,
    marginBottom: 15,
    alignItems: 'center',
  },
  dateBtnText: { fontSize: 16 },
});
