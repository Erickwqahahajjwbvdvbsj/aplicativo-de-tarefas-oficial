import { useProfile } from '../hooks/useProfile';
import React from 'react';

interface AuthUIProps {
  onClose?: () => void;
  isModal?: boolean;
}

export function AuthUI({ onClose, isModal = false }: AuthUIProps) {
  const { loginWithGoogle } = useProfile();

  const handleAuthAction = async () => {
    const success = await loginWithGoogle();
    if (success && onClose) onClose();
  };

  return (
    <div className={`w-full flex-col flex overflow-y-auto overflow-x-hidden no-scrollbar ${isModal ? 'min-h-[100dvh] bg-[#F4F5F9] absolute inset-0 z-50' : 'flex-1 h-full bg-[#F4F5F9] rounded-[32px]'}`}>
      
      {/* Top Section */}
      <div className="relative flex flex-col items-center justify-start pt-7 z-10 w-full flex-1 overflow-visible pb-4">
        {/* Curved brand color background */}
        <div className="absolute w-[240%] pb-[240%] left-[-70%] bottom-[8px] bg-gradient-to-b from-[#fe3a32] to-black rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center w-full grow min-h-0 px-6">
          <div className="w-full max-w-[360px] flex flex-col items-start text-left pt-1">
            <h2 className="text-white text-[32px] sm:text-[36px] font-bold leading-tight mb-4 w-full text-left">
              Olá, seja bem-vindo ao ZaptDay!
            </h2>
            
            <div className="flex flex-col gap-4 text-left text-[#dcdcdc] w-full">
              <p className="text-[15px] leading-relaxed font-normal text-[#dcdcdc]">
                O ZaptDay é o seu espaço para organizar sua rotina, colocar seus planos em ordem e tornar o dia a dia mais simples. Tenha tudo organizado em um só lugar, de forma prática, intuitiva e do seu jeito.
              </p>
              
              <div className="flex flex-col gap-3.5 pt-1">
                <div>
                  <p className="font-semibold text-[16px] text-white">Organização & Tarefas</p>
                  <p className="text-[#dcdcdc] text-[14px] leading-relaxed">Organize suas atividades do dia a dia com facilidade. Crie tarefas, acompanhe prazos e mantenha sua rotina sempre em dia, com mais clareza e controle sobre o que precisa ser feito.</p>
                </div>

                <div>
                  <p className="font-semibold text-[16px] text-white">Crie seus Objetivos</p>
                  <p className="text-[#dcdcdc] text-[14px] leading-relaxed">Transforme metas em planos concretos. Divida seus objetivos em etapas, acompanhe seu progresso e avance com clareza rumo a cada conquista.</p>
                </div>

                <div>
                  <p className="font-semibold text-[16px] text-white">Anotações & Ideias</p>
                  <p className="text-[#dcdcdc] text-[14px] leading-relaxed">Guarde pensamentos, insights e anotações importantes em um só lugar. Não deixe nenhuma ideia importante para trás.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-[#F4F5F9] px-6 pb-8 pt-5 flex flex-col justify-end w-full shrink-0 z-10 relative">
        <div className="flex flex-col gap-4 w-full max-w-[400px] mx-auto mt-auto">
          <button 
             type="button"
             onClick={() => handleAuthAction()}
             className="relative overflow-hidden w-full bg-[#101010] flex items-center justify-center gap-3 py-4 rounded-2xl text-[16px] font-bold text-white hover:bg-black transition active:scale-[0.98]"
          >
             {/* Subtle soft white shimmer light sweep */}
             <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
               <div className="absolute -top-3 -bottom-3 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent blur-sm animate-shimmer-sweep" />
             </div>

             <svg className="w-5 h-5 bg-white rounded-full p-[2px] relative z-10" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
             </svg>
             <span className="relative z-10">Entrar com Google</span>
          </button>
        </div>
      </div>
    </div>
  );
}
