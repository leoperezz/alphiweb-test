'use client'
import { useState } from 'react'
import Header from './components/Header'
import Link from 'next/link'
import { RiRobot2Line, RiTeamLine, RiMessage2Line } from 'react-icons/ri'
import { BsArrowRight } from 'react-icons/bs'
import { FaRegLightbulb, FaRegClock, FaRegChartBar, FaTwitter, FaLinkedin, FaDiscord } from 'react-icons/fa'
import Image from 'next/image'
import Footer from './components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section - Ahora ocupa toda la pantalla */}
        <section className="min-h-screen flex flex-col justify-center items-center px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#D57EEB]/10 to-transparent pointer-events-none" />
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-light mb-6 leading-tight bg-gradient-to-r from-[#FCCB90] to-[#D57EEB] bg-clip-text text-transparent">
              Conversaciones Inteligentes con tus Documentos
            </h1>
            <p className="text-gray-400 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              Crea agentes de IA personalizados que interactúan con tus archivos y documentos de manera natural. 
              Comparte conocimiento, automatiza consultas y potencia tu negocio.
            </p>
            <button className="px-8 py-3 text-sm font-light tracking-wider text-black bg-white hover:bg-gray-100 transition-all duration-300">
              COMENZAR AHORA
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-zinc-900">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-light text-center mb-16 bg-gradient-to-r from-[#FCCB90] to-[#D57EEB] bg-clip-text text-transparent">
              Características Principales
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center feature-card-new">
                <RiRobot2Line className="text-4xl mx-auto mb-6 feature-icon" />
                <h3 className="text-xl font-light mb-4">Agentes Personalizados</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Crea agentes especializados para diferentes tareas y áreas de conocimiento.
                </p>
              </div>
              <div className="text-center feature-card-new">
                <RiTeamLine className="text-4xl mx-auto mb-6 feature-icon" />
                <h3 className="text-xl font-light mb-4">Colaboración en Equipo</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Comparte agentes y conocimiento entre equipos de manera eficiente.
                </p>
              </div>
              <div className="text-center feature-card-new">
                <RiMessage2Line className="text-4xl mx-auto mb-6 feature-icon" />
                <h3 className="text-xl font-light mb-4">Chat Natural</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Interactúa con tus documentos mediante conversaciones naturales.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases Grid */}
        <section className="py-24">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-light text-center mb-16 bg-gradient-to-r from-[#FCCB90] to-[#D57EEB] bg-clip-text text-transparent">
              Casos de Uso
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                "Soporte Técnico",
                "Onboarding de Empleados",
                "Investigación y Análisis",
                "Gestión de Conocimiento",
                "Atención al Cliente",
                "Cumplimiento Legal"
              ].map((useCase, index) => (
                <div key={index} 
                     className="use-case-card group p-8 border border-zinc-800 transition-all duration-300">
                  <h3 className="text-lg font-light mb-4 group-hover:bg-gradient-to-r from-[#FCCB90] to-[#D57EEB] group-hover:bg-clip-text group-hover:text-transparent">
                    {useCase}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Descubre cómo Alphi puede transformar tu {useCase.toLowerCase()} con IA conversacional.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 bg-zinc-900">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-light text-center mb-16 bg-gradient-to-r from-[#FCCB90] to-[#D57EEB] bg-clip-text text-transparent">
              Beneficios
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div>
                <h3 className="text-xl font-light mb-8 text-white">Mayor Productividad</h3>
                <ul className="space-y-4 text-gray-400">
                  <li className="benefit-item flex items-center group">
                    <FaRegClock className="benefit-icon mr-4" />
                    <span>Reduce tiempo de búsqueda de información</span>
                  </li>
                  <li className="benefit-item flex items-center group">
                    <FaRegLightbulb className="benefit-icon mr-4" />
                    <span>Automatiza respuestas repetitivas</span>
                  </li>
                  <li className="benefit-item flex items-center group">
                    <FaRegChartBar className="benefit-icon mr-4" />
                    <span>Acelera la toma de decisiones</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-light mb-8 text-white">Conocimiento Seguro</h3>
                <ul className="space-y-4 text-gray-400">
                  <li className="benefit-item flex items-center group">
                    <FaRegLightbulb className="benefit-icon mr-4" />
                    <span>Control total sobre la información</span>
                  </li>
                  <li className="benefit-item flex items-center group">
                    <FaRegLightbulb className="benefit-icon mr-4" />
                    <span>Permisos personalizados por equipo</span>
                  </li>
                  <li className="benefit-item flex items-center group">
                    <FaRegLightbulb className="benefit-icon mr-4" />
                    <span>Auditoría de uso y consultas</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 text-center relative">
          <div className="absolute inset-0 bg-gradient-to-t from-[#D57EEB]/10 to-transparent pointer-events-none" />
          <h2 className="text-3xl font-light mb-6 bg-gradient-to-r from-[#FCCB90] to-[#D57EEB] bg-clip-text text-transparent">
            Potencia tu Empresa con IA Conversacional
          </h2>
          <p className="text-gray-400 mb-10 max-w-2xl mx-auto">
            Únete a las empresas que ya están transformando su gestión del conocimiento con agentes de IA personalizados.
          </p>
          <button className="px-8 py-3 text-sm font-light tracking-wider text-black bg-white hover:bg-gray-100 transition-all duration-300">
            SOLICITAR DEMO
          </button>
        </section>
      </main>
      <Footer />
    </div>
  )
}
