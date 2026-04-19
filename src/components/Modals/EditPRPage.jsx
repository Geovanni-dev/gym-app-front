// src/components/Modals/EditPRPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Trophy } from 'lucide-react';

export const EditPRPage = ({ onClose, onUpdate, planId, exerciseName, currentWeight }) => {
  const [weight, setWeight] = useState(currentWeight || '');
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    
    if (containerRef.current) {
      containerRef.current.style.height = `${window.innerHeight}px`;
    }
    
    const preventTouchMove = (e) => e.preventDefault();
    document.addEventListener('touchmove', preventTouchMove, { passive: false });
    
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo(0, scrollY);
      document.removeEventListener('touchmove', preventTouchMove);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Envia apenas o peso e isGenerated = true
      await onUpdate(planId, null, exerciseName, { weight: Number(weight) }, true);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="bg-black text-white fixed inset-0 z-[9999] overflow-hidden">
      <div className="h-full overflow-y-auto px-4 pt-8">
        <div className="max-w-md mx-auto">
          <button onClick={onClose} className="flex items-center gap-2 text-gray-400 mb-12">
            <ArrowLeft size={24} />
            <span className="text-sm font-bold uppercase tracking-wider">Voltar</span>
          </button>

          <div className="text-center mb-12">
            <Trophy size={48} className="text-[#ff6600] mx-auto mb-4 opacity-50" />
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">
              EDITAR <span className="text-[#ff6600]">PR</span>
            </h1>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mt-2">
              {exerciseName}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Carga Atual</span>
              <input
                autoFocus
                type="number"
                className="w-full bg-transparent text-6xl font-black text-[#ff6600] text-center outline-none"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="0"
                style={{ fontSize: '64px' }}
              />
              <span className="text-xl font-black text-gray-700 italic">KG</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 rounded-2xl font-black bg-[#ff6600] text-black uppercase text-xs tracking-widest shadow-[0_0_20px_rgba(255,102,0,0.4)] active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? 'SALVANDO...' : 'ATUALIZAR RECORDE'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};