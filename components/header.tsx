'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Search, User, Calendar, Ticket, CreditCard, Settings, LogOut, X } from 'lucide-react'

export function Header() {
  const pathname = usePathname()
  const [userDropdownOpen, setUserDropdownOpen] = useState(false) // desktop dropdown
  const [mobileUserMenuOpen, setMobileUserMenuOpen] = useState(false) // mobile drawer
  const [isSearchActive, setIsSearchActive] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // close desktop dropdown if click outside
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

  // lock body scroll when mobile drawer open
  useEffect(() => {
    if (mobileUserMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileUserMenuOpen])

  const navItems = [
    { label: 'Films', href: '/dashboard/film' },
    { label: 'Series', href: '/dashboard/series' },
    { label: 'Clips', href: '/dashboard/clip' },
    { label: 'Events', href: '/dashboard/event' },
    { label: 'Awards', href: '#' },
  ]

  const isActive = (href: string) => {
    if (href === '#') return false
    return pathname.startsWith(href)
  }

  const closeMobileMenu = () => setMobileUserMenuOpen(false)

  return (
    <nav className="sticky top-0 z-50 bg-[#020817] py-4 md:h-20 flex items-center md:border-b md:border-white/5">
      {/* MOBILE USER DRAWER */}
      {mobileUserMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          {/* overlay */}
          <button
            aria-label="Close menu overlay"
            className="absolute inset-0 bg-black/55"
            onClick={closeMobileMenu}
          />

          {/* panel */}
          <div className="absolute right-0 top-0 h-full w-[78%] max-w-[360px] bg-[#2b2b2b] shadow-2xl">
            {/* header user */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
              <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center overflow-hidden">
                <User className="w-5 h-5 text-white/80" />
              </div>
              <div className="min-w-0">
                <p className="text-white font-semibold leading-tight">leerob</p>
                <p className="text-white/60 text-sm truncate">leerob@example.com</p>
              </div>

              <button
                onClick={closeMobileMenu}
                className="ml-auto text-white/80 hover:text-white"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* menu items */}
            <div className="py-2">
              <Link
                href="#"
                onClick={closeMobileMenu}
                className="flex items-center gap-4 px-5 py-4 text-white/90 hover:bg-white/5 transition-colors"
              >
                <Calendar className="w-5 h-5 text-white/70" />
                <span>My Event</span>
              </Link>

              <Link
                href="#"
                onClick={closeMobileMenu}
                className="flex items-center gap-4 px-5 py-4 text-white/90 hover:bg-white/5 transition-colors"
              >
                <Ticket className="w-5 h-5 text-white/70" />
                <span>My Refferal</span>
              </Link>

              <Link
                href="/dashboard/profile"
                onClick={closeMobileMenu}
                className="flex items-center gap-4 px-5 py-4 text-white/90 hover:bg-white/5 transition-colors"
              >
                <CreditCard className="w-5 h-5 text-white/70" />
                <span>My Account</span>
              </Link>

              <Link
                href="/dashboard/profile"
                onClick={closeMobileMenu}
                className="flex items-center gap-4 px-5 py-4 text-white/90 hover:bg-white/5 transition-colors"
              >
                <User className="w-5 h-5 text-white/70" />
                <span>Profile</span>
              </Link>

              <Link
                href="/dashboard/changepass"
                onClick={closeMobileMenu}
                className="flex items-center gap-4 px-5 py-4 text-white/90 hover:bg-white/5 transition-colors"
              >
                <Settings className="w-5 h-5 text-white/70" />
                <span>Change Password</span>
              </Link>
            </div>

            <div className="border-t border-white/10 py-2">
              <Link
                href="/"
                onClick={closeMobileMenu}
                className="flex items-center gap-4 px-5 py-4 text-white/90 hover:bg-white/5 transition-colors"
              >
                <LogOut className="w-5 h-5 text-white/70" />
                <span>Sign Out</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="w-full px-4 md:px-6 lg:px-12">
        {/* MOBILE LAYOUT (2 rows) */}
        <div className="flex flex-col gap-4 md:hidden">
          {/* Row 1 */}
          <div className="flex items-center justify-between">
            <Image
              src="/usky-logo.png"
              alt="USKY Logo"
              width={120}
              height={40}
              className="h-8 w-auto object-contain"
            />

            <div className="flex items-center gap-4">
              {!isSearchActive ? (
                <button
                  onClick={() => setIsSearchActive(true)}
                  className="text-white/90"
                  aria-label="Search"
                >
                  <Search className="w-6 h-6" />
                </button>
              ) : (
                <button
                  onClick={() => setIsSearchActive(false)}
                  className="text-white/90"
                  aria-label="Close search"
                >
                  <X className="w-6 h-6" />
                </button>
              )}

              {/* Mobile Profile button -> open drawer */}
              <button
                onClick={() => setMobileUserMenuOpen(true)}
                className="w-10 h-10 rounded-full bg-[#E5E7EB] flex items-center justify-center"
                aria-label="Open user menu"
              >
                <User className="w-5 h-5 text-black" />
              </button>
            </div>
          </div>

          {/* Row 2: Menu capsule OR Search */}
          {!isSearchActive ? (
            <div className="flex items-center justify-center">
              <div className="flex items-center bg-[#111827]/80 rounded-full px-5 py-2.5 gap-6 w-full overflow-x-auto no-scrollbar">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`text-sm font-bold whitespace-nowrap transition-colors ${
                      isActive(item.href)
                        ? 'text-yellow-400'
                        : 'text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center w-full animate-in fade-in duration-300">
              <div className="flex-1 relative flex items-center bg-[#0d121f] border border-white/10 rounded-full px-5 h-12">
                <Search className="w-5 h-5 text-gray-500 mr-3" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-none outline-none text-white w-full text-sm placeholder:text-gray-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* DESKTOP LAYOUT (TETAP, jangan diubah) */}
        <div className="hidden md:flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* LEFT */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <Image
              src="/usky-logo.png"
              alt="USKY Logo"
              width={80}
              height={35}
              className="h-8 md:h-9 w-auto object-contain"
            />
          </div>

          {/* RIGHT */}
          <div className="hidden md:flex items-center gap-5">
            {/* nav capsule desktop */}
            <div className="flex items-center bg-[#111827]/80 border border-white/10 rounded-full px-6 py-2 md:py-2.5 gap-6 md:gap-10 shadow-lg">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`text-sm md:text-base font-bold whitespace-nowrap transition-colors ${
                    isActive(item.href)
                      ? 'text-yellow-400'
                      : 'text-white hover:text-blue-400'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* profile dropdown desktop */}
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

                    <Link
                      href="/dashboard/profile"
                      className="w-full flex items-center gap-4 px-6 py-3 text-sm text-gray-300 hover:bg-white/5 transition-colors"
                    >
                      <CreditCard className="w-5 h-5" /> My Account
                    </Link>

                    <Link href="/dashboard/changepass">
                      <button className="w-full flex items-center gap-4 px-6 py-3 text-sm text-gray-300 hover:bg-white/5 transition-colors">
                        <Settings className="w-5 h-5" /> Change Password
                      </button>
                    </Link>
                  </div>

                  <div className="border-t border-white/10 py-2">
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

            {/* search desktop */}
            {!isSearchActive ? (
              <button
                onClick={() => setIsSearchActive(true)}
                className="text-white/70 hover:text-white transition-colors"
              >
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
        </div>
      </div>
    </nav>
  )
}
