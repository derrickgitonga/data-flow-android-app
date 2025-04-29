
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.7166fa0e77564a678047b7facd9c0398',
  appName: 'ExpenseFlow',
  webDir: 'dist',
  server: {
    url: 'https://7166fa0e-7756-4a67-8047-b7facd9c0398.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: "#7E69AB",
      showSpinner: true,
      spinnerColor: "#FFFFFF",
      androidSplashResourceName: "splash"
    }
  },
  android: {
    backgroundColor: "#7E69AB"
  },
  ios: {
    backgroundColor: "#7E69AB"
  }
};

export default config;
