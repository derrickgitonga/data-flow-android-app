
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { dbService } from '@/db/database';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';

// Types
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

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const DashboardScreen = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalSpent, setTotalSpent] = useState(0);
  const [pieChartData, setPieChartData] = useState<any[]>([]);
  const [barChartData, setBarChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        // Fetch categories
        const categoriesData = await dbService.getCategories();
        setCategories(categoriesData);

        // Fetch expenses for the current user
        const expensesData = await dbService.getExpenses(user.id);
        setExpenses(expensesData);

        // Calculate total spent
        const total = expensesData.reduce((sum, expense) => sum + expense.amount, 0);
        setTotalSpent(total);

        // Prepare chart data
        prepareChartData(expensesData, categoriesData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const prepareChartData = (expenses: Expense[], categories: Category[]) => {
    // Prepare pie chart data (expenses by category)
    const expensesByCategory: Record<string, number> = {};
    expenses.forEach((expense) => {
      if (expensesByCategory[expense.category]) {
        expensesByCategory[expense.category] += expense.amount;
      } else {
        expensesByCategory[expense.category] = expense.amount;
      }
    });

    const pieData = Object.entries(expensesByCategory).map(([categoryId, amount]) => {
      const category = categories.find((c) => c.id === categoryId);
      return {
        name: category ? category.name : 'Unknown',
        value: amount,
        color: category ? category.color : '#999',
      };
    });

    setPieChartData(pieData);

    // Prepare bar chart data (daily expenses for the past 7 days)
    const today = new Date();
    const barData = [];

    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayExpenses = expenses.filter((expense) => expense.date.startsWith(dateStr));
      const totalAmount = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);

      barData.push({
        name: format(date, 'EEE'),
        amount: totalAmount,
      });
    }

    setBarChartData(barData);
  };

  const handleAddExpense = () => {
    navigate('/add-expense');
  };

  const handleViewAllTransactions = () => {
    navigate('/transactions');
  };

  // Get recent expenses (last 5)
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Calculate this month's spending
  const now = new Date();
  const start = startOfMonth(now);
  const end = endOfMonth(now);

  const thisMonthExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= start && expenseDate <= end;
  });

  const thisMonthTotal = thisMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-16">
      {/* Header */}
      <div className="bg-primary text-white p-4">
        <div className="container max-w-md mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold">ExpenseFlow</h1>
              <p className="text-sm opacity-80">Hello, {user?.username}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={logout} className="text-white hover:text-white/80">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container max-w-md mx-auto p-4 space-y-4">
        {/* Overview Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(totalSpent)}</p>
            </CardContent>
          </Card>
          <Card className="shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(thisMonthTotal)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Card className="shadow">
          <CardHeader>
            <CardTitle className="text-lg">Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {pieChartData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => formatCurrency(value as number)} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-6">No data available</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle className="text-lg">Last 7 Days</CardTitle>
          </CardHeader>
          <CardContent>
            {barChartData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData}>
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `$${value}`} />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Bar dataKey="amount" fill="#6200EE" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-6">No data available</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="shadow">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleViewAllTransactions}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {recentExpenses.length > 0 ? (
              <div className="space-y-4">
                {recentExpenses.map((expense) => {
                  const category = categories.find((c) => c.id === expense.category);

                  return (
                    <div key={expense.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: category?.color || '#ccc' }}
                        >
                          <span className="text-white text-xl">
                            {category?.name.substring(0, 1) || '?'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{expense.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(expense.date), 'MMM dd, yyyy')} • {category?.name || 'Unknown'}
                          </p>
                        </div>
                      </div>
                      <span className="font-medium">
                        -{formatCurrency(expense.amount)}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-6">No recent transactions</p>
            )}
          </CardContent>
        </Card>

        {/* Add Expense Button */}
        <div className="fixed bottom-6 right-0 left-0 flex justify-center">
          <Button 
            className="h-14 w-14 rounded-full shadow-lg"
            onClick={handleAddExpense}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
