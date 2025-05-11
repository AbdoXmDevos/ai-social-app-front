'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Eye, EyeOff, Github } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { signIn } from '@/app/api/auth';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ErrorMessage } from '@/components/ui/error-message';
import { useAuthStore } from '@/store/useAuthStore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { setSession } = useAuthStore();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/posts');
      }
    };

    checkSession();
  }, [router, supabase]);

  const validateForm = () => {
    if (!email) {
      setError('Email is required');
      return false;
    }
    if (!password) {
      setError('Password is required');
      return false;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    setError('');
    return true;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      if (data.session) {
        setSession(data.session);
        toast.success('Login successful!');
        router.push('/posts');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 flex items-center justify-center bg-background p-4"
    >
      <div className="w-[800px] h-[600px] flex rounded-xl overflow-hidden border border-secondary bg-card shadow-xl">
        {/* Left Side - Image */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="hidden md:flex flex-col justify-center items-center w-1/2 bg-muted relative dark:bg-muted"
        >
          <img
            src="https://images.pexels.com/photos/2387793/pexels-photo-2387793.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Login visual"
            className="object-cover w-full h-full absolute opacity-50"
            style={{ zIndex: 0 }}
          />
          <div className="relative z-10 p-8 w-full text-left">
            <span className="text-2xl font-bold text-primary drop-shadow-lg"></span>
          </div>
        </motion.div>
        {/* Right Side - Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full md:w-1/2 bg-card p-8 flex flex-col justify-center overflow-y-auto"
        >
          {/* Tabs */}
          <div className="flex mb-8">
            <button className="flex-1 py-2 rounded-l-lg bg-background text-primary font-medium border border-secondary border-r-0">Login</button>
            <button 
              onClick={() => handleNavigate('/auth/register')}
              className="cursor-pointer flex-1 py-2 rounded-r-lg bg-muted text-muted-foreground font-medium border border-secondary border-l-0 text-center hover:bg-muted/80 transition-colors"
            >
              Sign Up
            </button>
          </div>
          <h1 className="text-2xl font-bold mb-1 text-primary">Welcome back</h1>
          <p className="text-muted-foreground mb-6">Enter your credentials to access your account</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <ErrorMessage message={error} />}
            <div>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  setError('');
                }}
                required
                className="bg-background"
              />
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  setError('');
                }}
                required
                className="bg-background pr-10"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                tabIndex={-1}
                onClick={() => setShowPassword(v => !v)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <div className="flex items-center justify-end">
              <a href="/auth/forgot-password" className="text-sm text-primary hover:underline">Forgot password?</a>
            </div>
            <Button
              type="submit"
              className="cursor-pointer w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-secondary" />
            <span className="mx-4 text-xs text-muted-foreground">OR CONTINUE WITH</span>
            <div className="flex-1 h-px bg-secondary" />
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="flex-1 flex items-center gap-2 cursor-pointer" type="button">
              <img src="/images/google.png" 
              alt="Google" className="w-5 h-5 p-0.5" />
              Google
            </Button>
            <Button variant="outline" className="flex-1 flex items-center gap-2 cursor-pointer" type="button">
              <Github className="w-5 h-5" />
              GitHub
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
} 
