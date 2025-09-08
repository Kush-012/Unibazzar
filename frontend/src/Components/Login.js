import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [formData, setFormData] = useState({
        id: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const auth = localStorage.getItem('user');
        if (auth) navigate('/');
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Basic validation
            if (!formData.id || !formData.password) {
                throw new Error('Both ID and password are required');
            }

            const response = await fetch('http://localhost:4500/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            // Handle both JSON and text responses
            const data = await response.json().catch(() => response.text());

            if (typeof data === 'string') {
                // Handle text responses ("No user found" or "Enter both email and password")
                throw new Error(data);
            }

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Successful login
            localStorage.setItem('user', JSON.stringify(data));
            navigate('/');
                    
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="w-full max-w-md bg-white border border-blue-100 rounded-lg shadow-xl">
                <div className="px-8 pt-8 pb-6 text-center border-b border-blue-50">
                    <h2 className="mb-2 text-2xl font-bold text-gray-900">Student Login</h2>
                    <p className="text-sm text-blue-600">Access your UniBazaar account</p>
                </div>
                
                {error && (
                    <div className="p-3 mx-8 mt-6 text-sm text-red-700 border border-red-200 rounded-md bg-red-50">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleLogin} className="px-8 py-6 space-y-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Student ID
                        </label>
                        <input
                            type="text"
                            name="id"
                            value={formData.id}
                            onChange={handleChange}
                            placeholder="Enter your student ID"
                            required
                            className="w-full px-3 py-2 placeholder-gray-400 transition-colors border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                        />
                    </div>
                    
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                            className="w-full px-3 py-2 placeholder-gray-400 transition-colors border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                        />
                    </div>
                    
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-2.5 px-4 rounded-md font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                            isLoading
                                ? "bg-blue-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                        }`}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                
                <div className="px-8 pb-8 text-sm text-center text-gray-600">
                    Don't have an account?{" "}
                    <a href="/signup" className="font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline">
                        Sign up
                    </a>
                </div>
            </div>
        </div>
    );
}