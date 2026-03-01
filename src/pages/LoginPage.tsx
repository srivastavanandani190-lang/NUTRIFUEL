import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Lock, Mail, LogIn } from 'lucide-react';
import { toast } from 'sonner';

export const LoginPage: React.FC = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signInWithEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from || '/dashboard';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailOrUsername || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    const { error } = await signInWithEmail(emailOrUsername, password);
    setLoading(false);

    if (error) {
      toast.error(error.message || 'Login failed');
    } else {
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen w-full gradient-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass border-none rounded-[2.5rem] shadow-2xl">
        <CardHeader className="space-y-2 text-center pb-8 pt-10">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
            <LogIn className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-4xl font-black tracking-tight">Welcome Back</CardTitle>
          <CardDescription className="text-md font-medium">
            Login to continue your food journey
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 px-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-3">
              <Label htmlFor="emailOrUsername" className="text-sm font-bold uppercase tracking-wider">
                Email or Username
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="emailOrUsername"
                  type="text"
                  placeholder="email@example.com or username"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  className="pl-12 h-14 rounded-2xl glass border-none text-lg font-medium focus-visible:ring-primary"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-sm font-bold uppercase tracking-wider">
                  Password
                </Label>
                <Link to="/forgot-password" className="text-xs text-primary font-bold hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 h-14 rounded-2xl glass border-none text-lg font-medium focus-visible:ring-primary"
                  disabled={loading}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-2xl text-lg font-black nav-gradient-btn text-white mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center pb-10 pt-4">
          <p className="text-sm text-muted-foreground font-medium">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary font-bold hover:underline">
              Sign Up Free
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
