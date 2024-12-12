import Link from 'next/link'

export default function Header() {
  return (
    <div>
      <header className="w-full p-4 flex justify-between items-center px-12">
        {/* Logo section */}
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-white rounded-full"></div>
          <span className="text-white text-2xl font-semibold">Alphi</span>
        </div>

        {/* Navigation links */}
        <nav className="flex gap-8 items-center font-geist">
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/docs" className="nav-link">Docs</Link>
          <Link href="/pricing" className="nav-link">Pricing</Link>
        </nav>

        {/* Connect button */}
        <Link href="/login">
          <button className="nav-button">
            Sign in
          </button>
        </Link>
      </header>
      <div className="w-full h-[1px] bg-white/10"></div>
    </div>
  );
}
