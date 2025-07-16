// navigationTypes.ts
export type RootStackParamList = {
  Home: undefined;
  AddExpense: undefined;
  EditExpense: { id: string }; // ← Add this line
  Chart: undefined;
};

