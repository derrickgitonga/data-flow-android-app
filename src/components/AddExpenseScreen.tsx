
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { dbService } from '@/db/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

interface Expense {
  id?: string;
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

const AddExpenseScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [expenseId, setExpenseId] = useState<string | null>(null);

  // Form state
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await dbService.getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();

    // Check if we're in edit mode by looking at location state
    const state = location.state as { expense?: Expense } | null;
    if (state?.expense) {
      const expense = state.expense;
      setIsEditMode(true);
      setExpenseId(expense.id);
      setAmount(expense.amount.toString());
      setCategory(expense.category);
      setDescription(expense.description);
      setDate(expense.date);
    }
  }, [location.state]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }

    setIsLoading(true);

    try {
      const expenseData: Expense = {
        userId: user.id,
        amount: parseFloat(amount),
        category,
        description,
        date,
      };

      let result;
      
      if (isEditMode && expenseId) {
        // Update existing expense
        result = await dbService.updateExpense({
          ...expenseData,
          id: expenseId,
        });
        toast({
          title: "Expense updated",
          description: "Your expense has been updated successfully."
        });
      } else {
        // Create new expense
        result = await dbService.addExpense(expenseData);
        toast({
          title: "Expense added",
          description: "Your expense has been added successfully."
        });
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving expense:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save expense. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!expenseId) return;
    
    setIsLoading(true);
    
    try {
      await dbService.deleteExpense(expenseId);
      toast({
        title: "Expense deleted",
        description: "Your expense has been deleted successfully."
      });
      navigate('/transactions');
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete expense. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-16">
      {/* Header */}
      <div className="bg-primary text-white p-4">
        <div className="container max-w-md mx-auto">
          <div className="flex items-center">
            <button 
              onClick={handleCancel}
              className="mr-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-bold">
              {isEditMode ? 'Edit Expense' : 'Add Expense'}
            </h1>
          </div>
        </div>
      </div>

      <div className="container max-w-md mx-auto p-4">
        <Card className="shadow">
          <form onSubmit={handleFormSubmit}>
            <CardHeader>
              <CardTitle className="text-lg">
                {isEditMode ? 'Update your expense' : 'Enter expense details'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        <div className="flex items-center">
                          <div 
                            className="h-3 w-3 rounded-full mr-2"
                            style={{ backgroundColor: cat.color }}
                          ></div>
                          {cat.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="What did you spend on?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-2">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : isEditMode ? 'Update Expense' : 'Add Expense'}
              </Button>
              
              {isEditMode && (
                <Button 
                  type="button" 
                  variant="destructive" 
                  className="w-full" 
                  onClick={handleDelete}
                  disabled={isLoading}
                >
                  Delete Expense
                </Button>
              )}
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AddExpenseScreen;
