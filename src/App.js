import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';
import UserRequestForm from './components/UserRequestForm';
import CompanyPortal from './components/CompanyPortal';
import BackgroundImagePage from './components/BackgroundImagePage';
import Credentials from './components/Credentials';

function App() {
    return (
        <Router>
            <div className="container">
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage role="user" />} />
                    <Route path="/login/admin" element={<LoginPage role="admin" />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/user-request" element={<UserRequestForm />} />
                    <Route path="/company-portal" element={<CompanyPortal />} />
                    <Route path="/background-image" element={<BackgroundImagePage />} />
                    <Route path="/credentials" element={<Credentials />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
