import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, Upload, Trash2, Camera, Bell, Check, Key, User, ChevronRight, Pencil } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { AuthUI } from './AuthUI';

type SubScreen = 'main' | 'userInfo' | 'settings' | 'sensitiveData';

export const ScreenProfile: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { profile, updateProfile, resetProfile, user, loginWithGoogle, logout, deleteAccount } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [activeSubScreen, setActiveSubScreen] = useState<SubScreen>('main');
  const [nameInput, setNameInput] = useState(profile.name === 'anônimo' ? '' : profile.name);
  const [apiKeyInput, setApiKeyInput] = useState(profile.geminiApiKey || '');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingApiKey, setIsEditingApiKey] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setIsDeleting(false);
    setActiveSubScreen('main');
  }, [user?.uid]);

  useEffect(() => {
    setNameInput(profile.name === 'anônimo' ? '' : profile.name);
    setApiKeyInput(profile.geminiApiKey || '');
  }, [profile.name, profile.geminiApiKey]);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 300;
          let width = img.width;
          let height = img.height;
          if (width > height && width > maxDim) {
            height *= maxDim / width;
            width = maxDim;
          } else if (height > maxDim) {
            width *= maxDim / height;
            height = maxDim;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
          updateProfile({ photoUrl: compressedBase64 });
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveName = () => {
    const trimmed = nameInput.trim();
    if (trimmed) {
      updateProfile({ name: trimmed });
    } else {
      setNameInput(profile.name === 'anônimo' ? '' : profile.name);
    }
    setIsEditingName(false);
  };

  const handleSaveApiKey = () => {
    updateProfile({ geminiApiKey: apiKeyInput.trim() });
    setIsEditingApiKey(false);
  };

  const CategoryButton = ({ title, onClick }: { title: string, onClick: () => void }) => (
    <button 
      onClick={onClick}
      className="w-full h-[56px] bg-[#2c2c2c] rounded-[14px] px-5 shadow-sm border border-transparent flex items-center justify-between text-left transition-transform active:scale-[0.98] hover:bg-[#333333] mb-4"
    >
       <span className="text-[14px] font-bold text-white">{title}</span>
       <ChevronRight className="w-5 h-5 text-[#dcdcdc]" />
    </button>
  );

  return (
    <div className="absolute inset-0 z-50 w-full h-full bg-[#1f1f1f] font-sans overflow-hidden flex flex-col">
      <div className="flex-1 w-full overflow-y-auto no-scrollbar px-6 pt-8 pb-8 flex flex-col">
        <AnimatePresence mode="wait">
            {activeSubScreen === 'main' && (
              <motion.div 
                key="main"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col"
              >
                <div className="flex items-center shrink-0 justify-between min-h-[40px] mb-12 relative">
                  <button 
                    onClick={() => onBack()} 
                    className="w-10 h-10 rounded-full bg-[#2c2c2c] flex items-center justify-center hover:bg-[#333333] transition shadow-sm shrink-0"
                  >
                    <ArrowLeft className="w-5 h-5 text-[#dcdcdc]" />
                  </button>
                  <h2 className="text-white text-[20px] font-bold leading-tight text-center flex-1 pr-10">
                    {profile.name === 'anônimo' ? '' : profile.name}
                  </h2>
                </div>

                <div className="flex flex-col">
                  <CategoryButton title="Informações do usuário" onClick={() => setActiveSubScreen('userInfo')} />
                  <CategoryButton title="Dados sensíveis" onClick={() => setActiveSubScreen('sensitiveData')} />
                </div>
              </motion.div>
            )}

            {activeSubScreen === 'userInfo' && (
              <motion.div 
                key="userInfo"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col"
              >
                <div className="flex items-center shrink-0 justify-between mb-12">
                  <button 
                    onClick={() => setActiveSubScreen('main')} 
                    className="w-10 h-10 rounded-full bg-[#2c2c2c] flex items-center justify-center hover:bg-[#333333] transition shadow-sm shrink-0"
                  >
                    <ArrowLeft className="w-5 h-5 text-[#dcdcdc]" />
                  </button>
                  <h1 className="text-white text-[18px] font-bold leading-tight text-center flex-1 pr-10">
                    Informações do usuário
                  </h1>
                </div>

                {/* Form Fields */}
                <div className="mb-8 flex flex-col">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[15px] font-bold text-white leading-none">Nome de usuário</label>
                    {!isEditingName && (
                      <button 
                        className="flex items-center justify-center cursor-pointer hover:opacity-80 active:scale-[0.95] transition p-1 -mr-1"
                        onClick={() => setIsEditingName(true)}
                      >
                        <Pencil className="w-4 h-4 text-[#dcdcdc]" />
                      </button>
                    )}
                  </div>
                  {isEditingName ? (
                    <input 
                      type="text" 
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      onBlur={handleSaveName}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                      autoFocus
                      placeholder="Seu nome"
                      className="w-full bg-transparent text-[14px] font-normal text-white outline-none p-0 m-0 leading-none h-auto border-none shadow-none"
                    />
                  ) : (
                    <span className="text-[14px] font-normal text-[#73777d] leading-none">{profile.name === 'anônimo' ? 'Adicionar nome' : profile.name}</span>
                  )}
                </div>

                <div className="mb-8 flex flex-col">
                  <label className="text-[15px] font-bold text-white leading-none mb-1">Meu email cadastrado</label>
                  <span className="text-[14px] font-normal text-[#73777d] leading-none mt-1">{user?.email}</span>
                </div>

                {/* Logout Button */}
                <button 
                  onClick={() => {
                      setActiveSubScreen('main');
                      sessionStorage.removeItem('@app_has_seen_auth');
                      logout();
                      onBack();
                  }}
                  className="w-full text-left flex flex-col transition-all duration-150 active:scale-[0.98] hover:opacity-80 cursor-pointer mb-8"
                >
                   <span className="text-[15px] font-bold text-white leading-none">Sair da conta</span>
                </button>
              </motion.div>
            )}


            {activeSubScreen === 'sensitiveData' && (
              <motion.div 
                key="sensitiveData"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col"
              >
                <div className="flex items-center shrink-0 justify-between mb-12">
                  <button 
                    onClick={() => setActiveSubScreen('main')} 
                    className="w-10 h-10 rounded-full bg-[#2c2c2c] flex items-center justify-center hover:bg-[#333333] transition shadow-sm shrink-0"
                  >
                    <ArrowLeft className="w-5 h-5 text-[#dcdcdc]" />
                  </button>
                  <h1 className="text-white text-[18px] font-bold leading-tight text-center flex-1 pr-10">
                    Dados sensíveis
                  </h1>
                </div>
                <button 
                  onClick={async () => {
                      await resetProfile();
                      setActiveSubScreen('main');
                  }}
                  className="w-full text-left flex flex-col transition-all duration-150 active:scale-[0.98] hover:opacity-80 cursor-pointer mb-8"
                >
                   <span className="text-[15px] font-bold text-white leading-none mb-2">Resetar dados</span>
                   <span className="text-[14px] font-normal text-[#73777d] leading-none">Apaga suas configurações e dados, mas não exclui a conta.</span>
                </button>
                <button 
                  disabled={isDeleting}
                  onClick={async () => {
                      setIsDeleting(true);
                      sessionStorage.removeItem('@app_has_seen_auth');
                      try {
                        await deleteAccount();
                      } finally {
                        setIsDeleting(false);
                      }
                  }}
                  className="w-full text-left flex flex-col transition-all duration-150 active:scale-[0.98] hover:opacity-80 cursor-pointer mb-8 disabled:opacity-60"
                >
                   <div className="flex items-center gap-2 mb-2">
                     {isDeleting && (
                       <motion.div
                         animate={{ rotate: 360 }}
                         transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                         className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white shrink-0"
                       />
                     )}
                     <span className="text-[15px] font-bold text-white leading-none">Excluir conta</span>
                   </div>
                   <span className="text-[14px] font-normal text-[#73777d] leading-none">Exclui sua conta permanentemente e apaga todos os dados.</span>
                </button>
              </motion.div>
            )}

          </AnimatePresence>
      </div>
    </div>
  );
}
