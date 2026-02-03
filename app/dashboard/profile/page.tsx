'use client'

import React, { useState, useRef } from "react"
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ChevronRight, Trash2 } from 'lucide-react'

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    name: 'Nama Lengkap',
    email: 'email@gmail.com'
  })
  
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => setAvatarUrl(event.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-[#020817] text-white font-sans">
      <Header />

      {/* --- Hero Section --- */}
      <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("/images/privacy-header.jpg")' }} 
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-[#020817]/60 to-[#020817]"></div>

        <div className="relative h-full flex flex-col justify-center items-center text-center px-4 pt-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Profile</h1>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Profile</span>
          </div>
        </div>
      </div>

      {/* --- Main Content --- */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pb-20 -mt-10 relative z-10">
        <h2 className="text-2xl font-bold mb-8 text-white">My Profile</h2>

        <div className="space-y-8 md:space-y-10">
          
          {/* Avatar & Image Buttons Section */}
          {/* PERBAIKAN DI SINI: Menggunakan flex-row (default) agar avatar & tombol sejajar di mobile */}
          <div className="flex flex-row items-center md:items-start gap-5 md:gap-6">
            
            {/* Avatar Circle - Ukuran disesuaikan sedikit untuk mobile */}
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#1e293b] flex items-center justify-center overflow-hidden border border-gray-700 shrink-0">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl md:text-3xl font-medium text-white">CN</span>
              )}
            </div>

            {/* Buttons & Helper Text Container */}
            <div className="flex flex-col gap-2 pt-1">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 md:px-6 md:py-2 bg-[#0f172a] border border-gray-700 rounded-full hover:bg-gray-800 transition-all text-xs md:text-sm text-white whitespace-nowrap"
                >
                  Change Image
                </button>
                
                {/* Desktop Remove Button */}
                <button 
                  onClick={() => setAvatarUrl(null)}
                  className="hidden md:block px-6 py-2 bg-[#0f172a] border border-gray-700 rounded-full hover:bg-gray-800 transition-all text-sm text-white"
                >
                  Remove Image
                </button>
                
                {/* Mobile Trash Icon (Lingkaran) */}
                <button 
                  onClick={() => setAvatarUrl(null)}
                  className="flex md:hidden items-center justify-center w-9 h-9 bg-[#0f172a] border border-gray-700 rounded-full hover:text-red-500 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <p className="text-[10px] md:text-xs text-gray-500 leading-tight max-w-[200px] md:max-w-none">
                Supported formats: JPG, or PNG. Max size 2MB.
              </p>
              <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </div>
          </div>

          {/* Form Fields - Stacked on Mobile, Grid 2 Col on Desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-[#0a1120] border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-600 transition-all text-gray-300 placeholder-gray-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">E-Mail *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-[#0a1120] border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-600 transition-all text-gray-300 placeholder-gray-500"
              />
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
