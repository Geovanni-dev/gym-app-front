// src/components/PlanDetailsView.jsx (VERSÃO SEM LÁPIS E LIXEIRA DO PLANO)
import React, { useState, useEffect, useRef } from 'react';
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
  Check,
  Plus,
  X,
  Dumbbell,
  Zap,
  Flame,
  Calendar,
  BarChart3,
  MoreVertical,
} from 'lucide-react';
import api from '../services/api';
import { DayDetailsPage } from './Modals/DayDetailsPage';

// ==================== WRAPPER DO DRAG AND DROP ====================
const DiaSortableItem = ({ id, children }) => {
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
    touchAction: 'pan-y',
    WebkitTouchCallout: 'none',
    WebkitUserSelect: 'none',
    userSelect: 'none',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      {children({ dragHandleListeners: listeners })}
    </div>
  );
};

// ==================== MENU DROPDOWN DO DIA ====================
const DayMenu = ({ onEdit, onDelete }) => {
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
        className="w-6 h-6 rounded-md bg-white/5 text-gray-400 flex items-center justify-center hover:bg-white/10 hover:text-white transition-all"
      >
        <MoreVertical size={12} />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 top-6.5 z-20 bg-[#1a1a1a] border border-white/10 rounded-md shadow-lg overflow-hidden min-w-[90px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              onEdit();
            }}
            className="w-full px-2 py-1 text-left text-[8px] font-medium text-gray-300 hover:bg-[#ff6600]/10 hover:text-[#ff6600] transition-all flex items-center gap-1.5"
          >
            <Edit3 size={8} />
            Editar
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              onDelete();
            }}
            className="w-full px-2 py-1 text-left text-[8px] font-medium text-gray-300 hover:bg-red-500/10 hover:text-red-500 transition-all flex items-center gap-1.5 border-t border-white/5"
          >
            <Trash2 size={8} />
            Excluir
          </button>
        </div>
      )}
    </div>
  );
};

// ==================== COMPONENTE PRINCIPAL ====================
export const PlanDetailsView = ({
  plan,
  onBack,
  completedExercises,
  toggleCheck,
  onDeletePlan,
  onDeleteExercise,
  onUpdatePlanName,
  onUpdateDayName,
  updatePlanLocally,
  onUpdateExercise,
  onReorderDays,
  onAddExercise,
  onAddDay,
  onDeleteDay,
  onFinishWorkout,
  onClearDayExercises,
  isGenerated = false,
  onForceRefresh,
  onOpenAddExercisePage,
  onOpenEditExercisePage,
  onOpenEditPRPage,
  onOpenAddDayPage,
}) => {
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [editingPlanName, setEditingPlanName] = useState(null);
  const [editingDayIdx, setEditingDayIdx] = useState(null);
  const [tempDayName, setTempDayName] = useState('');
  const [holdProgress, setHoldProgress] = useState(0);
  const timerRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [localDays, setLocalDays] = useState(plan?.days || []);
  const [isDragging, setIsDragging] = useState(false);

  // Calcular estatísticas gerais do plano
  const planStats = {
    totalDays: localDays.length,
    totalExercises: localDays.reduce((acc, day) => acc + (day.exercises?.length || 0), 0),
    completedExercises: Object.keys(completedExercises).filter(key => completedExercises[key] === true).length,
    percent: 0
  };
  planStats.percent = planStats.totalExercises > 0 ? Math.round((planStats.completedExercises / planStats.totalExercises) * 100) : 0;

  // Sincroniza localDays quando plan mudar, mas NÃO durante o drag
  useEffect(() => {
    if (!isDragging && plan?.days) {
      setLocalDays(plan.days);
    }
  }, [plan?.days, isDragging]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 800,
        tolerance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 800,
        tolerance: 8,
      },
    })
  );

  useEffect(() => {
    document.body.style.overflow = 'auto';
    document.body.style.position = 'static';
    window.scrollTo(0, 0);
  }, []);

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

  const handleConfirm = () => {
    if (confirmTarget.type === 'plan') {
      onDeletePlan(confirmTarget.id);
    } else if (confirmTarget.type === 'day') {
      onDeleteDay(confirmTarget.planId, confirmTarget.dayName);
    }
    setTimeout(() => {
      setConfirmTarget(null);
      setHoldProgress(0);
    }, 400);
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      setIsDragging(false);
      return;
    }
    if (!localDays.length) {
      setIsDragging(false);
      return;
    }

    const oldIndex = parseInt(active.id);
    const newIndex = parseInt(over.id);

    const newDaysOrder = [...localDays];
    const [movedDay] = newDaysOrder.splice(oldIndex, 1);
    newDaysOrder.splice(newIndex, 0, movedDay);

    const daysOrder = newDaysOrder.map(day => day.name);

    setLocalDays(newDaysOrder);

    if (updatePlanLocally) {
      updatePlanLocally({ ...plan, days: newDaysOrder });
    }

    try {
      await api.put(`/workout-plans/${plan._id || plan.id}/reorder`, { daysOrder });
    } catch (error) {
      console.error('Erro ao reordenar dias:', error);
      setLocalDays(plan?.days || []);
      if (updatePlanLocally) {
        updatePlanLocally(plan);
      }
    } finally {
      setIsDragging(false);
    }
  };

  const handleUpdatePlanLocally = (updatedDay, dayIndex) => {
    const newDays = [...localDays];
    newDays[dayIndex] = updatedDay;
    setLocalDays(newDays);
    if (updatePlanLocally) {
      updatePlanLocally({ ...plan, days: newDays });
    }
  };

  const handleEditDayName = (dayName, newName) => {
    onUpdateDayName(plan._id || plan.id, dayName, newName);
    setEditingDayIdx(null);
  };

  return (
    <>
      {selectedDay && (
        <DayDetailsPage
          day={selectedDay.day}
          dayIndex={selectedDay.dayIndex}
          planId={plan._id || plan.id}
          planName={plan.name}
          onBack={() => setSelectedDay(null)}
          completedExercises={completedExercises}
          toggleCheck={toggleCheck}
          onDeleteDay={onDeleteDay}
          onDeleteExercise={onDeleteExercise}
          onOpenAddExercisePage={onOpenAddExercisePage}
          onOpenEditExercisePage={onOpenEditExercisePage}
          onOpenEditPRPage={onOpenEditPRPage}
          onUpdateExercise={onUpdateExercise}
          onAddExercise={onAddExercise}
          onFinishWorkout={onFinishWorkout}
          onClearDayExercises={onClearDayExercises}
          onForceRefresh={onForceRefresh}
          updatePlanLocally={handleUpdatePlanLocally}
          isGenerated={isGenerated}
        />
      )}

      <div
        className={`min-h-screen bg-black pb-28 relative ${selectedDay ? 'hidden' : ''}`}
      >
        {/* Glow de fundo */}
        <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#ff6600] rounded-full blur-[150px]" />
        </div>

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
                    {confirmTarget.type === 'plan' ? (
                      <Dumbbell size={140} strokeWidth={1} className="text-[#dc2626]" />
                    ) : (
                      <Zap size={140} strokeWidth={1} className="text-[#dc2626]" />
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
                      {confirmTarget.type === 'plan' ? 'EXCLUIR PLANO?' : 'EXCLUIR DIA?'}
                    </h3>

                    <p className="mt-3 text-[12px] text-gray-500 leading-relaxed font-medium">
                      {confirmTarget.type === 'plan' 
                        ? 'Todos os dias e exercícios serão perdidos.' 
                        : 'Os exercícios deste dia serão removidos.'}
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
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-24">
          
          {/* Cabeçalho do plano - SEM LÁPIS E SEM LIXEIRA */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={onBack}
                className="p-2 bg-white/5 rounded-xl text-gray-500 hover:text-white hover:bg-white/10 transition-all border border-white/5 hover:border-[#ff6600]/20"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="flex flex-col">
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white leading-tight">
                  {plan.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  {isGenerated && (
                    <div className="px-2 py-0.5 bg-[#ff6600] text-black text-[8px] font-black uppercase tracking-widest rounded-full italic">
                      FRANGO STUDIO
                    </div>
                  )}
                  {!isGenerated && plan.shareCode && (
                    <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-md pl-2 pr-1.5 py-0.5">
                      <span className="text-[10px] font-mono font-bold text-gray-300">
                        {plan.shareCode}
                      </span>
                      <button
                        onClick={async () => {
                          await navigator.clipboard.writeText(plan.shareCode);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 300);
                        }}
                        className="p-0.5 rounded text-gray-500 hover:text-[#ff6600] transition-all"
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Estatísticas do plano */}
            <div className="flex flex-col gap-3 mt-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <BarChart3 size={14} className="text-[#ff6600]" />
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                    {planStats.completedExercises} / {planStats.totalExercises} EXERCÍCIOS
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-[#ff6600]" />
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                    {planStats.totalDays} DIAS
                  </span>
                </div>
              </div>
              <div className="h-1 w-full max-w-xs bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#ff6600] shadow-[0_0_8px_#ff6600] transition-all duration-500" 
                  style={{ width: `${planStats.percent}%` }} 
                />
              </div>
            </div>
          </div>

          {/* Lista de dias com drag and drop */}
          <div className="space-y-4">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={localDays.map((_, idx) => idx.toString())}
                strategy={verticalListSortingStrategy}
              >
                {localDays.map((day, dIdx) => {
                  const dayExercisesCount = day.exercises?.length || 0;
                  
                  // Se estiver editando este dia
                  if (editingDayIdx === dIdx && !isGenerated) {
                    return (
                      <div key={dIdx} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
                        <div className="flex items-center gap-3">
                          <input
                            autoFocus
                            className="flex-1 bg-transparent text-xl sm:text-2xl font-black italic uppercase text-[#ff6600] border-b border-[#ff6600] outline-none px-2 py-1"
                            value={tempDayName}
                            onChange={(e) => setTempDayName(e.target.value)}
                          />
                          <button
                            onClick={() => handleEditDayName(day.name, tempDayName)}
                            className="p-2 text-[#ff6600] hover:bg-[#ff6600]/10 rounded-lg transition-all"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={() => setEditingDayIdx(null)}
                            className="p-2 text-gray-500 hover:text-white rounded-lg transition-all"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </div>
                    );
                  }
                  
                  return (
                    <DiaSortableItem key={dIdx} id={dIdx.toString()}>
                      {({ dragHandleListeners }) => (
                        <div className="group relative rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 overflow-hidden hover:border-[#ff6600]/30 w-full">
                          <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Calendar size={80} strokeWidth={1} className="text-[#ff6600]" />
                          </div>
                          
                          {/* Menu de 3 pontinhos no canto superior direito */}
                          <div className="absolute top-2 right-2 z-20">
                            {!isGenerated && (
                              <DayMenu
                                onEdit={() => {
                                  setEditingDayIdx(dIdx);
                                  setTempDayName(day.name);
                                }}
                                onDelete={() => {
                                  setConfirmTarget({
                                    type: 'day',
                                    planId: plan._id || plan.id,
                                    dayName: day.name,
                                  });
                                }}
                              />
                            )}
                          </div>
                          
                          <div className="relative z-10 p-4 sm:p-5 pr-10 sm:pr-12">
                            <div className="flex items-center justify-between gap-3">
                              <button
                                onClick={() => setSelectedDay({ day, dayIndex: dIdx })}
                                className="flex-1 text-left"
                                {...dragHandleListeners}
                              >
                                <h3 className="text-xl sm:text-2xl font-black italic uppercase text-[#ff6600] tracking-tight break-words">
                                  {day.name}
                                </h3>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">
                                  {dayExercisesCount} {dayExercisesCount === 1 ? 'EXERCÍCIO' : 'EXERCÍCIOS'}
                                </p>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </DiaSortableItem>
                  );
                })}
              </SortableContext>
            </DndContext>

            {/* Botão Adicionar Dia */}
            {!isGenerated && (
              <button
                onClick={() => onOpenAddDayPage?.(plan._id || plan.id, onAddDay)}
                className="w-full py-6 border-2 border-dashed border-white/10 rounded-2xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-3 text-gray-500 hover:border-[#ff6600] hover:text-[#ff6600] hover:bg-[#ff6600]/5 group"
              >
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center transition-all group-hover:bg-[#ff6600] group-hover:text-black">
                  <Plus size={14} strokeWidth={3} />
                </div>
                Adicionar dia
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};