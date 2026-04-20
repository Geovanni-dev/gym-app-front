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
          OVERLAYS - TODAS FLUTUAM SOBRE O MAINCONTENT
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