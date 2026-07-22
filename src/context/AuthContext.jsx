import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize and load persistent session from localStorage on mount
  useEffect(() => {
    try {
      const activeSession = localStorage.getItem("luxe_active_user");
      if (activeSession) {
        const parsed = JSON.parse(activeSession);
        setUser({ uid: parsed.uid, email: parsed.email });
        setUserData(parsed);
      }
    } catch (err) {
      console.error("Failed to load local session:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Register a new user locally (saved to localStorage list)
  const register = async (email, password) => {
    // Delay to simulate network requests
    await new Promise((resolve) => setTimeout(resolve, 800));

    const normalizedEmail = email.toLowerCase().trim();
    const storedUsers = localStorage.getItem("luxe_users");
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    const exists = users.some((u) => u.email === normalizedEmail);
    if (exists) {
      throw new Error("This email address is already registered.");
    }

    const newUser = {
      uid: `user_${Date.now()}`,
      email: normalizedEmail,
      password: password, // For simplicity in mock local database
      role: normalizedEmail === "admin@auraperfumes.com" ? "admin" : "user",
      createdAt: new Date().toISOString(),
      savedAddress: null,
    };

    users.push(newUser);
    localStorage.setItem("luxe_users", JSON.stringify(users));

    // Auto-login after registration
    localStorage.setItem("luxe_active_user", JSON.stringify(newUser));
    setUser({ uid: newUser.uid, email: newUser.email });
    setUserData(newUser);

    return newUser;
  };

  // Sign in an existing user locally
  const login = async (email, password) => {
    // Delay to simulate network requests
    await new Promise((resolve) => setTimeout(resolve, 800));

    const normalizedEmail = email.toLowerCase().trim();
    
    // Seed default admin account if local storage is completely empty
    const storedUsers = localStorage.getItem("luxe_users");
    let users = storedUsers ? JSON.parse(storedUsers) : [];

    if (users.length === 0) {
      // Seed default admin and a sample user
      const defaultAdmin = {
        uid: "admin_1",
        email: "admin@auraperfumes.com",
        password: "adminpassword",
        role: "admin",
        createdAt: new Date().toISOString(),
        savedAddress: null,
      };
      const sampleUser = {
        uid: "user_1",
        email: "customer@auraperfumes.com",
        password: "password123",
        role: "user",
        createdAt: new Date().toISOString(),
        savedAddress: null,
      };
      users = [defaultAdmin, sampleUser];
      localStorage.setItem("luxe_users", JSON.stringify(users));
    }

    const foundUser = users.find(
      (u) => u.email === normalizedEmail && u.password === password
    );

    if (!foundUser) {
      throw new Error("Invalid email or password.");
    }

    localStorage.setItem("luxe_active_user", JSON.stringify(foundUser));
    setUser({ uid: foundUser.uid, email: foundUser.email });
    setUserData(foundUser);

    return foundUser;
  };

  // Sign out the current user locally
  const logout = async () => {
    localStorage.removeItem("luxe_active_user");
    setUser(null);
    setUserData(null);
  };

  // Save address helper inside localStorage list
  const updateAddress = async (address) => {
    if (!userData) return;

    // Delay to simulate network requests
    await new Promise((resolve) => setTimeout(resolve, 500));

    const storedUsers = localStorage.getItem("luxe_users");
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    const userIndex = users.findIndex((u) => u.uid === userData.uid);
    const updatedUser = { ...userData, savedAddress: address };

    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem("luxe_users", JSON.stringify(users));
    }

    localStorage.setItem("luxe_active_user", JSON.stringify(updatedUser));
    setUserData(updatedUser);
  };

  // Check if current user has admin access
  const isAdmin =
    user?.email === "admin@auraperfumes.com" ||
    userData?.role === "admin";

  // Prevent app render flash during loading
  if (loading) return null;

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        isAdmin,
        register,
        login,
        logout,
        updateAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);