'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'

export default function LoginPage() {
  const router = useRouter()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const films = [
    {
      title: '[Judul Film]',
      description:
        'Watch groundbreaking films crafted by human creativity and artificial intelligence.',
      image: '/login-hero.jpg',
    },
  ]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % films.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + films.length) % films.length)
  }

  const loginToApi = async (payload: {
    google_id: string
    email: string
    name: string
    refferal?: string
  }) => {
    const formData = new FormData()
    formData.append('google_id', payload.google_id)
    formData.append('email', payload.email)
    formData.append('name', payload.name)
    formData.append('refferal', payload.refferal || '')

    const response = await fetch('https://api.usky.ai/login', {
      method: 'POST',
      body: formData,
    })

    const result = await response.json()
    return result
  }

  const saveLoginResult = (result: any) => {
    localStorage.setItem('user_token', result.token)
    localStorage.setItem('user_profile', JSON.stringify(result.data))
    localStorage.setItem('session_id', result.session_id)
    router.push('/dashboard')
  }

  const handleSuccess = async (credentialResponse: any) => {
    setIsLoading(true)

    try {
      const decoded: any = jwtDecode(credentialResponse.credential)

      const result = await loginToApi({
        google_id: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        refferal: '',
      })

      console.log('Google Login Result:', result)

      if (result.status === true || result.message === 'success') {
        saveLoginResult(result)
      } else {
        alert('Login gagal: ' + (result.message || 'Unknown error'))
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Google login error:', error)
      alert('Terjadi kesalahan saat login')
      setIsLoading(false)
    }
  }

  const handleError = () => {
    console.log('Google Login Failed')
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background text-foreground dark">
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

          <div className="mx-auto w-full max-w-sm space-y-8">
            <div className="space-y-4 text-center lg:text-left">
              <h1 className="text-4xl font-bold tracking-tight text-foreground">
                Login to your account
              </h1>
              <p className="text-base leading-relaxed text-muted-foreground">
                Login instantly with your Google account
                <br />
                No password required.
              </p>
            </div>

            {isLoading ? (
              <div className="flex h-12 items-center justify-center gap-2 rounded-lg border border-border bg-[#1a1a1a] text-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              <div className="w-full overflow-hidden rounded-lg border border-border bg-[#1a1a1a] p-1">
                <GoogleLogin
                  onSuccess={handleSuccess}
                  onError={handleError}
                  theme="filled_black"
                  shape="rectangular"
                  text="continue_with"
                  width="100%"
                />
              </div>
            )}

            <div className="space-y-1">
              <p className="text-center text-xs text-muted-foreground">
                By clicking continue, you agree to our
                <br />
                <a href="#" className="text-white underline-offset-4 hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-white underline-offset-4 hover:underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>

          <div className="text-[10px] text-muted-foreground opacity-50">
            © 2024 USKY. All rights reserved.
          </div>
        </div>

        <div className="relative overflow-hidden bg-black">
          <Image src="/login-hero.jpg" alt="Film hero" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute right-0 top-0 max-w-sm p-12 text-right">
            <h3 className="mb-2 text-xl font-semibold text-[#EAB308]">
              Explore AI-generated films
            </h3>
            <p className="text-sm leading-relaxed text-gray-300">
              Discover, curate, and manage cinematic content powered by AI.
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-12">
            <h2 className="mb-3 text-3xl font-bold">
              <span className="text-white">{films[0].title}</span>
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-gray-300">
              {films[0].description}
            </p>
          </div>
        </div>
      </div>

      <div className="flex min-h-screen flex-col bg-black lg:hidden">
        <div className="flex justify-center pb-6 pt-10">
          <Image
            src="/usky-logo.png"
            alt="USKY Logo"
            width={70}
            height={35}
            className="h-7 w-auto object-contain"
          />
        </div>

        <div className="flex flex-col items-center space-y-6 px-8 text-center">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Login to your account
            </h1>
            <p className="text-[13px] leading-tight text-gray-400">
              Login instantly with your Google account
              <br />
              No password required.
            </p>
          </div>

          {isLoading ? (
            <div className="flex h-11 w-full max-w-xs items-center justify-center gap-2 rounded-md border border-white/10 bg-[#1a1a1a] text-white">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Processing...</span>
            </div>
          ) : (
            <div className="w-full max-w-xs overflow-hidden rounded-md border border-white/10 bg-[#1a1a1a] p-1">
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
                theme="filled_black"
                shape="rectangular"
                text="continue_with"
                width="100%"
              />
            </div>
          )}

          <p className="text-[11px] text-gray-500">
            By clicking continue, you agree to our
            <br />
            <a href="#" className="text-gray-400 underline underline-offset-2">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-gray-400 underline underline-offset-2">
              Privacy Policy
            </a>
          </p>
        </div>

        <div className="relative mt-10 min-h-[400px] flex-1">
          <Image
            src={films[currentImageIndex].image || '/placeholder.svg'}
            alt="Film Background"
            fill
            className="object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

          <div className="absolute left-6 right-6 top-6">
            <h3 className="mb-1 text-base font-bold text-[#EAB308]">
              Explore AI-generated films
            </h3>
            <p className="max-w-[250px] text-xs leading-snug text-white/80">
              Discover, curate, and manage cinematic content powered by AI.
            </p>
          </div>

          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 opacity-70"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 opacity-70"
          >
            <ChevronRight className="h-5 w-5 text-white" />
          </button>

          <div className="absolute bottom-12 left-6 right-6 space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              {films[currentImageIndex].title}
            </h2>
            <p className="text-[13px] leading-relaxed text-white/70">
              {films[currentImageIndex].description}
            </p>
          </div>

          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
            {films.map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all ${
                  index === currentImageIndex ? 'w-8 bg-white' : 'w-4 bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
