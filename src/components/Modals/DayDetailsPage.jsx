// src/components/Modals/DayDetailsPage.jsx (VERSÃO FINAL - COM ATUALIZAÇÃO IMEDIATA)
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  ArrowLeft,
  Trash2,
  Edit3,
  CheckSquare,
  Plus,
  X,
  CheckCircle2,
  Dumbbell,
  Zap,
  Flame,
  Trophy,
  BarChart3,
  MoreVertical,
} from 'lucide-react';
import api from "../../services/api";

// ==================== EXERCICIO SORTABLE ITEM ====================
const ExercicioSortableItem = ({ id, children }) => {
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
    touchAction: isDragging ? 'none' : 'pan-y',
    WebkitTouchCallout: 'none',
    WebkitUserSelect: 'none',
    userSelect: 'none',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children({ isDragging })}
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
  const [holdProgress, setHoldProgress] = useState(0);
  const timerRef = useRef(null);
  const [syncingPR, setSyncingPR] = useState(null);
  const [exercises, setExercises] = useState(day?.exercises || []);

  // Bloqueio de scroll
  useEffect(() => {
    document.body.style.position = 'fixed';
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.position = '';
      document.body.style.overflow = '';
    };
  }, []);

  // Atualizar exercises local quando day mudar
  useEffect(() => {
    setExercises(day?.exercises || []);
  }, [day?.exercises]);

  // Função para adicionar exercício com atualização imediata
  const handleAddExercise = async (planId, dayName, onAddExerciseCallback) => {
    // Abre a página de adicionar exercício com um callback que atualiza a lista
    onOpenAddExercisePage(planId, dayName, async (planId, dayName, exerciseData) => {
      // Chama a função original de adicionar
      const newExercise = await onAddExerciseCallback(planId, dayName, exerciseData);
      
      // Atualiza a lista local imediatamente
      if (newExercise && newExercise.exercise) {
        setExercises(prev => [...prev, newExercise.exercise]);
      } else if (exerciseData) {
        // Se não tiver retorno, cria um objeto temporário
        const tempExercise = {
          _id: Date.now().toString(),
          ...exerciseData
        };
        setExercises(prev => [...prev, tempExercise]);
      }
      
      // Força refresh para garantir sincronia com o backend
      if (onForceRefresh) {
        setTimeout(() => onForceRefresh(), 100);
      }
    });
  };

  // Função para deletar exercício com atualização imediata
  const handleDeleteExercise = async (planId, dayName, exerciseName) => {
    await onDeleteExercise(planId, dayName, exerciseName);
    // Remove da lista local imediatamente
    setExercises(prev => prev.filter(ex => ex.name !== exerciseName));
    if (onForceRefresh) {
      setTimeout(() => onForceRefresh(), 100);
    }
  };

  // Função para editar exercício com atualização imediata
  const handleEditExercise = (planId, dayName, exerciseName, exerciseData, isGenerated, onUpdateExerciseCallback) => {
    onOpenEditExercisePage(planId, dayName, exerciseName, exerciseData, isGenerated, async (planId, dayName, exerciseName, updatedData) => {
      await onUpdateExerciseCallback(planId, dayName, exerciseName, updatedData);
      // Atualiza a lista local imediatamente
      setExercises(prev => prev.map(ex => 
        ex.name === exerciseName ? { ...ex, ...updatedData } : ex
      ));
      if (onForceRefresh) {
        setTimeout(() => onForceRefresh(), 100);
      }
    });
  };

  // Estatísticas de progresso
  const stats = useMemo(() => {
    const total = exercises.length;
    const done = exercises.filter((_, i) => completedExercises[`${planId}-${dayIndex}-${i}`]).length;
    const percent = total > 0 ? Math.round((done / total) * 100) : 0;
    return { total, done, percent };
  }, [exercises, completedExercises, planId, dayIndex]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 300,
        tolerance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 300,
        tolerance: 5,
      },
    })
  );

  const hasCompletedInDay = () => {
    return exercises.some((_, exIdx) => {
      const key = `${planId}-${dayIndex}-${exIdx}`;
      return !!completedExercises[key];
    });
  };

  const handleFinishDayWorkout = async () => {
    const entriesToLog = [];

    exercises.forEach((ex, exIdx) => {
      const key = `${planId}-${dayIndex}-${exIdx}`;
      if (completedExercises[key]) {
        entriesToLog.push({
          name: ex.name,
          reps: Number(ex.reps?.split('-')[0]) || 0,
          weight: Number(ex.weight) || 0,
          workoutName: `${planName} - ${day.name}`
        });
      }
    });
    
    if (entriesToLog.length === 0) return;

    try {
      await api.post('/workouts/log', { exercises: entriesToLog });

      if (onClearDayExercises) {
        onClearDayExercises(planId, dayIndex);
      }
      
      if (onFinishWorkout) {
        onFinishWorkout();
      }
    } catch (e) {
      console.error('Erro ao registrar treino:', e);
    }
  };

  const startHold = () => {
    timerRef.current = setInterval(() => {
      setHoldProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timerRef.current);
          handleConfirm();
          return 100;
        }
        return prev + 5.5;
      });
    }, 16);
  };

  const stopHold = () => {
    clearInterval(timerRef.current);
    if (holdProgress < 100) setHoldProgress(0);
  };

  const handleConfirm = async () => {
    if (confirmTarget.type === 'day') {
      onDeleteDay(confirmTarget.planId, confirmTarget.dayName);
      onBack();
    } else if (confirmTarget.type === 'exercise') {
      await handleDeleteExercise(confirmTarget.planId, confirmTarget.day, confirmTarget.exercise);
    }
    setTimeout(() => {
      setConfirmTarget(null);
      setHoldProgress(0);
    }, 400);
  };

  const handleSyncPR = async (exName, exData) => {
    setSyncingPR(exName);
    try {
      const response = await api.get('/workouts/pr', {
        params: { exercise: exName.trim() },
      });

      const prWeight = response.data.personalRecord || response.data.weight || 0;

      if (!prWeight || Number(prWeight) <= 0) {
        setSyncingPR(null);
        return;
      }

      if (isGenerated) {
        await api.put('/workouts/update-pr', {
          workoutId: planId,
          exerciseName: exName,
          newPR: Number(prWeight),
        });
      } else {
        await api.put(
          `/workout-plans/${planId}/${day.name}/${encodeURIComponent(exName)}`,
          {
            ...exData,
            weight: Number(prWeight),
          }
        );
      }

      // Atualiza o peso localmente
      setExercises(prev => prev.map(ex => 
        ex.name === exName ? { ...ex, weight: Number(prWeight) } : ex
      ));

      if (onForceRefresh) {
        setTimeout(() => onForceRefresh(), 100);
      }
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

    const newExercisesOrder = [...exercises];
    const [movedExercise] = newExercisesOrder.splice(oldIndex, 1);
    newExercisesOrder.splice(newIndex, 0, movedExercise);

    setExercises(newExercisesOrder);

    const exercisesOrder = newExercisesOrder.map(ex => ex._id);

    if (updatePlanLocally) {
      const updatedDay = { ...day, exercises: newExercisesOrder };
      updatePlanLocally(updatedDay, dayIndex);
    }

    try {
      await api.put(`/workout-plans/${planId}/reorder-exercises`, {
        dayName: day.name,
        exercisesOrder,
      });
      if (onForceRefresh && !updatePlanLocally) {
        setTimeout(() => onForceRefresh(), 100);
      }
    } catch (error) {
      console.error('Erro ao reordenar exercícios:', error);
      setExercises(day?.exercises || []);
      if (updatePlanLocally) {
        updatePlanLocally(day, dayIndex);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black overflow-y-auto selection:bg-[#ff6600]/30 text-white pt-20 md:pt-20">
      
      {/* Glow de fundo */}
      <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#ff6600] rounded-full blur-[150px]" />
      </div>

      {/* Modal de confirmação */}
      {confirmTarget && (
        <div className="fixed inset-0 z-[200] bg-black/98 backdrop-blur-md overflow-y-auto">
          <div className="min-h-full flex flex-col items-center justify-center p-4">
            <div className="relative p-[2px] rounded-[32px] overflow-hidden w-full max-w-[340px] transition-all duration-300 my-auto">
              <div
                className="absolute inset-0 transition-opacity duration-300"
                style={{
                  opacity: holdProgress > 0 ? 0.8 : 0,
                  background: `conic-gradient(from 0deg, #dc2626 ${holdProgress}%, transparent ${holdProgress}%)`,
                }}
              />

              <div className="relative bg-[#0a0a0a] p-8 rounded-[30px] z-10 border border-white/5 overflow-hidden">
                <div className="absolute -right-10 -bottom-10 opacity-10">
                  {confirmTarget.type === 'day' ? (
                    <Zap size={140} strokeWidth={1} className="text-[#dc2626]" />
                  ) : (
                    <Flame size={140} strokeWidth={1} className="text-[#dc2626]" />
                  )}
                </div>

                <button
                  onClick={() => {
                    setConfirmTarget(null);
                    setHoldProgress(0);
                    if (timerRef.current) clearInterval(timerRef.current);
                  }}
                  className="absolute top-6 right-6 text-gray-600 hover:text-[#dc2626] transition-colors z-20"
                >
                  <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center relative z-10">
                  <div className={`mb-6 h-16 w-16 rounded-2xl bg-red-900/20 border border-red-800/30 flex items-center justify-center transition-all duration-500 ${holdProgress > 0 ? 'text-[#dc2626] shadow-[0_0_20px_rgba(220,38,38,0.3)] scale-105' : 'text-red-700'}`}>
                    <Trash2 size={28} strokeWidth={1.5} />
                  </div>

                  <h3 className="text-xl font-black text-white tracking-tighter uppercase">
                    {confirmTarget.type === 'day' ? 'EXCLUIR DIA?' : 'EXCLUIR EXERCÍCIO?'}
                  </h3>

                  <p className="mt-3 text-[12px] text-gray-500 leading-relaxed font-medium">
                    {confirmTarget.type === 'day' 
                      ? 'Os exercícios deste dia serão removidos.' 
                      : 'Este exercício será removido permanentemente.'}
                  </p>
                </div>

                <div className="mt-8 relative z-10">
                  <button
                    onMouseDown={startHold}
                    onMouseUp={stopHold}
                    onMouseLeave={stopHold}
                    onTouchStart={startHold}
                    onTouchEnd={stopHold}
                    className={`relative w-full h-14 rounded-2xl border bg-black/80 border-white/5 transition-all duration-300 select-none cursor-pointer overflow-hidden
                      ${holdProgress > 0
                        ? 'shadow-[0_0_40px_rgba(220,38,38,0.2)] scale-[0.98] border-[#dc2626]/50'
                        : 'shadow-none'
                      }`}
                  >
                    <div
                      className="absolute inset-y-0 left-0 bg-[#dc2626] transition-all duration-75 ease-linear shadow-[5px_0_15px_rgba(0,0,0,0.3)]"
                      style={{ width: `${holdProgress}%` }}
                    />
                    <span className={`relative z-10 text-[11px] font-black uppercase tracking-[0.2em] transition-colors duration-300 ${holdProgress > 50 ? 'text-white' : 'text-gray-400'}`}>
                      {holdProgress >= 100 ? 'EXCLUÍDO' : 'EXCLUIR'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo principal */}
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
            
            <div className="flex items-center gap-6 mt-4 ml-1">
              <div className="flex items-center gap-2">
                <BarChart3 size={14} className="text-[#ff6600]" />
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  {stats.done} / {stats.total} EXERCÍCIOS
                </span>
              </div>
              <div className="h-1 w-24 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#ff6600] shadow-[0_0_8px_#ff6600] transition-all duration-500" 
                  style={{ width: `${stats.percent}%` }} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Botão Adicionar */}
        {!isGenerated && (
          <div className="flex justify-end -mt-19 mb-6">
            <button
              onClick={() => handleAddExercise(planId, day.name, onAddExercise)}
              className="w-12 h-12 bg-[#ff6600] hover:bg-[#ff5500] text-black rounded-full shadow-2xl hover:shadow-[#ff6600]/30 flex items-center justify-center transition-all hover:scale-110 active:scale-95 group"
            >
              <Plus size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>
        )}

        {/* Lista de exercícios com drag and drop */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          autoScroll={false}
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
                  <ExercicioSortableItem key={ex._id || eIdx} id={eIdx.toString()}>
                    {() => (
                      <div className={`group relative min-h-[160px] sm:min-h-[170px] rounded-2xl border overflow-hidden transition-all duration-300 w-full ${isCompleted ? 'border-[#ff6600] scale-[0.99] shadow-[0_0_20px_rgba(255,102,0,0.15)] bg-[#050505]' : 'border-white/20 bg-white/[0.03] hover:border-[#ff6600]/40 shadow-lg'}`}>
                        <div className={`absolute inset-0 transition-colors duration-500 ${isCompleted ? 'bg-[#050505]' : 'bg-gradient-to-br from-[#0a0a0a] via-black to-[#0d0d0d] group-hover:via-[#111111]'}`} />
                        <div className={`absolute -right-3 -bottom-4 transition-opacity duration-500 text-[#ff6600] transform rotate-12 ${isCompleted ? 'opacity-[0.1]' : 'opacity-[0.03] group-hover:opacity-[0.07]'}`}>
                          <DecorativeIcon size={140} strokeWidth={2.5} />
                        </div>
                        <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 ${isCompleted ? 'bg-[#ff6600]' : 'bg-[#ff6600] opacity-30 group-hover:opacity-100 group-hover:w-2'}`} />

                        {/* Menu de 3 pontinhos */}
                        <div className="absolute top-3 right-3 z-20">
                          <ExerciseMenu
                            onEdit={() => {
                              if (isGenerated) {
                                onOpenEditPRPage?.(planId, ex.name, ex, onUpdateExercise);
                              } else {
                                handleEditExercise(planId, day.name, ex.name, ex, isGenerated, onUpdateExercise);
                              }
                            }}
                            onDelete={() => {
                              setConfirmTarget({
                                type: 'exercise',
                                planId,
                                day: day.name,
                                exercise: ex.name,
                              });
                            }}
                          />
                        </div>

                        <div className="relative z-10 h-full p-5 sm:p-6 pr-14 sm:pr-16 flex items-center justify-between gap-3 w-full">
                          <div className="flex items-center gap-4 sm:gap-5 flex-grow min-w-0 cursor-pointer" onClick={() => toggleCheck(checkKey)}>
                            <div className={`flex-shrink-0 transition-all duration-300 rounded-lg ${isCompleted ? 'text-[#ff6600] scale-110 drop-shadow-[0_0_8px_#ff6600]' : 'text-white/20 group-hover:text-[#ff6600]/50 group-hover:scale-110'}`}>
                              <CheckSquare className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={2.5} />
                            </div>
                            <div className="space-y-3 min-w-0 overflow-hidden flex-1">
                              <h4 className={`text-lg sm:text-xl md:text-2xl font-black uppercase italic tracking-tight transition-all truncate leading-tight py-1 ${isCompleted ? 'text-[#ff6600]' : 'text-white group-hover:text-[#ff6600]'}`}>
                                {ex.name}
                              </h4>

                              <div className="flex items-center gap-5 sm:gap-8">
                                <div className="flex flex-col">
                                  <p className="text-[9px] sm:text-[10px] font-black text-gray-500 uppercase tracking-widest leading-tight">
                                    SÉRIES
                                  </p>
                                  <p className={`text-xl sm:text-2xl md:text-3xl font-black italic transition-colors leading-tight ${isCompleted ? 'text-[#ff6600]' : 'text-white'}`}>
                                    {ex.sets}
                                  </p>
                                </div>
                                <div className="flex flex-col">
                                  <p className="text-[9px] sm:text-[10px] font-black text-gray-500 uppercase tracking-widest leading-tight">
                                    REPS
                                  </p>
                                  <p className={`text-xl sm:text-2xl md:text-3xl font-black italic transition-colors leading-tight ${isCompleted ? 'text-[#ff6600]' : 'text-white'}`}>
                                    {ex.reps}
                                  </p>
                                </div>
                                <div className="flex flex-col">
                                  <p className="text-[9px] sm:text-[10px] font-black text-[#ff6600]/60 uppercase tracking-widest leading-tight">
                                    CARGA
                                  </p>
                                  <div className="flex items-center gap-2 overflow-visible">
                                    <p className="text-xl sm:text-2xl md:text-3xl font-black italic text-[#ff6600] leading-tight whitespace-nowrap overflow-visible">
                                      {ex.weight}KG
                                    </p>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleSyncPR(ex.name, ex);
                                      }}
                                      onPointerDown={(e) => e.stopPropagation()}
                                      className={`p-1.5 rounded-md transition-all flex-shrink-0 ${syncingPR === ex.name
                                        ? 'animate-spin bg-[#ff6600]/20 text-[#ff6600]'
                                        : 'text-[#ff6600]/40 hover:text-[#ff6600] hover:bg-[#ff6600]/10'
                                        }`}
                                      title="Sincronizar PR do Histórico"
                                    >
                                      <Trophy size={14} />
                                    </button>
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

        {/* Botão Finalizar treino */}
        <div className="space-y-4 mt-8">
          {hasCompletedInDay() && (
            <div className="flex justify-center">
              <button
                onClick={handleFinishDayWorkout}
                className="group flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <CheckCircle2 size={18} className="text-green-500 group-hover:scale-110 transition-transform" />
                <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-gray-400 group-hover:text-white transition-colors">
                  Finalizar treino
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};