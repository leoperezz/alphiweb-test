'use client'
import { useEffect, useState } from 'react'
import Header from './components/Header'
import { RiRobot2Line, RiTeamLine, RiMessage2Line } from 'react-icons/ri'
import { BsCheck2 } from 'react-icons/bs'
import { FaRegLightbulb, FaRegClock, FaRegChartBar } from 'react-icons/fa'
import Footer from './components/Footer'

export default function Home() {
  const [activePlan, setActivePlan] = useState<'personal' | 'developer'>('personal');

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
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col justify-center items-center px-4 relative fade-in-section">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center items-center mb-12">
              <div className="flex items-center gap-6">
                <div className="w-32 h-32 bg-white rounded-full hover-gradient animate-drop-bounce"></div>
                <span className="text-7xl font-geist font-bold text-white animate-text-reveal">Alphi</span>
              </div>
            </div>
            <p className="text-gray-400 text-2xl mb-12 max-w-2xl mx-auto leading-relaxed font-geist animate-fade-in-delayed">
              Interactúa con tus documentos de manera inteligente y natural
            </p>
            <button className="px-8 py-3 text-sm font-light tracking-wider text-black bg-white hover:bg-gray-100 transition-all duration-300 rounded-full animate-fade-in-delayed-more">
              COMENZAR AHORA
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-32 bg-black">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-5xl md:text-6xl font-light text-center mb-20 bg-gradient-to-r from-[#ee0979] to-[#ff6a00] bg-clip-text text-transparent animate-title">
              Características Principales
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 fade-in-section">
              <div className="text-center feature-card-new">
                <RiRobot2Line className="text-5xl mx-auto mb-8 feature-icon" />
                <h3 className="text-2xl font-light mb-4 transition-colors duration-300">
                  Agentes Personalizados
                </h3>
                <p className="text-gray-400 text-base leading-relaxed">
                  Crea agentes especializados para diferentes tareas y áreas de conocimiento.
                </p>
              </div>
              <div className="text-center feature-card-new">
                <RiTeamLine className="text-5xl mx-auto mb-8 feature-icon" />
                <h3 className="text-2xl font-light mb-4 transition-colors duration-300">
                  Colaboración en Equipo
                </h3>
                <p className="text-gray-400 text-base leading-relaxed">
                  Comparte agentes y conocimiento entre equipos de manera eficiente.
                </p>
              </div>
              <div className="text-center feature-card-new">
                <RiMessage2Line className="text-5xl mx-auto mb-8 feature-icon" />
                <h3 className="text-2xl font-light mb-4 transition-colors duration-300">
                  Chat Natural
                </h3>
                <p className="text-gray-400 text-base leading-relaxed">
                  Interactúa con tus documentos mediante conversaciones naturales.
                </p>
              </div>
              <div className="text-center feature-card-new">
                <FaRegClock className="text-5xl mx-auto mb-8 feature-icon" />
                <h3 className="text-2xl font-light mb-4 transition-colors duration-300">
                  Respuestas Rápidas
                </h3>
                <p className="text-gray-400 text-base leading-relaxed">
                  Obtén respuestas instantáneas gracias a nuestro procesamiento optimizado.
                </p>
              </div>
              <div className="text-center feature-card-new">
                <FaRegLightbulb className="text-5xl mx-auto mb-8 feature-icon" />
                <h3 className="text-2xl font-light mb-4 transition-colors duration-300">
                  Múltiples Formatos
                </h3>
                <p className="text-gray-400 text-base leading-relaxed">
                  Soporte para PDF, TXT, DOCX, PPTX, MD y más formatos de archivo.
                </p>
              </div>
              <div className="text-center feature-card-new">
                <FaRegChartBar className="text-5xl mx-auto mb-8 feature-icon" />
                <h3 className="text-2xl font-light mb-4 transition-colors duration-300">
                  Análisis Inteligente
                </h3>
                <p className="text-gray-400 text-base leading-relaxed">
                  Obtén insights y análisis profundos de tus documentos automáticamente.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases Grid */}
        <section className="py-32 bg-black">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-5xl md:text-6xl font-light text-center mb-20 bg-gradient-to-r from-[#ee0979] to-[#ff6a00] bg-clip-text text-transparent animate-title">
              Casos de Uso
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 fade-in-section">
              {[
                "Soporte Técnico",
                "Onboarding de Empleados",
                "Investigación y Análisis",
                "Gestión de Conocimiento",
                "Atención al Cliente",
                "Cumplimiento Legal"
              ].map((useCase, index) => (
                <div key={index} 
                     className="use-case-card p-8 text-center">
                  <h3 className="text-2xl font-light mb-4 text-white">
                    {useCase}
                  </h3>
                  <p className="text-gray-400 text-base mb-4 leading-relaxed">
                    Descubre cómo Alphi puede transformar tu {useCase.toLowerCase()} con IA conversacional.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-24 bg-black">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-5xl md:text-6xl font-light text-center mb-6 text-white">
              Planes
            </h2>
            <p className="text-gray-400 text-center mb-12 max-w-3xl mx-auto">
              Alphi te ofrece planes flexibles para que puedas disfrutar de la gestión inteligente de la información, sin importar tus necesidades o presupuesto.
            </p>

            {/* Plan Type Selector */}
            <div className="flex justify-center gap-4 mb-16">
              <button 
                onClick={() => setActivePlan('personal')}
                className={`px-8 py-3 rounded-full transition-all duration-300 ${
                  activePlan === 'personal' 
                    ? 'bg-white text-black' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Personal
              </button>
              <button 
                onClick={() => setActivePlan('developer')}
                className={`px-8 py-3 rounded-full transition-all duration-300 ${
                  activePlan === 'developer' 
                    ? 'bg-white text-black' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Developer
              </button>
            </div>

            {/* Personal Plans */}
            <div className={`transition-opacity duration-300 ${activePlan === 'personal' ? 'opacity-100' : 'opacity-0 hidden'}`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Free Plan */}
                <div className="pricing-card group hover:scale-105 transition-transform duration-300 ease-out">
                  <div>
                    <h3 className="pricing-title">Personal</h3>
                    <div className="text-4xl font-bold mb-2 text-white">
                      Free
                    </div>
                    <p className="text-gray-400 text-sm mb-6">
                      Ideal para individuos y pequeños equipos que buscan organizar su información y aumentar su productividad.
                    </p>
                    <ul className="space-y-4 mb-8">
                      <li className="pricing-feature">
                        <BsCheck2 className="text-white text-xl flex-shrink-0" />
                        <span>Almacenamiento ilimitado</span>
                      </li>
                      <li className="pricing-feature">
                        <BsCheck2 className="text-white text-xl flex-shrink-0" />
                        <span>2 asistentes virtuales</span>
                      </li>
                      <li className="pricing-feature">
                        <BsCheck2 className="text-white text-xl flex-shrink-0" />
                        <span>10 consultas diarias a la IA</span>
                      </li>
                      <li className="pricing-feature">
                        <BsCheck2 className="text-white text-xl flex-shrink-0" />
                        <span>Hasta 50 mensajes gratis al día</span>
                      </li>
                      <li className="pricing-feature">
                        <BsCheck2 className="text-white text-xl flex-shrink-0" />
                        <span>Pay-as-you-go disponible:</span>
                      </li>
                      <li className="pricing-feature pl-6">
                        <span className="text-sm">• $0.02 por búsqueda en documentos</span>
                      </li>
                      <li className="pricing-feature pl-6">
                        <span className="text-sm">• $0.02 por cada 100 mensajes a la IA</span>
                      </li>
                      <li className="pricing-feature pl-6">
                        <span className="text-sm">• $0.125 por consulta al superinference</span>
                      </li>
                    </ul>
                  </div>
                  <div className="pricing-button-container">
                    <button className="pricing-button">
                      Comenzar Gratis
                    </button>
                  </div>
                </div>
                
                {/* Premium Plan */}
                <div className="pricing-card premium group hover:scale-105 transition-transform duration-300 ease-out">
                  <div>
                    <div className="pricing-badge">Popular</div>
                    <h3 className="pricing-title">Premium</h3>
                    <div className="text-4xl font-bold mb-2 gradient-text">
                      $17<span className="text-lg">/mes</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-6">
                      Todas las funcionalidades de Free, ¡sin límites!
                    </p>
                    <ul className="space-y-4 mb-8">
                      <li className="pricing-feature">
                        <BsCheck2 className="text-white text-xl flex-shrink-0" />
                        <span>Almacenamiento ilimitado</span>
                      </li>
                      <li className="pricing-feature">
                        <BsCheck2 className="text-white text-xl flex-shrink-0" />
                        <span>Asistentes ilimitados</span>
                      </li>
                      <li className="pricing-feature">
                        <BsCheck2 className="text-white text-xl flex-shrink-0" />
                        <span>Consultas ilimitadas a la IA</span>
                      </li>
                      <li className="pricing-feature">
                        <BsCheck2 className="text-white text-xl flex-shrink-0" />
                        <span>Colaboración ilimitada</span>
                      </li>
                      <li className="pricing-feature">
                        <BsCheck2 className="text-white text-xl flex-shrink-0" />
                        <span>10 llamadas gratuitas al superinference</span>
                      </li>
                      <li className="pricing-feature">
                        <BsCheck2 className="text-white text-xl flex-shrink-0" />
                        <span>$0.125 por llamada adicional al superinference</span>
                      </li>
                    </ul>
                  </div>
                  <div className="pricing-button-container">
                    <button className="pricing-button">
                      Comenzar Ahora
                    </button>
                  </div>
                </div>
                
                {/* Enterprise Plan */}
                <div className="pricing-card group hover:scale-105 transition-transform duration-300 ease-out">
                  <div>
                    <h3 className="pricing-title">Enterprise</h3>
                    <div className="text-4xl font-bold mb-2 text-white">
                      Custom
                    </div>
                    <p className="text-gray-400 text-sm mb-6">
                      Pensado en las empresas para manejar una gran cantidad de archivos
                    </p>
                    <ul className="space-y-4 mb-8">
                      <li className="pricing-feature">
                        <BsCheck2 className="text-white text-xl flex-shrink-0" />
                        <span>Todo lo incluido en Premium</span>
                      </li>
                      <li className="pricing-feature">
                        <BsCheck2 className="text-white text-xl flex-shrink-0" />
                        <span>Integración con otras plataformas (Google Drive, Slack, Discord, etc.) <span className="text-xs text-yellow-400 ml-1">Soon</span></span>
                      </li>
                      <li className="pricing-feature">
                        <BsCheck2 className="text-white text-xl flex-shrink-0" />
                        <span>Menor precio por usuario según cantidad</span>
                      </li>
                    </ul>
                  </div>
                  <div className="pricing-button-container">
                    <button className="pricing-button">
                      Contact Sales
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Developer Plans */}
            <div className={`transition-opacity duration-300 ${activePlan === 'developer' ? 'opacity-100' : 'opacity-0 hidden'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Developer Pay as you go */}
                <div className="pricing-card">
                  <div>
                    <h3 className="pricing-title">Developer</h3>
                    <div className="text-4xl font-bold mb-2 text-white">
                      Pay as you go
                    </div>
                    <p className="text-gray-400 text-sm mb-6">
                      Para desarrolladores que buscan integrar la potencia de la IA de Alphi
                    </p>
                    <ul className="space-y-4 mb-8">
                      <li className="pricing-feature">
                        <BsCheck2 className="text-white text-xl flex-shrink-0" />
                        <span>$0.02 por búsqueda en documentos</span>
                      </li>
                      <li className="pricing-feature">
                        <BsCheck2 className="text-white text-xl flex-shrink-0" />
                        <span>$0.02 por cada 100 mensajes a la IA</span>
                      </li>
                      <li className="pricing-feature">
                        <BsCheck2 className="text-white text-xl flex-shrink-0" />
                        <span>$0.125 por consulta al superinference</span>
                      </li>
                    </ul>
                  </div>
                  <div className="pricing-button-container">
                    <button className="pricing-button">
                      Comenzar Ahora
                    </button>
                  </div>
                </div>

                {/* Enterprise Developer */}
                <div className="pricing-card">
                  <div>
                    <h3 className="pricing-title">Enterprise</h3>
                    <div className="text-4xl font-bold mb-2 text-white">
                      Custom
                    </div>
                    <p className="text-gray-400 text-sm mb-6">
                      Soluciones personalizadas para grandes volúmenes
                    </p>
                    <ul className="space-y-4 mb-8">
                      <li className="pricing-feature">
                        <BsCheck2 className="text-white text-xl flex-shrink-0" />
                        <span>Custom Rate Limits</span>
                      </li>
                      <li className="pricing-feature">
                        <BsCheck2 className="text-white text-xl flex-shrink-0" />
                        <span>Precios personalizados por volumen</span>
                      </li>
                      <li className="pricing-feature">
                        <BsCheck2 className="text-white text-xl flex-shrink-0" />
                        <span>Soporte prioritario 24/7</span>
                      </li>
                    </ul>
                  </div>
                  <div className="pricing-button-container">
                    <button className="pricing-button">
                      Contact Sales
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 text-center relative fade-in-section">
          <h2 className="text-3xl font-light mb-6 text-white">
            Potencia tu Empresa con IA Conversacional
          </h2>
          <p className="text-gray-400 mb-10 max-w-2xl mx-auto">
            Únete a las empresas que ya están transformando su gestión del conocimiento con agentes de IA personalizados.
          </p>
          <button className="px-8 py-3 text-sm font-light tracking-wider text-black bg-white hover:bg-gray-100 transition-all duration-300 rounded-full">
            SOLICITAR DEMO
          </button>
        </section>
      </main>
      <Footer />
    </div>
  )
}
