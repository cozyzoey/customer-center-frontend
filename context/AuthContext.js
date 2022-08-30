import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { NEXT_URL } from "@/constants/config";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
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

    const { user, token, message } = await res.json();

    setLoading(false);

    if (res.ok) {
      setUser(user);
      setToken(token);
    } else {
      setError(
        message === "Email or Username are already taken"
          ? "이메일이나 닉네임이 이미 사용중입니다."
          : message
      );
    }
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

    const { user, token, message } = await res.json();

    const convertErrorMessage = (msg) => {
      switch (msg) {
        case "Invalid identifier or password":
          return "이메일 혹은 비밀번호를 확인해주세요.";
        case "Your account email is not confirmed":
          return "보내드린 메일을 확인해주세요.";
        default:
          return msg;
      }
    };

    setLoading(false);

    if (res.ok) {
      setUser(user);
      setToken(token);
      toast.success("반갑습니다:)");
    } else {
      setError(convertErrorMessage(message));
    }
  };

  const logout = async () => {
    setLoading(true);

    const res = await fetch(`${NEXT_URL}/api/logout`, {
      method: "POST",
    });

    if (res.ok) {
      setUser(null);
      setToken(null);
      router.push("/");
    }

    setLoading(false);
  };

  const checkUserLoggedIn = async () => {
    const res = await fetch(`${NEXT_URL}/api/user`);
    const { user, token, message } = await res.json();

    if (res.ok) {
      setUser(user);
      setToken(token);
    } else if (
      message === "Missing or invalid credentials" ||
      message === "Invalid credentials"
    ) {
      logout();
    }
  };

  const resetError = () => setError(null);
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        error,
        resetError,
        loading,
        register,
        login,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
