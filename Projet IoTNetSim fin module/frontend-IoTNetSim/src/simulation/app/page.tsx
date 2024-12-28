
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import Login from "./login/login";
import Register from "./register/register";
import IoTNetworkSimulator, { User } from "./dashboard/Simulation.tsx";

const queryClient = new QueryClient();

function Page() {
    const token = localStorage.getItem('auth_token');

    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/login"
                        element={!token ? <Login /> : <Navigate to="/dashboard" />}
                    />
                    <Route
                        path="/register"
                        element={!token ? <Register /> : <Navigate to="/dashboard" />}
                    />
                    <Route
                        path="/simulation"
                        element={
                            token ? <IoTNetworkSimulator/> : <Navigate to="/login" />
                        }
                    />
                    <Route
                        path="/"
                        element={<Navigate to={token ? "/dashboard" : "/login"} />}
                    />
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default Page;
