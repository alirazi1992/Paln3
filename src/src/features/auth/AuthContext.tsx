import React, { useEffect, useState, createContext, useContext } from "react";

export type UserRole = "admin" | "technician" | "client";

export const roleHomePath: Record<UserRole, string> = {
  admin: "/dashboard",
  technician: "/dashboard/technician",
  client: "/dashboard/client",
};

export const getHomePathForRole = (role?: UserRole | null) =>
  role ? roleHomePath[role] : roleHomePath.admin;

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<UserProfile>;
  logout: () => void;
}

const roleProfiles: Record<
  UserRole,
  { name: string; avatar: string; defaultEmail: string }
> = {
  admin: {
    name: "سارا احمدی",
    avatar: "https://i.pravatar.cc/150?img=5",
    defaultEmail: "admin@navalhub.ir",
  },
  technician: {
    name: "مهدی رضوی",
    avatar: "https://i.pravatar.cc/150?img=15",
    defaultEmail: "tech@navalhub.ir",
  },
  client: {
    name: "لیلا جعفری",
    avatar: "https://i.pravatar.cc/150?img=32",
    defaultEmail: "client@navalhub.ir",
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function inferRoleFromEmail(email: string): UserRole {
  const e = (email || "").toLowerCase().trim();
  if (e.startsWith("admin@")) return "admin";
  if (e.startsWith("tech@") || e.startsWith("technician@")) return "technician";
  return "client";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    const storedRole = localStorage.getItem("authRole") as UserRole | null;
    const storedEmail = localStorage.getItem("authEmail") || "";
    if (auth === "true") {
      const role =
        storedRole ?? inferRoleFromEmail(storedEmail || "client@navalhub.ir");
      if (!storedRole) localStorage.setItem("authRole", role);
      const profile = roleProfiles[role];
      setIsAuthenticated(true);
      setUser({
        name: profile.name,
        email: storedEmail || profile.defaultEmail,
        avatar: profile.avatar,
        role,
      });
    }
  }, []);

  const login = async (
    email: string,
    _password: string
  ): Promise<UserProfile> => {
    // MOCK: replace with your real API call if needed
    await new Promise((r) => setTimeout(r, 400));
    const role = inferRoleFromEmail(email);

    localStorage.setItem("auth", "true");
    localStorage.setItem("authRole", role);
    localStorage.setItem("authEmail", email);

    const base = roleProfiles[role];
    const loggedIn: UserProfile = {
      name: base.name,
      email: email || base.defaultEmail,
      avatar: base.avatar,
      role,
    };

    setIsAuthenticated(true);
    setUser(loggedIn);
    return loggedIn;
  };

  const logout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("authRole");
    localStorage.removeItem("authEmail");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
