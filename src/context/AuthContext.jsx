import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [language, setLanguage] = useState('en');

  // Initialize auth, theme, and language on mount
  useEffect(() => {
    initializeAuth();
    initializeTheme();
    initializeLanguage();
  }, []);

  const initializeAuth = () => {
    try {
      const currentUser = authService.getCurrentUser();
      const token = authService.getToken();
      
      if (currentUser && token) {
        setUser(currentUser);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      setError('Failed to initialize authentication');
    } finally {
      setLoading(false);
    }
  };

  const initializeTheme = () => {
    try {
      const storedTheme = localStorage.getItem('theme') || 'dark';
      const isDark = storedTheme === 'dark';
      setIsDarkMode(isDark);
      applyTheme(isDark);
    } catch (error) {
      console.error('Theme initialization error:', error);
    }
  };

  const initializeLanguage = () => {
    try {
      const storedLanguage = localStorage.getItem('language') || 'en';
      setLanguage(storedLanguage);
    } catch (error) {
      console.error('Language initialization error:', error);
    }
  };

  const applyTheme = (isDark) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    applyTheme(newTheme);
    // Dispatch custom event for components to listen
    window.dispatchEvent(new CustomEvent('themeChange', { detail: { isDarkMode: newTheme } }));
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    window.dispatchEvent(new CustomEvent('languageChange', { detail: { language: lang } }));
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login(credentials);
      setUser(response.data);
      return response;
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    authService.logout();
  };

  const updateUser = (userData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...userData
    }));
    localStorage.setItem('user', JSON.stringify({
      ...user,
      ...userData
    }));
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    clearError,
    loading,
    error,
    isDarkMode,
    toggleTheme,
    language,
    changeLanguage,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isGuide: user?.role === 'guide',
    isUser: user?.role === 'user',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;




// import React, { createContext, useContext, useState, useEffect } from 'react';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isDarkMode, setIsDarkMode] = useState(true);
//   const [language, setLanguage] = useState('en');
//   const [loading, setLoading] = useState(true);

//   // Initialize theme and language from localStorage
//   useEffect(() => {
//     const storedTheme = localStorage.getItem('theme') || 'dark';
//     const storedLanguage = localStorage.getItem('language') || 'en';
    
//     setIsDarkMode(storedTheme === 'dark');
//     setLanguage(storedLanguage);
    
//     // Apply theme to document
//     applyTheme(storedTheme);
    
//     setLoading(false);
//   }, []);

//   const applyTheme = (theme) => {
//     if (theme === 'dark') {
//       document.documentElement.classList.add('dark');
//     } else {
//       document.documentElement.classList.remove('dark');
//     }
//   };

//   const toggleTheme = () => {
//     const newTheme = isDarkMode ? 'light' : 'dark';
//     setIsDarkMode(!isDarkMode);
//     localStorage.setItem('theme', newTheme);
//     applyTheme(newTheme);
//     // Dispatch custom event for components to listen
//     window.dispatchEvent(new CustomEvent('themeChange', { detail: { theme: newTheme } }));
//   };

//   const changeLanguage = (lang) => {
//     setLanguage(lang);
//     localStorage.setItem('language', lang);
//   };

//   const login = (userData) => {
//     setUser(userData);
//     localStorage.setItem('user', JSON.stringify(userData));
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('user');
//   };

//   const isAdmin = () => user?.role === 'admin';
//   const isGuide = () => user?.role === 'guide';
//   const isTourist = () => user?.role === 'user' || user?.role === 'tourist';

//   const value = {
//     user,
//     setUser,
//     login,
//     logout,
//     isDarkMode,
//     toggleTheme,
//     language,
//     changeLanguage,
//     loading,
//     isAdmin,
//     isGuide,
//     isTourist,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within AuthProvider');
//   }
//   return context;
// };
