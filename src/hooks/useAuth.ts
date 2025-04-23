import { useContext } from "react";
import { AuthContext, IAuthContext } from "../context/authContextDefs.ts";

/**
 * Custom hook to consume the Authentication Context.
 * Provides easy access to auth state (accessToken, userInfo, isLoading)
 * and functions (login, logout).
 *
 * Throws an error if used outside an AuthProvider.
 */
export const useAuth = (): IAuthContext => {
  const context = useContext(AuthContext);

  // --- Runtime Check ---
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  // --- Check for Default Value ---
  if (
    context.accessToken === null &&
    context.userInfo === null &&
    context.isLoading &&
    !("login" in context)
  ) {
    console.warn(
      "useAuth called possibly before AuthProvider initialized fully",
    );
  }

  return context;
};
