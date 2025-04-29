
import { openDB, DBSchema } from 'idb';

// Define the database schema
interface ExpenseTrackerDB extends DBSchema {
  users: {
    key: string;
    value: {
      id: string;
      username: string;
      password: string;
    };
  };
  expenses: {
    key: string;
    value: {
      id: string;
      userId: string;
      amount: number;
      category: string;
      description: string;
      date: string;
    };
    indexes: {
      'by-user': string;
      'by-date': string;
      'by-category': string;
    };
  };
  categories: {
    key: string;
    value: {
      id: string;
      name: string;
      icon: string;
      color: string;
    };
  };
}

// Database name and version
const DB_NAME = 'expense-tracker-db';
const DB_VERSION = 1;

// Initialize the database
export const initDB = async () => {
  const db = await openDB<ExpenseTrackerDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create users store
      if (!db.objectStoreNames.contains('users')) {
        const userStore = db.createObjectStore('users', { keyPath: 'id' });
        userStore.createIndex('by-username', 'username', { unique: true });
      }

      // Create expenses store
      if (!db.objectStoreNames.contains('expenses')) {
        const expenseStore = db.createObjectStore('expenses', { keyPath: 'id' });
        expenseStore.createIndex('by-user', 'userId', { unique: false });
        expenseStore.createIndex('by-date', 'date', { unique: false });
        expenseStore.createIndex('by-category', 'category', { unique: false });
      }

      // Create categories store
      if (!db.objectStoreNames.contains('categories')) {
        const categoryStore = db.createObjectStore('categories', { keyPath: 'id' });
      }

      // Add default categories
      const categories = [
        { id: '1', name: 'Food & Dining', icon: 'utensils', color: '#FF9800' },
        { id: '2', name: 'Transportation', icon: 'car', color: '#2196F3' },
        { id: '3', name: 'Shopping', icon: 'shopping-bag', color: '#E91E63' },
        { id: '4', name: 'Entertainment', icon: 'film', color: '#9C27B0' },
        { id: '5', name: 'Bills & Utilities', icon: 'file-invoice', color: '#F44336' },
        { id: '6', name: 'Health', icon: 'heartbeat', color: '#4CAF50' },
        { id: '7', name: 'Travel', icon: 'plane', color: '#03A9F4' },
        { id: '8', name: 'Education', icon: 'graduation-cap', color: '#795548' },
        { id: '9', name: 'Other', icon: 'ellipsis-h', color: '#607D8B' },
      ];

      // Add a default user for demo
      const user = {
        id: '1',
        username: 'demo',
        password: 'password123',
      };

      const tx = db.transaction(['categories', 'users'], 'readwrite');
      categories.forEach((category) => {
        tx.objectStore('categories').add(category);
      });
      tx.objectStore('users').add(user);
    },
  });

  return db;
};

// Database access methods
export const dbService = {
  // User methods
  async authenticateUser(username: string, password: string) {
    const db = await openDB<ExpenseTrackerDB>(DB_NAME, DB_VERSION);
    const tx = db.transaction('users', 'readonly');
    const store = tx.objectStore('users');
    const users = await store.getAll();
    
    const user = users.find(u => u.username === username && u.password === password);
    return user || null;
  },

  async addUser(username: string, password: string) {
    const db = await openDB<ExpenseTrackerDB>(DB_NAME, DB_VERSION);
    const id = crypto.randomUUID();
    await db.add('users', {
      id,
      username,
      password,
    });
    return id;
  },

  // Expense methods
  async getExpenses(userId: string) {
    const db = await openDB<ExpenseTrackerDB>(DB_NAME, DB_VERSION);
    const tx = db.transaction('expenses', 'readonly');
    const index = tx.store.index('by-user');
    return index.getAll(userId);
  },

  async getExpenseById(id: string) {
    const db = await openDB<ExpenseTrackerDB>(DB_NAME, DB_VERSION);
    return db.get('expenses', id);
  },

  async addExpense(expense: Omit<ExpenseTrackerDB['expenses']['value'], 'id'>) {
    const db = await openDB<ExpenseTrackerDB>(DB_NAME, DB_VERSION);
    const id = crypto.randomUUID();
    await db.add('expenses', {
      ...expense,
      id,
    });
    return id;
  },

  async updateExpense(expense: ExpenseTrackerDB['expenses']['value']) {
    const db = await openDB<ExpenseTrackerDB>(DB_NAME, DB_VERSION);
    await db.put('expenses', expense);
    return expense;
  },

  async deleteExpense(id: string) {
    const db = await openDB<ExpenseTrackerDB>(DB_NAME, DB_VERSION);
    await db.delete('expenses', id);
  },

  // Category methods
  async getCategories() {
    const db = await openDB<ExpenseTrackerDB>(DB_NAME, DB_VERSION);
    return db.getAll('categories');
  },

  async getCategoryById(id: string) {
    const db = await openDB<ExpenseTrackerDB>(DB_NAME, DB_VERSION);
    return db.get('categories', id);
  },
};
