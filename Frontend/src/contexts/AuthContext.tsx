
// import React, { createContext, useContext, useEffect, useState } from 'react';

// interface User {
//   StripeId: string;
//   name: string;
// }

// interface AuthContextType {
//   token: string | null;
//   user: User | null;
//   isAuthenticated: boolean;
//   setToken: (token: string) => void;
//   setUser: (user: User) => void;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [token, setTokenState] = useState<string | null>(null);
//   const [user, setUser] = useState<User | null>(null);

//   useEffect(() => {
//     // Load token from localStorage on mount
//     const savedToken = localStorage.getItem('token');
//     if (savedToken) {
//       setTokenState(savedToken);
//     }
//   }, []);

//   const setToken = (newToken: string) => {
//     localStorage.setItem('token', newToken);
//     setTokenState(newToken);
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     setTokenState(null);
//     setUser(null);
//   };

//   const isAuthenticated = !!token;

//   return (
//     <AuthContext.Provider
//       value={{
//         token,
//         user,
//         isAuthenticated,
//         setToken,
//         setUser,
//         logout,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };
import { Flag } from 'lucide-react';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  StripeId: string;
  name: string;
  isEmailVerified:boolean;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isEmailConfirmed:boolean;
  loading: boolean;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEmailConfirmed, setIsEmailConfirmed] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken) {
      setTokenState(savedToken);
    }

    if (savedUser) {
      try {
        setUserState(JSON.parse(savedUser));
        setIsEmailConfirmed(JSON.parse(savedUser).isEmailVerified)
      } catch (err) {
        console.error("Failed to parse saved user from localStorage", err);
        setUserState(null);
      }
    }
    setLoading(false);
  }, []);

  const setToken = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setTokenState(newToken);
  };

  const setUser = (newUser: User) => {
    localStorage.setItem('user', JSON.stringify(newUser));
    setUserState(newUser);
    setIsEmailConfirmed(newUser.isEmailVerified)
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setTokenState(null);
    setUserState(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        loading,
        isEmailConfirmed,
        setToken,
        setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
