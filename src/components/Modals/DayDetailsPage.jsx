// src/components/Modals/DayDetailsPage.jsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  ArrowLeft,
  Trash2,
  Edit3,
  CheckSquare,
  Plus,
  CheckCircle2,
  Dumbbell,
  Zap,
  Flame,
  Trophy,
  BarChart3,
  MoreVertical,
  GripVertical,
  ArrowUpDown,
  Check,
  Loader2,
} from 'lucide-react';
import api from "../../services/api";

// ==================== EXERCICIO SORTABLE ITEM ====================
const ExercicioSortableItem = ({ id, children, isReorderMode }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative',
    zIndex: isDragging ? 999 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      {children({ isDragging, dragListeners: isReorderMode ? listeners : undefined })}
    </div>
  );
};

// ==================== COMPONENTE DO MENU DROPDOWN ====================
const ExerciseMenu = ({ onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="w-8 h-8 rounded-lg bg-white/5 text-gray-400 flex items-center justify-center hover:bg-white/10 hover:text-white transition-all"
      >
        <MoreVertical size={16} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-10 z-20 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden min-w-[130px] animate-in fade-in slide-in-from-top-2 duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              onEdit();
            }}
            className="w-full px-4 py-2.5 text-left text-sm font-medium text-gray-300 hover:bg-[#ff6600]/10 hover:text-[#ff6600] transition-all flex items-center gap-2"
          >
            <Edit3 size={14} />
            Editar
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              onDelete();
            }}
            className="w-full px-4 py-2.5 text-left text-sm font-medium text-gray-300 hover:bg-red-500/10 hover:text-red-500 transition-all flex items-center gap-2"
          >
            <Trash2 size={14} />
            Excluir
          </button>
        </div>
      )}
    </div>
  );
};

// ==================== MODAL DE CONFIRMAÇÃO SIM/NÃO ====================
const ConfirmModal = ({ confirmTarget, onConfirm, onCancel }) => {
  if (!confirmTarget) return null;
  const isDay = confirmTarget.type === 'day';

  return (
    <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 w-full max-w-[320px] relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 opacity-10">
          {isDay ? (
            <Zap size={120} strokeWidth={1} className="text-[#dc2626]" />
          ) : (
            <Flame size={120} strokeWidth={1} className="text-[#dc2626]" />
          )}
        </div>
        <div className="flex flex-col items-center text-center relative z-10">
          <div className="mb-5 h-14 w-14 rounded-2xl bg-red-900/20 border border-red-800/30 flex items-center justify-center text-red-600">
            <Trash2 size={24} strokeWidth={1.5} />
          </div>
          <h3 className="text-lg font-black text-white tracking-tighter uppercase">
            {isDay ? 'Excluir dia?' : 'Excluir exercício?'}
          </h3>
          <p className="mt-2 text-[12px] text-gray-500 leading-relaxed">
            {isDay
              ? 'Todos os exercícios deste dia serão removidos.'
              : 'Este exercício será removido permanentemente.'}
          </p>
        </div>
        <div className="mt-7 flex gap-3 relative z-10">
          <button
            onClick={onCancel}
            className="flex-1 h-12 rounded-2xl border border-white/10 bg-white/5 text-gray-400 text-[11px] font-black uppercase tracking-[0.15em] hover:bg-white/10 hover:text-white transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-12 rounded-2xl bg-[#dc2626] text-white text-[11px] font-black uppercase tracking-[0.15em] hover:bg-red-700 active:scale-95 transition-all"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== COMPONENTE PRINCIPAL ====================
export const DayDetailsPage = ({
  day,
  dayIndex,
  planId,
  planName,
  onBack,
  completedExercises,
  toggleCheck,
  onDeleteDay,
  onDeleteExercise,
  onOpenAddExercisePage,
  onOpenEditExercisePage,
  onOpenEditPRPage,
  onUpdateExercise,
  onAddExercise,
  onFinishWorkout,
  onClearDayExercises,
  onForceRefresh,
  updatePlanLocally,
  isGenerated = false,
}) => {
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [syncingPR, setSyncingPR] = useState(null);
  const [exercises, setExercises] = useState(day?.exercises || []);
  const [isReorderMode, setIsReorderMode] = useState(false);
  // [FIX] Trava o botão "Finalizar treino" após 1º clique
  const [isFinishing, setIsFinishing] = useState(false);
  // Hover do banner para a animação da barra inferior
  const [isBannerHovered, setIsBannerHovered] = useState(false);

  useEffect(() => {
    setExercises(day?.exercises || []);
  }, [day?.exercises]);

  useEffect(() => {
    return () => setIsReorderMode(false);
  }, []);

  const handleAddExercise = async (planId, dayName, onAddExerciseCallback) => {
    onOpenAddExercisePage(planId, dayName, async (planId, dayName, exerciseData) => {
      const newExercise = await onAddExerciseCallback(planId, dayName, exerciseData);
      if (newExercise && newExercise.exercise) {
        setExercises(prev => [...prev, newExercise.exercise]);
      } else if (exerciseData) {
        setExercises(prev => [...prev, { _id: Date.now().toString(), ...exerciseData }]);
      }
      if (onForceRefresh) setTimeout(() => onForceRefresh(), 100);
    });
  };

  const handleDeleteExercise = async (planId, dayName, exerciseName) => {
    await onDeleteExercise(planId, dayName, exerciseName);
    setExercises(prev => prev.filter(ex => ex.name !== exerciseName));
    if (onForceRefresh) setTimeout(() => onForceRefresh(), 100);
  };

  const handleEditExercise = (planId, dayName, exerciseName, exerciseData, isGenerated, onUpdateExerciseCallback) => {
    onOpenEditExercisePage(planId, dayName, exerciseName, exerciseData, isGenerated, async (planId, dayName, exerciseName, updatedData) => {
      await onUpdateExerciseCallback(planId, dayName, exerciseName, updatedData);
      setExercises(prev => prev.map(ex =>
        ex.name === exerciseName ? { ...ex, ...updatedData } : ex
      ));
      if (onForceRefresh) setTimeout(() => onForceRefresh(), 100);
    });
  };

  const stats = useMemo(() => {
    const total = exercises.length;
    const done = exercises.filter((_, i) => completedExercises[`${planId}-${dayIndex}-${i}`]).length;
    const percent = total > 0 ? Math.round((done / total) * 100) : 0;
    return { total, done, percent };
  }, [exercises, completedExercises, planId, dayIndex]);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 50, tolerance: 5 } })
  );

  const hasCompletedInDay = () =>
    exercises.some((_, exIdx) => !!completedExercises[`${planId}-${dayIndex}-${exIdx}`]);

  // [FIX] Trava contra cliques múltiplos — libera só em caso de erro
  const handleFinishDayWorkout = async () => {
    if (isFinishing) return;
    const entriesToLog = [];
    exercises.forEach((ex, exIdx) => {
      const key = `${planId}-${dayIndex}-${exIdx}`;
      if (completedExercises[key]) {
        entriesToLog.push({
          name: ex.name,
          reps: Number(ex.reps?.split('-')[0]) || 0,
          weight: Number(ex.weight) || 0,
          workoutName: `${planName} - ${day.name}`,
        });
      }
    });
    if (entriesToLog.length === 0) return;
    setIsFinishing(true);
    try {
      await api.post('/workouts/log', { exercises: entriesToLog });
      if (onClearDayExercises) onClearDayExercises(planId, dayIndex);
      if (onFinishWorkout) onFinishWorkout();
      // Não reseta em sucesso — componente desmonta
    } catch (e) {
      console.error('Erro ao registrar treino:', e);
      setIsFinishing(false); // libera só em erro
    }
  };

  const handleConfirm = async () => {
    if (confirmTarget.type === 'day') {
      onDeleteDay(confirmTarget.planId, confirmTarget.dayName);
      onBack();
    } else if (confirmTarget.type === 'exercise') {
      await handleDeleteExercise(confirmTarget.planId, confirmTarget.day, confirmTarget.exercise);
    }
    setConfirmTarget(null);
  };

  const handleSyncPR = async (exName, exData) => {
    setSyncingPR(exName);
    try {
      const response = await api.get('/workouts/pr', { params: { exercise: exName.trim() } });
      const prWeight = response.data.personalRecord || response.data.weight || 0;
      if (!prWeight || Number(prWeight) <= 0) return;
      if (isGenerated) {
        await api.put('/workouts/update-pr', { workoutId: planId, exerciseName: exName, newPR: Number(prWeight) });
      } else {
        await api.put(`/workout-plans/${planId}/${day.name}/${encodeURIComponent(exName)}`, { ...exData, weight: Number(prWeight) });
      }
      setExercises(prev => prev.map(ex => ex.name === exName ? { ...ex, weight: Number(prWeight) } : ex));
      if (onForceRefresh) setTimeout(() => onForceRefresh(), 100);
    } catch (e) {
      console.error('Erro ao sincronizar PR', e);
    } finally {
      setSyncingPR(null);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = parseInt(active.id);
    const newIndex = parseInt(over.id);
    const newExercisesOrder = arrayMove([...exercises], oldIndex, newIndex);
    setExercises(newExercisesOrder);
    if (updatePlanLocally) updatePlanLocally({ ...day, exercises: newExercisesOrder }, dayIndex);
    try {
      await api.put(`/workout-plans/${planId}/reorder-exercises`, {
        dayName: day.name,
        exercisesOrder: newExercisesOrder.map(ex => ex._id),
      });
      if (onForceRefresh && !updatePlanLocally) setTimeout(() => onForceRefresh(), 100);
    } catch (error) {
      console.error('Erro ao reordenar exercícios:', error);
      setExercises(day?.exercises || []);
      if (updatePlanLocally) updatePlanLocally(day, dayIndex);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black overflow-y-auto selection:bg-[#ff6600]/30 text-white pt-20 md:pt-20">
      {/* Glow de fundo */}
      <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#ff6600] rounded-full blur-[150px]" />
      </div>

      <ConfirmModal
        confirmTarget={confirmTarget}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmTarget(null)}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pb-24">

        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-4 mb-2">
              <button
                onClick={onBack}
                className="p-3 bg-white/5 rounded-2xl text-gray-500 hover:text-white transition-all border border-white/5 hover:border-[#ff6600]/20 flex-shrink-0"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black italic uppercase tracking-tighter text-[#ff6600] break-words leading-tight">
                {day.name}
              </h1>
            </div>

           {/* [FIX] Contador + barra de progresso alinhada */}
<div className="flex flex-col gap-2 mt-4">
  <div className="flex items-center gap-2">
    <BarChart3 size={14} className="text-[#ff6600] flex-shrink-0" />
    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
      {stats.done} / {stats.total} EXERCÍCIOS
    </span>
  </div>
  <div className="h-1 w-30 bg-white/5 rounded-full overflow-hidden">
    <div
      className="h-full bg-[#ff6600] shadow-[0_0_8px_#ff6600] transition-all duration-500"
      style={{ width: `${stats.percent}%` }}
    />
  </div>
</div>
          </div>
        </div>

        {/* Barra de ações */}
        <div className="flex items-center justify-end gap-3 -mt-19 mb-6">
          {!isGenerated && exercises.length > 1 && (
            <button
              onClick={() => setIsReorderMode(prev => !prev)}
              className={`flex items-center gap-2 px-4 h-10 rounded-full text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 border ${
                isReorderMode
                  ? 'bg-[#ff6600] border-[#ff6600] text-black shadow-[0_0_16px_rgba(255,102,0,0.4)]'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:border-[#ff6600]/40 hover:text-[#ff6600]'
              }`}
            >
              {isReorderMode
                ? <><Check size={13} strokeWidth={3} />Concluir</>
                : <><ArrowUpDown size={13} strokeWidth={2.5} />Reordenar</>
              }
            </button>
          )}
          {!isGenerated && (
            <button
              onClick={() => handleAddExercise(planId, day.name, onAddExercise)}
              className="w-12 h-12 bg-[#ff6600] hover:bg-[#ff5500] text-black rounded-full shadow-2xl hover:shadow-[#ff6600]/30 flex items-center justify-center transition-all hover:scale-110 active:scale-95 group"
            >
              <Plus size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
          )}
        </div>

        {/* Lista de exercícios */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          autoScroll={true}
        >
          <SortableContext
            items={exercises.map((_, idx) => idx.toString())}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid gap-4 sm:gap-5 grid-cols-1 md:grid-cols-2">
              {exercises.map((ex, eIdx) => {
                const checkKey = `${planId}-${dayIndex}-${eIdx}`;
                const isCompleted = !!completedExercises[checkKey];
                const DecorativeIcon = eIdx % 3 === 0 ? Dumbbell : eIdx % 3 === 1 ? Zap : Flame;

                return (
                  <ExercicioSortableItem
                    key={ex._id || eIdx}
                    id={eIdx.toString()}
                    isReorderMode={isReorderMode}
                  >
                    {({ isDragging, dragListeners }) => (
                      // [FIX] Card inteiro clicável — stopPropagation nos botões internos
                      <div
                        onClick={() => { if (!isReorderMode) toggleCheck(checkKey); }}
                        className={`group relative min-h-[160px] sm:min-h-[170px] rounded-2xl border overflow-hidden transition-all duration-300 w-full ${
                          isReorderMode ? 'cursor-default' : 'cursor-pointer'
                        } ${
                          isDragging
                            ? 'border-[#ff6600] shadow-[0_0_30px_rgba(255,102,0,0.3)] scale-[1.02]'
                            : isCompleted
                            ? 'border-[#ff6600] scale-[0.99] shadow-[0_0_20px_rgba(255,102,0,0.15)] bg-[#050505]'
                            : 'border-white/20 bg-white/[0.03] hover:border-[#ff6600]/40 shadow-lg'
                        }`}
                      >
                        <div className={`absolute inset-0 transition-colors duration-500 ${isCompleted ? 'bg-[#050505]' : 'bg-gradient-to-br from-[#0a0a0a] via-black to-[#0d0d0d] group-hover:via-[#111111]'}`} />
                        <div className={`absolute -right-3 -bottom-4 transition-opacity duration-500 text-[#ff6600] transform rotate-12 ${isCompleted ? 'opacity-[0.1]' : 'opacity-[0.03] group-hover:opacity-[0.07]'}`}>
                          <DecorativeIcon size={140} strokeWidth={2.5} />
                        </div>
                        <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 ${isCompleted ? 'bg-[#ff6600]' : 'bg-[#ff6600] opacity-30 group-hover:opacity-100 group-hover:w-2'}`} />

                        {/* Handle drag ou menu 3 pontinhos */}
                        <div className="absolute top-3 right-3 z-20" onClick={(e) => e.stopPropagation()}>
                          {isReorderMode ? (
                            <div
                              {...dragListeners}
                              className="w-8 h-8 rounded-lg bg-[#ff6600]/10 border border-[#ff6600]/30 text-[#ff6600] flex items-center justify-center cursor-grab active:cursor-grabbing touch-none select-none"
                              style={{ touchAction: 'none' }}
                            >
                              <GripVertical size={16} />
                            </div>
                          ) : (
                            <ExerciseMenu
                              onEdit={() => {
                                if (isGenerated) {
                                  onOpenEditPRPage?.(planId, ex.name, ex, onUpdateExercise);
                                } else {
                                  handleEditExercise(planId, day.name, ex.name, ex, isGenerated, onUpdateExercise);
                                }
                              }}
                              onDelete={() =>
                                setConfirmTarget({ type: 'exercise', planId, day: day.name, exercise: ex.name })
                              }
                            />
                          )}
                        </div>

                        <div className="relative z-10 h-full p-5 sm:p-6 pr-14 sm:pr-16 flex items-center gap-3 w-full">
                          <div className="flex items-center gap-4 sm:gap-5 flex-grow min-w-0">
                            <div className={`flex-shrink-0 transition-all duration-300 rounded-lg ${isCompleted ? 'text-[#ff6600] scale-110 drop-shadow-[0_0_8px_#ff6600]' : 'text-white/20 group-hover:text-[#ff6600]/50 group-hover:scale-110'}`}>
                              <CheckSquare className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={2.5} />
                            </div>
                            <div className="space-y-3 min-w-0 overflow-hidden flex-1">
                              <h4 className={`text-lg sm:text-xl md:text-2xl font-black uppercase italic tracking-tight transition-all truncate leading-tight py-1 ${isCompleted ? 'text-[#ff6600]' : 'text-white group-hover:text-[#ff6600]'}`}>
                                {ex.name}
                              </h4>
                              <div className="flex items-center gap-5 sm:gap-8">
                                <div className="flex flex-col">
                                  <p className="text-[9px] sm:text-[10px] font-black text-gray-500 uppercase tracking-widest leading-tight">SÉRIES</p>
                                  <p className={`text-xl sm:text-2xl md:text-3xl font-black italic transition-colors leading-tight ${isCompleted ? 'text-[#ff6600]' : 'text-white'}`}>{ex.sets}</p>
                                </div>
                                <div className="flex flex-col">
                                  <p className="text-[9px] sm:text-[10px] font-black text-gray-500 uppercase tracking-widest leading-tight">REPS</p>
                                  <p className={`text-xl sm:text-2xl md:text-3xl font-black italic transition-colors leading-tight ${isCompleted ? 'text-[#ff6600]' : 'text-white'}`}>{ex.reps}</p>
                                </div>
                                <div className="flex flex-col">
                                  <p className="text-[9px] sm:text-[10px] font-black text-[#ff6600]/60 uppercase tracking-widest leading-tight">CARGA</p>
                                  <div className="flex items-center gap-2 overflow-visible">
                                    <p className="text-xl sm:text-2xl md:text-3xl font-black italic text-[#ff6600] leading-tight whitespace-nowrap overflow-visible">
                                      {ex.weight}KG
                                    </p>
                                    {!isReorderMode && (
                                      <button
                                        onClick={(e) => { e.stopPropagation(); handleSyncPR(ex.name, ex); }}
                                        className={`p-1.5 rounded-md transition-all flex-shrink-0 ${syncingPR === ex.name ? 'animate-spin bg-[#ff6600]/20 text-[#ff6600]' : 'text-[#ff6600]/40 hover:text-[#ff6600] hover:bg-[#ff6600]/10'}`}
                                        title="Sincronizar PR do Histórico"
                                      >
                                        <Trophy size={14} />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </ExercicioSortableItem>
                );
              })}
            </div>
          </SortableContext>
        </DndContext>

        {/* [FIX] Botão Finalizar treino travado após 1º clique */}
        <div className="space-y-4 mt-8">
          {!isReorderMode && hasCompletedInDay() && (
            <div className="flex justify-center">
              <button
                onClick={handleFinishDayWorkout}
                disabled={isFinishing}
                className={`group flex items-center gap-2 transition-all ${
                  isFinishing
                    ? 'opacity-60 cursor-not-allowed'
                    : 'hover:scale-105 active:scale-95 cursor-pointer'
                }`}
              >
                {isFinishing ? (
                  <Loader2 size={18} className="text-green-500 animate-spin" />
                ) : (
                  <CheckCircle2 size={18} className="text-green-500 group-hover:scale-110 transition-transform" />
                )}
                <span className={`text-xs sm:text-sm font-black uppercase tracking-wider transition-colors ${
                  isFinishing ? 'text-gray-600' : 'text-gray-400 group-hover:text-white'
                }`}>
                  {isFinishing ? 'Salvando...' : 'Finalizar treino'}
                </span>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};