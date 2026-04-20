import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { MainContent } from './components/MainContent';
import { PRSearchPage } from './components/Modals/PRSearchPage';
import { ImportPlanPage } from './components/Modals/ImportPlanPage';
import { AddExercisePage } from './components/Modals/AddExercisePage';
import { EditExercisePage } from './components/Modals/EditExercisePage';
import { EditPRPage } from './components/Modals/EditPRPage';
import { ResetHistoryPage } from './components/Modals/ResetHistoryPage';
import { useScrollToInput } from './hooks/useScrollToInput';

function App() {
  useScrollToInput();
  
  // ============================================
  // OVERLAYS - TODAS AS 6 SÃO OVERLAYS
  // ============================================
  const [showPRSearchOverlay, setShowPRSearchOverlay] = useState(false);
  const [showImportPlanOverlay, setShowImportPlanOverlay] = useState(false);
  const [showAddExerciseOverlay, setShowAddExerciseOverlay] = useState(false);
  const [showEditExerciseOverlay, setShowEditExerciseOverlay] = useState(false);
  const [showEditPROverlay, setShowEditPROverlay] = useState(false);
  const [showResetHistoryOverlay, setShowResetHistoryOverlay] = useState(false);
  
  // Dados PRSearch
  const [onPRSearchCloseCallback, setOnPRSearchCloseCallback] = useState(null);
  
  // Dados ImportPlan
  const [onImportPlanCloseCallback, setOnImportPlanCloseCallback] = useState(null);
  
  // Dados AddExercise
  const [addExercisePlanId, setAddExercisePlanId] = useState(null);
  const [addExerciseDayName, setAddExerciseDayName] = useState('');
  const [onAddExerciseCallback, setOnAddExerciseCallback] = useState(null);
  
  // Dados EditExercise
  const [editExerciseData, setEditExerciseData] = useState(null);
  const [editExercisePlanId, setEditExercisePlanId] = useState(null);
  const [editExerciseDayName, setEditExerciseDayName] = useState('');
  const [editExerciseName, setEditExerciseName] = useState('');
  const [editExerciseIsGenerated, setEditExerciseIsGenerated] = useState(false);
  const [onUpdateExerciseCallback, setOnUpdateExerciseCallback] = useState(null);

  // Dados EditPR
  const [editPRPlanId, setEditPRPlanId] = useState(null);
  const [editPRExerciseName, setEditPRExerciseName] = useState('');
  const [editPRWeight, setEditPRWeight] = useState(0);
  const [onUpdatePRCallback, setOnUpdatePRCallback] = useState(null);

  // Dados ResetHistory
  const [onConfirmResetCallback, setOnConfirmResetCallback] = useState(null);

  // ============================================
  // APP NORMAL - MainContent SEMPRE montado
  // ============================================
  return (
    <AuthProvider>
      <style>{`
        html, body { 
          height: 100%; 
          overscroll-behavior-y: none; 
          background-color: #000; 
        }
        input, select, textarea { 
          font-size: 16px !important; 
        }
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none !important;
          margin: 0 !important;
        }
        input[type=number] {
          -moz-appearance: textfield !important;
          appearance: textfield !important;
        }
        input {
          overflow: hidden !important;
          outline: none !important;
        }
      `}</style>

      <MainContent 
        onOpenPRPage={() => setShowPRSearchOverlay(true)}
        onOpenImportPage={() => setShowImportPlanOverlay(true)}
        
        onOpenAddExercisePage={(planId, dayName, onAdd) => {
          setAddExercisePlanId(planId);
          setAddExerciseDayName(dayName);
          setOnAddExerciseCallback(() => onAdd);
          setShowAddExerciseOverlay(true);
        }}
        
        onOpenEditExercisePage={(planId, dayName, exerciseName, exerciseData, isGenerated, onUpdate) => {
          setEditExercisePlanId(planId);
          setEditExerciseDayName(dayName);
          setEditExerciseName(exerciseName);
          setEditExerciseData(exerciseData);
          setEditExerciseIsGenerated(isGenerated);
          setOnUpdateExerciseCallback(() => onUpdate);
          setShowEditExerciseOverlay(true);
        }}
        
        onOpenEditPRPage={(planId, exerciseName, exerciseData, onUpdate) => {
          setEditPRPlanId(planId);
          setEditPRExerciseName(exerciseName);
          setEditPRWeight(exerciseData.weight);
          setOnUpdatePRCallback(() => onUpdate);
          setShowEditPROverlay(true);
        }}
        
        onOpenResetHistoryPage={(onConfirm) => {
          setOnConfirmResetCallback(() => onConfirm);
          setShowResetHistoryOverlay(true);
        }}
      />

      {/* ============================================
          OVERLAYS - TODAS COM MESMA ESTRUTURA
          ============================================ */}
      
      {showPRSearchOverlay && (
        <PRSearchPage 
          onClose={() => setShowPRSearchOverlay(false)} 
        />
      )}

      {showImportPlanOverlay && (
        <ImportPlanPage 
          onClose={() => setShowImportPlanOverlay(false)} 
        />
      )}

      {showAddExerciseOverlay && (
        <AddExercisePage 
          onClose={() => setShowAddExerciseOverlay(false)} 
          onAdd={onAddExerciseCallback} 
          planId={addExercisePlanId} 
          dayName={addExerciseDayName} 
        />
      )}

      {showEditExerciseOverlay && (
        <EditExercisePage 
          onClose={() => setShowEditExerciseOverlay(false)} 
          onUpdate={onUpdateExerciseCallback} 
          exerciseData={editExerciseData} 
          planId={editExercisePlanId} 
          dayName={editExerciseDayName} 
          exerciseName={editExerciseName} 
          isGenerated={editExerciseIsGenerated} 
        />
      )}

      {showEditPROverlay && (
        <EditPRPage 
          onClose={() => setShowEditPROverlay(false)} 
          onUpdate={onUpdatePRCallback} 
          planId={editPRPlanId} 
          exerciseName={editPRExerciseName} 
          currentWeight={editPRWeight} 
        />
      )}

      {showResetHistoryOverlay && (
        <ResetHistoryPage 
          onClose={() => setShowResetHistoryOverlay(false)} 
          onReset={async () => {
            if (onConfirmResetCallback) {
              await onConfirmResetCallback();
            }
          }} 
        />
      )}
    </AuthProvider>
  );
}

export default App;