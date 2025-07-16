import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

import { useExpenseStore, Category } from '../store/expenseStore';
import type { RootStackParamList } from '../navigationTypes';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Nav = NativeStackNavigationProp<RootStackParamList, 'AddExpense'>;

/* Categories that exactly match the Category union type */
const categories: Category[] = ['Food', 'Transport', 'Shopping', 'Bills', 'Other'];

export default function AddExpenseScreen() {
  const nav = useNavigation<Nav>();
  const addExpense = useExpenseStore((s) => s.addExpense);
  const setFilter  = useExpenseStore((s) => s.setFilter); // reset filters after save

  /* Form state */
  const [title, setTitle]         = useState('');
  const [amount, setAmount]       = useState('');
  const [category, setCategory]   = useState<Category>('Food');
  const [date, setDate]           = useState<Date>(new Date());
  const [showDate, setShowDate]   = useState(false);

  const handleSave = () => {
    if (!title || !amount) return;

    addExpense({
      id: Date.now().toString(),
      title,
      amount: parseFloat(amount),
      category,
      date: date.toISOString(),
    });

    /* Ensure Home shows the new item */
    setFilter({ range: 'all' });

    nav.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.label}>Title</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Expense Title"
        style={styles.input}
      />

      {/* Amount */}
      <Text style={styles.label}>Amount</Text>
      <TextInput
        value={amount}
        onChangeText={setAmount}
        placeholder="0"
        keyboardType="numeric"
        style={styles.input}
      />

      {/* Category */}
      <Text style={styles.label}>Category</Text>
      <Picker
        selectedValue={category}
        onValueChange={(val) => setCategory(val as Category)}
        style={styles.input}
      >
        {categories.map((cat) => (
          <Picker.Item label={cat} value={cat} key={cat} />
        ))}
      </Picker>

      {/* Date */}
      <Text style={styles.label}>Date</Text>
      <Button title={date.toDateString()} onPress={() => setShowDate(true)} />
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

      {/* Save */}
      <View style={{ marginTop: 20 }}>
        <Button title="Save Expense" onPress={handleSave} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label:     { marginTop: 10, fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
});
