
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initDB } from '@/db/database';

const SplashScreen = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        // Initialize the database
        await initDB();
        
        // Simulate loading time
        setTimeout(() => {
          setLoading(false);
          // Navigate to login screen after splash
          navigate('/login');
        }, 2500);
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };

    initialize();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary to-purple-800">
      <div className="flex flex-col items-center space-y-8">
        <div className="relative">
          <div className="h-28 w-28 rounded-full bg-white shadow-lg flex items-center justify-center">
            <div className="animate-spin-slow">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="80" 
                height="80" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-primary"
              >
                <path d="M12 2v2"></path>
                <path d="M12 20v2"></path>
                <path d="m4.93 4.93 1.41 1.41"></path>
                <path d="m17.66 17.66 1.41 1.41"></path>
                <path d="M2 12h2"></path>
                <path d="M20 12h2"></path>
                <path d="m6.34 17.66-1.41 1.41"></path>
                <path d="m19.07 4.93-1.41 1.41"></path>
              </svg>
            </div>
          </div>
          <div className="absolute inset-0 rounded-full border-t-4 border-secondary opacity-30 animate-spin"></div>
        </div>
        
        <div className="animate-fade-in text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">ExpenseFlow</h1>
          <p className="text-white/80">Track. Analyze. Save.</p>
        </div>
        
        {loading && (
          <div className="w-36 h-1 bg-white/20 rounded-full overflow-hidden mt-8">
            <div className="h-full bg-white animate-pulse"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SplashScreen;
