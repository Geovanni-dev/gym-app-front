import React, { useState, useEffect, useRef } from 'react';
// Adicionei os ícones aqui para não dar erro de "not defined"
import { ArrowLeft, ClipboardList, Hash, Activity, Weight } from 'lucide-react';
import { InputField } from '../'; // Subindo um nível para usar o index.jsx

export const AddExercisePage = ({ onClose, onAdd, planId, dayName }) => {
  const [newExData, setNewExData] = useState({ name: '', sets: '', reps: '', weight: '' });
  const [error, setError] = useState('');
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(false);

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
    
    const preventTouchMove = (e) => { e.preventDefault(); };
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
    if (!newExData.name.trim()) { setError('Digite o nome do exercício'); return; }
    if (!newExData.sets) { setError('Digite o número de séries'); return; }
    
    setLoading(true);
    try {
      await onAdd(planId, dayName, {
        ...newExData,
        sets: Number(newExData.sets),
        weight: Number(newExData.weight) || 0,
      });
      setTimeout(() => { onClose(); }, 500);
    } catch (error) {
      setError('Erro ao adicionar exercício');
      setLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="bg-black text-white" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', overflow: 'hidden', zIndex: 9999 }}>
      <div className="h-full overflow-hidden">
        <div className="h-full overflow-y-auto px-4 pt-8 pb-20">
          <div className="max-w-7xl mx-auto">
            
            <button onClick={onClose} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8">
              <ArrowLeft size={24} />
              <span className="text-sm font-bold uppercase tracking-wider">Voltar</span>
            </button>

            <div className="mb-8">
              <h1 className="text-5xl sm:text-7xl font-black italic uppercase tracking-tighter text-white leading-none">
                NOVO <span className="text-[#ff6600]">EXERCÍCIO</span>
              </h1>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mt-4">
                ADICIONANDO AO PLANO DE {dayName?.toUpperCase()}
              </p>
            </div>

            <div className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                  
                  {/* NOME DO EXERCÍCIO */}
                  <InputField
                    label="Nome do Exercício"
                    icon={ClipboardList}
                    autoFocus
                    placeholder="Ex: Supino Reto"
                    value={newExData.name}
                    onChange={(e) => setNewExData({ ...newExData, name: e.target.value })}
                  />
                  
                  <div className="grid grid-cols-3 gap-3">
                    {/* SÉRIES */}
                    <InputField
                      label="Séries"
                      type="number"
                      icon={Hash}
                      placeholder="4"
                      value={newExData.sets}
                      onChange={(e) => setNewExData({ ...newExData, sets: e.target.value })}
                    />

                    {/* REPS */}
                    <InputField
                      label="Reps"
                      icon={Activity}
                      placeholder="12"
                      value={newExData.reps}
                      onChange={(e) => setNewExData({ ...newExData, reps: e.target.value })}
                    />

                    {/* CARGA */}
                    <InputField
                      label="Carga (KG)"
                      type="number"
                      icon={Weight}
                      placeholder="KG"
                      value={newExData.weight}
                      onChange={(e) => setNewExData({ ...newExData, weight: e.target.value })}
                      style={{ color: '#ff6600', fontWeight: '900' }}
                    />
                  </div>
                </div>
                
                {error && <p className="text-red-500 text-sm text-center font-bold uppercase">{error}</p>}
                
                <button type="submit" disabled={loading} className="w-full py-4 rounded-xl font-black italic bg-[#ff6600] text-black uppercase text-[10px] tracking-widest shadow-[0_0_20px_rgba(255,102,0,0.9)] active:scale-95 transition-all disabled:opacity-50">
                  {loading ? 'ADICIONANDO...' : 'ADICIONAR EXERCÍCIO'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};