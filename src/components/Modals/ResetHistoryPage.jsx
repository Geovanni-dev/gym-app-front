// src/components/Modals/ResetHistoryPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Trash2, AlertTriangle } from 'lucide-react';
import { InputField } from '../'; 

export const ResetHistoryPage = ({ onClose, onReset }) => {
  const [confirmText, setConfirmText] = useState('');
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

  const handleReset = async (e) => {
    e.preventDefault();
    if (confirmText.toUpperCase() !== 'LIMPAR') return;

    setLoading(true);
    try {
      await onReset();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="bg-black text-white fixed inset-0 z-[9999] overflow-hidden flex flex-col">
      <div className="px-4 pt-6 pb-2">
        <button onClick={onClose} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={24} />
          <span className="text-sm font-bold uppercase tracking-wider">Voltar</span>
        </button>
      </div>

      {/* Ajustado pt-10 para pt-4 e mb-10 para mb-6 para subir o corpo */}
      <div className="flex-1 px-6 flex flex-col items-center pt-4">
        <div className="max-w-md w-full">
          
          <div className="text-center mb-6">
            <div className="inline-block p-3 rounded-full bg-red-500/10 mb-3">
              <AlertTriangle size={40} className="text-red-500" />
            </div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-none mb-2">
              APAGAR <span className="text-red-500">HISTÓRICO</span>
            </h1>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
              Esta ação não pode ser desfeita
            </p>
          </div>

          <form onSubmit={handleReset} className="space-y-6">
            <div className="space-y-4">
              <p className="text-center text-xs text-gray-400">
                Digite <span className="text-white font-bold">LIMPAR</span> abaixo para confirmar a exclusão de todos os seus treinos.
              </p>
              
              <InputField
                label="Confirmação"
                icon={Trash2}
                autoFocus
                placeholder="Digite LIMPAR"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="text-center font-black uppercase"
                style={{ color: confirmText.toUpperCase() === 'LIMPAR' ? '#ef4444' : '#ffffff' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading || confirmText.toUpperCase() !== 'LIMPAR'}
              className="w-full py-5 rounded-2xl font-black italic bg-red-600 text-white uppercase text-xs tracking-[0.2em] shadow-[0_0_30px_rgba(220,38,38,0.3)] active:scale-95 transition-all disabled:opacity-20 disabled:grayscale"
            >
              {loading ? 'APAGANDO...' : 'EXCLUIR TUDO DEFINITIVAMENTE'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};