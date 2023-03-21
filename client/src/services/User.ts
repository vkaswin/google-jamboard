import axios from "./axios";
import { User } from "./config";
import { SignInData, SignUpData, AuthenticateResponse } from "@/types/User";

export const signInUser = (data: SignInData) => {
  return axios<AuthenticateResponse>({
    url: User.signIn,
    method: "post",
    data,
  });
};

export const signUpUser = (data: SignUpData) => {
  return axios<AuthenticateResponse>({
    url: User.signUp,
    method: "post",
    data,
  });
};
