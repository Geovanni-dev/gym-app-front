
import { useEffect } from 'react';

export const useScrollToInput = () => {
  useEffect(() => {
    const handleFocus = (e) => {
      // Verifica se o elemento focado é um input ou textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        /* SÓ executa o scroll se o input n estiver dentro de um modal com overflow-y-auto
        isso evita conflito com os modais que já tem scroll próprio*/
        const isInsideModal = e.target.closest('.overflow-y-auto, .overflow-y-scroll');
        
        if (!isInsideModal) {
          setTimeout(() => {
            e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 300);
        }
      }
    };

    document.addEventListener('focusin', handleFocus);
    
    return () => document.removeEventListener('focusin', handleFocus);
  }, []);
};