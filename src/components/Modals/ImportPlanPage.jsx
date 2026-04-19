// src/components/Modals/ImportPlanPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Download } from 'lucide-react';
import api from '../../services/api';
import { InputField } from '../'; 

export const ImportPlanPage = ({ onClose, onSuccess }) => {
  const [importCode, setImportCode] = useState('');
  const [loadingImport, setLoadingImport] = useState(false);
  const [error, setError] = useState('');
  const containerRef = useRef(null);

  // Função para formatar o código no padrão XXXX-XXXX-XXXX automaticamente
  const formatShareCode = (value) => {
    // Remove tudo que não é letra ou número e deixa em maiúsculo
    const cleanValue = value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    
    // Aplica a máscara de hifens
    let formatted = cleanValue;
    if (cleanValue.length > 4 && cleanValue.length <= 8) {
      formatted = `${cleanValue.slice(0, 4)}-${cleanValue.slice(4)}`;
    } else if (cleanValue.length > 8) {
      formatted = `${cleanValue.slice(0, 4)}-${cleanValue.slice(4, 8)}-${cleanValue.slice(8, 12)}`;
    }
    
    return formatted.slice(0, 14); // Limite máximo do código formatado
  };

  useEffect(() => {
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    if (containerRef.current) containerRef.current.style.height = `${window.innerHeight}px`;
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo(0, scrollY);
    };
  }, []);

  const handleImport = async (e) => {
    if (e) e.preventDefault();
    if (importCode.length < 14) {
      setError('O código deve ter 12 caracteres (XXXX-XXXX-XXXX)');
      return;
    }
    
    setLoadingImport(true);
    setError('');
    
    try {
      // Agora o importCode já vai com os hifens, passando suave pelo seu Zod
      await api.post(`/workout-plans/copy/${importCode}`);
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      // Se o erro vier do Zod, pegamos os detalhes
      const message = error.response?.data?.detalhes?.shareCode?.[0] || 
                      error.response?.data?.message || 
                      'Código inválido';
      setError(message);
    } finally {
      setLoadingImport(false);
    }
  };

  return (
    <div ref={containerRef} className="bg-black text-white fixed inset-0 z-[9999] overflow-hidden flex flex-col">
      <div className="px-4 pt-6 pb-2">
        <button onClick={onClose} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={24} /><span className="text-sm font-bold uppercase tracking-wider">Voltar</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-20">
        <div className="max-w-md mx-auto">
          <div className="mb-10 text-center">
            <div className="relative inline-block mb-4">
               <Download size={48} className="text-[#ff6600] opacity-80" />
               <div className="absolute inset-0 blur-2xl bg-[#ff6600]/20 -z-10"></div>
            </div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">
              IMPORTAR <span className="text-[#ff6600]">PLANO</span>
            </h1>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mt-4">DIGITE O CÓDIGO DE COMPARTILHAMENTO</p>
          </div>

          <form onSubmit={handleImport} className="space-y-6">
            <InputField
              label="ID do Plano (12 dígitos)"
              autoFocus
              placeholder="XXXX-XXXX-XXXX"
              value={importCode}
              onChange={(e) => setImportCode(formatShareCode(e.target.value))}
              className="text-center font-mono font-bold tracking-[0.2em] text-xl"
            />
            
            {error && (
              <p className="text-red-500 text-[10px] font-black uppercase text-center bg-red-500/10 py-3 rounded-xl border border-red-500/20">
                {error}
              </p>
            )}
            
            <button
              type="submit"
              disabled={loadingImport || importCode.length < 14}
              className="w-full py-5 rounded-2xl font-black italic bg-[#ff6600] text-black uppercase text-[11px] tracking-widest shadow-[0_0_20px_rgba(255,102,0,0.5)] active:scale-95 disabled:opacity-30 transition-all"
            >
              {loadingImport ? 'SINCRONIZANDO...' : 'CONFIRMAR IMPORTAÇÃO'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};