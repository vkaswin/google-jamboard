import { createContext, ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { signInUser, signUpUser } from "@/services/User";
import { cookie } from "@/utils";
import { AuthContextType, SignInData, SignUpData, User } from "@/types/User";
import { toast } from "react-toastify";

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
    document.addEventListener("unauthorized", logout);
    return () => {
      document.removeEventListener("unauthorized", logout);
    };
  }, []);

  let handleAuthResponse = (token: string) => {
    cookie.set({ name: "auth_token", value: token, days: 14 });
    setUser(jwtDecode<User>(token));
    navigate("/document/list");
  };

  let signIn = async (data: SignInData) => {
    try {
      let {
        data: { token },
      } = await signInUser(data);
      handleAuthResponse(token);
    } catch (err: any) {
      toast.error(err?.message);
      if (err?.message === "User not exist") navigate("/auth/sign-up");
    }
  };

  let signUp = async (data: SignUpData) => {
    try {
      let {
        data: { token },
      } = await signUpUser(data);
      handleAuthResponse(token);
    } catch (err: any) {
      toast.error(err?.message);
    }
  };

  let logout = () => {
    cookie.remove("auth_token");
    navigate("/");
    setUser(undefined);
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
