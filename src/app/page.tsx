'use client'
import { useState, useEffect } from 'react'
import Header from './components/Header'
import Link from 'next/link'
import { RiRobot2Line, RiTeamLine, RiMessage2Line } from 'react-icons/ri'
import { BsArrowRight } from 'react-icons/bs'
import { FaRegLightbulb, FaRegClock, FaRegChartBar, FaTwitter, FaLinkedin, FaDiscord } from 'react-icons/fa'
import Image from 'next/image'
import Footer from './components/Footer'

export default function Home() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          entry.target.classList.remove('is-visible');
          const cards = entry.target.querySelectorAll('.feature-card-new, .use-case-card, .benefit-item');
          cards.forEach(card => {
            card.classList.remove('visible');
          });
        }
        else {
          entry.target.classList.add('is-visible');
          const cards = entry.target.querySelectorAll('.feature-card-new');
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add('visible');
            }, index * 200);
          });
          
          const useCases = entry.target.querySelectorAll('.use-case-card');
          useCases.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add('visible');
            }, index * 150);
          });
          
          const benefits = entry.target.querySelectorAll('.benefit-item');
          benefits.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add('visible');
            }, index * 100);
          });
        }
      });
    }, { threshold: 0.1 });

    const sections = document.querySelectorAll('.fade-in-section');
    sections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col relative">
      <Header />
      <main className="flex-1">
        {/* Hero Section - Ahora ocupa toda la pantalla */}
        <section className="min-h-screen flex flex-col justify-center items-center px-4 relative fade-in-section">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-light mb-6 leading-tight bg-gradient-to-r from-[#FCCB90] to-[#D57EEB] bg-clip-text text-transparent font-geist">
              Todos tus documentos potenciados con IA
            </h1>
            <p className="text-gray-400 text-xl mb-10 max-w-2xl mx-auto leading-relaxed font-geist">
              Interactúa con tus documentos de manera inteligente y natural
            </p>
            <button className="px-8 py-3 text-sm font-light tracking-wider text-black bg-white hover:bg-gray-100 transition-all duration-300">
              COMENZAR AHORA
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-32 bg-black">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-5xl md:text-6xl font-light text-center mb-20 bg-gradient-to-r from-[#FCCB90] to-[#D57EEB] bg-clip-text text-transparent animate-title">
              Características Principales
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 fade-in-section">
              <div className="text-center feature-card-new">
                <RiRobot2Line className="text-5xl mx-auto mb-8 feature-icon" />
                <h3 className="text-2xl font-light mb-4">Agentes Personalizados</h3>
                <p className="text-gray-400 text-base leading-relaxed">
                  Crea agentes especializados para diferentes tareas y áreas de conocimiento.
                </p>
              </div>
              <div className="text-center feature-card-new">
                <RiTeamLine className="text-5xl mx-auto mb-8 feature-icon" />
                <h3 className="text-2xl font-light mb-4">Colaboración en Equipo</h3>
                <p className="text-gray-400 text-base leading-relaxed">
                  Comparte agentes y conocimiento entre equipos de manera eficiente.
                </p>
              </div>
              <div className="text-center feature-card-new">
                <RiMessage2Line className="text-5xl mx-auto mb-8 feature-icon" />
                <h3 className="text-2xl font-light mb-4">Chat Natural</h3>
                <p className="text-gray-400 text-base leading-relaxed">
                  Interactúa con tus documentos mediante conversaciones naturales.
                </p>
              </div>
              <div className="text-center feature-card-new">
                <FaRegClock className="text-5xl mx-auto mb-8 feature-icon" />
                <h3 className="text-2xl font-light mb-4">Respuestas Rápidas</h3>
                <p className="text-gray-400 text-base leading-relaxed">
                  Obtén respuestas instantáneas gracias a nuestro procesamiento optimizado.
                </p>
              </div>
              <div className="text-center feature-card-new">
                <FaRegLightbulb className="text-5xl mx-auto mb-8 feature-icon" />
                <h3 className="text-2xl font-light mb-4">Múltiples Formatos</h3>
                <p className="text-gray-400 text-base leading-relaxed">
                  Soporte para PDF, TXT, DOCX, PPTX, MD y más formatos de archivo.
                </p>
              </div>
              <div className="text-center feature-card-new">
                <FaRegChartBar className="text-5xl mx-auto mb-8 feature-icon" />
                <h3 className="text-2xl font-light mb-4">Análisis Inteligente</h3>
                <p className="text-gray-400 text-base leading-relaxed">
                  Obtén insights y análisis profundos de tus documentos automáticamente.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases Grid */}
        <section className="py-24 bg-black">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-light text-center mb-16 bg-gradient-to-r from-[#FCCB90] to-[#D57EEB] bg-clip-text text-transparent animate-title">
              Casos de Uso
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 fade-in-section">
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
        <section className="py-24 bg-black">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-light text-center mb-16 bg-gradient-to-r from-[#FCCB90] to-[#D57EEB] bg-clip-text text-transparent animate-title">
              Beneficios
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 fade-in-section">
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
        <section className="py-32 text-center relative fade-in-section">
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
