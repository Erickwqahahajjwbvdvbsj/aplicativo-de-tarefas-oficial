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
    <div className={`w-full flex items-center justify-center ${isModal ? 'min-h-[100dvh] bg-[#1f1f1f] absolute inset-0 z-50' : 'flex-1 h-full bg-[#1f1f1f]'} p-6 select-none`}>
      <div className="w-full max-w-[400px] mx-auto flex flex-col items-center text-center">
        
        {/* Title & Description */}
        <h1 className="text-white text-[28px] sm:text-[32px] font-bold leading-tight tracking-tight">
          Bem-vindo ao ZaptDay.
        </h1>
        <p className="text-[#a0a0a0] text-[15px] sm:text-[16px] font-normal leading-relaxed mt-1.5 mb-8">
          O lugar ideal para organizar sua vida, seu trabalho e tudo o que é importante para você.
        </p>

        {/* Google Login Action */}
        <button 
          type="button"
          onClick={() => handleAuthAction()}
          className="w-full h-[56px] bg-[#303030] hover:bg-[#383838] border border-[#424242] rounded-[16px] flex items-center justify-center gap-3 text-[15.5px] font-medium text-white transition-all active:scale-[0.98] shadow-sm"
        >
          <svg className="w-5 h-5 bg-white rounded-full p-[2px] shrink-0" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span>Entrar com o Google</span>
        </button>

        {/* Terms & Privacy Notice */}
        <p className="text-[#808080] text-[12px] sm:text-[12.5px] leading-relaxed text-center mt-5 px-2">
          Ao continuar, você concorda com os Termos de Uso e Política de Privacidade.
        </p>

      </div>
    </div>
  );
}

