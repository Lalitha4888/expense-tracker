export type Theme = {
  bg: string;
  text: string;
  card: string;
  border: string;
  danger: string;
};

export const lightTheme: Theme = {
  bg: '#f2f2f7',
  text: '#1c1c1e',
  card: '#ffffff',
  border: '#e0e0e5',
  danger: '#ff3b30',
};

export const darkTheme: Theme = {
  bg: '#000000',
  text: '#f2f2f7',
  card: '#1c1c1e',
  border: '#303033',
  danger: '#ff453a',
};
