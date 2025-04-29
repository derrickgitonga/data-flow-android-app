
import { v4 as uuidv4 } from 'uuid';

// Define types
interface User {
  id: string;
  username: string;
  password: string;
}

interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

// Mock database
let users: User[] = [];
let expenses: Expense[] = [];

// Initialize database
export const initDB = async (): Promise<void> => {
  // Load data from localStorage if available
  const storedUsers = localStorage.getItem('users');
  const storedExpenses = localStorage.getItem('expenses');
  
  if (storedUsers) {
    users = JSON.parse(storedUsers);
  }
  
  if (storedExpenses) {
    expenses = JSON.parse(storedExpenses);
  }
  
  console.log('Database initialized');
};

// Save data to localStorage
const saveData = (): void => {
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('expenses', JSON.stringify(expenses));
};

// Database service
export const dbService = {
  // User methods
  addUser: async (username: string, password: string): Promise<User> => {
    const newUser: User = {
      id: uuidv4(),
      username,
      password, // In a real app, you would hash this password
    };
    
    users.push(newUser);
    saveData();
    return newUser;
  },
  
  authenticateUser: async (username: string, password: string): Promise<User | null> => {
    const user = users.find(u => u.username === username && u.password === password);
    return user || null;
  },
  
  // Expense methods
  addExpense: async (expenseData: Omit<Expense, 'id'>): Promise<Expense> => {
    const newExpense: Expense = {
      id: uuidv4(),
      ...expenseData
    };
    
    expenses.push(newExpense);
    saveData();
    return newExpense;
  },
  
  getExpenses: async (userId: string): Promise<Expense[]> => {
    return expenses.filter(e => e.userId === userId);
  },
  
  updateExpense: async (expense: Expense): Promise<Expense | null> => {
    const index = expenses.findIndex(e => e.id === expense.id);
    if (index === -1) return null;
    
    expenses[index] = expense;
    saveData();
    return expenses[index];
  },
  
  deleteExpense: async (id: string): Promise<boolean> => {
    const initialLength = expenses.length;
    expenses = expenses.filter(e => e.id !== id);
    saveData();
    return expenses.length < initialLength;
  },
  
  // Category methods
  getCategories: async (): Promise<Category[]> => {
    return [
      { id: 'food', name: 'Food & Dining', color: '#FF5722', icon: 'utensils' },
      { id: 'transport', name: 'Transportation', color: '#2196F3', icon: 'car' },
      { id: 'shopping', name: 'Shopping', color: '#9C27B0', icon: 'shopping-bag' },
      { id: 'entertainment', name: 'Entertainment', color: '#FF9800', icon: 'film' },
      { id: 'bills', name: 'Bills & Utilities', color: '#607D8B', icon: 'file-invoice' },
      { id: 'health', name: 'Health', color: '#4CAF50', icon: 'heartbeat' },
      { id: 'travel', name: 'Travel', color: '#03A9F4', icon: 'plane' },
      { id: 'education', name: 'Education', color: '#795548', icon: 'book' },
      { id: 'other', name: 'Other', color: '#9E9E9E', icon: 'ellipsis-h' }
    ];
  },
  
  // Analytics methods
  getExpensesByCategory: async (userId: string): Promise<Record<string, number>> => {
    const userExpenses = await dbService.getExpenses(userId);
    return userExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);
  },
  
  getExpensesByDateRange: async (userId: string, startDate: string, endDate: string): Promise<Expense[]> => {
    const userExpenses = await dbService.getExpenses(userId);
    return userExpenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return expenseDate >= start && expenseDate <= end;
    });
  },
  
  getTotalExpenses: async (userId: string): Promise<number> => {
    const userExpenses = await dbService.getExpenses(userId);
    return userExpenses.reduce((total, expense) => total + expense.amount, 0);
  }
};
