'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Eye, EyeOff, Github } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { signUp } from '@/app/api/auth';
import { ErrorMessage } from '@/components/ui/error-message';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const validateForm = () => {
    if (!name) {
      setError('Username is required');
      return false;
    }
    if (!email) {
      setError('Email is required');
      return false;
    }
    if (!password) {
      setError('Password is required');
      return false;
    }
    if (!confirmPassword) {
      setError('Please confirm your password');
      return false;
    }
    if (name.length < 3) {
      setError('Username must be at least 3 characters long');
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
    if (password !== confirmPassword) {
      setError('Passwords do not match');
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
      const { auth, userId } = await signUp(email, password, name);
      console.log('Created user with ID:', userId);
      toast.success('Registration successful! Please check your email to verify your account.');
      router.push('/auth/login');
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Registration failed. Please try again.');
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
            alt="Register visual"
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
            <button 
              onClick={() => handleNavigate('/auth/login')}
              className="flex-1 py-2 rounded-l-lg bg-muted text-muted-foreground font-medium border border-secondary border-r-0 text-center hover:bg-muted/80 transition-colors"
            >
              Login
            </button>
            <button className="flex-1 py-2 rounded-r-lg bg-background text-primary font-medium border border-secondary border-l-0">Sign Up</button>
          </div>
          <h1 className="text-2xl font-bold mb-1 text-primary">Create an account</h1>
          <p className="text-muted-foreground mb-6">Enter your details to get started</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <ErrorMessage message={error} />}
            <div>
              <Input
                id="name"
                type="text"
                placeholder="Username"
                value={name}
                onChange={e => {
                  setName(e.target.value);
                  setError('');
                }}
                required
                className="bg-background"
              />
            </div>
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
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={e => {
                  setConfirmPassword(e.target.value);
                  setError('');
                }}
                required
                className="bg-background pr-10"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                tabIndex={-1}
                onClick={() => setShowConfirmPassword(v => !v)}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Sign Up'
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
