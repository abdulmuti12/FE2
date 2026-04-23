'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

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

  const handleDummyLogin = async () => {
    setIsLoading(true)

    try {
      const result = await loginToApi({
        google_id: '101109146890194474497',
        email: 'jajasukamakmur@gmail.com',
        name: 'jajasukamakmur',
        refferal: '',
      })

      console.log('Dummy Login Result:', result)

      if (result.status === true || result.message === 'success') {
        saveLoginResult(result)
      } else {
        alert('Login gagal: ' + (result.message || 'Unknown error'))
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Dummy login error:', error)
      alert('Terjadi kesalahan saat dummy login')
      setIsLoading(false)
    }
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
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center gap-2 text-white">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Processing...</span>
          </div>
        ) : (
          <>
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
              theme="filled_black"
              shape="rectangular"
              width="320"
            />

            <Button onClick={handleDummyLogin} className="w-[320px]">
              Login Dummy
            </Button>
          </>
        )}
      </div>
    </div>
  )
}