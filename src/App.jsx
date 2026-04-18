import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { MainContent } from './components/MainContent';
import { PRSearchPage } from './components/Modals/PRSearchPage';
import { ImportPlanPage } from './components/Modals/ImportPlanPage';
import { AddExercisePage } from './components/Modals/AddExercisePage';
import { useScrollToInput } from './hooks/useScrollToInput';

function App() {
  useScrollToInput();
  
  // Estados que controlam as páginas
  const [showPRPage, setShowPRPage] = useState(false);
  const [showImportPage, setShowImportPage] = useState(false);
  const [showAddExercisePage, setShowAddExercisePage] = useState(false);
  const [addExerciseDayName, setAddExerciseDayName] = useState('');
  const [onAddExerciseCallback, setOnAddExerciseCallback] = useState(null);
  
  // Se a página PR estiver aberta, mostra SOMENTE ela
  if (showPRPage) {
    return (
      <AuthProvider>
        <PRSearchPage onClose={() => setShowPRPage(false)} />
      </AuthProvider>
    );
  }
  
  // Se a página de importar estiver aberta, mostra SOMENTE ela
  if (showImportPage) {
    return (
      <AuthProvider>
        <ImportPlanPage onClose={() => setShowImportPage(false)} />
      </AuthProvider>
    );
  }
  
  // Se a página de adicionar exercício estiver aberta, mostra SOMENTE ela
if (showAddExercisePage) {
  return (
    <AuthProvider>
      <AddExercisePage 
        onClose={() => setShowAddExercisePage(false)}
        onAdd={onAddExerciseCallback}
        dayName={addExerciseDayName}
      />
    </AuthProvider>
  );
}
  // Senão, mostra o app normal
  return (

    
    <AuthProvider>
      <style>{`
        /* Reset básico para mobile */
        html, body {
          height: 100%;
          overscroll-behavior-y: none; 
          background-color: #000;
        }

        input, select, textarea {
          font-size: 16px !important;
        }

        .app-container {
          display: flex;
          flex-direction: column;
          height: 100dvh;
          width: 100%;
          position: relative;
        }

        .scroll-content {
          flex: 1;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          padding-bottom: 2rem;
        }

        body.keyboard-open .scroll-content {
          padding-bottom: 50vh;
        }

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        input[type=number] {
          -moz-appearance: textfield;
          appearance: textfield;
        }

        @media (max-height: 700px) {
          .fixed.inset-0.z-200 .my-8 {
            margin-top: 1rem !important;
            margin-bottom: 1rem !important;
          }
          .fixed.inset-0.z-200 .p-6 {
            padding: 1rem !important;
          }
          .fixed.inset-0.z-200 .space-y-6 {
            gap: 0.75rem !important;
          }
          .fixed.inset-0.z-200 .py-3.5 {
            padding-top: 0.5rem !important;
            padding-bottom: 0.5rem !important;
          }
          .fixed.inset-0.z-200 .w-12.h-12 {
            width: 2.5rem !important;
            height: 2.5rem !important;
          }
        }

        @media (max-height: 600px) {
          .fixed.inset-0.z-200 .my-8 {
            margin-top: 0.5rem !important;
            margin-bottom: 0.5rem !important;
          }
          .fixed.inset-0.z-200 .p-6 {
            padding: 0.75rem !important;
          }
          .fixed.inset-0.z-200 .gap-3 {
            gap: 0.5rem !important;
          }
        }

        body.modal-open {
          overflow: hidden;
        }

        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active {
          -webkit-transition: background-color 9999s ease-out;
          transition: background-color 9999s ease-out;
          -webkit-text-fill-color: white !important;
        }

        input:-webkit-autofill {
          caret-color: white;
        }
      `}</style>
     <MainContent 
  onOpenPRPage={() => setShowPRPage(true)}
  onOpenImportPage={() => setShowImportPage(true)}
  onOpenAddExercisePage={(dayName, onAdd) => {
    setAddExerciseDayName(dayName);
    setOnAddExerciseCallback(() => onAdd);
    setShowAddExercisePage(true);
  }}
/>
    </AuthProvider>
  );
}

export default App;