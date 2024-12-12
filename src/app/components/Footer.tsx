import Link from 'next/link'
import Image from 'next/image'
import { FaTwitter, FaLinkedin, FaDiscord } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Alphi Column */}
          <div>
            <h3 className="text-xl font-light mb-4 text-white">
              Alphi
            </h3>
            <p className="text-gray-400 mb-4 font-light">
              Producto de tenbot ai
            </p>
            <Link href="https://tenbotai.com" target="_blank" rel="noopener noreferrer">
              <Image
                src="/tenbotai.jpeg"
                alt="Tenbot AI"
                width={40}
                height={40}
                className="rounded-lg hover:opacity-80 transition-opacity"
              />
            </Link>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-xl font-light mb-4 text-white">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/features" className="text-gray-400 hover:text-white transition-all duration-300 font-light">
                  Características
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-400 hover:text-white transition-all duration-300 font-light">
                  Precios
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-all duration-300 font-light">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect Column */}
          <div>
            <h3 className="text-xl font-light mb-4 text-white">
              Connect
            </h3>
            <ul className="space-y-4">
              <li>
                <Link 
                  href="https://twitter.com" 
                  className="text-gray-400 hover:text-white transition-all duration-300 font-light flex items-center gap-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTwitter className="text-xl" />
                  <span>Twitter</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="https://linkedin.com" 
                  className="text-gray-400 hover:text-white transition-all duration-300 font-light flex items-center gap-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedin className="text-xl" />
                  <span>LinkedIn</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="https://discord.com" 
                  className="text-gray-400 hover:text-white transition-all duration-300 font-light flex items-center gap-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaDiscord className="text-xl" />
                  <span>Discord</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center text-gray-400 font-light">
          <p>© 2024 Alphi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
