// src/components/Modals/EditPRPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Trophy, Weight } from 'lucide-react';
import { InputField } from '../'; 

export const EditPRPage = ({ onClose, onUpdate, planId, exerciseName, currentWeight }) => {
  const [weight, setWeight] = useState(currentWeight || '');
  const [loading, setLoading] = useState(false);
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
    <div ref={containerRef} className="bg-black text-white fixed inset-0 z-[9999] overflow-hidden flex flex-col">
      {/* Header Compacto */}
      <div className="px-4 pt-6 pb-2">
        <button onClick={onClose} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={24} />
          <span className="text-sm font-bold uppercase tracking-wider">Voltar</span>
        </button>
      </div>

      <div className="flex-1 px-6 flex flex-col items-center pt-2">
        <div className="max-w-md w-full">
          
          {/* Topo: Troféu e Título com mais destaque */}
          <div className="text-center mb-10">
            <div className="relative inline-block mb-4">
               <Trophy size={60} className="text-[#ff6600] opacity-90 mx-auto" />
               <div className="absolute inset-0 blur-3xl bg-[#ff6600]/20 -z-10"></div>
            </div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-none mb-2">
              RECORD <span className="text-[#ff6600]">PESSOAL</span>
            </h1>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em]">
              {exerciseName}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Campo de Input harmonizado com o resto do App */}
            <div className="space-y-3">
              <InputField
                label="Nova Carga Máxima (KG)"
                type="number"
                icon={Weight}
                autoFocus
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="0"
                // Removido o estilo "gigante" para caber melhor e ficar harmônico
                className="text-center font-black text-2xl"
                style={{ color: '#ff6600' }}
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
        </div>
      </div>
    </div>
  );
};