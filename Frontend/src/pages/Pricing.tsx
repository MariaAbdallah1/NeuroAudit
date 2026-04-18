import { useState ,useEffect} from 'react';
import {Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, Check, Zap, Crown } from 'lucide-react';
import axios from 'axios';

const Pricing = () => {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [Plan, setSubsPlan] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const{token,logout,user,isEmailConfirmed}=useAuth()



  const checkOutSession= async (priceId:string)=>{
    if(!token){
      navigate("/signin")
      toast({
        title: 'Pls Login First',
      });
    }else{
    try {
       const res = await axios.post(
  'http://localhost:3000/plan/session',
  {}, // empty body
  {
    headers: {
      Authorization: `${token}`,
    },
    params: {
      priceId: priceId,
    }
  }
);
      const checkoutUrl: string = res.data.url;
      window.location.href = checkoutUrl;
    } catch (error) {
       console.error('Error creating checkout session:', error);
        alert('Payment failed. Please try again.');
    }
  }

  }
  


  const fetchSubscription = async () => {
      if (!token) return;

      try {
        const res = await axios.get('http://localhost:3000/plan/subs', {
          headers: {
            Authorization: `${token}`
          }
        });
        console.log(res.data.subscriptions)
        if (res.data.subscriptions.length > 0) {
          setSubsPlan(res.data.subscriptions);
        }
      } catch (error) {
        console.error("Error checking subscription:", error);
      }
    };

  useEffect(() => {
    fetchSubscription();
    if(!isEmailConfirmed){
       toast({
        title: 'Pls Confirm your email to be able to subscribe',
      });
    }
  }, [token,isEmailConfirmed]);



  return (
      <div className="min-h-screen">
          {/* Navigation */}
          <nav className="fixed w-full z-50 glass-card border-b border-white/10">
            <div className="container mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <Link to="/" className="text-2xl font-bold glow-text">
                  NeuroAudit
                </Link>
                <div className="flex gap-4 items-center">
                  {token && user ? (
                    <>
                      <span className="text-white text-sm md:text-base font-medium">
                       <Link to="/profile">
                        Welcome, {user.name}
                       </Link>
                      </span>
                      <Button
                        variant="ghost"
                        className="text-red-400 hover:bg-red-500/10"
                        onClick={() => {
                          logout();
                          navigate('/');
                        }}
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link to="/signin">
                        <Button variant="ghost" className="text-white hover:bg-white/10">
                          Sign In
                        </Button>
                      </Link>
                      <Link to="/signup">
                        <Button className="cyber-button">
                          Get Started
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </nav>
      <div className="container mx-auto px-6 py-12 mt">
        <div className="text-center mb-16 mt-14">
          <h1 className="text-5xl font-bold glow-text mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Select the perfect plan to secure your code and protect your applications
          </p>
        </div>

        {/* Pricing Cards */}
        <div  className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto" >
          {/* Monthly */}
          <div className="neuro-card p-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <Zap className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Monthly</h3>
              <div className="text-4xl font-bold glow-text">
                $10<span className="text-lg text-gray-400">/month</span>
              </div>
            </div>
            <ul className="space-y-4 mb-8">
              {[
                "1,000 code analyses per month",
                "Real-time vulnerability detection",
                "Basic security reports",
                "Email support",
                "Custom security rules",
                "24/7 priority support",
                "API access",
                "Team collaboration",
              ].map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  {index < 4 ? (
                    <>
                      <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </>
                  ) : (
                    <>
                      <Check className="h-5 w-5 text-gray-700 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-500 line-through">{feature}</span>
                    </>
                  )}
                </li>
              ))}
            </ul>
            <Button
              onClick={() => checkOutSession("price_1RXecbRqBqokj6ezpUNa94uu")}
              disabled={Plan === '1-Month Plan'||Plan!=null||!isEmailConfirmed}
              className="w-full text-lg py-3 bg-white/10 hover:bg-white/20 text-white"
            >
              {Plan === '1-Month Plan'? 'Subscribed' : 'Subscribe'}
            </Button>
          </div>

          {/* 6 Months */}
          <div className="neuro-card p-8 ring-2 ring-purple-400 animate-glow-pulse relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="cyber-gradient px-4 py-2 rounded-full text-sm font-medium text-white">
                Most Popular
              </span>
            </div>
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <Shield className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">3 Months</h3>
              <p className="text-green-400 text-sm mb-2">Save 15%</p>
              <div className="text-4xl font-bold glow-text">
                $25<span className="text-lg text-gray-400">/3 months</span>
              </div>
            </div>
            <ul className="space-y-4 mb-8">
              {[
                "8,000 code analyses 3 months)",
                "Advanced vulnerability detection",
                "Priority email support",
                "Custom security rules",
                "24/7 priority support",
                "API access",
                "Team collaboration",
              ].map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  {index < 4 ? (
                    <>
                      <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </>
                  ) : (
                    <>
                      <Check className="h-5 w-5 text-gray-700 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-500 line-through">{feature}</span>
                    </>
                  )}
                </li>
              ))}
            </ul>
            <Button
              onClick={() => checkOutSession("price_1RXed0RqBqokj6ez7iXlHJ9N")}
              disabled={Plan === '3-Months Plan'||!isEmailConfirmed || Plan!=null}
              className="w-full text-lg py-3 cyber-button"
            >
              {Plan === '3-Months Plan'? 'Subscribed' : 'Subscribe'}
            </Button>
          </div>

          {/* Yearly */}
          <div className="neuro-card p-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <Crown className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Yearly</h3>
              <p className="text-green-400 text-sm mb-2">Save 20%</p>
              <div className="text-4xl font-bold glow-text">
                $60<span className="text-lg text-gray-400">/year</span>
              </div>
            </div>
            <ul className="space-y-4 mb-8">
              {[
                "Unlimited code analyses",
                "Enterprise vulnerability detection",
                "Comprehensive security reports",
                "24/7 priority support",
                "Custom security rules",
                "API access",
                "Team collaboration",
              ].map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              onClick={() => checkOutSession("price_1RXedgRqBqokj6ezxC6ugTql")}
              disabled={Plan === '1-Year Plan'||!isEmailConfirmed ||Plan!=null}
              className="w-full text-lg py-3 bg-white/10 hover:bg-white/20 text-white"
            >
              {Plan === '1-Year Plan'? 'Subscribed' : 'Subscribe'}
            </Button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold glow-text text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold text-white mb-3">
                Can I change my plan later?
              </h3>
              <p className="text-gray-300">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold text-white mb-3">
                Is there a free trial?
              </h3>
              <p className="text-gray-300">
                Yes, all plans come with a 7-day free trial. No credit card required to start.
              </p>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold text-white mb-3">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-300">
                We accept all major credit cards and PayPal through our secure Stripe integration.
              </p>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold text-white mb-3">
                Is my code data secure?
              </h3>
              <p className="text-gray-300">
                Absolutely. We use bank-level encryption and never store your code permanently.
              </p>
            </div>
          </div>
        </div>
      </div>
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="container mx-auto text-center text-gray-400">
          <p>&copy; 2024 SecureCode. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Pricing;
