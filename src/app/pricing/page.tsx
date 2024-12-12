'use client'
import { useState } from 'react'
import Header from '../components/Header'
import { BsCheck2 } from 'react-icons/bs'

export default function Pricing() {
  const [activePlan, setActivePlan] = useState('personal')

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />
      <main className="flex-1 px-12 max-w-7xl mx-auto w-full">
        <div className="text-center mt-16 mb-16">
          <h1 className="text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-gray-400 text-xl mb-8">
            Choose the plan that fits your needs
          </p>
        </div>

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

        {/* Pricing Content (similar to the original page.tsx pricing section) */}
        {activePlan === 'personal' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pay As You Go Plan */}
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

            {/* Monthly Subscription Plan */}
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

            {/* Enterprise Plan */}
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

        {/* Free Trial Text */}
        <p className="text-gray-400 text-center mt-8">
          * All plans come with a 14-day free trial. No credit card required.
        </p>
      </main>
    </div>
  )
}
