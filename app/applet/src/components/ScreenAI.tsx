import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

const SUGGESTIONS = [
  "Adicione uma tarefa para comprar leite hoje",
  "Edite minha reunião de amanhã para as 15h",
  "Mostre as minhas tarefas concluídas",
  "Crie um projeto para a viagem de férias",
  "Quais são minhas prioridades para esta semana?",
  "Reagende todas as tarefas atrasadas para hoje",
  "Adicione 'Ligar para a mãe' com prioridade alta",
  "Apague a tarefa de lavar o carro",
  "Lembre-me de beber água a cada 2 horas",
  "Resuma o que eu tenho para fazer hoje"
];

export function ScreenAI({ onNavigate }: { onNavigate: (tab: 'home' | 'roadmap' | 'ai' | 'profile' | 'focus' | 'notifications') => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SUGGESTIONS.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full bg-[#050505] relative font-sans overflow-hidden flex flex-col">
      <style>{`
        /* Container principal que aplica o desfoque global */
        .ai-fog-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            /* Aumentei o blur para as cores se fundirem ainda mais ao se cruzarem */
            filter: blur(140px);
            -webkit-filter: blur(140px);
            z-index: 1;
        }

        /* Formas base (orbes de luz) */
        .orb {
            position: absolute;
            border-radius: 50%;
            mix-blend-mode: screen; 
            opacity: 0.85;
            will-change: transform;
        }

        /* Cor 1: O vermelho exigido (#ff3838) */
        .orb-red {
            width: 70vw;
            height: 70vw;
            background: #ff3838;
            top: 10%;
            left: -10%;
            /* Tempo reduzido (mais rápido) */
            animation: mixRed 12s ease-in-out infinite alternate;
        }

        /* Cor 2: Roxo profundo */
        .orb-purple {
            width: 80vw;
            height: 80vw;
            background: #5e17eb;
            bottom: 0%;
            right: -10%;
            animation: mixPurple 14s ease-in-out infinite alternate-reverse;
        }

        /* Cor 3: Laranja/Coral quente */
        .orb-orange {
            width: 60vw;
            height: 60vw;
            background: #ff8a00;
            bottom: -10%;
            left: -5%;
            animation: mixOrange 16s ease-in-out infinite alternate;
        }

        /* Cor 4: Azul/Ciano sutil */
        .orb-cyan {
            width: 65vw;
            height: 65vw;
            background: #00f0ff;
            top: -10%;
            right: 0%;
            animation: mixCyan 13s ease-in-out infinite alternate-reverse;
        }

        /* Camada de ruído tátil (Textura) */
        .noise-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 2;
            opacity: 0.12; /* Levemente aumentado para segurar o banding com o movimento rápido */
            pointer-events: none;
            mix-blend-mode: overlay;
        }

        /* --- ANIMAÇÕES KEYFRAMES (NOVAS TRAJETÓRIAS) --- */
        /* Agora as formas viajam distâncias muito maiores, cruzando a tela 
           e se misturando intensamente no centro. */

        @keyframes mixRed {
            0% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(40vw, 30vh) scale(1.3); } /* Vai bem pro meio */
            66% { transform: translate(10vw, 60vh) scale(0.8); }
            100% { transform: translate(50vw, -10vh) scale(1.2); }
        }

        @keyframes mixPurple {
            0% { transform: translate(0, 0) scale(1.1); }
            33% { transform: translate(-50vw, -40vh) scale(0.8); } /* Atravessa a tela */
            66% { transform: translate(-20vw, -10vh) scale(1.4); }
            100% { transform: translate(-60vw, 20vh) scale(1); }
        }

        @keyframes mixOrange {
            0% { transform: translate(0, 0) scale(0.9); }
            33% { transform: translate(50vw, -50vh) scale(1.2); }
            66% { transform: translate(20vw, -20vh) scale(0.7); }
            100% { transform: translate(60vw, -60vh) scale(1.3); }
        }

        @keyframes mixCyan {
            0% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(-40vw, 50vh) scale(1.3); }
            66% { transform: translate(-10vw, 30vh) scale(0.9); }
            100% { transform: translate(-50vw, 60vh) scale(1.2); }
        }

        /* Responsividade mantida */
        @media (max-width: 768px) {
            .orb { opacity: 0.95; }
            .orb-red { width: 100vw; height: 100vw; }
            .orb-purple { width: 120vw; height: 120vw; }
            .orb-orange { width: 90vw; height: 90vw; }
            .orb-cyan { width: 100vw; height: 100vw; }
        }
      `}</style>

      {/* Filtro de ruído (mantido, pois é essencial) */}
      <svg className="noise-overlay" viewBox="0 0 100vw 100vh" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
              <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch"/>
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)"/>
      </svg>

      {/* O Efeito de Neblina Puro */}
      <div className="ai-fog-container">
          <div className="orb orb-red"></div>
          <div className="orb orb-purple"></div>
          <div className="orb orb-orange"></div>
          <div className="orb orb-cyan"></div>
      </div>

      {/* Top Header com Botão de Voltar */}
      <div className="absolute top-0 left-0 right-0 pt-12 px-6 z-50 flex items-center">
        <button 
          onClick={() => onNavigate('home')}
          className="w-10 h-10 rounded-full border border-white/10 bg-[#303030] shadow-sm hover:bg-white/10 transition flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Sugestões Centrais */}
      <div className="flex-1 w-full flex flex-col items-center justify-center px-8 relative z-10 pointer-events-none">
        <h2 className="text-white text-[18px] font-bold text-center opacity-[0.03] leading-none">Peça ao ZaptDay:</h2>
        
        <div className="h-[60px] flex items-start justify-center w-full mt-1">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.03 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="text-white font-medium text-[15px] text-center italic leading-tight"
            >
              "{SUGGESTIONS[currentIndex]}"
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
}
