// // export default Landing;
// import { useEffect, useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Shield, Zap, Lock, Eye } from 'lucide-react';
// import { useAuth } from '@/contexts/AuthContext';
// import { Link, useNavigate } from 'react-router-dom';
// import { useToast } from "@/hooks/use-toast";
// import axios from 'axios';

// const Landing = () => {
//   const { token, user, logout } = useAuth();
//   const navigate = useNavigate();
//   const [hasSubscription, setHasSubscription] = useState(false);
//   const { toast } = useToast();

//   const fetchSubscription = async () => {
//       if (!token) return;

//       try {
//         const res = await axios.get('http://localhost:3000/plan/subs', {
//           headers: {
//             Authorization: `${token}`
//           }
//         });
//         console.log(res)
//         if (res.data.subscriptions.length > 0) {
//           setHasSubscription(true);
//         }
//       } catch (err: any) {
//       // Axios throws for 401 here
//       if (err.response?.status === 401) {
//         setHasSubscription(false)
//         logout();
//         navigate("/signin");
//         toast({
//           title: "Session expired",
//           description: "Sign in again",
//           variant: "destructive",
//         });
//       } else {
//         toast({ title: err.response?.status  });
//       }
//     }
//   };

//   useEffect(() => {
//     if (!token) {
//     setHasSubscription(false); // Reset on logout
//     return;
//   }
//     fetchSubscription();
//   }, []);

//   const features = [
//     {
//       icon: <Shield className="h-8 w-8 text-purple-400" />,
//       title: "Advanced Vulnerability Detection",
//       description: "Our AI-powered engine scans your code for security vulnerabilities with 99.9% accuracy."
//     },
//     {
//       icon: <Zap className="h-8 w-8 text-purple-400" />,
//       title: "Real-time Analysis",
//       description: "Get instant feedback on your code security. No waiting, no delays - just immediate results."
//     },
//     {
//       icon: <Lock className="h-8 w-8 text-purple-400" />,
//       title: "Enterprise Security",
//       description: "Bank-level encryption ensures your code remains private and secure throughout the analysis."
//     },
//     {
//       icon: <Eye className="h-8 w-8 text-purple-400" />,
//       title: "Detailed Reports",
//       description: "Comprehensive vulnerability reports with fix suggestions and severity ratings."
//     }
//   ];

//   return (
//     <div className="min-h-screen">
//       {/* Navigation */}
//       <nav className="fixed w-full z-50 glass-card border-b border-white/10">
//         <div className="container mx-auto px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="text-2xl font-bold glow-text">
//               NeuroAudit 
//             </div>
//             <div className="flex gap-4 items-center">
//               {token && user ? (
//                 <>
//                   <span className="text-white text-sm md:text-base font-medium">
//                     <Link to="/profile">
//                         Welcome, {user.name}
//                     </Link>
                   
//                   </span>
//                   <Button
//                     variant="ghost"
//                     className="text-red-400 hover:bg-red-500/10"
//                     onClick={() => {
//                       logout();
//                       navigate('/');
//                     }}
//                   >
//                     Logout
//                   </Button>
//                 </>
//               ) : (
//                 <>
//                   <Link to="/signin">
//                     <Button variant="ghost" className="text-white hover:bg-white/10">
//                       Sign In
//                     </Button>
//                   </Link>
//                   <Link to="/signup">
//                     <Button className="cyber-button">
//                       Get Started
//                     </Button>
//                   </Link>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <section className="pt-32 pb-20 px-6">
//         <div className="container mx-auto text-center">
//           <div className="animate-fade-in">
//             <h1 className="text-6xl md:text-7xl font-bold mb-6 glow-text">
//               Secure Your Code
//               <span className="cyber-gradient bg-clip-text text-white block my-4">
//                 <p className='opacity-50 '>
//                    Before It's Too Late
//                 </p>
               
//               </span>
//             </h1>
//             <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
//               Advanced AI-powered vulnerability detection that scans your code in real-time. 
//               Protect your applications from security threats before they become problems.
//             </p>
//             {!hasSubscription &&
//             <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
//               {!token&&<Link to="/signup">
//                 <Button size="lg" className="cyber-button text-lg px-8 py-4">
//                   Start Free Trial
//                 </Button>
//               </Link>}
//               <Link to="/pricing">
//                 <Button size="lg" variant="outline" className="border-purple-500 text-purple-300 hover:bg-purple-500/10 text-lg px-8 py-4">
//                   View Pricing
//                 </Button>
//               </Link>
//             </div>
//             }
//             {/* Detector Button */}
//             {hasSubscription && (
//               <Link to="/dashboard">
//                 <Button size="lg" className="cyber-button text-lg px-8 py-4">
//                   Go to Detector
//                 </Button>
//               </Link>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="py-20 px-6">
//         <div className="container mx-auto">
//           <div className="text-center mb-16">
//             <h2 className="text-4xl md:text-5xl font-bold mb-4 glow-text">
//               Why Choose SecureCode?
//             </h2>
//             <p className="text-xl text-gray-400 max-w-2xl mx-auto">
//               Built by security experts, trusted by developers worldwide
//             </p>
//           </div>

//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {features.map((feature, index) => (
//               <div key={index} className="neuro-card p-6 text-center animate-fade-in hover:scale-105 transition-transform duration-300">
//                 <div className="mb-4 flex justify-center">
//                   {feature.icon}
//                 </div>
//                 <h3 className="text-xl font-semibold mb-3 text-white">
//                   {feature.title}
//                 </h3>
//                 <p className="text-gray-300 leading-relaxed">
//                   {feature.description}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}

//       {!token&&<section className="py-20 px-6">
//         <div className="container mx-auto text-center">
//           <div className="neuro-card p-12 max-w-4xl mx-auto">
//             <h2 className="text-4xl md:text-5xl font-bold mb-6 glow-text">
//               Ready to Secure Your Code?
//             </h2>
//             <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
//               Join thousands of developers who trust SecureCode to protect their applications.
//             </p>
//             <Link to="/signup">
//               <Button size="lg" className="cyber-button text-lg px-8 py-4 animate-glow-pulse">
//                 Get Started Now
//               </Button>
//             </Link>
//           </div>
//         </div>
//       </section>}

//       {/* Footer */}
//       <footer className="py-12 px-6 border-t border-white/10">
//         <div className="container mx-auto text-center text-gray-400">
//           <p>&copy; 2024 SecureCode. All rights reserved.</p>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Landing;
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Zap, Lock, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import axios from 'axios';

const Landing = () => {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [hasSubscription, setHasSubscription] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(true);

  useEffect(() => {
    setCheckingSubscription(true)
    const checkSubscription = async () => {
      if (!token) {
        setHasSubscription(false);
        setCheckingSubscription(false);
        return;
      }

      try {
        const res = await axios.get('http://localhost:3000/plan/subs', {
          headers: {
            Authorization: `${token}`,
          },
        });

        if (res.data.subscriptions.length > 0) {
          setHasSubscription(true);
        } else {
          setHasSubscription(false);
        }
      } catch (err: any) {
        if (err.response?.status === 401) {
          logout();
          navigate("/signin");
          toast({
            title: "Session expired",
            description: "Please sign in again",
            variant: "destructive",
          });
        } else {
          toast({ title: "Subscription check failed" });
        }
      } finally {
        setCheckingSubscription(false);
      }
    };

    checkSubscription();
  }, [token,navigate]);

  const features = [
    {
      icon: <Shield className="h-8 w-8 text-purple-400" />,
      title: "Advanced Vulnerability Detection",
      description: "Our AI-powered engine scans your code for security vulnerabilities with 99.9% accuracy."
    },
    {
      icon: <Zap className="h-8 w-8 text-purple-400" />,
      title: "Real-time Analysis",
      description: "Get instant feedback on your code security. No waiting, no delays - just immediate results."
    },
    {
      icon: <Lock className="h-8 w-8 text-purple-400" />,
      title: "Enterprise Security",
      description: "Bank-level encryption ensures your code remains private and secure throughout the analysis."
    },
    {
      icon: <Eye className="h-8 w-8 text-purple-400" />,
      title: "Detailed Reports",
      description: "Comprehensive vulnerability reports with fix suggestions and severity ratings."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed w-full z-50 glass-card border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold glow-text">
              NeuroAudit
            </div>
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

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 glow-text">
              Secure Your Code
              <span className="cyber-gradient bg-clip-text text-white block my-4">
                <p className='opacity-50'>
                  Before It's Too Late
                </p>
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Advanced AI-powered vulnerability detection that scans your code in real-time.
              Protect your applications from security threats before they become problems.
            </p>

            {checkingSubscription ? (
              <Button disabled size="lg" className="cyber-button text-lg px-8 py-4 animate-pulse">
                Checking Subscription...
              </Button>
            ) : hasSubscription ? (<>
              <Link to="/dashboard">
                <Button size="lg" className="cyber-button text-lg px-8 py-4 mx-2">
                  Go to Detector
                </Button>
              </Link>
              <Link to="/pricing">
                  <Button size="lg" variant="outline" className="border-purple-500 text-purple-300 hover:bg-purple-500/10 mx-2 text-lg px-8 py-4">
                    View Pricing
                  </Button>
                </Link></>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
                {!token && (
                  <Link to="/signup">
                    <Button size="lg" className="cyber-button text-lg px-8 py-4">
                      Start Free Trial
                    </Button>
                  </Link>
                )}
                <Link to="/pricing">
                  <Button size="lg" variant="outline" className="border-purple-500 text-purple-300 hover:bg-purple-500/10 text-lg px-8 py-4">
                    View Pricing
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 glow-text">
              Why Choose SecureCode?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Built by security experts, trusted by developers worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="neuro-card p-6 text-center animate-fade-in hover:scale-105 transition-transform duration-300">
                <div className="mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!token && (
        <section className="py-20 px-6">
          <div className="container mx-auto text-center">
            <div className="neuro-card p-12 max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 glow-text">
                Ready to Secure Your Code?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of developers who trust SecureCode to protect their applications.
              </p>
              <Link to="/signup">
                <Button size="lg" className="cyber-button text-lg px-8 py-4 animate-glow-pulse">
                  Get Started Now
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="container mx-auto text-center text-gray-400">
          <p>&copy; 2024 SecureCode. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
