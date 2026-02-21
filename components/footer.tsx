import Image from 'next/image'

export function Footer() {
  return (
    <footer className="bg-[#020817] border-t border-white/5 px-6 lg:px-12 py-12 mt-12">
      <div className="flex flex-col gap-10">
        
        {/* Baris Atas: Link Navigasi & Social Media */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 md:gap-8">
          
          {/* Menu Kiri */}
          <div className="flex flex-wrap gap-x-4 md:gap-x-8 gap-y-2 md:gap-y-4 text-xs md:text-sm font-medium text-white/90">
            <a href="/dashboard/term" className="hover:text-white transition-colors">Terms Of Use</a>
            <a href="/dashboard/privacy" className="hover:text-white transition-colors">Privacy-Policy</a>
            <a href="/dashboard/about" className="hover:text-white transition-colors">About Us</a>
            <a href="/dashboard/contact" className="hover:text-white transition-colors">Contact Support</a>
            <a href="#" className="hover:text-white transition-colors">Legal Notice</a>
          </div>

          {/* Social Media Kanan */}
          <div className="flex flex-col items-start lg:items-end gap-3 md:gap-4">
            <span className="text-xs md:text-sm text-gray-400">Our Social Media:</span>
            <div className="flex gap-2 md:gap-3">
              {/* Facebook */}
              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white hover:bg-gray-200 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="black"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
              </a>
              {/* Instagram */}
              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white hover:bg-gray-200 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              {/* TikTok */}
              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full hover:opacity-80 transition-opacity">
                <Image 
                  src="/images/tiktok.png" 
                  alt="TikTok" 
                  width={40} 
                  height={40} 
                  className="w-full h-full object-cover rounded-full"
                />
              </a>
              {/* X (Twitter) */}
              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white hover:bg-gray-200 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="black"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              {/* YouTube */}
              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white hover:bg-gray-200 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="black"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Baris Bawah: Copyright */}
        <div className="max-w-2xl">
          <p className="text-xs text-gray-500 leading-relaxed">
            © 2025 USKY.AI. All Rights Reserved. All videos and shows on this platform are trademarks of, and all related images and content are the property of, Usky Labs. Duplication and copy of this is strictly prohibited.
          </p>
        </div>
      </div>
    </footer>
  )
}
