import { useState, useEffect } from "react";

/**
 * Custom hook untuk autentikasi JWT + Google OAuth
 * Backend: FastAPI
 * Frontend: React (Vite/CRA)
 */

interface User {
  email: string;
  name: string;
  picture: string;
  email_verified?: boolean;
}

interface UseAuthReturn {
  user: User | null;
  token: string | null;
  loading: boolean;
  loginWithGoogle: () => void;
  logout: () => Promise<void>;
}

export default function useAuth(baseUrl = "http://localhost:8000/api"): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("access_token"));
  const [loading, setLoading] = useState(true);

  const loginWithGoogle = () => {
    window.location.href = `${baseUrl}/auth/google`;
  };

  const logout = async () => {
    try {
      if (!token) {
        // console.warn("⚠️ No token to logout");
        return;
      }

      const res = await fetch(`${baseUrl}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (data.success) {
        // console.log("✅ Logout successful");
        localStorage.removeItem("access_token");
        setUser(null);
        setToken(null);
      }
    } catch (err) {
      // console.error("❌ Logout error:", err);
      // Tetap clear token meskipun request gagal
      localStorage.removeItem("access_token");
      setUser(null);
      setToken(null);
    }
  };

  const getCurrentUser = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // console.log("🔑 Fetching current user with token:", token.substring(0, 20) + "...");
      const res = await fetch(`${baseUrl}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        // console.warn("⚠️ Token invalid or expired");
        localStorage.removeItem("access_token");
        setToken(null);
        setUser(null);
        setLoading(false);
        return;
      }

      if (res.status === 404) {
        // console.warn("❌ User not found");
        localStorage.removeItem("access_token");
        setToken(null);
        setUser(null);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        // console.warn("⚠️ Unexpected response:", res.status);
        localStorage.removeItem("access_token");
        setToken(null);
        setUser(null);
        setLoading(false);
        return;
      }

      const data = await res.json();
      if (data.success && data.user) {
        // console.log("✅ User ditemukan:", data.user);
        setUser(data.user);
      } else {
        // console.warn("❌ Tidak ada data user di response:", data);
        localStorage.removeItem("access_token");
        setToken(null);
        setUser(null);
      }
    } catch (err) {
      console.error("❌ Fetch user error:", err);
      localStorage.removeItem("access_token");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");

    if (tokenFromUrl) {
      localStorage.setItem("access_token", tokenFromUrl);
      setToken(tokenFromUrl);
      // Hapus ?token=... dari URL
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);
  useEffect(() => {
    if (token) {
      getCurrentUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  return { user, token, loading, loginWithGoogle, logout };
}