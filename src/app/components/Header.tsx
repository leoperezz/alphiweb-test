import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/70 backdrop-blur-md' : ''}`}>
      <header className="w-full p-4 flex justify-between items-center px-12">
        {/* Logo section */}
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-white rounded-full"></div>
        </div>

        {/* Navigation links */}
        <nav className="flex gap-8 items-center font-geist">
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/docs" className="nav-link">Docs</Link>
          <Link href="/pricing" className="nav-link">Pricing</Link>
        </nav>

        {/* Connect button */}
        <Link href="/login">
          <button className="px-8 py-3 text-sm font-light tracking-wider text-black bg-white hover:bg-gray-100 transition-all duration-300">
            Sign in
          </button>
        </Link>
      </header>
      <div className="w-full h-[1px] bg-white/10"></div>
    </div>
  );
}
