import React, { useMemo } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useExpenseStore } from '../store/expenseStore';

const screenW = Dimensions.get('window').width;
const PALETTE = [
  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
  '#FF9F40', '#8DD1E1', '#D4A5A5', '#A3DE83', '#C9CBCF'
];

export default function ChartScreen() {
  /* subscribe directly to expenses so chart updates after add/delete */
  const expenses = useExpenseStore(s => s.expenses);
  const filter   = useExpenseStore(s => s.filter);

  /* compute filtered list the same way HomeScreen does */
  const filtered = useMemo(() => {
    const now = new Date();
    return expenses.filter(e => {
      const catOK = !filter.category || e.category === filter.category;
      if (filter.range === 'all') return catOK;

      const d   = new Date(e.date);
      const diff= (now.valueOf() - d.valueOf()) / 86_400_000;
      const rangeOK =
        (filter.range === 'day'  && diff < 1) ||
        (filter.range === 'week' && diff < 7) ||
        (filter.range === 'month' &&
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear());
      return catOK && rangeOK;
    });
  }, [expenses, filter]);

  /* build chart sums */
  const chartData = useMemo(() => {
    const sums: Record<string, number> = {};
    filtered.forEach(e => {
      sums[e.category] = (sums[e.category] || 0) + e.amount;
    });
    const cats = Object.keys(sums);
    return cats.map((cat, i) => ({
      name:             cat,
      amount:           sums[cat],
      color:            PALETTE[i % PALETTE.length],
      legendFontColor:  '#333',
      legendFontSize:   13,
    }));
  }, [filtered]);

  /* no data case */
  if (chartData.length === 0) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>No expenses match the current filters.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <PieChart
        data={chartData as any}
        accessor="amount"
        width={screenW - 40}
        height={260}
        absolute
        chartConfig={{
          backgroundGradientFrom: '#fff',
          backgroundGradientTo:   '#fff',
          decimalPlaces: 0,
          color: () => '#000',
        }}
        paddingLeft="15"
        backgroundColor="transparent"
      />
    </View>
  );
}
