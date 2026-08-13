import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "/api/auth";

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);

  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }

  return response.data;
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await axios.get(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.user;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};