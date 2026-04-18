
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { planAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresSubscription?: boolean;
}

const ProtectedRoute = ({ children, requiresSubscription = false }: ProtectedRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const checkAccess = async () => {
      // Allow access to everyone now
      if (!requiresSubscription) {
        setHasAccess(true);
        setIsLoading(false);
        return;
      }

      // Only check subscription if user is authenticated and subscription is required
      if (isAuthenticated && requiresSubscription) {
        try {
          const subscription = await planAPI.checkSubscription();
          if (!subscription || subscription.status !== 'active') {
            toast({
              title: "Subscription Required",
              description: "Please subscribe to access this feature.",
              variant: "destructive",
            });
            setHasAccess(false);
          } else {
            setHasAccess(true);
          }
        } catch (error) {
          console.error('Subscription check failed:', error);
          setHasAccess(false);
        }
      } else if (requiresSubscription && !isAuthenticated) {
        // If subscription required but not authenticated, redirect to signin
        setHasAccess(false);
      } else {
        setHasAccess(true);
      }
      
      setIsLoading(false);
    };

    checkAccess();
  }, [requiresSubscription, isAuthenticated, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (requiresSubscription && !isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (requiresSubscription && !hasAccess) {
    return <Navigate to="/pricing" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
