import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { MainContent } from './components/MainContent';
import { PRSearchPage } from './components/Modals/PRSearchPage';
import { ImportPlanPage } from './components/Modals/ImportPlanPage';
import { AddExercisePage } from './components/Modals/AddExercisePage';
import { useScrollToInput } from './hooks/useScrollToInput';

function App() {
  useScrollToInput();
  
  const [isLoading, setIsLoading] = useState(true);
  const [initialView, setInitialView] = useState('landing');
  
  // Estados que controlam as páginas
  const [showPRPage, setShowPRPage] = useState(false);
  const [showImportPage, setShowImportPage] = useState(false);
  const [showAddExercisePage, setShowAddExercisePage] = useState(false);
  const [addExercisePlanId, setAddExercisePlanId] = useState(null);
  const [addExerciseDayName, setAddExerciseDayName] = useState('');
  const [onAddExerciseCallback, setOnAddExerciseCallback] = useState(null);
  
  useEffect(() => {
    // Verifica se o usuário está logado no localStorage
    const token = localStorage.getItem('@superfrango:token');
    const savedView = localStorage.getItem('@superfrango:view');
    
    if (token && savedView === 'dashboard') {
      setInitialView('dashboard');
    } else {
      setInitialView('landing');
    }
    
    setIsLoading(false);
  }, []);
  
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-white text-2xl font-black">CARREGANDO...</div>
      </div>
    );
  }
  
  // Se a página PR estiver aberta, mostra SOMENTE ela
  if (showPRPage) {
    return (
      <AuthProvider initialView={initialView}>
        <PRSearchPage onClose={() => setShowPRPage(false)} />
      </AuthProvider>
    );
  }
  
  // Se a página de importar estiver aberta, mostra SOMENTE ela
  if (showImportPage) {
    return (
      <AuthProvider initialView={initialView}>
        <ImportPlanPage onClose={() => setShowImportPage(false)} />
      </AuthProvider>
    );
  }
  
  // Se a página de adicionar exercício estiver aberta, mostra SOMENTE ela
  if (showAddExercisePage) {
    return (
      <AuthProvider initialView={initialView}>
        <AddExercisePage 
          onClose={() => setShowAddExercisePage(false)}
          onAdd={onAddExerciseCallback}
          planId={addExercisePlanId}
          dayName={addExerciseDayName}
        />
      </AuthProvider>
    );
  }
  
  // Senão, mostra o app normal
  return (
    <AuthProvider initialView={initialView}>
      <style>{`...`}</style>
      <MainContent 
        initialView={initialView}
        onOpenPRPage={() => setShowPRPage(true)}
        onOpenImportPage={() => setShowImportPage(true)}
        onOpenAddExercisePage={(planId, dayName, onAdd) => {
          setAddExercisePlanId(planId);
          setAddExerciseDayName(dayName);
          setOnAddExerciseCallback(() => onAdd);
          setShowAddExercisePage(true);
        }}
      />
    </AuthProvider>
  );
}

export default App;