import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext, UserInfo } from "./authContextDefs.ts";
import useLocalStorage from "../hooks/useLocalStorage.ts";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useLocalStorage<string | null>(
    "accessToken",
    null,
  );
  const [userInfo, setUserInfo] = useLocalStorage<UserInfo | null>(
    "userInfo",
    null,
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const navigate = useNavigate();

  // --- Login Function ---
  const login = useCallback(
    (token: string, user: UserInfo) => {
      // console.log("AuthProvider: Logging in...", { token, user });
      try {
        setAccessToken(token);
        setUserInfo(user);
        navigate("/");
      } catch (error) {
        console.error(
          "AuthProvider: Error during login state update/storage:",
          error,
        );
        setAccessToken(null);
        setUserInfo(null);
      }
    },
    [setAccessToken, setUserInfo, navigate],
  );

  const logout = useCallback(() => {
    // console.log("AuthProvider: Logging out...");
    try {
      setAccessToken(null);
      setUserInfo(null);
      navigate("/login");
    } catch (error) {
      console.error(
        "AuthProvider: Error during logout state update/storage:",
        error,
      );
    }
  }, [setAccessToken, setUserInfo, navigate]);

  // -- Context Value ---
  // Memoize the context value to prevent unnecessary re-renders of consumers
  // Only updates if the states values actually change
  const contextValue = React.useMemo(
    () => ({
      accessToken,
      userInfo,
      login,
      logout,
      isLoading,
    }),
    [accessToken, userInfo, isLoading, login, logout],
  );

  // -- Provide the Context ---
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
