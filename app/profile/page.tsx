'use client'

import React, { useState, useRef, useEffect } from "react"
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ChevronRight, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const router = useRouter()

  const [formData, setFormData] = useState({ name: '' })
  const [email, setEmail] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarRemoved, setAvatarRemoved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('user_token')
        if (!token) { router.push('/'); return }

        const response = await fetch('/api/customer-profile', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        const data = await response.json()

        if (response.ok && data.data) {
          setFormData({ name: data.data.name || '' })
          setEmail(data.data.email || '')
          if (data.data.avatar_url) {
            setAvatarUrl(data.data.avatar_url)
          } else if (data.data.avatar) {
            setAvatarUrl(`http://usky.ai/uploads/${data.data.avatar}`)
          }
        }
      } catch (err) {
        console.error('[Profile] fetch error:', err)
      } finally {
        setFetchLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      setAvatarRemoved(false)
      const reader = new FileReader()
      reader.onload = (event) => setAvatarUrl(event.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError(null)
      setSuccess(false)

      const token = localStorage.getItem('user_token')
      if (!token) { router.push('/'); return }

      const submitFormData = new FormData()
      submitFormData.append('name', formData.name)
      if (avatarFile) {
        submitFormData.append('avatar', avatarFile)
      } else if (avatarRemoved) {
        submitFormData.append('avatar', '')
      }

      const response = await fetch('/api/customer-update', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: submitFormData,
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to update profile')
      } else if (data.status === true || data.message === 'success') {
        setSuccess(true)
        if (fileInputRef.current) fileInputRef.current.value = ''
        setTimeout(() => { router.push('/myaccount') }, 1500)
      } else {
        setError('Unexpected response from server')
      }
    } catch (err) {
      console.error('[Profile] update error:', err)
      setError('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/myaccount')
  }

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-[#020817] text-white flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-400">Loading profile...</p>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#020817] text-white font-sans">
      <Header />

      <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("/images/privacy-header.jpg")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-[#020817]/60 to-[#020817]" />
        <div className="relative h-full flex flex-col justify-center items-center text-center px-4 pt-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Profile</h1>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Profile</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pb-20 -mt-10 relative z-10">
        <h2 className="text-2xl font-bold mb-8 text-white">My Profile</h2>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500 text-green-400 rounded-lg text-sm">
            Profile updated successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 md:space-y-10">

          {/* Avatar */}
          <div className="flex flex-row items-center gap-5 md:gap-6">
            <div className="w-[90px] h-[90px] rounded-full bg-[#374151] flex items-center justify-center overflow-hidden border border-gray-500 shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
              ) : (
                <span className="text-3xl font-semibold text-white">
                  {formData.name
                    ? formData.name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
                    : 'CN'}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-5 py-2 bg-[#0f172a] border border-gray-600 rounded-full hover:bg-gray-800 transition-all text-sm text-white whitespace-nowrap"
                >
                  Change Image
                </button>
                <button
                  type="button"
                  onClick={() => { setAvatarUrl(null); setAvatarFile(null); setAvatarRemoved(true) }}
                  className="hidden md:block px-5 py-2 bg-[#0f172a] border border-gray-600 rounded-full hover:bg-gray-800 transition-all text-sm text-white"
                >
                  Remove Image
                </button>
                <button
                  type="button"
                  onClick={() => { setAvatarUrl(null); setAvatarFile(null); setAvatarRemoved(true) }}
                  className="flex md:hidden items-center justify-center w-9 h-9 bg-[#0f172a] border border-gray-600 rounded-full hover:text-red-500 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Supported formats: JPG, or PNG. Max size 2MB.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
          </div>

          {/* Form Name + Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nama Lengkap"
                className="w-full bg-[#0d1526] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-white placeholder-gray-500 text-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">E-Mail *</label>
              <input
                type="email"
                value={email}
                readOnly
                disabled
                placeholder="email@gmail.com"
                className="w-full bg-[#0d1526] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 cursor-not-allowed text-sm"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 disabled:bg-gray-400 transition-all text-sm whitespace-nowrap"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="px-8 py-3 bg-transparent border border-gray-600 text-white font-semibold rounded-full hover:bg-gray-800 disabled:border-gray-700 transition-all text-sm whitespace-nowrap"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>

      <Footer />
    </div>
  )
}