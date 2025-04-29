
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dbService } from '@/db/database';
import { BarChart } from '@/components/ui/chart';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

const DashboardScreen = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [expensesByCategory, setExpensesByCategory] = useState<Record<string, number>>({});
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        
        // Fetch categories
        const categoriesData = await dbService.getCategories();
        setCategories(categoriesData);
        
        // Fetch total expenses
        const total = await dbService.getTotalExpenses(user.id);
        setTotalExpenses(total);
        
        // Fetch expenses by category
        const byCategory = await dbService.getExpensesByCategory(user.id);
        setExpensesByCategory(byCategory);
        
        // Fetch recent transactions
        const transactions = await dbService.getExpenses(user.id);
        setRecentTransactions(transactions.slice(0, 3));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user, navigate]);

  const handleAddExpense = () => {
    navigate('/add-expense');
  };

  const handleViewTransactions = () => {
    navigate('/transactions');
  };

  const handleSettings = () => {
    navigate('/settings');
  };
  
  const handleProfile = () => {
    navigate('/profile');
  };
  
  const handleHelp = () => {
    navigate('/help');
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Prepare chart data
  const chartData = Object.entries(expensesByCategory).map(([categoryId, amount]) => {
    const category = categories.find(c => c.id === categoryId);
    return {
      name: category?.name || 'Unknown',
      value: amount,
      color: category?.color || '#ccc',
    };
  });

  // Get category by ID
  const getCategoryById = (id: string) => {
    return categories.find(category => category.id === id);
  };

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
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-3">
                <Avatar className="h-10 w-10 bg-primary-foreground text-primary">
                  <AvatarFallback>
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div>
                <h1 className="text-xl font-bold">Dashboard</h1>
                <p className="text-sm opacity-80">Welcome, {user?.username || 'User'}!</p>
              </div>
            </div>
            <button onClick={handleSettings}>
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
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="container max-w-md mx-auto p-4 space-y-4">
        {/* Total Expenses Card */}
        <Card className="shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(totalExpenses)}</div>
            <p className="text-muted-foreground text-sm mt-1">Current Month</p>
          </CardContent>
        </Card>
        
        {/* Expenses Chart */}
        <Card className="shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {chartData.length > 0 ? (
                <BarChart 
                  data={chartData}
                  index="name"
                  categories={["value"]}
                  colors={["primary"]}
                  valueFormatter={(value) => formatCurrency(value)}
                  showLegend={false}
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-muted-foreground">No expense data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Transactions */}
        <Card className="shadow">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleViewTransactions}
              className="text-xs"
            >
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {recentTransactions.length > 0 ? (
              <div className="space-y-2">
                {recentTransactions.map((transaction) => {
                  const category = getCategoryById(transaction.category);
                  return (
                    <div key={transaction.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md">
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
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {category?.name || 'Unknown'}
                          </p>
                        </div>
                      </div>
                      <span className="font-medium">
                        -{formatCurrency(transaction.amount)}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">No recent transactions</p>
            )}
          </CardContent>
        </Card>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-2">
          <Button 
            variant="outline"
            className="flex flex-col h-24 items-center justify-center space-y-1"
            onClick={handleAddExpense}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14"></path>
              <path d="M5 12h14"></path>
            </svg>
            <span className="text-xs">Add Expense</span>
          </Button>
          <Button 
            variant="outline"
            className="flex flex-col h-24 items-center justify-center space-y-1"
            onClick={handleProfile}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span className="text-xs">Profile</span>
          </Button>
          <Button 
            variant="outline"
            className="flex flex-col h-24 items-center justify-center space-y-1"
            onClick={handleHelp}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <path d="M12 17h.01"></path>
            </svg>
            <span className="text-xs">Help</span>
          </Button>
        </div>
        
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
