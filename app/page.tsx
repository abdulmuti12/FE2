'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react' // Tambah Loader2 untuk icon loading
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'

export default function LoginPage() {
  const router = useRouter()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  // 1. Tambahkan state isLoading
  const [isLoading, setIsLoading] = useState(false)

  const films = [
    {
      title: '[Judul Film]',
      description: 'Watch groundbreaking films crafted by human creativity and artificial intelligence.',
      image: '/login-hero.jpg'
    },
  ]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % films.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + films.length) % films.length)
  }

  const handleSuccess = async (credentialResponse: any) => {
    // 2. Set loading jadi true saat mulai proses
    setIsLoading(true);
    try {
      console.log('Google Response:', credentialResponse);

      const decoded: any = jwtDecode(credentialResponse.credential);
      
      const formData = new FormData();
      formData.append('google_id', decoded.sub);
      formData.append('email', decoded.email);
      formData.append('name', decoded.name);
      formData.append('refferal', '');

      const response = await fetch('https://api.usky.ai/login', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.status === true || result.message === 'success') {
        localStorage.setItem('user_token', result.token);
        localStorage.setItem('user_profile', JSON.stringify(result.data));
        localStorage.setItem('session_id', result.session_id);

        console.log('Login Berhasil:', result);

        router.push('/dashboard');
      } else {
        alert('Login Gagal: ' + (result.message || 'Kesalahan Server'));
        setIsLoading(false); // Matikan loading jika gagal agar tombol muncul lagi
      }
    } catch (error) {
      console.error('Error saat proses login:', error);
      alert('Terjadi kesalahan saat menghubungi server.');
      setIsLoading(false); // Matikan loading jika error
    }
  }

  const handleError = () => {
    console.log('Google Login Failed');
    setIsLoading(false);
  }

  return (
    <div className="min-h-screen bg-background text-foreground dark">
      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:min-h-screen">
        <div className="flex flex-col justify-between bg-background p-10">
          <div className="flex items-center">
            <Image src="/usky-logo.png" alt="USKY Logo" width={60} height={30} className="h-6 w-auto object-contain" />
          </div>
          <div className="space-y-8 max-w-sm mx-auto w-full">
            <div className="space-y-4 text-center lg:text-left">
              <h1 className="text-4xl font-bold text-foreground tracking-tight">Login to your account</h1>
              <p className="text-base text-muted-foreground leading-relaxed">
                Login instantly with your Google account<br /> No password required.
              </p>
            </div>

            <div className="w-full flex justify-center lg:justify-start">
              {/* 3. Render kondisional: Tampilkan loading atau tombol Google */}
              {isLoading ? (
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg animate-pulse w-[320px] justify-center border border-border">
                  <Loader2 className="h-5 w-5 animate-spin text-yellow-500" />
                  <span className="text-sm font-medium">Mempersiapkan akun Anda...</span>
                </div>
              ) : (
                <GoogleLogin
                  onSuccess={handleSuccess}
                  onError={handleError}
                  useOneTap
                  theme="filled_black"
                  shape="rectangular"
                  width="320"
                />
              )}
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground text-center lg:text-left">
                By clicking continue, you agree to our<br />
                <a href="#" className="text-white hover:underline underline-offset-4">Terms of Service</a> and{' '}
                <a href="#" className="text-white hover:underline underline-offset-4">Privacy Policy</a>
              </p>
            </div>
          </div>
          <div className="text-[10px] text-muted-foreground opacity-50">© 2024 USKY. All rights reserved.</div>
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

      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col min-h-screen bg-black">
        <div className="pt-10 pb-6 flex justify-center">
          <Image src="/usky-logo.png" alt="USKY Logo" width={70} height={35} className="h-7 w-auto object-contain" />
        </div>

        <div className="px-8 flex flex-col items-center text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Login to your account</h1>
            <p className="text-[13px] text-gray-400 leading-tight">
              Login instantly with your Google account<br /> No password required.
            </p>
          </div>

          <div className="w-full flex justify-center">
            {/* Tampilkan loading di Mobile juga */}
            {isLoading ? (
              <div className="flex items-center gap-2 text-white">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-xs">Processing...</span>
              </div>
            ) : (
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
                theme="filled_black"
                shape="rectangular"
                width="280"
              />
            )}
          </div>

          <p className="text-[11px] text-gray-500">
            By clicking continue, you agree to our<br />
            <a href="#" className="text-gray-400 underline underline-offset-2">Terms of Service</a> and{' '}
            <a href="#" className="text-gray-400 underline underline-offset-2">Privacy Policy</a>
          </p>
        </div>

        <div className="mt-10 flex-1 relative min-h-[400px]">
          <Image src={films[currentImageIndex].image || "/placeholder.svg"} alt="Film Background" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          <div className="absolute bottom-12 left-6 right-6 space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white tracking-tight">{films[currentImageIndex].title}</h2>
            <p className="text-[13px] text-white/70 leading-relaxed">{films[currentImageIndex].description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}