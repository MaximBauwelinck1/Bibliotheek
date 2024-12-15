import {
  createContext,
  useState, 
  useCallback, 
  useMemo, 
} from 'react';
import useSWRMutation from 'swr/mutation'; 
import * as api from '../api'; 
import useSWR from 'swr';
  
export const JWT_TOKEN_KEY = 'jwtToken'; 
export const AuthContext = createContext(); 

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem(JWT_TOKEN_KEY)); 
  const {
    data: user,
    loading: userLoading,
    error: userError,
  } = useSWR(token ? 'gebruikers/me' : null, api.getById);

  const {
    trigger: doLogin,
    isMutating: loginLoading,
    error: loginError,
  } = useSWRMutation('sessions', api.post);

  const {
    trigger: doregister,
    isMutating: registerLoading,
    error: registerError,
  } = useSWRMutation('gebruikers', api.post);

  const login = useCallback(
    async (email, password) => {
      try {
   
        const { token } = await doLogin({
          email,
          password,
        });
  
        setToken(token); 
        localStorage.setItem(JWT_TOKEN_KEY, token); 
  
        return true; 
      } catch (error) {
       
        console.error(error);
        return false;
      }
    },
    [doLogin],
  );

  const register = useCallback(
    async (voornaam, achternaam,geboortedatum,email, password) => {
      try {
   
        const { token } = await doregister({
          voornaam,
          achternaam,
          geboortedatum,
          email,
          password,
        });
  
        setToken(token); 
        localStorage.setItem(JWT_TOKEN_KEY, token); 
  
        return true; 
      } catch (error) {
       
        console.error(error);
        return false;
      }
    },
    [doregister],
  );
 
  const logout = useCallback(() => {
    setToken(null);
  
    localStorage.removeItem(JWT_TOKEN_KEY);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loginError: loginError || userError, 
      // errors gescheiden houden, anders kan je een loginError krijgen op de register pagina
      registerError: registerError || userError,
      loading: loginLoading || userLoading || registerLoading,
      isAuthed: Boolean(token),
      ready: !userLoading,
      login,
      logout,
      register,
    }),
    [user, loginError, userError, registerError, loginLoading, userLoading,
      registerLoading, token, login, logout, register],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
  