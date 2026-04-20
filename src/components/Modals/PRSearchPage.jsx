import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Search, Trophy, Dumbbell } from 'lucide-react';
import api from '../../services/api';

export const PRSearchPage = ({ onClose }) => {
  const [prSearchQuery, setPRSearchQuery] = useState('');
  const [prSearchResult, setPRSearchResult] = useState(null);
  const [searchingPR, setSearchingPR] = useState(false);
  const [isInfoActive, setIsInfoActive] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    
    // Esconde o navbar
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
      
      // Restaura o navbar
      if (navbar) {
        navbar.style.display = '';
      }
    };
  }, []);

  const handleSearchPR = async (e) => {
    if (e) e.preventDefault();
    if (!prSearchQuery.trim()) return;
    
    setSearchingPR(true);
    try {
      const response = await api.get('/workouts/pr', {
        params: { exercise: prSearchQuery.trim() },
      });
      const pr = response.data.personalRecord || response.data.weight;
      setPRSearchResult(pr !== undefined && pr !== null ? `${pr}` : 'N/A');
    } catch (e) {
      setPRSearchResult('N/A');
    } finally {
      setSearchingPR(false);
    }
  };

  return (
    <div ref={containerRef} className="fixed inset-0 z-[9999] bg-black overflow-y-auto">
      <div className="bg-black w-full">
        <div className="w-full max-w-[380px] mx-auto p-4">
          
          <button onClick={onClose} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8">
            <ArrowLeft size={20} />
            <span className="text-[10px] font-bold uppercase tracking-widest">VOLTAR</span>
          </button>

          <div className="mb-12">
            <h1 className="text-6xl font-black italic uppercase tracking-tighter leading-[0.85] text-white">
              SEU <span className="text-[#ff6600]">PR</span><br />
              MÁXIMO
            </h1>
            <p className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.3em] mt-4">
              BUSCA O PR DE QUALQUER EXERCÍCIO
            </p>
          </div>

          <div className="space-y-10">
            <form onSubmit={handleSearchPR} className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Search size={14} className="text-gray-600" />
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-600">PESQUISAR EXERCÍCIO</span>
              </div>
              
              <div className="relative group">
                <input
                  type="text"
                  placeholder="EX: SUPINO RETO"
                  value={prSearchQuery}
                  onChange={(e) => setPRSearchQuery(e.target.value.toUpperCase())}
                  style={{ fontSize: '16px' }}
                  className="w-full bg-[#0a0a0a] border border-white/5 rounded-2xl p-5 text-gray-400 font-bold text-sm tracking-widest outline-none focus:border-[#ff6600]/30 transition-all placeholder:text-gray-900"
                />
                <button 
                  type="submit"
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-[#ff6600] opacity-30 group-focus-within:opacity-100 transition-opacity"
                >
                  {searchingPR ? (
                    <div className="animate-spin h-5 w-5 border-2 border-[#ff6600] border-t-transparent rounded-full" />
                  ) : (
                    <Search size={22} />
                  )}
                </button>
              </div>
            </form>

            {prSearchResult !== null && (
              <div className="animate-in fade-in zoom-in duration-300">
                <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-10 text-center relative overflow-hidden">
                  <div className="absolute -right-6 -top-6 text-[#ff6600]/5 rotate-12">
                    <Trophy size={150} />
                  </div>
                  <span className="text-[9px] font-black uppercase text-gray-600 tracking-[0.4em] mb-4 block">
                    seu pr nesse exercício
                  </span>
                  <div className="flex items-end justify-center gap-2">
                    <span className="text-8xl font-black italic text-[#ff6600] leading-none tracking-tighter" style={{ textShadow: '0 0 40px rgba(255,102,0,0.3)' }}>
                      {prSearchResult}
                    </span>
                    {prSearchResult !== 'N/A' && (
                      <span className="text-2xl font-black italic text-gray-800 mb-1">KG</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CAMPO INFORMATIVO - AGORA NO FINAL DO CONTEÚDO */}
          <div className="mt-16 pb-8">
            <div 
              onClick={() => setIsInfoActive(!isInfoActive)}
              className={`group relative p-4 rounded-2xl bg-white/[0.03] border transition-all duration-500 shadow-2xl overflow-hidden cursor-pointer
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
                    <span className="text-[#ff6600]">A força não vem do corpo</span>. 
                    Vem da vontade de nunca parar.
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