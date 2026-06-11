import { api } from "@/utils/axios";

export const registerRequest = async (email: string, nickname: string, password: string, confirmPassword: string) => {
  const response = await api.post('/register', {
      email,
      nickname,
      password,
      password_confirmation: confirmPassword,
  });

  const { token, user, message } = response.data;
  console.log(message);
  return { token, user };
};

export const logoutRequest = async () => {
    await api.post('/logout');
};

export const loginRequest = async (email: string, password: string) => {
  const response = await api.post('/login', {
    email,
    password
  });

  const { token, user, message } = response.data;
  console.log(message);
  return { token, user };
}