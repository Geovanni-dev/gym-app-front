// src/components/Modals/PRSearchPage.jsx
import React, { useState } from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import api from '../../services/api';

export const PRSearchPage = ({ onClose }) => {
  const [prSearchQuery, setPRSearchQuery] = useState('');
  const [prSearchResult, setPRSearchResult] = useState(null);
  const [searchingPR, setSearchingPR] = useState(false);

  const handleSearchPR = async (e) => {
    e.preventDefault();
    if (!prSearchQuery.trim()) return;
    setSearchingPR(true);
    try {
      const response = await api.get('/workouts/pr', {
        params: { exercise: prSearchQuery.trim() },
      });
      const pr = response.data.personalRecord || response.data.weight;
      setPRSearchResult(pr !== undefined && pr !== null ? `${pr}KG` : 'N/A');
    } catch (e) {
      setPRSearchResult('N/A');
    } finally {
      setSearchingPR(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-20">
        
        {/* Botão Voltar */}
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={24} />
          <span className="text-sm font-bold uppercase tracking-wider">Voltar</span>
        </button>

        {/* Título */}
        <div className="mb-8">
          <h1 className="text-5xl sm:text-7xl font-black italic uppercase tracking-tighter text-white leading-none">
            SEU <span className="text-[#ff6600]">PR</span>
            <br />
            MÁXIMO
          </h1>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mt-4">
            BUSCA O RECORDE DE QUALQUER EXERCÍCIO
          </p>
        </div>

        {/* Conteúdo */}
        <div className="space-y-6">
          <form onSubmit={handleSearchPR} className="space-y-4">
            <div className="relative">
              <input
                autoFocus
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white uppercase font-bold text-sm outline-none focus:border-[#ff6600] pr-12"
                placeholder="NOME DO EXERCÍCIO"
                value={prSearchQuery}
                onChange={(e) => setPRSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#ff6600]"
              >
                {searchingPR ? (
                  <div className="animate-spin h-5 w-5 border-2 border-[#ff6600] border-t-transparent rounded-full" />
                ) : (
                  <ChevronRight size={20} />
                )}
              </button>
            </div>
          </form>

          {prSearchResult !== null && (
            <div className="bg-white/[0.02] border border-[#ff6600]/20 rounded-2xl p-6 text-center">
              <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">
                RECORD PESSOAL (MAX CARGA)
              </p>
              <p className="text-5xl font-black italic text-[#ff6600] tracking-tighter">
                {prSearchResult}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};