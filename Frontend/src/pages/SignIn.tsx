
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { authAPI } from '@/services/api';
import { Shield } from 'lucide-react';
import axios from 'axios'; // at the top of your file


const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setToken, setUser } = useAuth();


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const res = await axios.post('http://localhost:3000/auth/signin', {
      email: formData.email,
      PassWord: formData.password,
    });

    const { token, name, StripeId ,isEmailVerified} = res.data;

    setToken(token);
    setUser({ name, StripeId,isEmailVerified });

    toast({
      title: "Welcome back!",
      description: "You have successfully signed in.",
    });
    if(!isEmailVerified){
      navigate('/email-error');
    }else{
      navigate('/');
    }
    
  } catch (error: any) {
    toast({
      title: "Sign In Failed",
      description: error.response?.data?.message || "Please check your credentials and try again.",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="neuro-card p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12 text-purple-400" />
            </div>
            <h1 className="text-3xl font-bold glow-text mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-400">
              Sign in to your SecureCode account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                placeholder="Enter your password"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full cyber-button text-lg py-3"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link to="/signup" className="text-purple-400 hover:text-purple-300 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
