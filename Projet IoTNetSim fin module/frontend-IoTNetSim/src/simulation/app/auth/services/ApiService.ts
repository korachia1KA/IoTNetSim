import axios from 'axios';

const apiService = axios.create({
  baseURL: 'http://localhost:8080/api',
});

const API_URL = "http://localhost:8080/api";

export const register = async (username: string, email: string, password: string) => {

  if (email === "admin@admin.com" && (password.toUpperCase() === "ADMIN")) {
    var role = ["ROLE_ADMIN"];
  } else {
    var role = ["ROLE_USER"];
  }

  try {
    const response = await fetch('http://localhost:8080/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({username, email, password, role}),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};
// src/lib/ApiService.ts

export const login = async (username: string, password: string) => {
  try {
    const response = await fetch('http://localhost:8080/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

const ApiService = {
  getDevices: () => axios.get(`${API_URL}/devices`).then((res) => res.data),
  createDevice: (device) => axios.post(`${API_URL}/devices`, device),
  getNetwork: () => axios.get(`${API_URL}/network`).then((res) => res.data),
};

export default ApiService;