// src/components/Modals/PRSearchPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Search, Trophy } from 'lucide-react';
import api from '../../services/api';

export const PRSearchPage = ({ onClose }) => {
  const [prSearchQuery, setPRSearchQuery] = useState('');
  const [prSearchResult, setPRSearchResult] = useState(null);
  const [searchingPR, setSearchingPR] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    
    if (containerRef.current) {
      containerRef.current.style.height = `${window.innerHeight}px`;
    }
    
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo(0, scrollY);
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
    <div 
      ref={containerRef}
      className="bg-black text-white fixed inset-0 z-[9999] overflow-hidden flex flex-col"
    >
      {/* Botão Voltar */}
      <div className="px-4 pt-8 pb-2">
        <button onClick={onClose} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
          <span className="text-[10px] font-bold uppercase tracking-widest">VOLTAR</span>
        </button>
      </div>

      <div className="flex-1 px-6 pt-10">
        <div className="max-w-md mx-auto">
          
          {/* Título com quebra de linha conforme a imagem */}
          <div className="mb-12">
            <h1 className="text-6xl font-black italic uppercase tracking-tighter leading-[0.85] text-white">
              SEU <span className="text-[#ff6600]">PR</span><br />
              MÁXIMO
            </h1>
            <p className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.3em] mt-4">
              BUSCA O pr DE QUALQUER EXERCÍCIO
            </p>
          </div>

          <div className="space-y-10">
            {/* Campo de busca dentro do retângulo conforme a imagem */}
            <form onSubmit={handleSearchPR} className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Search size={14} className="text-gray-600" />
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-600">PESQUISAR EXERCÍCIO</span>
              </div>
              
              <div className="relative group">
                <input
                  autoFocus
                  type="text"
                  placeholder="EX: SUPINO RETO"
                  value={prSearchQuery}
                  onChange={(e) => setPRSearchQuery(e.target.value.toUpperCase())}
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

            {/* Resultado do PR - Estilo Brutalista */}
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
        </div>
      </div>
    </div>
  );
};