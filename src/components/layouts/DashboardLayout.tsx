import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Utensils, CalendarDays, BarChart3, Flame, Menu, X, LogOut, User as UserIcon, Sparkles, RefreshCw, Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getRandomQuote, type MotivationalQuote } from '@/utils/motivationalQuotes';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle, ThemeToggleMobile } from '@/components/ui/theme-toggle';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  username: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, activeTab, setActiveTab, username }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [quote, setQuote] = useState<MotivationalQuote>(getRandomQuote());
  const { signOut } = useAuth();
  const navigate = useNavigate();

  // Refresh quote on component mount (when user logs in)
  useEffect(() => {
    setQuote(getRandomQuote());
  }, []);

  // Function to manually refresh quote
  const refreshQuote = () => {
    setQuote(getRandomQuote());
  };

  const navItems = [
    { id: 'explorer', label: 'Food Explorer', icon: <Utensils className="w-4 h-4 mr-2" />, emoji: '🍽️' },
    { id: 'planner', label: 'Meal Planner', icon: <CalendarDays className="w-4 h-4 mr-2" />, emoji: '📅' },
    { id: 'exercise', label: 'Exercise', icon: <Dumbbell className="w-4 h-4 mr-2" />, emoji: '💪' },
    { id: 'profile', label: 'Profile', icon: <UserIcon className="w-4 h-4 mr-2" />, emoji: '👤' },
  ];

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <div className="min-h-screen w-full gradient-bg pb-12">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full px-4 py-4">
        <nav className="max-w-7xl mx-auto glass rounded-full px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-8 h-8 text-primary animate-pulse dark:neon-pulse" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              NutriFuel
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? 'default' : 'ghost'}
                className={cn(
                  "rounded-full transition-all duration-300",
                  activeTab === item.id 
                    ? "nav-gradient-btn text-white dark:active-tab-glow" 
                    : "hover:bg-primary/10 dark:hover:bg-primary/20"
                )}
                onClick={() => setActiveTab(item.id)}
              >
                {item.emoji} {item.label}
              </Button>
            ))}
          </div>

          {/* User Menu & Theme Toggle */}
          <div className="hidden lg:flex items-center gap-4">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="rounded-full hover:bg-destructive/10 hover:text-destructive transition-all duration-300"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>

          {/* Mobile Menu Trigger */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden rounded-full">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="glass h-auto border-none pt-12 pb-8">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between px-4 py-3 glass rounded-2xl mb-4">
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-primary" />
                    <span className="font-bold">{username}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ThemeToggleMobile />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      className="rounded-xl hover:bg-destructive/10 hover:text-destructive"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>
                
                {navItems.map((item) => (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? 'default' : 'ghost'}
                    className={cn(
                      "w-full justify-start rounded-xl h-12 text-lg transition-all duration-300",
                      activeTab === item.id ? "nav-gradient-btn text-white" : ""
                    )}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <span className="mr-3">{item.emoji}</span>
                    {item.label}
                  </Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 mt-8 space-y-6">
        {/* Motivational Quote Banner */}
        <AnimatePresence mode="wait">
          <motion.div
            key={quote.text}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="glass rounded-3xl p-6 border-2 border-primary/20 dark:border-primary/30 relative overflow-hidden dark:glow-primary"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/5 dark:bg-secondary/10 rounded-full blur-3xl" />
            
            <div className="relative flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary animate-pulse dark:text-cyan-400" />
                  <span className="text-xs font-bold uppercase tracking-widest text-primary dark:text-cyan-400">
                    Daily Motivation
                  </span>
                </div>
                <blockquote className="text-base md:text-lg font-bold text-foreground leading-relaxed italic">
                  "{quote.text}"
                </blockquote>
                <p className="text-xs font-semibold text-muted-foreground">
                  — {quote.author}
                </p>
              </div>
              
              <Button
                onClick={refreshQuote}
                variant="ghost"
                size="icon"
                className="shrink-0 h-9 w-9 rounded-full hover:bg-primary/10 hover:text-primary transition-all hover:rotate-180 duration-500"
                title="Get new quote"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>

        {children}
      </main>
      
      <footer className="mt-12 text-center text-muted-foreground text-sm">
        © 2026 Food Recommendation Dashboard
      </footer>
    </div>
  );
};
