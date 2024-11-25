import Header from './components/Header'

export default function Home() {
  return (
    <main className="h-screen bg-black">
      <Header />
      <div className="h-[calc(100vh-73px)] flex flex-col items-center justify-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-full"></div>
          <h1 className="text-white text-6xl font-semibold">Alphi</h1>
        </div>
      </div>
    </main>
  )
}
