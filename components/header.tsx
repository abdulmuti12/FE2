'use client'

import Image from 'next/image'
import Link from 'next/link' // Import Link untuk navigasi
import { useState, useRef, useEffect } from 'react'
import { Search, User, Calendar, Ticket, CreditCard, Settings, LogOut, X } from 'lucide-react'

export function Header() {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [isSearchActive, setIsSearchActive] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (isSearchActive && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchActive])

  const navItems = [
    { label: 'Films', href: '/dashboard' },
    { label: 'Clips', href: '/dashboard/clip' },
    { label: 'Events', href: '/dashboard/event' },
    { label: 'Awards', href: '#' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-[#020817] border-b border-white/5 py-4 md:h-20 flex items-center">
      <div className="w-full px-4 md:px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* SISI KIRI: Logo */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <Image 
              src="/usky-logo.png" 
              alt="USKY Logo" 
              width={80} 
              height={35} 
              className="h-8 md:h-9 w-auto object-contain" 
            />
            
            {/* Ikon Mobile (TETAP) */}
            <div className="flex items-center gap-3 md:hidden">
              {!isSearchActive ? (
                <>
                  <button onClick={() => setIsSearchActive(true)} className="text-white/90">
                    <Search className="w-6 h-6" />
                  </button>
                  <div className="w-10 h-10 bg-[#D9D9D9] rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-black" />
                  </div>
                </>
              ) : (
                <button onClick={() => setIsSearchActive(false)} className="text-white">
                  <X className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>

          {/* SISI KANAN (Web/Desktop) */}
          <div className="hidden md:flex items-center gap-5">
            
            {/* Navigasi Kapsul */}
            <div className="flex items-center bg-[#111827]/80 border border-white/10 rounded-full px-6 py-2 md:py-2.5 gap-6 md:gap-10 shadow-lg">
              {navItems.map((item) => (
                <Link 
                  key={item.label} 
                  href={item.href}
                  className="text-sm md:text-base font-bold text-white hover:text-blue-400 transition-colors whitespace-nowrap"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Ikon Profil */}
            <div ref={dropdownRef} className="relative">
              <button 
                onClick={() => setUserDropdownOpen(!userDropdownOpen)} 
                className="flex items-center justify-center w-10 h-10 bg-[#D9D9D9] hover:bg-white transition-all rounded-full"
              >
                <User className="w-6 h-6 text-black" />
              </button>
              
              {userDropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-6 py-4 border-b border-white/10">
                    <p className="font-semibold text-white text-sm">leerob</p>
                    <p className="text-xs text-gray-400">leerob@example.com</p>
                  </div>
                  <div className="py-2">
                    <button className="w-full flex items-center gap-4 px-6 py-3 text-sm text-gray-300 hover:bg-white/5 transition-colors">
                        <Calendar className="w-5 h-5" /> My Event
                    </button>
                    <button className="w-full flex items-center gap-4 px-6 py-3 text-sm text-gray-300 hover:bg-white/5 transition-colors">
                        <Ticket className="w-5 h-5" /> My Referral
                    </button>
                    
                    {/* LINK MY ACCOUNT DI SINI */}
                    <Link 
                        href="/dashboard/profile" 
                        className="w-full flex items-center gap-4 px-6 py-3 text-sm text-gray-300 hover:bg-white/5 transition-colors"
                    >
                        <CreditCard className="w-5 h-5" /> My Account
                    </Link>
                    
                    <button className="w-full flex items-center gap-4 px-6 py-3 text-sm text-gray-300 hover:bg-white/5 transition-colors">
                        <Settings className="w-5 h-5" /> Settings
                    </button>
                  </div>
                  <div className="border-t border-white/10 py-2">
                    
                    {/* LINK SIGN OUT DI SINI */}
                    <Link 
                        href="/" 
                        className="w-full flex items-center gap-4 px-6 py-3 text-sm text-gray-300 hover:bg-white/5 transition-colors"
                    >
                        <LogOut className="w-5 h-5" /> Sign Out
                    </Link>

                  </div>
                </div>
              )}
            </div>
            
            {/* SEARCH AREA (Desktop) */}
            {!isSearchActive ? (
              <button onClick={() => setIsSearchActive(true)} className="text-white/70 hover:text-white transition-colors">
                <Search className="w-6 h-6" />
              </button>
            ) : (
              <div className="flex items-center gap-3 animate-in slide-in-from-right duration-300">
                <div className="relative flex items-center bg-[#0d121f] border border-white/10 rounded-lg px-4 h-10 w-64 lg:w-80">
                  <Search className="w-4 h-4 text-gray-500 mr-2" />
                  <input 
                    ref={searchInputRef}
                    type="text" 
                    placeholder="Search..." 
                    className="bg-transparent border-none outline-none text-white w-full text-sm placeholder:text-gray-500"
                  />
                </div>
                <button 
                  onClick={() => setIsSearchActive(false)}
                  className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            )}
          </div>

          {/* Navigasi Mobile (TETAP) */}
          {!isSearchActive && (
            <div className="flex items-center justify-center md:hidden">
              <div className="flex items-center bg-[#111827]/80 border border-white/10 rounded-full px-6 py-2 gap-6 w-full overflow-x-auto no-scrollbar">
                {navItems.map((item) => (
                  <Link key={item.label} href={item.href} className="text-sm font-bold text-white whitespace-nowrap">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Search Input Mobile (TETAP) */}
          {isSearchActive && (
            <div className="flex items-center w-full md:hidden animate-in fade-in duration-300">
              <div className="flex-1 relative flex items-center bg-[#0d121f] border border-white/10 rounded-full px-5 h-12">
                <Search className="w-5 h-5 text-gray-500 mr-3" />
                <input 
                  ref={searchInputRef}
                  type="text" 
                  placeholder="Search..." 
                  className="bg-transparent border-none outline-none text-white w-full text-sm"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}