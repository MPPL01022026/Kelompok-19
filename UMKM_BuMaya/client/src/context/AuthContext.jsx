import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('family_kupi_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  // Check session on mount
  useEffect(() => {
    async function checkSession() {
      try {
        const data = await api.auth.me();
        if (data?.user) {
          setUser(data.user);
          localStorage.setItem('family_kupi_user', JSON.stringify(data.user));
        }
      } catch (err) {
        // Not logged in or session expired
        // Keep cached user if offline or clear if needed
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, []);

  const login = async (username, password) => {
    try {
      const data = await api.auth.login(username, password);
      if (data?.user) {
        setUser(data.user);
        localStorage.setItem('family_kupi_user', JSON.stringify(data.user));
        return { success: true, message: data.message };
      }
      return { success: false, message: 'Gagal login.' };
    } catch (err) {
      // Local fallback for offline demo testing if server is unreachable
      if (username.trim().toLowerCase() === 'bumaya' && password === 'familykupi123') {
        const localUser = {
          id: 1,
          username: 'bumaya',
          nama: 'Bu Maya',
          role: 'Pemilik Warung',
        };
        setUser(localUser);
        localStorage.setItem('family_kupi_user', JSON.stringify(localUser));
        return { success: true };
      }
      return { success: false, message: err.message || 'Username atau password salah!' };
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch (err) {
      console.warn('Logout API failed:', err);
    } finally {
      setUser(null);
      localStorage.removeItem('family_kupi_user');
    }
  };

  const updateProfile = async (formData) => {
    try {
      const res = await api.auth.updateProfile(formData);
      if (res?.user) {
        setUser(res.user);
        localStorage.setItem('family_kupi_user', JSON.stringify(res.user));
        return { success: true, message: res.message };
      }
      return { success: false, message: 'Gagal memperbarui profil.' };
    } catch (err) {
      return { success: false, message: err.message || 'Gagal memperbarui username atau kata sandi.' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
