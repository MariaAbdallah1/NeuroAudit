// export default Profile;
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users, MessageCircle } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

type ProfileData = {
  name: string;
  email: string;
  isEmailVerified: boolean;
  subscription: string | null;
};

const Profile = () => {
  const { token, logout, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get<ProfileData>('http://localhost:3000/profile', {
          headers: { Authorization: `${token}` },
        });
        setProfile(res.data);
      } catch (error: any) {
          if (error.response?.status === 401) {
          logout();
          navigate("/signin");
          toast({
            title: "Session expired",
            description: "Please sign in again",
            variant: "destructive",
          })
        } else{
            toast({
          title: 'Error',
          description: error?.response?.data?.message || 'Failed to fetch profile',
          variant: 'destructive',
        });
          }
        
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-xl">
        Loading profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-lg">
        Profile not found or failed to load.
      </div>
    );
  }

  return (
    <>
      {/* Navigation */}
      <nav className="fixed w-full z-50 glass-card border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/"><div className="text-2xl font-bold glow-text text-white">NeuroAudit</div></Link>
            <div className="flex gap-4 items-center">
              {token && user ? (
                <>
                  <span className="text-white text-sm md:text-base font-medium">
                    Welcome, {profile.name}
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
                    <Button className="cyber-button">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Profile Card */}
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-24 bg-gradient-to-b from-[#1a0025] via-[#2d0146] to-[#0a0012]">
        <div className="relative w-full max-w-md">
          <div className="neuro-card p-8 pt-16 rounded-3xl shadow-xl text-center relative z-10">
            {/* Action buttons */}
            
            {/* Avatar */}
            <div className="absolute left-1/2 -top-14 -translate-x-1/2 z-20">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  profile.name
                )}&background=6b21a8&color=fff`}
                alt="Profile"
                className="w-28 h-28 rounded-full border-4 border-purple-400 shadow-lg bg-[#1a0025] object-cover"
              />
            </div>

            {/* Info */}
            <h1 className="mt-8 text-2xl font-bold glow-text text-white">{profile.name}</h1>
            <p className="text-purple-300 mb-1">{profile.email}</p>
            <p
              className={`text-sm ${
                profile.isEmailVerified ? 'text-green-400' : 'text-yellow-400'
              } mb-4`}
            >
              {profile.isEmailVerified ? 'Email Verified' : 'Email Not Verified'}
            </p>

            {/* Subscription */}
            <div className="bg-black/40 border border-purple-800 rounded-lg px-4 py-3 text-white mb-6">
              <p className="text-xs text-purple-300 uppercase mb-1">Current Plan</p>
              <p className="text-lg font-semibold">
                {profile.subscription || 'No Active Subscription'}
              </p>
            </div>

            {/* Upgrade Button */}
           {!profile.subscription&&<Link to="/pricing">
              <Button className="cyber-button w-40 mx-auto text-lg py-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-purple-600 hover:to-pink-600">
                Upgrade Plan
              </Button>
            </Link>}
          </div>
        </div>
      </div>
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="container mx-auto text-center text-gray-400">
          <p>&copy; 2024 SecureCode. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default Profile;
