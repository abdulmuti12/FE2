'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const films = [
    {
      title: '[Judul Film]',
      description: 'Watch groundbreaking films crafted by human creativity and artificial intelligence.',
      image: '/login-hero.jpg'
    },
    // Tambahkan item lain untuk testing carousel jika perlu
  ]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % films.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + films.length) % films.length)
  }

  const handleGoogleLogin = () => {
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-background text-foreground dark">
      {/* Desktop Layout - Split View (TIDAK BERUBAH) */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:min-h-screen">
        <div className="flex flex-col justify-between bg-background p-10">
          <div className="flex items-center">
            <Image
              src="/usky-logo.png"
              alt="USKY Logo"
              width={60}
              height={30}
              className="h-6 w-auto object-contain"
            />
          </div>
          <div className="space-y-8 max-w-sm mx-auto w-full">
            <div className="space-y-4 text-center lg:text-left">
              <h1 className="text-4xl font-bold text-foreground tracking-tight">
                Login to your account
              </h1>
              <p className="text-base text-muted-foreground leading-relaxed">
                Login instantly with your Google account<br />
                No password required.
              </p>
            </div>
            <Button
              onClick={handleGoogleLogin}
              className="w-full bg-[#1a1a1a] hover:bg-[#252525] text-foreground border border-border h-12 rounded-lg font-medium transition-all"
              variant="outline"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </Button>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground text-center">
                By clicking continue, you agree to our<br />
                <a href="#" className="text-white hover:underline underline-offset-4">Terms of Service</a> and{' '}
                <a href="#" className="text-white hover:underline underline-offset-4">Privacy Policy</a>
              </p>
            </div>
          </div>
          <div className="text-[10px] text-muted-foreground opacity-50">
            © 2024 USKY. All rights reserved.
          </div>
        </div>
        <div className="relative bg-black overflow-hidden">
          <Image src="/login-hero.jpg" alt="Film hero" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute top-0 right-0 p-12 text-right max-w-sm">
            <h3 className="text-xl font-semibold text-[#EAB308] mb-2">Explore AI-generated films</h3>
            <p className="text-sm text-gray-300 leading-relaxed">Discover, curate, and manage cinematic content powered by AI.</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-12">
            <h2 className="text-3xl font-bold mb-3"><span className="text-white">{films[0].title}</span></h2>
            <p className="text-sm text-gray-300 max-w-md leading-relaxed">{films[0].description}</p>
          </div>
        </div>
      </div>

      {/* Mobile Layout - Updated per mobileve.png */}
      <div className="lg:hidden flex flex-col min-h-screen bg-black">
        {/* Mobile Header - Logo Centered */}
        <div className="pt-10 pb-6 flex justify-center">
          <Image
            src="/usky-logo.png"
            alt="USKY Logo"
            width={70}
            height={35}
            className="h-7 w-auto object-contain"
          />
        </div>

        {/* Mobile Login Form - Centered Text */}
        <div className="px-8 flex flex-col items-center text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Login to your account</h1>
            <p className="text-[13px] text-gray-400 leading-tight">
              Login instantly with your Google account<br />
              No password required.
            </p>
          </div>

          <Button 
            onClick={handleGoogleLogin}
            className="w-full max-w-xs bg-[#1a1a1a] hover:bg-[#252525] text-white border border-white/10 h-11 rounded-md text-sm font-medium transition-all flex items-center justify-center"
            variant="outline"
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </Button>

          <p className="text-[11px] text-gray-500">
            By clicking continue, you agree to our<br />
            <a href="#" className="text-gray-400 underline underline-offset-2">Terms of Service</a> and{' '}
            <a href="#" className="text-gray-400 underline underline-offset-2">Privacy Policy</a>
          </p>
        </div>

        {/* Mobile Image Section */}
        <div className="mt-10 flex-1 relative min-h-[400px]">
          <Image
            src={films[currentImageIndex].image || "/placeholder.svg"}
            alt="Film Background"
            fill
            className="object-cover"
          />
          {/* Dark Overlay for Text Visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

          {/* Explore Text - Absolute inside image */}
          <div className="absolute top-6 left-6 right-6">
            <h3 className="text-[#EAB308] font-bold text-base mb-1">Explore AI-generated films</h3>
            <p className="text-xs text-white/80 leading-snug max-w-[250px]">
              Discover, curate, and manage cinematic content powered by AI.
            </p>
          </div>

          {/* Navigation Arrows */}
          <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 opacity-70">
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 opacity-70">
            <ChevronRight className="w-5 h-5 text-white" />
          </button>

          {/* Film Info - Bottom */}
          <div className="absolute bottom-12 left-6 right-6 space-y-2">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              {films[currentImageIndex].title}
            </h2>
            <p className="text-[13px] text-white/70 leading-relaxed">
              {films[currentImageIndex].description}
            </p>
          </div>

          {/* Indicators - Bottom Center */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
            {films.map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all ${
                  index === currentImageIndex ? 'bg-white w-8' : 'bg-white/30 w-4'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
