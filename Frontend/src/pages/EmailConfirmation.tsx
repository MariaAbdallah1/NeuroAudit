import { useState, useEffect } from 'react';
import { useSearchParams, Link,useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Shield, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

const EmailConfirmation = () => {
  const [status, setStatus] = useState<'success' | 'error'>('error');
  const { toast } = useToast();
  const {token}=useParams()
  useEffect(() => {
     confirmEmail()
  }, []);
const confirmEmail= async ()=>{
  try{
    const res = await axios.patch(
      'http://localhost:3000/auth/confirmemail',
      null, // No request body
      { // The config object containing headers
        headers: {
          Authorization: `${token}` 
        }
      }
    );
    if(res.data.user.isEmailVerified){
      setStatus('success')
    }else{
      setStatus('error')

    }
  }catch(err){
    console.log(err)
  }
      
    }
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="neuro-card p-8 text-center">
          <div className="flex justify-center mb-6">
            <Shield className="h-12 w-12 text-purple-400" />
          </div>
          
          <h1 className="text-3xl font-bold glow-text mb-4">
            Email Confirmation
          </h1>

          {/* {status === 'loading' && (
            <div className="space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-gray-400">Confirming your email...</p>
            </div>
          )} */}

          {status === 'success' && (
            <div className="space-y-6">
              <CheckCircle className="h-16 w-16 text-green-400 mx-auto" />
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">
                  Email Confirmed!
                </h2>
                <p className="text-gray-400">
                  Your email has been successfully verified. You can now access all features.
                </p>
              </div>
              <Link to="/signin">
                <Button className="cyber-button w-full">
                  Continue to Sign In
                </Button>
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-6">
              <XCircle className="h-16 w-16 text-red-400 mx-auto" />
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">
                  Confirmation Failed
                </h2>
                <p className="text-gray-400">
                  The confirmation link is invalid or has expired. Please try signing up again.
                </p>
              </div>
              {/* <Link to="/signup">
                <Button className="cyber-button w-full">
                  Back to Sign Up
                </Button>
              </Link> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmation;
