
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { DemoCredentials } from './DemoCredentials';
import { ThemeToggle } from './ThemeToggle';
import { ColorSelector } from './ColorSelector';
import { toast } from 'sonner';
import { authService } from '../services/authService';

interface AuthProps {
  onLogin: (userData: UserData) => void;
}

interface UserData {
  id: string;
  email: string;
  username: string;
  registrationDate: string;
  recoveryCode?: string;
}

export function Auth({ onLogin }: AuthProps) {
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);



  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await authService.login({
        emailOrUsername: loginForm.email,
        password: loginForm.password,
        platform: 'web',
        deviceType: 'desktop'
      });
      
      const userData: UserData = {
        id: response.user.id,
        email: response.user.email,
        username: response.user.username,
        registrationDate: response.user.createdAt
      };
      
      onLogin(userData);
      toast.success('Login successful!');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (registerForm.password !== registerForm.confirmPassword) {
      toast.error('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (registerForm.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      setIsLoading(false);
      return;
    }

    try {
      const response = await authService.register({
        email: registerForm.email,
        username: registerForm.username,
        password: registerForm.password,
        displayName: registerForm.username,
        platform: 'web',
        deviceType: 'desktop'
      });

      const userData: UserData = {
        id: response.user.id,
        email: response.user.email,
        username: response.user.username,
        registrationDate: response.user.createdAt
      };
      
      onLogin(userData);
      toast.success('Registration successful! Welcome to StreamVault.');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (email: string, password: string) => {
    setLoginForm({ email, password });
    
    // Automatically trigger login
    setIsLoading(true);
    
    try {
      const response = await authService.login({
        emailOrUsername: email,
        password: password,
        platform: 'web',
        deviceType: 'desktop'
      });
      
      const userData: UserData = {
        id: response.user.id,
        email: response.user.email,
        username: response.user.username,
        registrationDate: response.user.createdAt
      };
      
      onLogin(userData);
      toast.success(`Welcome back, ${response.user.displayName}!`);
    } catch (error: any) {
      console.error('Quick login error:', error);
      toast.error(error.message || 'Quick login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Theme & Color Controls - Fixed Position */}
      <div className="fixed top-4 right-4 z-50 flex items-center space-x-2">
        <ThemeToggle />
        <ColorSelector />
      </div>
      
      <div className="w-full max-w-2xl space-y-6">
        <DemoCredentials onAccountSelect={handleQuickLogin} />
        <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">StreamVault</CardTitle>
          <p className="text-center text-muted-foreground">Your Premium Streaming Platform</p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="Choose a username"
                    value={registerForm.username}
                    onChange={(e) => setRegisterForm({...registerForm, username: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email">Email</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="Enter your email"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Password</Label>
                  <Input
                    id="reg-password"
                    type="password"
                    placeholder="Create a password"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating Account...' : 'Register'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        </Card>
      </div>
    </div>
  );
}

