'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/login')
  }, [router])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">
      <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
    </div>
  )
}
