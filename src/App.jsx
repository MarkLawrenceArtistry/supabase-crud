import { Routes, Route, Link } from "react-router-dom";
// import { AuthProvider } from "./contexts/AuthContext";
// import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from './pages/Dashboard'
import Register from './pages/Register'
import Login from './pages/Login'
import NotFound from './pages/NotFound'

function App() {
    return (
            <div>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Register />} />

                    <Route path="/dashboard" element={
                            <Dashboard />
                        }
                    />

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
    )
}

export default App

{/* <AuthProvider>
    <div>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Register />} />

            <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            <Route path="*" element={<NotFound />} />
        </Routes>
    </div>
</AuthProvider> */}