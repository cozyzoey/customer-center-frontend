import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { NEXT_URL } from "@/static/config";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const register = async (userInfo) => {
    setError(null);
    setLoading(true);

    const res = await fetch(`${NEXT_URL}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    });

    const { user, message } = await res.json();

    if (res.ok) {
      setUser(user);
      router.push("/");
    } else {
      setError(message);
    }

    setLoading(false);
  };

  const login = async ({ email: identifier, password }) => {
    setError(null);
    setLoading(true);

    const res = await fetch(`${NEXT_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier,
        password,
      }),
    });

    const { user, message } = await res.json();

    if (res.ok) {
      setUser(user);
      toast.success("반갑습니다:)");
      router.push("/");
    } else {
      setError(message);
    }

    setLoading(false);
  };

  const logout = async () => {
    setLoading(true);

    const res = await fetch(`${NEXT_URL}/api/logout`, {
      method: "POST",
    });

    if (res.ok) {
      setUser(null);
      router.push("/");
    }

    setLoading(false);
  };

  const checkUserLoggedIn = async () => {
    const res = await fetch(`${NEXT_URL}/api/user`);
    const { user } = await res.json();

    if (res.ok) {
      setUser(user);
    } else {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, error, loading, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
