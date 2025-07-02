import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { User } from "@/types/type";
import { GetUserNameFromCookieClient } from "@/lib/utils";

// 1. Define the context type
interface UserContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  refreshUser: () => void;
}

// 2. Initial user value
const initialUser: User = {
  name: "",
  email: "",
};

// 3. Create the context (undefined by default for safe guard)
const UserContext = createContext<UserContextType | undefined>(undefined);

// 4. UserProvider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(initialUser);

  const refreshUser = () => {
    const token = GetUserNameFromCookieClient();
    console.log("Refreshing user from cookie:", token);

    if (token && token.name) {
      setUser({ name: token.name, email: "" });
    } else {
      setUser(initialUser);
    }
  };

  useEffect(() => {
    // Get user data from cookie when component mounts
    refreshUser();
  }, []); // Empty dependency array - only run once on mount

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

// 5. Custom hook to use the context safely
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export default UserContext;
