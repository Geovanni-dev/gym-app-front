import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ClipboardList, Hash, Activity, Weight, Dumbbell } from 'lucide-react';
import { InputField } from '../';

export const AddExercisePage = ({ onClose, onAdd, planId, dayName }) => {
  const [newExData, setNewExData] = useState({ name: '', sets: '', reps: '', weight: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isInfoActive, setIsInfoActive] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const containerRef = useRef(null);
  const nameInputRef = useRef(null);

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
    
    /*const preventTouchMove = (e) => { e.preventDefault(); };
    document.addEventListener('touchmove', preventTouchMove, { passive: false });*/
    
    if (containerRef.current) {
      containerRef.current.style.height = `${window.innerHeight}px`;
    }
    
    // Posiciona o cursor no final do texto se houver valor
    if (nameInputRef.current && newExData.name) {
      const value = nameInputRef.current.value;
      nameInputRef.current.value = '';
      nameInputRef.current.value = value;
    }
    
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo(0, scrollY);
      //document.removeEventListener('touchmove', preventTouchMove);
      
      if (navbar) {
        navbar.style.display = '';
      }
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
      onClose();
    } catch (error) {
      setError('Erro ao adicionar exercício');
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
          
          <div className="mb-8 pt-12"> {/* pt-12 para compensar a saída do botão de voltar do topo */}
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
                <InputField
                  ref={nameInputRef}
                  label="Nome do Exercício"
                  icon={ClipboardList}
                  placeholder="Ex: Supino Reto"
                  value={newExData.name}
                  onChange={(e) => setNewExData({ ...newExData, name: e.target.value })}
                  style={{ fontSize: '16px' }}
                />
                
                <div className="grid grid-cols-3 gap-3">
                  <InputField
                    label="Séries"
                    type="number"
                    icon={Hash}
                    placeholder="4"
                    value={newExData.sets}
                    onChange={(e) => setNewExData({ ...newExData, sets: e.target.value })}
                    style={{ fontSize: '16px' }}
                  />

                  <InputField
                    label="Reps"
                    icon={Activity}
                    placeholder="12"
                    value={newExData.reps}
                    onChange={(e) => setNewExData({ ...newExData, reps: e.target.value })}
                    style={{ fontSize: '16px' }}
                  />

                  <InputField
                    label="Carga (KG)"
                    type="number"
                    icon={Weight}
                    placeholder="KG"
                    value={newExData.weight}
                    onChange={(e) => setNewExData({ ...newExData, weight: e.target.value })}
                    style={{ fontSize: '16px', color: '#ff6600', fontWeight: '900' }}
                  />
                </div>
              </div>
              
              {error && <p className="text-red-500 text-sm text-center font-bold uppercase">{error}</p>}
              
              <button type="submit" disabled={loading} className="w-full py-4 rounded-xl font-black italic bg-[#ff6600] text-black uppercase text-[10px] tracking-widest shadow-[0_0_20px_rgba(255,102,0,0.9)] active:scale-95 transition-all disabled:opacity-50">
                {loading ? 'ADICIONANDO...' : 'ADICIONAR EXERCÍCIO'}
              </button>
            </form>
            
            {/* VOLTAR como texto simples abaixo do botão */}
            <div className="text-center">
              <span 
                onClick={onClose}
                className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em] cursor-pointer active:text-white transition-colors"
              >
                VOLTAR
              </span>
            </div>
          </div>

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
                    <span className="text-[#ff6600]">Todo grande resultado começa com um único movimento</span>. 
                    Adicione seu próximo desafio.
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