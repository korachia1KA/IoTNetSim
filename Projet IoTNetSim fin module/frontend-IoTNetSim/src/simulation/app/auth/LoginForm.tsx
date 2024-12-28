import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Removed useNavigate
import { useMutation } from 'react-query';
import { User, Role } from '../dashboard/Simulation.tsx';
import { create } from 'zustand'; // Adjust the import path

export let user: User;
export let Therole: Role;

interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

let useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  setAuth: (token, user) => set({ token, user }),
  logout: () => set({ token: null, user: null }),
}));

Therole = {
  id: 1,
  name: 'user',
};

export let token: string | null = null;

export function LoginForm() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginMutation = useMutation({
    mutationFn: () => login(email, password),
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      user = data.user;
      token = data.token;
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('Therole', JSON.stringify(data.user.roles));
      window.location.href = '/dashboard'; // Replace navigate with window.location.href
    },
  });

  const login = async (username: string, password: string) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="email" className="mb-2.5 block font-medium text-black dark:text-white">
          Email
        </label>
        <div className="relative">
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="password" className="mb-2.5 block font-medium text-black dark:text-white">
          Password
        </label>
        <div className="relative">
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="6+ Characters, 1 Capital letter"
            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>
      </div>

      <div className="mb-5">
        <input
          type="submit"
          value="Sign In"
          className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
        />
      </div>

      <button
        className="flex w-full items-center justify-center gap-3.5 rounded-lg border border-stroke bg-gray p-4 hover:bg-opacity-50 dark:border-strokedark dark:bg-meta-4 dark:hover:bg-opacity-50">
        Continue with Google
      </button>

      <p className="mt-6 text-center">
        Don’t have any account?{' '}
        <Link to="/register" className="text-primary">
          Sign Up
        </Link>
      </p>
    </form>
  );
}
