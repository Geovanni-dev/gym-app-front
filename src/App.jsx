import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { MainContent } from './components/MainContent';
import { PRSearchPage } from './components/Modals/PRSearchPage';
import { ImportPlanPage } from './components/Modals/ImportPlanPage';
import { AddExercisePage } from './components/Modals/AddExercisePage';
import { EditExercisePage } from './components/Modals/EditExercisePage';
import { EditPRPage } from './components/Modals/EditPRPage'; // Importe a nova página
import { ResetHistoryPage } from './components/Modals/ResetHistoryPage'; // Importe a nova página
import { useScrollToInput } from './hooks/useScrollToInput';

function App() {
  useScrollToInput();
  
  // Estados existentes
  const [showPRPage, setShowPRPage] = useState(false);
  const [showImportPage, setShowImportPage] = useState(false);
  const [showAddExercisePage, setShowAddExercisePage] = useState(false);
  const [addExercisePlanId, setAddExercisePlanId] = useState(null);
  const [addExerciseDayName, setAddExerciseDayName] = useState('');
  const [onAddExerciseCallback, setOnAddExerciseCallback] = useState(null);
  
  const [showEditExercisePage, setShowEditExercisePage] = useState(false);
  const [editExerciseData, setEditExerciseData] = useState(null);
  const [editExercisePlanId, setEditExercisePlanId] = useState(null);
  const [editExerciseDayName, setEditExerciseDayName] = useState('');
  const [editExerciseName, setEditExerciseName] = useState('');
  const [editExerciseIsGenerated, setEditExerciseIsGenerated] = useState(false);
  const [onUpdateExerciseCallback, setOnUpdateExerciseCallback] = useState(null);

  // NOVOS ESTADOS para as páginas que faltavam
  const [showEditPRPage, setShowEditPRPage] = useState(false);
  const [editPRPlanId, setEditPRPlanId] = useState(null);
  const [editPRExerciseName, setEditPRExerciseName] = useState('');
  const [editPRWeight, setEditPRWeight] = useState(0);
  const [onUpdatePRCallback, setOnUpdatePRCallback] = useState(null);

  const [showResetHistoryPage, setShowResetHistoryPage] = useState(false);
  const [onConfirmResetCallback, setOnConfirmResetCallback] = useState(null);

  // --- RENDERIZAÇÃO CONDICIONAL (LOGICA DE "PÁGINAS") ---
  
  if (showPRPage) return (<AuthProvider><PRSearchPage onClose={() => setShowPRPage(false)} /></AuthProvider>);
  if (showImportPage) return (<AuthProvider><ImportPlanPage onClose={() => setShowImportPage(false)} /></AuthProvider>);
  
  if (showAddExercisePage) return (
    <AuthProvider>
      <AddExercisePage onClose={() => setShowAddExercisePage(false)} onAdd={onAddExerciseCallback} planId={addExercisePlanId} dayName={addExerciseDayName} />
    </AuthProvider>
  );

  if (showEditExercisePage) return (
    <AuthProvider>
      <EditExercisePage onClose={() => setShowEditExercisePage(false)} onUpdate={onUpdateExerciseCallback} exerciseData={editExerciseData} planId={editExercisePlanId} dayName={editExerciseDayName} exerciseName={editExerciseName} isGenerated={editExerciseIsGenerated} />
    </AuthProvider>
  );

  // Nova página de Edit PR
  if (showEditPRPage) return (
    <AuthProvider>
      <EditPRPage onClose={() => setShowEditPRPage(false)} onUpdate={onUpdatePRCallback} planId={editPRPlanId} exerciseName={editPRExerciseName} currentWeight={editPRWeight} />
    </AuthProvider>
  );


if (showResetHistoryPage) return (
  <AuthProvider>
    <ResetHistoryPage 
      onClose={() => setShowResetHistoryPage(false)} 
      onReset={async () => {
        // Chamamos a função que está guardada no estado
        if (onConfirmResetCallback) {
          await onConfirmResetCallback();
        }
      }} 
    />
  </AuthProvider>
);

  // APP NORMAL
  return (
    <AuthProvider>
   <style>{`
  /* Comportamento da Página */
  html, body { 
    height: 100%; 
    overscroll-behavior-y: none; 
    background-color: #000; 
  }

  /* Evita zoom no iOS */
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

  .no-scrollbar::-webkit-scrollbar { 
    display: none; 
  }

  /* ==========================================================
     BLOQUEIO GLOBAL DE SETINHAS (SPINNERS) EM INPUT NUMBER
     ========================================================== */
  
  /* Chrome, Safari, Edge e Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
    margin: 0 !important;
  }

  /* Firefox */
  input[type=number] {
    -moz-appearance: textfield !important;
    appearance: textfield !important;
  }
    /* REMOVE TUDO QUE É NATIVO DE INPUT NO MOBILE */
  input[type="number"] {
    -webkit-appearance: none !important; /* Mata o estilo do iOS */
    -moz-appearance: textfield !important; /* Mata o estilo do Firefox */
    appearance: none !important;
    margin: 0 !important;
  }

  /* Mata os botões internos de incremento */
  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
    display: none !important;
    margin: 0 !important;
  }

  /* Garante que o input não tenha scroll interno */
  input {
    overflow: hidden !important;
    outline: none !important;
  }
`}</style>

      <MainContent 
        onOpenPRPage={() => setShowPRPage(true)}
        onOpenImportPage={() => setShowImportPage(true)}
        onOpenAddExercisePage={(planId, dayName, onAdd) => {
          setAddExercisePlanId(planId);
          setAddExerciseDayName(dayName);
          setOnAddExerciseCallback(() => onAdd);
          setShowAddExercisePage(true);
        }}
        onOpenEditExercisePage={(planId, dayName, exerciseName, exerciseData, isGenerated, onUpdate) => {
          setEditExercisePlanId(planId);
          setEditExerciseDayName(dayName);
          setEditExerciseName(exerciseName);
          setEditExerciseData(exerciseData);
          setEditExerciseIsGenerated(isGenerated);
          setOnUpdateExerciseCallback(() => onUpdate);
          setShowEditExercisePage(true);
        }}
        // Conexão das novas páginas com o MainContent
        onOpenEditPRPage={(planId, exerciseName, exerciseData, onUpdate) => {
          setEditPRPlanId(planId);
          setEditPRExerciseName(exerciseName);
          setEditPRWeight(exerciseData.weight);
          setOnUpdatePRCallback(() => onUpdate);
          setShowEditPRPage(true);
        }}
       onOpenResetHistoryPage={(onConfirm) => {
  // O segredo é o "() => onConfirm" para o React não executar na hora
  setOnConfirmResetCallback(() => onConfirm); 
  setShowResetHistoryPage(true);
}}
      />
    </AuthProvider>
  );
}

export default App;