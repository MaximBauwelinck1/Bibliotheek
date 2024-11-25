// src/contexts/Auth.context.jsx
import {
  createContext, // 👈 1
  useState, // 👈 4
  useCallback, // 👈 6
  useMemo, // 👈 5
} from 'react';
import useSWRMutation from 'swr/mutation'; // 👈 8
import * as api from '../api'; // 👈 8
import useSWR from 'swr';
  
export const JWT_TOKEN_KEY = 'jwtToken'; // 👈 13
export const AuthContext = createContext(); // 👈 1
  
// 👇 2
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem(JWT_TOKEN_KEY)); // 👈 4 en 13
  
  // 👇 14
  const {
    data: user,
    loading: userLoading,
    error: userError,
  } = useSWR(token ? 'users/me' : null, api.getById);
  
  const {
    trigger: doLogin,
    isMutating: loginLoading,
    error: loginError,
  } = useSWRMutation('sessions', api.post); // 👈 8
  
  // 👇 5 en 6
  const login = useCallback(
    async (email, password) => {
      try {
        // 👇 7
        const { token } = await doLogin({
          email,
          password,
        });
  
        setToken(token); // 👈 8
  
        localStorage.setItem(JWT_TOKEN_KEY, token); // 👈 13
  
        return true; // 👈 10
      } catch (error) {
        // 👇 10
        console.error(error);
        return false;
      }
    },
    [doLogin],
  );
  
  // 👇 11
  const logout = useCallback(() => {
    setToken(null);
  
    localStorage.removeItem(JWT_TOKEN_KEY);
  }, []);
  
  // 👇 5 en 7 en 9 en 12 en 14
  const value = useMemo(
    () => ({
      user,
      error: loginError || userError,
      loading: loginLoading || userLoading,
      login,
      logout,
    }),
    [user, loginError, loginLoading, userError, userLoading, login, logout],
  );
  
  // 👇 3
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
  