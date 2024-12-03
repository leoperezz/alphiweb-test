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
          <a href="#" className="nav-link">Home</a>
          <a href="#" className="nav-link">About</a>
          <a href="#" className="nav-link">Docs</a>
          <a href="#" className="nav-link">Pricing</a>
        </nav>

        {/* Connect button */}
        <Link href="/login">
          <button className="nav-button">
            Connect
          </button>
        </Link>
      </header>
      <div className="w-full h-[1px] bg-white/10"></div>
    </div>
  );
}
