import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Eye, EyeOff, Shield, Lock, User } from 'lucide-react';
import { LoadingSpinner, PageLoader } from './ui/loading';
import { mockUsers } from '../data/mockData';
import { toast } from '../hooks/use-toast';

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [processingSession, setProcessingSession] = useState(false);

  // Clear error when component mounts or when user starts typing
  useEffect(() => {
    setError('');
    initializeAuth();
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (user && !processingSession) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate, processingSession]);

  const initializeAuth = async () => {
    try {
      // Check for session_id in URL fragment first (from Google OAuth redirect)
      const fragment = window.location.hash.substring(1);
      const params = new URLSearchParams(fragment);
      const sessionId = params.get('session_id');
      
      if (sessionId) {
        await processGoogleSession(sessionId);
        return;
      }
      
      // Check for existing session
      await checkExistingSession();
      
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const checkExistingSession = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/session-check`, {
        method: 'GET',
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.authenticated && data.user) {
          login(data.user);
          return;
        }
      }
    } catch (error) {
      console.error('Session check error:', error);
    }
  };

  const processGoogleSession = async (sessionId) => {
    setProcessingSession(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/process-session`, {
        method: 'POST',
        headers: {
          'X-Session-ID': sessionId,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          // Clean URL fragment
          window.location.hash = '';
          
          login(data.user);
          toast({
            title: "Welcome!",
            description: "Successfully signed in with Google"
          });
          navigate('/dashboard', { replace: true });
          return;
        }
      }
      
      throw new Error('Failed to process Google authentication');
      
    } catch (error) {
      console.error('Google session processing error:', error);
      setError('Google authentication failed. Please try again.');
      toast({
        title: "Authentication Error",
        description: "Failed to sign in with Google. Please try again.",
        variant: "destructive"
      });
      
      // Clean URL fragment on error
      window.location.hash = '';
    } finally {
      setProcessingSession(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = mockUsers.find(
        u => u.email === formData.email && u.password === formData.password
      );

      if (foundUser) {
        login(foundUser);
        navigate('/dashboard', { replace: true });
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setGoogleLoading(true);
    try {
      // Redirect to Emergent Auth with dashboard as redirect URL
      const redirectUrl = `${window.location.origin}/dashboard`;
      const authUrl = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
      window.location.href = authUrl;
    } catch (error) {
      console.error('Google sign-in error:', error);
      setError('Failed to initiate Google sign-in');
      setGoogleLoading(false);
    }
  };

  const handleChange = (e) => {
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (initialLoading || processingSession) {
    return (
      <PageLoader 
        message={processingSession ? "Processing Google authentication..." : "Loading login..."}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Sign in to your admin account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Google Sign-In Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
          >
            {googleLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <GoogleIcon />
            )}
            <span className="ml-2">
              {googleLoading ? 'Redirecting...' : 'Continue with Google'}
            </span>
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Or continue with email</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 pr-10"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 h-4 w-4 text-slate-400 hover:text-slate-600"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <p className="text-sm font-medium text-slate-700 mb-2">Demo Credentials:</p>
            <div className="space-y-1 text-xs text-slate-600">
              <div><strong>Admin:</strong> admin@demo.com / admin123</div>
              <div><strong>Creator:</strong> creator@demo.com / creator123</div>
              <div><strong>SuperAdmin:</strong> superadmin@demo.com / super123</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;