'use client'
import { useState } from 'react'
import Header from './components/Header'
import Link from 'next/link'
import { RiFlashlightLine } from 'react-icons/ri'
import { MdSecurity } from 'react-icons/md'
import { FaRocket } from 'react-icons/fa'
import { AiOutlineFileText } from 'react-icons/ai'
import { BsArrowRight, BsCheck2 } from 'react-icons/bs'

export default function Home() {
  const [activePlan, setActivePlan] = useState('personal')

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="flex flex-col items-center">
          {/* Hero Section */}
          <div className="text-center mt-32 mb-48">
            <h1 className="text-5xl font-bold mb-4">
              Talk with your files in minutes
            </h1>
            <p className="text-gray-400 text-xl mb-8">
              Deploy your state-of-the-art RAG System Fast
            </p>
            <button className="px-8 py-3 font-semibold text-black bg-gradient-to-r from-[#22c1c3] to-[#fdbb2d] hover:opacity-90 transition-all duration-300 transform hover:scale-105">
              Get Started
            </button>
          </div>

          {/* Features Section */}
          <div className="w-full px-12 max-w-7xl mx-auto mb-48">
            <h2 className="text-3xl font-bold text-center mb-16">
              Why Choose Alphi?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Feature cards */}
              <div className="feature-card">
                <div className="text-white text-3xl mb-4">
                  <RiFlashlightLine />
                </div>
                <h3 className="text-xl font-semibold mb-2">Instant Deployment</h3>
                <p className="text-gray-400">
                  Set up your RAG system in seconds, not days.
                </p>
              </div>

              <div className="feature-card">
                <div className="text-white text-3xl mb-4">
                  <MdSecurity />
                </div>
                <h3 className="text-xl font-semibold mb-2">Enterprise-Grade Security</h3>
                <p className="text-gray-400">
                  Your data is protected with top-tier security measures.
                </p>
              </div>

              <div className="feature-card">
                <div className="text-white text-3xl mb-4">
                  <FaRocket />
                </div>
                <h3 className="text-xl font-semibold mb-2">Scalable Performance</h3>
                <p className="text-gray-400">
                  Handles millions of documents with blazing-fast retrieval.
                </p>
              </div>

              <div className="feature-card">
                <div className="text-white text-3xl mb-4">
                  <AiOutlineFileText />
                </div>
                <h3 className="text-xl font-semibold mb-2">Multi-Format Support</h3>
                <p className="text-gray-400">
                  Process PDFs, DOCX, TXT, MD, PPT, and more with ease.
                </p>
              </div>
            </div>
          </div>

          {/* How it Works Section */}
          <div className="w-full px-12 max-w-7xl mx-auto mb-48">
            <h2 className="text-3xl font-bold text-center mb-16">
              How Alphi Works
            </h2>
            
            <div className="flex justify-between items-center relative">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white to-transparent">
                <div className="h-full w-full animate-pulse-line"></div>
              </div>

              {/* Steps */}
              <div className="relative z-10 flex flex-col items-center text-center w-64">
                <div className="w-16 h-16 bg-white flex items-center justify-center text-black text-2xl font-bold mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2">Upload Your Data</h3>
                <p className="text-gray-400">Simply upload your documents in any format.</p>
                <div className="absolute -right-4 top-8 text-white">
                  <BsArrowRight className="text-2xl animate-pulse-arrow" />
                </div>
              </div>

              <div className="relative z-10 flex flex-col items-center text-center w-64">
                <div className="w-16 h-16 bg-white flex items-center justify-center text-black text-2xl font-bold mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Processing</h3>
                <p className="text-gray-400">Our advanced AI analyzes and indexes your content.</p>
                <div className="absolute -right-4 top-8 text-white">
                  <BsArrowRight className="text-2xl animate-pulse-arrow" />
                </div>
              </div>

              <div className="relative z-10 flex flex-col items-center text-center w-64">
                <div className="w-16 h-16 bg-white flex items-center justify-center text-black text-2xl font-bold mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2">Instant Deployment</h3>
                <p className="text-gray-400">Your RAG system is ready to use immediately.</p>
                <div className="absolute -right-4 top-8 text-white">
                  <BsArrowRight className="text-2xl animate-pulse-arrow" />
                </div>
              </div>

              <div className="relative z-10 flex flex-col items-center text-center w-64">
                <div className="w-16 h-16 bg-white flex items-center justify-center text-black text-2xl font-bold mb-4">
                  4
                </div>
                <h3 className="text-xl font-semibold mb-2">Start Querying</h3>
                <p className="text-gray-400">Get accurate, context-aware responses instantly.</p>
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="w-full px-12 max-w-7xl mx-auto mb-32">
            <h2 className="text-3xl font-bold text-center mb-4">
              Simple, Transparent Pricing
            </h2>

            {/* Pricing Toggle */}
            <div className="flex justify-center gap-4 mb-12">
              <button 
                className={`px-6 py-2 bg-white/10 text-white transition-all ${activePlan === 'personal' ? 'bg-white/20' : 'hover:bg-white/20'}`}
                onClick={() => setActivePlan('personal')}
              >
                Personal
              </button>
              <button 
                className={`px-6 py-2 bg-white/10 text-white transition-all ${activePlan === 'developer' ? 'bg-white/20' : 'hover:bg-white/20'}`}
                onClick={() => setActivePlan('developer')}
              >
                Developer
              </button>
            </div>

            {/* Personal Plans */}
            {activePlan === 'personal' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Pay As You Go */}
                <div className="bg-white/5 p-8 border border-white/10 hover:border-white/20 transition-all">
                  <h3 className="text-xl font-bold mb-2">Pay As You Go</h3>
                  <div className="text-4xl font-bold mb-6">
                    $0.05<span className="text-lg text-gray-400">/1k pages</span>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-2">
                      <BsCheck2 className="text-[#22c1c3]" />
                      <span>$0.0075 per search</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <BsCheck2 className="text-[#22c1c3]" />
                      <span>All file formats supported</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <BsCheck2 className="text-[#22c1c3]" />
                      <span>Unlimited storage</span>
                    </li>
                  </ul>
                  <button className="w-full mt-8 px-6 py-3 bg-white/10 text-white hover:bg-white/20 transition-all">
                    Start Free
                  </button>
                </div>

                {/* Monthly Subscription */}
                <div className="bg-gradient-to-b from-[#ff6b6b]/10 to-transparent p-8 border border-[#ff6b6b]/30 transform scale-105">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#ff6b6b] text-white text-sm">
                    Popular
                  </div>
                  <h3 className="text-xl font-bold mb-2">Monthly</h3>
                  <div className="text-4xl font-bold mb-6">
                    $20<span className="text-lg text-gray-400">/month</span>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-2">
                      <BsCheck2 className="text-[#ff6b6b]" />
                      <span>Basic model: $0.05/1k pages</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <BsCheck2 className="text-[#ff6b6b]" />
                      <span>Advanced model: $0.5/1k pages</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <BsCheck2 className="text-[#ff6b6b]" />
                      <span>$0.002 per image processed</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <BsCheck2 className="text-[#ff6b6b]" />
                      <span>Unlimited searches</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <BsCheck2 className="text-[#ff6b6b]" />
                      <span>Priority support</span>
                    </li>
                  </ul>
                  <button className="w-full mt-8 px-6 py-3 bg-[#ff6b6b] text-white hover:bg-[#ff6b6b]/90 transition-all">
                    Start Free Trial
                  </button>
                </div>

                {/* Enterprise */}
                <div className="bg-white/5 p-8 border border-white/10 hover:border-white/20 transition-all">
                  <h3 className="text-xl font-bold mb-2">Enterprise</h3>
                  <div className="text-4xl font-bold mb-6">
                    Custom
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-2">
                      <BsCheck2 className="text-[#22c1c3]" />
                      <span>Unlimited everything</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <BsCheck2 className="text-[#22c1c3]" />
                      <span>Custom models</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <BsCheck2 className="text-[#22c1c3]" />
                      <span>24/7 support</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <BsCheck2 className="text-[#22c1c3]" />
                      <span>SLA guarantee</span>
                    </li>
                  </ul>
                  <button className="w-full mt-8 px-6 py-3 bg-white/10 text-white hover:bg-white/20 transition-all">
                    Contact Sales
                  </button>
                </div>
              </div>
            )}

            {/* Developer Plans */}
            {activePlan === 'developer' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Developer API Plan */}
                <div className="bg-white/5 p-8 border border-white/10 hover:border-white/20 transition-all">
                  <h3 className="text-xl font-bold mb-2">Developer API</h3>
                  <div className="text-4xl font-bold mb-6">
                    $50<span className="text-lg text-gray-400">/month</span>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-2">
                      <BsCheck2 className="text-[#22c1c3]" />
                      <span>$0.05/1k pages (Basic Model)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <BsCheck2 className="text-[#22c1c3]" />
                      <span>$1/1k pages (Advanced Model)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <BsCheck2 className="text-[#22c1c3]" />
                      <span>$0.02 per image processed</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <BsCheck2 className="text-[#22c1c3]" />
                      <span>10,000 API calls/month</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <BsCheck2 className="text-[#22c1c3]" />
                      <span>All file formats supported</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <BsCheck2 className="text-[#22c1c3]" />
                      <span>Unlimited storage</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <BsCheck2 className="text-[#22c1c3]" />
                      <span>Developer support</span>
                    </li>
                  </ul>
                  <button className="w-full mt-8 px-6 py-3 bg-white/10 text-white hover:bg-white/20 transition-all">
                    Get API Access
                  </button>
                </div>

                {/* Scale Plan */}
                <div className="bg-white/5 p-8 border border-white/10 hover:border-white/20 transition-all">
                  <h3 className="text-xl font-bold mb-2">Scale</h3>
                  <div className="text-4xl font-bold mb-6">
                    Custom
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-2">
                      <BsCheck2 className="text-[#22c1c3]" />
                      <span>Custom API call limits</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <BsCheck2 className="text-[#22c1c3]" />
                      <span>Volume discounts</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <BsCheck2 className="text-[#22c1c3]" />
                      <span>Custom model training</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <BsCheck2 className="text-[#22c1c3]" />
                      <span>Dedicated support</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <BsCheck2 className="text-[#22c1c3]" />
                      <span>SLA guarantee</span>
                    </li>
                  </ul>
                  <button className="w-full mt-8 px-6 py-3 bg-white/10 text-white hover:bg-white/20 transition-all">
                    Contact Sales
                  </button>
                </div>
              </div>
            )}

            {/* Free Trial Text */}
            <p className="text-gray-400 text-center mt-8">
              * All plans come with a 14-day free trial. No credit card required.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10">
        <div className="max-w-7xl mx-auto px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Alphi Column */}
            <div>
              <h3 className="text-xl font-bold mb-4">Alphi</h3>
              <p className="text-gray-400 mb-4">
                Empowering businesses with state-of-the-art RAG systems.
              </p>
            </div>

            {/* Product Column */}
            <div>
              <h3 className="text-xl font-bold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/features" className="text-gray-400 hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/documentation" className="text-gray-400 hover:text-white transition-colors">
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h3 className="text-xl font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-gray-400 hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            {/* Connect Column */}
            <div>
              <h3 className="text-xl font-bold mb-4">Connect</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="https://twitter.com" className="text-gray-400 hover:text-white transition-colors">
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link href="https://linkedin.com" className="text-gray-400 hover:text-white transition-colors">
                    LinkedIn
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 text-center text-gray-400">
            <p>© 2024 Alphi. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
