'use client'

import React, { useState } from "react"
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ChevronRight, Eye, EyeOff } from 'lucide-react'

export default function ChangePasswordPage() {
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  })

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswords(prev => ({ ...prev, [name]: value }))
  }

  const toggleVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }))
  }

  return (
    <div className="min-h-screen bg-[#020817] text-white font-sans">
      <Header />

      {/* --- Hero Section --- */}
      <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("/images/privacy-header.jpg")' }} 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-[#020817]/60 to-[#020817]"></div>

        <div className="relative h-full flex flex-col justify-center items-center text-center px-4 pt-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Profile</h1>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Change Password</span>
          </div>
        </div>
      </div>

      {/* --- Main Content --- */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pb-20 -mt-10 relative z-10">
        <h2 className="text-2xl font-bold mb-8 text-white">My Account Password</h2>

        <div className="space-y-8 md:space-y-10">
          
          {/* Form Fields Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full">
            
            {/* 1. Current Password */}
            <div className="space-y-2 relative">
              <label className="text-sm font-medium text-gray-200">Current Password *</label>
              <div className="relative">
                <input
                  type={showPassword.current ? "text" : "password"}
                  name="current"
                  value={passwords.current}
                  onChange={handleInputChange}
                  placeholder="******"
                  className="w-full bg-[#0a1120] border border-gray-800 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:border-blue-600 transition-all text-gray-300 placeholder-gray-500"
                />
                <button 
                  type="button"
                  onClick={() => toggleVisibility('current')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword.current ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* 2. SPACER (Elemen Kosong) */}
            {/* Ini triknya: Div kosong ini mengisi kolom kanan di baris pertama, sehingga New Password turun ke bawah */}
            <div className="hidden md:block"></div> 

            {/* 3. New Password */}
            <div className="space-y-2 relative">
              <label className="text-sm font-medium text-gray-200">New Password *</label>
              <div className="relative">
                <input
                  type={showPassword.new ? "text" : "password"}
                  name="new"
                  value={passwords.new}
                  onChange={handleInputChange}
                  placeholder="******"
                  className="w-full bg-[#0a1120] border border-gray-800 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:border-blue-600 transition-all text-gray-300 placeholder-gray-500"
                />
                <button 
                  type="button"
                  onClick={() => toggleVisibility('new')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword.new ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* 4. Confirm New Password - Sekarang sejajar disamping New Password */}
            <div className="space-y-2 relative">
              <label className="text-sm font-medium text-gray-200">Confirm New Password *</label>
              <div className="relative">
                <input
                  type={showPassword.confirm ? "text" : "password"}
                  name="confirm"
                  value={passwords.confirm}
                  onChange={handleInputChange}
                  placeholder="******"
                  className="w-full bg-[#0a1120] border border-gray-800 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:border-blue-600 transition-all text-gray-300 placeholder-gray-500"
                />
                <button 
                  type="button"
                  onClick={() => toggleVisibility('confirm')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword.confirm ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-2">
            <button className="flex-1 md:flex-none px-6 md:px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-all text-sm whitespace-nowrap">
              Save Changes
            </button>
            <button className="flex-1 md:flex-none px-6 md:px-8 py-3 bg-transparent border border-gray-700 text-white font-semibold rounded-full hover:bg-gray-800 transition-all text-sm whitespace-nowrap">
              Cancel
            </button>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  )
}