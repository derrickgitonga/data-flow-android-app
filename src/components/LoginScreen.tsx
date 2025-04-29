
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { dbService } from '@/db/database';
import { useToast } from '@/components/ui/use-toast';

const LoginScreen = () => {
  const [username, setUsername] = useState('Demo'); // Pre-filled for demo purposes
  const [password, setPassword] = useState('Demo'); // Pre-filled for demo purposes
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(username, password);
      if (success) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred during login."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // For demo purposes - register a demo account if it doesn't exist
  const handleCreateDemoAccount = async () => {
    setIsLoading(true);
    try {
      // Check if demo user exists
      const user = await dbService.authenticateUser('Demo', 'Demo');
      if (!user) {
        await dbService.addUser('Demo', 'Demo');
        toast({
          title: "Demo account created",
          description: "You can now log in with username 'Demo' and password 'Demo'"
        });
      } else {
        toast({
          title: "Demo account exists",
          description: "The demo account already exists"
        });
      }
    } catch (error) {
      console.error('Error creating demo account:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not create demo account"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-purple-800 p-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="flex justify-center mb-8">
          <div className="h-20 w-20 rounded-full bg-white shadow-lg flex items-center justify-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="48" 
              height="48" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-primary"
            >
              <path d="M20.91 8.84 8.56 2.23a1.93 1.93 0 0 0-1.81 0L3.1 4.13a2.12 2.12 0 0 0-.05 3.69l12.22 6.93a2 2 0 0 0 1.94 0L21 12.51a2.12 2.12 0 0 0-.09-3.67Z" />
              <path d="m3.09 8.84 12.35-6.61a1.93 1.93 0 0 1 1.81 0l3.65 1.9a2.12 2.12 0 0 1 .1 3.69L8.73 14.75a2 2 0 0 1-1.94 0L3 12.51a2.12 2.12 0 0 1 .09-3.67Z" />
              <line x1="12" y1="22" x2="12" y2="13" />
              <path d="M20 13.5v3.37a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13.5" />
            </svg>
          </div>
        </div>
        
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">ExpenseFlow</CardTitle>
            <CardDescription>Log in to track your expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Log In'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col text-center">
            <p className="text-sm text-gray-500 mb-2">
              Using demo account? Click below to create one.
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleCreateDemoAccount}
              disabled={isLoading}
              className="text-xs"
            >
              Create Demo Account
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginScreen;
