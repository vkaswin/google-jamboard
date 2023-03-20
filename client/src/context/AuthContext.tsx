import { createContext, ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { signInUser, signUpUser } from "@/services/User";
import { cookie } from "@/utils";
import { AuthContextType, SignInData, SignUpData, User } from "@/types/User";

export const AuthContext = createContext({} as AuthContextType);

type AuthProviderProps = {
  children: ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  let [user, setUser] = useState<User>();

  let navigate = useNavigate();

  useEffect(() => {
    let authToken = cookie.get("auth_token");
    authToken && setUser(jwtDecode<User>(authToken));
  }, []);

  let handleAuthResponse = (token: string) => {
    cookie.set({ name: "auth_token", value: token, days: 14 });
    setUser(jwtDecode<User>(token));
    navigate("/document/64106505659e51ce8d788753");
  };

  let signIn = async (data: SignInData) => {
    try {
      let {
        data: { token },
      } = await signInUser(data);
      handleAuthResponse(token);
    } catch (err) {
      console.log(err);
    }
  };

  let signUp = async (data: SignUpData) => {
    try {
      let {
        data: { token },
      } = await signUpUser(data);
      handleAuthResponse(token);
    } catch (err) {
      console.log(err);
    }
  };

  let logout = () => {
    navigate("/");
  };

  let context: AuthContextType = {
    user,
    setUser,
    signIn,
    signUp,
    logout,
  };

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
