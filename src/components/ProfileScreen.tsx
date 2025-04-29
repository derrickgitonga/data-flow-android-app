
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';

const ProfileScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [isEditing, setIsEditing] = useState(false);

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleSave = () => {
    // In a real app, update user profile in the database
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully"
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

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
            <h1 className="text-xl font-bold">Profile</h1>
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="ml-auto"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                  <path d="m15 5 4 4" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container max-w-md mx-auto p-4 space-y-4">
        {/* Profile Avatar */}
        <div className="flex flex-col items-center justify-center py-6">
          <Avatar className="h-24 w-24">
            <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <h2 className="mt-4 text-xl font-semibold">{name}</h2>
          <p className="text-muted-foreground">@{user?.username}</p>
        </div>
        
        {/* Profile Details */}
        <Card className="shadow">
          <CardHeader>
            <CardTitle className="text-lg">
              {isEditing ? 'Edit Profile' : 'Profile Details'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => setIsEditing(false)} 
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSave} 
                    className="flex-1"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Full Name</Label>
                  <p>{name}</p>
                </div>
                
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p>{email}</p>
                </div>
                
                <div>
                  <Label className="text-muted-foreground">Username</Label>
                  <p>{user?.username}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Statistics */}
        <Card className="shadow">
          <CardHeader>
            <CardTitle className="text-lg">Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-md text-center">
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Expenses This Month</p>
              </div>
              <div className="p-4 bg-muted rounded-md text-center">
                <p className="text-2xl font-bold">$1,523</p>
                <p className="text-sm text-muted-foreground">Total Spent</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileScreen;
