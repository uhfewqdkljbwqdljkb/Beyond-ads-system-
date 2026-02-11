import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button, Input, Checkbox, Card } from '../../components/ui';
import { Eye, EyeOff, AlertCircle, ShieldCheck } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { login } = useAuth();

  const [email, setEmail] = useState('admin@nexusagency.com');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Simple validation
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
    
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await login(email, password);
      toast.success('Successfully logged in!');
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4 py-12">
      <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-xl shadow-lg flex items-center justify-center text-white mb-4">
            <ShieldCheck size={36} />
          </div>
          <h1 className="text-3xl font-extrabold text-textPrimary tracking-tight">Beyond Ads</h1>
          <p className="text-textSecondary mt-2">Sign in to your agency command center</p>
        </div>

        <Card padding="lg" className="shadow-xl">
          <form className="space-y-5" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-error rounded-md p-3 flex items-start gap-2 animate-in fade-in zoom-in-95 duration-200">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            <Input
              label="Email address"
              type="email"
              placeholder="alex@nexusagency.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              required
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                required
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="hover:text-primary transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Checkbox
                label="Remember me"
                checked={rememberMe}
                onChange={setRememberMe}
              />
              <button type="button" className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors">
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              isLoading={isSubmitting}
            >
              Sign in
            </Button>
          </form>
        </Card>

        <div className="mt-8 text-center space-y-2">
          <p className="text-xs text-textMuted uppercase tracking-widest font-semibold">Demo Credentials</p>
          <div className="flex justify-center gap-4 text-xs text-textSecondary">
            <div>
              <span className="font-bold">Admin:</span> admin@nexusagency.com
            </div>
            <div>
              <span className="font-bold">Rep:</span> rep@nexusagency.com
            </div>
          </div>
          <p className="text-[10px] text-textMuted italic">Password: password</p>
        </div>
      </div>
    </div>
  );
};

export default Login;