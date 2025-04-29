
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { dbService } from '@/db/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

const TransactionsScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

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
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleAddExpense = () => {
    navigate('/add-expense');
  };

  const handleEditExpense = (expense: Expense) => {
    navigate('/add-expense', { state: { expense } });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Filter and sort expenses
  let filteredExpenses = [...expenses];

  // Apply search filter
  if (searchQuery) {
    filteredExpenses = filteredExpenses.filter(
      (expense) => expense.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Apply category filter
  if (categoryFilter && categoryFilter !== 'all') {
    filteredExpenses = filteredExpenses.filter(
      (expense) => expense.category === categoryFilter
    );
  }

  // Apply sorting
  filteredExpenses.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    
    if (sortOrder === 'newest') {
      return dateB - dateA;
    } else if (sortOrder === 'oldest') {
      return dateA - dateB;
    } else if (sortOrder === 'highest') {
      return b.amount - a.amount;
    } else {
      return a.amount - b.amount;
    }
  });

  // Group expenses by date
  const groupedExpenses: Record<string, Expense[]> = {};
  filteredExpenses.forEach((expense) => {
    const date = expense.date;
    if (!groupedExpenses[date]) {
      groupedExpenses[date] = [];
    }
    groupedExpenses[date].push(expense);
  });

  // Sort dates for display
  const sortedDates = Object.keys(groupedExpenses).sort((a, b) => {
    if (sortOrder === 'newest' || sortOrder === 'highest' || sortOrder === 'lowest') {
      return new Date(b).getTime() - new Date(a).getTime();
    } else {
      return new Date(a).getTime() - new Date(b).getTime();
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-16">
      {/* Header */}
      <div className="bg-primary text-white p-4">
        <div className="container max-w-md mx-auto">
          <div className="flex items-center">
            <button onClick={handleBack} className="mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-bold">Transactions</h1>
          </div>
        </div>
      </div>

      <div className="container max-w-md mx-auto p-4 space-y-4">
        {/* Search and Filter */}
        <div className="flex flex-col space-y-2">
          <Input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
          
          <div className="grid grid-cols-2 gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="highest">Highest Amount</SelectItem>
                <SelectItem value="lowest">Lowest Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Expenses List */}
        {sortedDates.length > 0 ? (
          <div className="space-y-4">
            {sortedDates.map((date) => (
              <Card key={date} className="shadow overflow-hidden">
                <CardHeader className="py-2">
                  <CardTitle className="text-sm font-medium">
                    {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {groupedExpenses[date].map((expense) => {
                    const category = categories.find((c) => c.id === expense.category);
                    
                    return (
                      <div 
                        key={expense.id}
                        onClick={() => handleEditExpense(expense)}
                        className="p-4 border-t first:border-t-0 hover:bg-muted/50 cursor-pointer transition-colors flex items-center justify-between"
                      >
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
                              {category?.name || 'Unknown'}
                            </p>
                          </div>
                        </div>
                        <span className="font-medium">
                          -{formatCurrency(expense.amount)}
                        </span>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="shadow text-center p-8">
            <p className="text-muted-foreground mb-4">No transactions found</p>
            <Button onClick={handleAddExpense}>Add Your First Expense</Button>
          </Card>
        )}
        
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

export default TransactionsScreen;
