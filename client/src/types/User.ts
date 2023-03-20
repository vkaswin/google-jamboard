import { Dispatch, SetStateAction } from "react";

export interface User {
  _id: string;
  name: string;
  email: string;
}

export type SignInData = {
  email: string;
  password: string;
};

export interface SignUpData extends SignInData {
  name: string;
}

export interface AuthenticateResponse {
  message: string;
  token: string;
}

export interface AuthContextType {
  user?: User;
  setUser: Dispatch<SetStateAction<User | undefined>>;
  signIn: (data: SignInData) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  logout: () => void;
}
