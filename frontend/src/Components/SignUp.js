import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SignUp() {
    const [formData, setFormData] = useState({
        name: "",
        id: "",
        password: ""
    })
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [signupError, setSignupError] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        const auth = localStorage.getItem("user")
        if (auth) {
            navigate('/')
        }
    }, [navigate])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }))
        }
    }

    const validate = () => {
        const newErrors = {}
        if (!formData.name.trim()) newErrors.name = "Name is required"
        if (!formData.id.trim()) newErrors.id = "Student ID is required"
        if (!formData.password) newErrors.password = "Password is required"
        else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters"
        
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSignupError("")
        
        if (validate()) {
            setIsSubmitting(true)
            try {
                const response = await fetch('http://localhost:4500/signup', {
                    method: 'POST',
                    body: JSON.stringify(formData),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                
                const result = await response.json()
                
                if (!response.ok) {
                    throw new Error(result.message || "Signup failed")
                }
                
                if (result) {
                    localStorage.setItem("user", JSON.stringify(result))
                    navigate("/")
                }
            } catch (error) {
                console.error("Signup error:", error)
                setSignupError(error.message || "Signup failed. Please try again.")
            } finally {
                setIsSubmitting(false)
            }
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="w-full max-w-md bg-white border border-blue-100 rounded-lg shadow-xl">
                <div className="px-8 pt-8 pb-6 text-center border-b border-blue-50">
                    <h2 className="mb-2 text-2xl font-bold text-gray-900">Create Your UniBazaar Account</h2>
                    <p className="text-sm text-blue-600">Join our student marketplace community</p>
                </div>
                
                {signupError && (
                    <div className="p-3 mx-8 mt-6 text-sm text-red-700 border border-red-200 rounded-md bg-red-50">
                        {signupError}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
                    <div>
                        <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">
                            Full Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                errors.name 
                                    ? "border-red-300 bg-red-50" 
                                    : "border-gray-300 hover:border-blue-400"
                            }`}
                        />
                        {errors.name && <span className="block mt-1 text-xs text-red-500">{errors.name}</span>}
                    </div>
                    
                    <div>
                        <label htmlFor="id" className="block mb-1 text-sm font-medium text-gray-700">
                            Student ID
                        </label>
                        <input
                            id="id"
                            name="id"
                            type="text"
                            placeholder="Enter your student ID"
                            value={formData.id}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                errors.id 
                                    ? "border-red-300 bg-red-50" 
                                    : "border-gray-300 hover:border-blue-400"
                            }`}
                        />
                        {errors.id && <span className="block mt-1 text-xs text-red-500">{errors.id}</span>}
                    </div>
                    
                    <div>
                        <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Create a password (min 6 characters)"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                errors.password 
                                    ? "border-red-300 bg-red-50" 
                                    : "border-gray-300 hover:border-blue-400"
                            }`}
                        />
                        {errors.password && <span className="block mt-1 text-xs text-red-500">{errors.password}</span>}
                    </div>
                    
                    <button 
                        type="submit" 
                        className={`w-full py-2.5 px-4 rounded-md font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                            isSubmitting
                                ? "bg-blue-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                        }`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Creating Account..." : "Sign Up"}
                    </button>
                </form>
                
                <div className="px-8 pb-8 text-sm text-center text-gray-600">
                    Already have an account?{" "}
                    <a href="/login" className="font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline">
                        Log in
                    </a>
                </div>
            </div>
        </div>
    )
}