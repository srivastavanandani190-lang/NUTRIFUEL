import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Mail, Lock, User } from 'lucide-react';
import { toast } from 'sonner';

export const SignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUpWithEmail } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !username || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      toast.error('Username can only contain letters, numbers, and underscores');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const { error } = await signUpWithEmail(email, username, password);
    setLoading(false);

    if (error) {
      toast.error(error.message || 'Signup failed');
    } else {
      toast.success('Account created successfully! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 1000);
    }
  };

  return (
    <div className="min-h-screen w-full gradient-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass border-none rounded-[2.5rem] shadow-2xl">
        <CardHeader className="space-y-2 text-center pb-8 pt-10">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-4xl font-black tracking-tight">Create Account</CardTitle>
          <CardDescription className="text-md font-medium">
            Join us to start your personalized food journey
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 px-8">
          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-3">
              <Label htmlFor="email" className="text-sm font-bold uppercase tracking-wider">
                Email *
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nandani@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-14 rounded-2xl glass border-none text-lg font-medium focus-visible:ring-primary"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="username" className="text-sm font-bold uppercase tracking-wider">
                Username *
              </Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="nandani"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-12 h-14 rounded-2xl glass border-none text-lg font-medium focus-visible:ring-primary"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="password" className="text-sm font-bold uppercase tracking-wider">
                Password *
              </Label>
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
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="confirmPassword" className="text-sm font-bold uppercase tracking-wider">
                Confirm Password *
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-12 h-14 rounded-2xl glass border-none text-lg font-medium focus-visible:ring-primary"
                  disabled={loading}
                  required
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
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center pb-10 pt-4">
          <p className="text-sm text-muted-foreground font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignupPage;
