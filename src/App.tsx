import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { ScreenRoadmap } from './components/ScreenRoadmap';
import { ScreenHome } from './components/ScreenHome';

import { ScreenProfile } from './components/ScreenProfile';
import { ScreenGoals } from './components/ScreenGoals';
import { ScreenNotes } from './components/ScreenNotes';
import { PhoneFrame } from './components/PhoneFrame';
import { AuthUI } from './components/AuthUI';
import { useProfile } from './hooks/useProfile';
import { useNotes } from './hooks/useNotes';
import { useGoals } from './hooks/useGoals';
import { useTasks } from './hooks/useTasks';

function NamePrompt() {
  const { updateProfile } = useProfile();
  const [nameInput, setNameInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (nameInput.trim() && !isSaving) {
      setIsSaving(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await updateProfile({ name: nameInput.trim() });
    }
  };

  if (isSaving) {
    return <SplashScreen />;
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
       <div className="w-full text-left max-w-[400px] bg-[#1f1f1f] rounded-[32px] p-8 relative border border-[#2c2c2c]">
          <h2 className="text-white text-[26px] sm:text-[28px] font-bold leading-tight mb-2">Bem vindo ao ZaptDay! 🎉</h2>
          <p className="text-white font-normal text-[15px] leading-tight mb-8">
            Para personalizar sua experiência, como gostaria de ser chamado?
          </p>
          <div className="flex flex-col gap-4">
             <input 
               type="text" 
               value={nameInput}
               onChange={(e) => setNameInput(e.target.value)}
               placeholder="Digite seu nome..."
               className="w-full bg-[#2c2c2c] border border-transparent rounded-2xl px-5 py-4 text-[16px] font-normal text-white placeholder:text-[#a0a0a0] placeholder:font-normal outline-none transition"
             />
             {nameInput.trim() ? (
               <button 
                 onClick={handleSave}
                 disabled={isSaving}
                 className="w-full bg-[#ff3838] text-white px-8 py-4 rounded-2xl text-[15px] font-bold hover:bg-[#e03030] transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
               >
                 Começar a usar
               </button>
             ) : null}
          </div>
       </div>
    </div>
  );
}

function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[200] bg-[#1f1f1f] flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-[#ff3838] animate-spin" />
    </div>
  );
}

const ICONS_TO_PRELOAD = [
  "https://i.ibb.co/RkjZrzH6/Vou-pra-puta-que-pariu-amanh-e-n-o-quero-nem-saber-de-nada-rapaz-20260819-132338-0000.png",
  "https://i.ibb.co/BV2ZD0Ws/Bem-vindo-ao-Cosmo-List-512-x-512-px-20260711-170809-0000.png",
  "https://i.ibb.co/JNnKTWq/Bem-vindo-ao-Cosmo-List-512-x-512-px-20260711-170502-0000.png",
  "https://i.ibb.co/93y6xTwJ/Bem-vindo-ao-Cosmo-List-512-x-512-px-20260711-171109-0000.png",
  "https://i.ibb.co/B2YpNgVD/Bem-vindo-ao-Cosmo-List-512-x-512-px-20260711-165417-0000.png",
  "https://i.ibb.co/FqbdJ8MT/Picsart-26-07-22-22-47-11-226.png",
  "https://i.ibb.co/LzzjQ8Xh/Picsart-26-07-22-22-47-56-320.png",
  "https://i.ibb.co/bg19xYN8/Bem-vindo-ao-Cosmo-List-512-x-512-px-20260711-212607-0000.png",
  "https://i.ibb.co/gM8zHtxw/Vou-pra-puta-que-pariu-amanh-e-n-o-quero-nem-saber-de-nada-rapaz-20260818-011442-0000.png",
  "https://i.ibb.co/bgshDt4f/Bem-vindo-ao-Cosmo-List-512-x-512-px-20260720-161659-0000.png",
  "https://i.ibb.co/Kp66cQQx/Bem-vindo-ao-Cosmo-List-512-x-512-px-20260720-161840-0000.png",
  "https://i.ibb.co/v4fChL23/Vou-pra-puta-que-pariu-amanh-e-n-o-quero-nem-saber-de-nada-rapaz-20260812-130637-0000.png",
  "https://i.ibb.co/ZpzY7Hxs/Vou-pra-puta-que-pariu-amanh-e-n-o-quero-nem-saber-de-nada-rapaz-20260812-130517-0000.png",
  "https://i.ibb.co/bMSpngM7/Vou-pra-puta-que-pariu-amanh-e-n-o-quero-nem-saber-de-nada-rapaz-20260819-212239-0000.png",
  "https://i.ibb.co/v6VYvhRF/Vou-pra-puta-que-pariu-amanh-e-n-o-quero-nem-saber-de-nada-rapaz-20260819-211412-0000.png"
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'home' | 'ai' | 'profile' | 'goals' | 'notifications' | 'notes'>('home');
  const { user, profile, isLoadingProfile, isDeletingAccount } = useProfile();
  const [showInitialAuth, setShowInitialAuth] = useState(false);
  const [minSplashDone, setMinSplashDone] = useState(false);
  const [loginSplashActive, setLoginSplashActive] = useState(false);
  const [logoutSplashActive, setLogoutSplashActive] = useState(false);
  const [imagesPreloaded, setImagesPreloaded] = useState(false);
  
  const appMountTime = useRef(Date.now());
  const prevUserRef = useRef(user?.uid);

  // Initialize reminder scheduler, notes and goals preloading
  const { isLoading: isNotesLoading } = useNotes();
  const { isLoading: isGoalsLoading } = useGoals();
  const { isLoading: isTasksLoading } = useTasks();

  useEffect(() => {
    const t = setTimeout(() => {
      setMinSplashDone(true);
    }, 2000); // Exatamente 2 segundos no início
    return () => clearTimeout(t);
  }, []);

  const preloadImages = () => {
    setImagesPreloaded(false);
    let completedCount = 0;
    const checkDone = () => {
      if (completedCount >= ICONS_TO_PRELOAD.length) {
        setImagesPreloaded(true);
      }
    };

    ICONS_TO_PRELOAD.forEach(src => {
      // Force browser to cache the image in memory directly in the document head
      // This prevents the flicker when components unmount and remount (304 revalidation)
      let link = document.querySelector(`link[href="${src}"]`) as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      }

      // 1. Fetch to ensure it hits the disk cache
      fetch(src, { mode: 'no-cors', referrerPolicy: 'no-referrer' }).catch(() => {});

      // 2. Image object to track onload exactly
      const img = new Image();
      img.referrerPolicy = "no-referrer";
      img.src = src;
      img.onload = () => {
        completedCount++;
        checkDone();
      };
      img.onerror = () => {
        completedCount++;
        checkDone();
      };
    });
  };

  useEffect(() => {
    preloadImages();
  }, []);

  useEffect(() => {
    // Detect manual login and logout
    if (!prevUserRef.current && user?.uid) {
      setActiveTab('home');
      preloadImages(); // Re-run preload to ensure cache is hot if user cleared it before logging in
      if (Date.now() - appMountTime.current > 2000) {
        setLoginSplashActive(true);
        const t = setTimeout(() => {
          setLoginSplashActive(false);
        }, 2000); // Exatamente 2 segundos no login manual
      }
    } else if (prevUserRef.current && !user?.uid) {
      // Detect manual logout
      setActiveTab('home');
      setLogoutSplashActive(true);
      const t = setTimeout(() => {
        setLogoutSplashActive(false);
      }, 2000); // Exatamente 2 segundos no logout
    }
    prevUserRef.current = user?.uid;
  }, [user?.uid]);

  const isDataLoading = isTasksLoading || isGoalsLoading || isNotesLoading;
  const showSplash = !minSplashDone || isLoadingProfile || !imagesPreloaded || loginSplashActive || logoutSplashActive || (!!user?.uid && isDataLoading);

  useEffect(() => {
    if (showSplash || isDeletingAccount || sessionStorage.getItem('@app_deleting_account') === 'true') {
      setShowInitialAuth(false);
    } else {
      if (!user) {
        setShowInitialAuth(true);
      } else {
        setShowInitialAuth(false);
      }
    }
  }, [user, showSplash, isDeletingAccount]);

  const handleCloseAuth = () => {
    setShowInitialAuth(false);
  };

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen key="splash" />}
      </AnimatePresence>
      
      {/* Desktop view: 3 phones parallel like the Dribbble shot */}
      <div className="hidden lg:flex flex-row items-center justify-center gap-10 w-full min-h-screen p-8 bg-[#E3E5EB] overflow-x-auto">
        <div className="transform translate-y-6 shrink-0 transition-transform duration-500 hover:translate-y-4">
          <PhoneFrame>
             <ScreenRoadmap onBack={() => setActiveTab('home')} onNavigate={setActiveTab} />
          </PhoneFrame>
        </div>
        <div className="transform -translate-y-4 shrink-0 transition-transform duration-500 hover:-translate-y-6">
          <PhoneFrame>
             <AnimatePresence>
               {activeTab === 'profile' && <ScreenProfile key="profile" onBack={() => setActiveTab('home')} />}
            </AnimatePresence>
            {activeTab !== 'profile' && (
              activeTab === 'goals' ? (
                  <ScreenGoals onNavigate={setActiveTab} />
              ) : activeTab === 'notes' ? (
                  <ScreenNotes onNavigate={setActiveTab} />
              ) : (
                  <ScreenHome onNavigate={setActiveTab} />
              )
            )}
          </PhoneFrame>
        </div>
        
      </div>

      {/* Mobile view: single interactive phone layout */}
      <div className="lg:hidden w-full h-[100dvh] bg-black flex items-center justify-center">
         <div className="w-full h-full max-w-[480px] bg-[#1f1f1f] relative overflow-hidden">
            {activeTab === 'roadmap' && <ScreenRoadmap onBack={() => setActiveTab('home')} onNavigate={setActiveTab} />}
            {activeTab === 'home' && <ScreenHome onNavigate={setActiveTab} />}
            {activeTab === 'goals' && <ScreenGoals onNavigate={setActiveTab} />}
            {activeTab === 'notes' && <ScreenNotes onNavigate={setActiveTab} />}
            
            <AnimatePresence>{activeTab === 'profile' && <ScreenProfile key="profile" onBack={() => setActiveTab('home')} />}</AnimatePresence>
         </div>
      </div>

      {showInitialAuth && (
        <div className="fixed inset-0 z-[100] bg-white animate-in slide-in-from-bottom-[100%] duration-300">
           <AuthUI onClose={handleCloseAuth} isModal={true} />
        </div>
      )}

      {!showSplash && !isLoadingProfile && !isDeletingAccount && sessionStorage.getItem('@app_deleting_account') !== 'true' && user && profile.name === 'anônimo' && <NamePrompt />}
    </>
  );
}
