// src/components/Modals/ResetHistoryPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

export const ResetHistoryPage = ({ onClose, onConfirm }) => {
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

  const handleReset = async () => {
    if (confirmText !== 'CONFIRM') return;
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="bg-black text-white fixed inset-0 z-[9999] overflow-hidden">
      <div className="h-full overflow-y-auto px-6 pt-12">
        <div className="max-w-md mx-auto text-center">
          <button onClick={onClose} className="flex items-center gap-2 text-gray-500 mb-20">
            <ArrowLeft size={24} />
            <span className="text-sm font-bold uppercase">Cancelar</span>
          </button>

          <AlertTriangle size={64} className="text-red-600 mx-auto mb-6 animate-pulse" />
          
          <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-4">
            ZERAR <span className="text-red-600">HISTÓRICO</span>
          </h1>
          
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-12">
            ESTA AÇÃO É IRREVERSÍVEL. TODOS OS SEUS LOGS E EVOLUÇÃO DE CARGA SERÃO APAGADOS.
          </p>

          <div className="space-y-6">
            <div>
              <p className="text-[9px] font-black uppercase text-gray-600 mb-2 tracking-widest">
                DIGITE <span className="text-red-600">"CONFIRM"</span> PARA DELETAR
              </p>
              <input
                autoFocus
                className="w-full bg-red-600/5 border border-red-600/20 rounded-2xl p-5 text-white text-center font-black tracking-[0.5em] outline-none focus:border-red-600 transition-all"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                placeholder="......"
              />
            </div>

            <button
              onClick={handleReset}
              disabled={confirmText !== 'CONFIRM' || loading}
              className="w-full py-5 rounded-2xl font-black bg-red-600 text-white uppercase text-xs tracking-widest shadow-[0_0_30px_rgba(220,38,38,0.2)] disabled:opacity-20 active:scale-95 transition-all"
            >
              {loading ? 'APAGANDO...' : 'LIMPAR TUDO AGORA'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};