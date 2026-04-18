// src/components/Modals/ImportPlanPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import api from '../../services/api';

export const ImportPlanPage = ({ onClose, onSuccess }) => {
  const [importCode, setImportCode] = useState('');
  const [loadingImport, setLoadingImport] = useState(false);
  const [error, setError] = useState('');
  const containerRef = useRef(null);

  // Solução definitiva para iOS (mesma do PRSearchPage)
  useEffect(() => {
    const scrollY = window.scrollY;
    
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    document.body.style.webkitOverflowScrolling = 'none';
    
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
      document.body.style.webkitOverflowScrolling = '';
      window.scrollTo(0, scrollY);
      document.removeEventListener('touchmove', preventTouchMove);
    };
  }, []);

  const handleImport = async () => {
    if (!importCode.trim()) {
      setError('Digite um código válido');
      return;
    }
    
    setLoadingImport(true);
    setError('');
    
    try {
      await api.post(`/workout-plans/copy/${importCode.trim()}`);
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || 'Código inválido');
    } finally {
      setLoadingImport(false);
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
        <div className="h-full overflow-y-auto px-4 pt-8 pb-20" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="max-w-7xl mx-auto">
            
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
                IMPORTAR <span className="text-[#ff6600]">PLANO</span>
              </h1>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mt-4">
                COLE O ID DO PLANO QUE DESEJA COPIAR
              </p>
            </div>

            {/* Conteúdo */}
            <div className="space-y-6">
              <div className="space-y-4">
                <input
                  autoFocus
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white uppercase font-mono text-base outline-none focus:border-[#ff6600] text-center"
                  style={{ fontSize: '16px' }}
                  placeholder="EX: XXXX-XXXX-XXXX"
                  value={importCode}
                  onChange={(e) => setImportCode(e.target.value.toUpperCase())}
                />
                
                {error && (
                  <p className="text-red-500 text-sm text-center">{error}</p>
                )}
                
                <button
                  onClick={handleImport}
                  disabled={loadingImport || !importCode.trim()}
                  className="w-full py-4 rounded-xl font-black italic bg-[#ff6600] text-black uppercase text-[10px] tracking-widest shadow-[0_0_20px_rgba(255,102,0,0.9)] active:scale-95 transition-all disabled:opacity-50"
                >
                  {loadingImport ? 'IMPORTANDO...' : 'IMPORTAR'}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};