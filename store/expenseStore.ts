import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

/* ───── Types ───── */
export type Category = 'Food' | 'Transport' | 'Shopping' | 'Bills' | 'Other';
export type DateRange = 'all' | 'day' | 'week' | 'month';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: Category;
  date: string; // ISO
}

const STORAGE_KEY = 'expenses_v1';

/* ───── Store Interface ───── */
interface Store {
  expenses: Expense[];

  addExpense(e: Expense): void;
  deleteExpense(id: string): void;
  updateExpense(e: Expense): void;            // ← NEW

  filter: { category?: Category; range: DateRange };
  setFilter(f: Store['filter']): void;

  filtered(): Expense[];
  total(): number;
  loadFromStorage(): Promise<void>;
}

/* ───── Store Implementation ───── */
export const useExpenseStore = create<Store>((set, get) => ({
  expenses: [],

  /* add */
  addExpense: (e) => {
    const updated = [e, ...get().expenses];
    set({ expenses: updated });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  /* delete */
  deleteExpense: (id) => {
    const updated = get().expenses.filter((x) => x.id !== id);
    set({ expenses: updated });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  /* update (EDIT) */
  updateExpense: (edited) => {
    const updated = get().expenses.map((e) =>
      e.id === edited.id ? { ...e, ...edited } : e
    );
    set({ expenses: updated });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  /* filter state */
  filter: { range: 'all' },
  setFilter: (f) => set({ filter: f }),

  /* derived lists */
  filtered: () => {
    const { expenses, filter } = get();
    const now = new Date();

    return expenses.filter((e) => {
      const catOK = !filter.category || e.category === filter.category;

      if (filter.range === 'all') return catOK;

      const diff = (now.valueOf() - new Date(e.date).valueOf()) / 86_400_000;

      const rangeOK =
        (filter.range === 'day' && diff < 1) ||
        (filter.range === 'week' && diff < 7) ||
        (filter.range === 'month' &&
          new Date(e.date).getMonth() === now.getMonth() &&
          new Date(e.date).getFullYear() === now.getFullYear());

      return catOK && rangeOK;
    });
  },

  total: () =>
    get().filtered().reduce((sum, e) => sum + e.amount, 0),

  /* load saved data on app start */
  loadFromStorage: async () => {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed: Expense[] = JSON.parse(raw);
        set({ expenses: parsed });
      } catch (e) {
        console.error('Failed to parse saved expenses', e);
      }
    }
  },
}));
