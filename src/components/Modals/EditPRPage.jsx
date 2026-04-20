import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Trophy, Weight, Dumbbell } from 'lucide-react';
import { InputField } from '../';

export const EditPRPage = ({ onClose, onUpdate, planId, exerciseName, currentWeight }) => {
  const [weight, setWeight] = useState(currentWeight || '');
  const [loading, setLoading] = useState(false);
  const [isInfoActive, setIsInfoActive] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    setIsAndroid(userAgent.includes('android'));

    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    
    const navbar = document.querySelector('nav');
    if (navbar) {
      navbar.style.display = 'none';
    }
    
    if (containerRef.current) {
      containerRef.current.style.height = `${window.innerHeight}px`;
    }
    
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo(0, scrollY);
      
      if (navbar) {
        navbar.style.display = '';
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onUpdate(planId, null, exerciseName, { weight: Number(weight) }, true);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      ref={containerRef} 
      className={`fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl overflow-y-auto ${isAndroid ? 'android-scroll-limit' : ''}`}
      style={isAndroid ? { WebkitOverflowScrolling: 'touch' } : {}}
    >
      <div className="min-h-full flex flex-col items-center p-4">
        <div className="w-full max-w-[380px] flex flex-col">
          
          <button onClick={onClose} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8">
            <ArrowLeft size={24} />
            <span className="text-sm font-bold uppercase tracking-wider">VOLTAR</span>
          </button>

          <div className="mb-12 text-center">
            <div className="relative inline-block mb-4">
              <Trophy size={60} className="text-[#ff6600] opacity-90 mx-auto" />
              <div className="absolute inset-0 blur-3xl bg-[#ff6600]/20 -z-10"></div>
            </div>
           <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-none mb-2">
  <span className="text-white">RECORD</span> <span className="text-[#ff6600]">PESSOAL</span>
</h1>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em]">
              {exerciseName}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <InputField
                label="Nova Carga Máxima (KG)"
                type="number"
                icon={Weight}
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="0"
                style={{ fontSize: '16px', color: '#ff6600' }}
              />
              <p className="text-center text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em] italic">
                O peso será atualizado no seu histórico global
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 rounded-2xl font-black italic bg-[#ff6600] text-black uppercase text-[11px] tracking-[0.2em] shadow-[0_0_30px_rgba(255,102,0,0.4)] active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? 'SALVANDO...' : 'CONFIRMAR NOVO PR'}
            </button>
          </form>

          <div className="mt-16">
            <div 
              onClick={() => setIsInfoActive(!isInfoActive)}
              className={`group relative p-4 rounded-2xl bg-white/[0.03] backdrop-blur-sm border transition-all duration-500 shadow-2xl overflow-hidden cursor-pointer
                ${isInfoActive 
                  ? 'border-[#ff6600]/60 scale-[1.01] bg-white/[0.06]' 
                  : 'border-white/10 hover:border-white/20'
                }`}
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 
                ${isInfoActive ? 'bg-[#ff6600] shadow-[0_0_15px_#ff6600]' : 'bg-[#ff6600]/10'}`} 
              />

              <div className="flex items-center gap-4 relative z-10">
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-300 flex-shrink-0
                  ${isInfoActive 
                    ? 'bg-[#ff6600] text-black border-[#ff6600] shadow-[0_0_10px_#ff6600]' 
                    : 'bg-white/[0.03] border-white/5 text-gray-500'
                  }`}
                >
                  <Dumbbell size={16} />
                </div>

                <div className="flex-1">
                  <p className={`text-[12px] font-bold uppercase tracking-[0.15em] leading-tight transition-colors duration-300
                    ${isInfoActive ? 'text-white' : 'text-gray-400'}`}
                  >
                    <span className="text-[#ff6600]">Todo recorde foi um dia apenas um sonho</span>. 
                    Agora é hora de superar.
                  </p>
                </div>
              </div>

              <div className={`absolute bottom-0 left-0 h-[2px] bg-[#ff6600] shadow-[0_0_15px_#ff6600] transition-all duration-700 
                ${isInfoActive ? 'w-full' : 'w-0'}`} 
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};