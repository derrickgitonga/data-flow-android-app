
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const HelpScreen = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-8">
      {/* Header */}
      <div className="bg-primary text-white p-4">
        <div className="container max-w-md mx-auto">
          <div className="flex items-center">
            <button onClick={handleBack} className="mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-bold">Help & Support</h1>
          </div>
        </div>
      </div>

      <div className="container max-w-md mx-auto p-4 space-y-4">
        <Card className="shadow">
          <CardHeader>
            <CardTitle>Welcome to ExpenseFlow</CardTitle>
            <CardDescription>
              Your personal expense tracking app
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              ExpenseFlow helps you track your expenses, visualize spending patterns, and take control of your finances.
              Below are some frequently asked questions to help you get started.
            </p>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="adding-expense">
                <AccordionTrigger>How do I add an expense?</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">To add a new expense:</p>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Tap the "+" button at the bottom of the dashboard or transactions screen</li>
                    <li>Enter the expense amount</li>
                    <li>Select a category</li>
                    <li>Add a description</li>
                    <li>Select the date</li>
                    <li>Tap "Add Expense"</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="editing-expense">
                <AccordionTrigger>How do I edit or delete an expense?</AccordionTrigger>
                <AccordionContent>
                  <p>
                    To edit or delete an expense, go to the Transactions screen and tap on any transaction. 
                    This will open the edit screen where you can modify details or delete the expense using the 
                    "Delete Expense" button at the bottom.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="categories">
                <AccordionTrigger>What are the available categories?</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">ExpenseFlow comes with the following default categories:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Food & Dining</li>
                    <li>Transportation</li>
                    <li>Shopping</li>
                    <li>Entertainment</li>
                    <li>Bills & Utilities</li>
                    <li>Health</li>
                    <li>Travel</li>
                    <li>Education</li>
                    <li>Other</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="charts">
                <AccordionTrigger>What do the charts show?</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">The Dashboard includes two main charts:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Spending by Category:</strong> A pie chart showing the proportion of your spending across different categories.
                    </li>
                    <li>
                      <strong>Last 7 Days:</strong> A bar chart showing your daily spending over the past week.
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="data-storage">
                <AccordionTrigger>Where is my data stored?</AccordionTrigger>
                <AccordionContent>
                  <p>
                    All your expense data is stored locally on your device using a secure database. 
                    Your data is not uploaded to any server, ensuring your financial information remains private.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="filtering">
                <AccordionTrigger>How do I filter my transactions?</AccordionTrigger>
                <AccordionContent>
                  <p>
                    On the Transactions screen, you can use the search bar to find specific expenses by description. 
                    You can also filter by category and sort by date or amount using the dropdown menus.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle className="text-lg">Contact Support</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              If you have any questions or need assistance with ExpenseFlow, please contact our support team:
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="mr-2 text-primary"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
                <a href="mailto:support@expenseflow.app" className="text-primary hover:underline">
                  support@expenseflow.app
                </a>
              </div>
              <div className="flex items-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="mr-2 text-primary"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span>1-800-EXPENSE (1-800-397-3673)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground pt-4">
          <p>ExpenseFlow v1.0.0</p>
          <p>© 2025 ExpenseFlow Inc. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default HelpScreen;
