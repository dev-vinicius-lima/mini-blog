import { ReactNode, createContext, useContext } from "react";

interface AuthContextType {
  user: {
    uid: string;
    displayName: string;
  };
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
