// src/components/Modals/EditExercisePage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';

export const EditExercisePage = ({ onClose, onUpdate, exerciseData, planId, dayName, exerciseName, isGenerated }) => {
  const [formData, setFormData] = useState({
    name: exerciseData?.name || '',
    sets: exerciseData?.sets || '',
    reps: exerciseData?.reps || '',
    weight: exerciseData?.weight || 0,
  });
  const [error, setError] = useState('');
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
    
    const preventTouchMove = (e) => {
      e.preventDefault();
    };
    
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
    
    if (!formData.name.trim()) {
      setError('Digite o nome do exercício');
      return;
    }
    if (!formData.sets) {
      setError('Digite o número de séries');
      return;
    }
    
    setLoading(true);
    
    try {
      await onUpdate(planId, dayName, exerciseName, {
        name: formData.name,
        sets: Number(formData.sets),
        reps: formData.reps,
        weight: Number(formData.weight) || 0,
      }, isGenerated);
      onClose();
    } catch (error) {
      setError('Erro ao editar exercício');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="bg-black text-white"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: 9999,
      }}
    >
      <div className="h-full overflow-hidden">
        <div className="h-full overflow-y-auto px-4 pt-8 pb-20">
          <div className="max-w-7xl mx-auto">
            
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
            >
              <ArrowLeft size={24} />
              <span className="text-sm font-bold uppercase tracking-wider">Voltar</span>
            </button>

            <div className="mb-8">
              <h1 className="text-5xl sm:text-7xl font-black italic uppercase tracking-tighter text-white leading-none">
                EDITAR <span className="text-[#ff6600]">EXERCÍCIO</span>
              </h1>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mt-4">
                MODIFIQUE OS PARÂMETROS DO EXERCÍCIO
              </p>
            </div>

            <div className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                      Nome do Exercício
                    </label>
                    <input
                      autoFocus
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-base outline-none focus:border-[#ff6600] mt-1"
                      style={{ fontSize: '16px' }}
                      placeholder="Ex: Supino Reto"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                        Séries
                      </label>
                      <input
                        type="number"
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-center text-base outline-none focus:border-[#ff6600] mt-1"
                        placeholder="4"
                        value={formData.sets}
                        onChange={(e) => setFormData({ ...formData, sets: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                        Reps
                      </label>
                      <input
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-center text-base outline-none focus:border-[#ff6600] mt-1"
                        placeholder="12"
                        value={formData.reps}
                        onChange={(e) => setFormData({ ...formData, reps: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                        Carga (KG)
                      </label>
                      <input
                        type="number"
                        className="w-full bg-white/5 border border-[#ff6600]/20 rounded-xl p-4 text-[#ff6600] font-black text-center text-base outline-none focus:border-[#ff6600] mt-1"
                        placeholder="KG"
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                
                {error && (
                  <p className="text-red-500 text-sm text-center">{error}</p>
                )}
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl font-black italic bg-[#ff6600] text-black uppercase text-[10px] tracking-widest shadow-[0_0_20px_rgba(255,102,0,0.9)] active:scale-95 transition-all disabled:opacity-50"
                >
                  {loading ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'}
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};