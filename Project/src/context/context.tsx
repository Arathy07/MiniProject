import { createContext, useContext, useState, ReactNode } from "react";
import { User } from "../interfaces/Common";

// Define the context type including the new language state and function
interface AppContextType {
  user: User;
  setUser: (newUser: User) => void;
}

const defaultUser = { userName: "", email: "" };
export const AppContext = createContext<AppContextType | undefined>({
  user: defaultUser,
  setUser: () => {},
});

export function useAppContext(): AppContextType {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("Context undefined");
  }
  return context;
}

// Add the dynamic language state and function to update it
interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<User>(defaultUser);

  const changeUser = (newUser: User) => {
    setUser(newUser);
  };

  const contextValue: AppContextType = {
    ...useAppContext(), // If there are other values in the context, include them here
    user: user,
    setUser: changeUser,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
