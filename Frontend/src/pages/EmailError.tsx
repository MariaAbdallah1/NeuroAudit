import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, XCircle } from 'lucide-react';

const EmailError = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="neuro-card p-8 text-center">
          <div className="flex justify-center mb-6">
            <Shield className="h-12 w-12 text-purple-400" />
          </div>
          
          <h1 className="text-3xl font-bold glow-text mb-4">
            Email Verification Required
          </h1>

          <div className="space-y-6">
            <XCircle className="h-16 w-16 text-red-400 mx-auto" />
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">
                Please Confirm Your Email
              </h2>
              <p className="text-gray-400">
                You need to verify your email address to access this feature. Please check your inbox for the verification link.
              </p>
            </div>
            <Link to="/">
              <Button className="cyber-button w-full">
                Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailError; 