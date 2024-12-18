'use client'
import Header from '../components/Header'
import { BsCheck2 } from 'react-icons/bs'

export default function Pricing() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />
      <main className="flex-1 px-12 max-w-7xl mx-auto w-full">
        <div className="text-center mt-16 mb-16">
          <h1 className="text-4xl font-bold mb-4">
            Planes
          </h1>
          <p className="text-gray-400 text-xl mb-8">
            Alphie te ofrece planes flexibles para que puedas disfrutar de la gestión inteligente de la información.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 fade-in-section">
          {/* Personal Plan */}
          <div className="pricing-card">
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
              </ul>
            </div>
            <div className="pricing-button-container">
              <button className="pricing-button">
                Comenzar Gratis
              </button>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="pricing-card premium">
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
              </ul>
            </div>
            <div className="pricing-button-container">
              <button className="pricing-button">
                Comenzar Ahora
              </button>
            </div>
          </div>

          {/* Developer Plan */}
          <div className="pricing-card">
            <div>
              <h3 className="pricing-title">Developer</h3>
              <div className="text-4xl font-bold mb-2 text-white">
                Pay as you go
              </div>
              <p className="text-gray-400 text-sm mb-6">
                Para desarrolladores que buscan integrar la potencia de la IA de Alphie en sus propias aplicaciones y flujos de trabajo.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="pricing-feature">
                  <BsCheck2 className="text-white text-xl flex-shrink-0" />
                  <span>$0.01 por mil páginas de documentos</span>
                </li>
                <li className="pricing-feature">
                  <BsCheck2 className="text-white text-xl flex-shrink-0" />
                  <span>$0.02 por cada consulta</span>
                </li>
                <li className="pricing-feature">
                  <BsCheck2 className="text-white text-xl flex-shrink-0" />
                  <span>$0.02 por mensajes con Alphi</span>
                </li>
              </ul>
            </div>
            <div className="pricing-button-container">
              <button className="pricing-button">
                Contactar
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
