import { createContext } from "react";

export interface UserInfo {
  pk: number;
  email: string;
}

export interface IAuthContext {
  accessToken: string | null;
  userInfo: UserInfo | null;
  login: (token: string, userInfo: UserInfo) => void;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<IAuthContext>({
  accessToken: null,
  userInfo: null,
  login: () => {},
  logout: () => {},
  isLoading: true,
});
