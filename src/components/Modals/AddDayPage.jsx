import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Plus, Calendar, Dumbbell } from 'lucide-react';
import { InputField } from '../';

export const AddDayPage = ({ onClose, onAdd, planId }) => {
  const [dayName, setDayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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
    
    const preventTouchMove = (e) => { e.preventDefault(); };
    document.addEventListener('touchmove', preventTouchMove, { passive: false });

    if (containerRef.current) {
      containerRef.current.style.height = `${window.innerHeight}px`;
    }
    
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo(0, scrollY);
      document.removeEventListener('touchmove', preventTouchMove);
      
      if (navbar) {
        navbar.style.display = '';
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dayName.trim()) {
      setError('Digite o nome do dia');
      return;
    }
    
    setLoading(true);
    try {
      await onAdd(planId, dayName);
      onClose();
    } catch (err) {
      setError('Erro ao adicionar dia');
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
          
          <div className="mb-12 text-center pt-2"> 
            <div className="relative inline-block mb-4">
              <Calendar size={48} className="text-[#ff6600] opacity-80" />
              <div className="absolute inset-0 blur-2xl bg-[#ff6600]/20 -z-10"></div>
            </div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">
              NOVO <span className="text-[#ff6600]">DIA</span>
            </h1>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mt-4">
              ADICIONE UM NOVO DIA DE TREINO
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              label="Nome do Dia"
              icon={Plus}
              placeholder="EX: QUARTA - COSTAS"
              value={dayName}
              onChange={(e) => setDayName(e.target.value.toUpperCase())}
              style={{ fontSize: '16px' }}
              className="text-center font-black uppercase tracking-wider"
            />
            
            {error && (
              <p className="text-red-500 text-[10px] font-black uppercase text-center bg-red-500/10 py-3 rounded-xl border border-red-500/20">
                {error}
              </p>
            )}
            
            <div className="space-y-4">
              <button
                type="submit"
                disabled={loading || !dayName.trim()}
                className="w-full py-5 rounded-2xl font-black italic bg-[#ff6600] text-black uppercase text-[11px] tracking-widest shadow-[0_0_20px_rgba(255,102,0,0.5)] active:scale-95 disabled:opacity-30 transition-all"
              >
                {loading ? 'ADICIONANDO...' : 'CRIAR DIA'}
              </button>

              {/* VOLTAR como texto simples abaixo do botão com feedback active */}
              <div className="text-center">
                <span 
                  onClick={onClose}
                  className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em] cursor-pointer active:text-white transition-colors"
                >
                  VOLTAR
                </span>
              </div>
            </div>
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
                    <span className="text-[#ff6600]">Organize seus dias de treino</span>. 
                    Uma boa divisão é o segredo da evolução.
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