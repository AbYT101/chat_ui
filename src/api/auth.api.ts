// src/api/auth.api.ts
import { api } from "./client";

export const login = (email: string, password: string) => {
  const username = email;
  return api.post("/auth/login", { username, password });
};
  

export const register = (email: string, password: string) => {
  const username = email;
  return api.post("/auth/signup", { email, password, username });
};
  
