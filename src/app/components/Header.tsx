import Link from 'next/link'

export default function Header() {
  return (
    <div>
      <header className="w-full p-4 flex justify-end items-center pr-40">
        <nav className="flex gap-8 items-center font-geist">
          <a href="#" className="nav-link">Home</a>
          <a href="#" className="nav-link">Docs</a>
          <a href="#" className="nav-link">Pricing</a>
          <Link href="/login">
            <button className="nav-button">
              Connect
            </button>
          </Link>
        </nav>
      </header>
      <div className="w-full h-[1px] bg-white/10"></div>
    </div>
  );
}
