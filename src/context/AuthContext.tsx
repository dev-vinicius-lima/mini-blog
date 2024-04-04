import { User } from "firebase/auth";
import { useContext, createContext, ReactNode } from "react";

interface AuthContextType {
  user: User | null;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  value,
}: {
  children?: ReactNode;
  value: AuthContextType | undefined;
}) {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthValue() {
  return useContext(AuthContext);
}
