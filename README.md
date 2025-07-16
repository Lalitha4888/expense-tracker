# 💰 Expense Tracker App (React Native + Zustand + Dark Mode)

A simple yet powerful Expense Tracker app built with **React Native**, using **Zustand** for state management and **AsyncStorage** for local data persistence.

## ✨ Features

- 💸 Add, Edit, and Delete Expenses
- 📅 Select expense date via calendar
- 🏷️ Choose category for each expense
- 📊 Analytics view with Pie Chart (react-native-chart-kit)
- 🌓 Dark Mode Toggle (using ThemeContext)
- 📦 Data persisted locally using AsyncStorage
- 📱 Mobile Responsive Design
- 🚀 Built with clean folder structure and TypeScript

## 📸 Screenshots

(Add screenshots here if needed)

## 📁 Folder Structure

expense-tracker-app/
├── assets/
├── components/
├── navigation/
├── screens/
│ ├── AddExpenseScreen.tsx
│ ├── AnalyticsScreen.tsx
│ └── HomeScreen.tsx
├── store/
│ └── expenseStore.ts
├── themes/
│ ├── colors.ts
│ └── ThemeContext.tsx
├── App.tsx
├── README.md
└── ...

## 🛠️ Tech Stack

- React Native
- Zustand
- TypeScript
- AsyncStorage
- react-native-chart-kit
- react-navigation
- react-native-picker-select
- react-native-swipe-list-view

## 📦 Installation

```bash
git clone https://github.com/Lalitha4888/expense-tracker-app.git
cd expense-tracker-app
npm install
npx expo start
