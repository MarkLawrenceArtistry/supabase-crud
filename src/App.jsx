import { Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import Dashboard from './pages/Dashboard'
import Register from './pages/Register'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <AuthProvider>
            <div>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route path="/dashboard" element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </AuthProvider>
    )
}

export default App