'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

const LoginPage = () => {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check against environment variable
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      // Set authentication cookie instead of localStorage
      Cookies.set('isAuthenticated', 'true', { expires: 7 }) // Expires in 7 days
      router.push('/')
      router.refresh() // Force a refresh to update the middleware state
    } else {
      setError('Invalid password')
      setPassword('')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111111]">
      <div className="bg-[#222222] p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-6">Login</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#333333] border border-[#444444] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
              required
            />
          </div>
          
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage