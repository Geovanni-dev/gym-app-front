// src/components/PlanDetailsView.jsx
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
        <div className="absolute right-0 top-7 z-20 bg-[#1a1a1a] border border-white/10 rounded-md shadow-lg overflow-hidden min-w-[90px]">
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

// ==================== MODAL DE CONFIRMAÇÃO SIM/NÃO ====================
const ConfirmModal = ({ confirmTarget, onConfirm, onCancel }) => {
  if (!confirmTarget) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 w-full max-w-[320px] relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 opacity-10">
          {confirmTarget.type === 'plan' ? (
            <Dumbbell size={120} strokeWidth={1} className="text-[#dc2626]" />
          ) : (
            <Zap size={120} strokeWidth={1} className="text-[#dc2626]" />
          )}
        </div>

        <div className="flex flex-col items-center text-center relative z-10">
          <div className="mb-5 h-14 w-14 rounded-2xl bg-red-900/20 border border-red-800/30 flex items-center justify-center text-red-600">
            <Trash2 size={24} strokeWidth={1.5} />
          </div>

          <h3 className="text-lg font-black text-white tracking-tighter uppercase">
            {confirmTarget.type === 'plan' ? 'Excluir plano?' : 'Excluir dia?'}
          </h3>

          <p className="mt-2 text-[12px] text-gray-500 leading-relaxed">
            {confirmTarget.type === 'plan'
              ? 'Todos os dias e exercícios serão perdidos.'
              : 'Todos os exercícios deste dia serão removidos.'}
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
  const [editingDayIdx, setEditingDayIdx] = useState(null);
  const [tempDayName, setTempDayName] = useState('');
  const [copied, setCopied] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [localDays, setLocalDays] = useState(plan?.days || []);
  const [isDragging, setIsDragging] = useState(false);

  const planStats = {
    totalDays: localDays.length,
    totalExercises: localDays.reduce((acc, day) => acc + (day.exercises?.length || 0), 0),
    completedExercises: Object.keys(completedExercises).filter(key => completedExercises[key] === true).length,
    percent: 0,
  };
  planStats.percent = planStats.totalExercises > 0
    ? Math.round((planStats.completedExercises / planStats.totalExercises) * 100)
    : 0;

  useEffect(() => {
    if (!isDragging && plan?.days) setLocalDays(plan.days);
  }, [plan?.days, isDragging]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { delay: 800, tolerance: 20 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 800, tolerance: 20 },
    })
  );

  useEffect(() => {
    document.body.style.overflow = 'auto';
    document.body.style.position = 'static';
    window.scrollTo(0, 0);
  }, []);

  const handleConfirm = () => {
    if (confirmTarget.type === 'plan') {
      onDeletePlan(confirmTarget.id);
    } else if (confirmTarget.type === 'day') {
      onDeleteDay(confirmTarget.planId, confirmTarget.dayName);
    }
    setConfirmTarget(null);
  };

  const handleDragStart = () => setIsDragging(true);

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

    setLocalDays(newDaysOrder);
    if (updatePlanLocally) updatePlanLocally({ ...plan, days: newDaysOrder });

    try {
      await api.put(`/workout-plans/${plan._id || plan.id}/reorder`, {
        daysOrder: newDaysOrder.map(day => day.name),
      });
    } catch (error) {
      console.error('Erro ao reordenar dias:', error);
      setLocalDays(plan?.days || []);
      if (updatePlanLocally) updatePlanLocally(plan);
    } finally {
      setIsDragging(false);
    }
  };

  const handleUpdatePlanLocally = (updatedDay, dayIndex) => {
    const newDays = [...localDays];
    newDays[dayIndex] = updatedDay;
    setLocalDays(newDays);
    if (updatePlanLocally) updatePlanLocally({ ...plan, days: newDays });
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

      <div className={`min-h-screen bg-black pb-28 relative ${selectedDay ? 'hidden' : ''}`}>
        {/* Glow de fundo */}
        <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#ff6600] rounded-full blur-[150px]" />
        </div>

        <ConfirmModal
          confirmTarget={confirmTarget}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmTarget(null)}
        />

        {/* Conteúdo principal */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-24">

          {/* Cabeçalho do plano */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={onBack}
                className="p-2 bg-white/5 rounded-xl text-gray-500 hover:text-white hover:bg-white/10 transition-all border border-white/5 hover:border-[#ff6600]/20"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="flex flex-col min-w-0 flex-1">
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white leading-tight truncate">
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

          {/* Lista de dias */}
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

                  // modo edição do nome do dia
                  if (editingDayIdx === dIdx && !isGenerated) {
                    return (
                      <div key={dIdx} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
                        {/* flex com min-w-0 em cada filho para não vazar o container */}
                        <div className="flex items-center gap-2 w-full min-w-0">
                          <input
                            autoFocus
                            className="flex-1 min-w-0 bg-transparent text-xl sm:text-2xl font-black italic uppercase text-[#ff6600] border-b border-[#ff6600] outline-none px-1 py-1"
                            value={tempDayName}
                            onChange={(e) => setTempDayName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleEditDayName(day.name, tempDayName);
                              if (e.key === 'Escape') setEditingDayIdx(null);
                            }}
                          />
                          <button
                            onClick={() => handleEditDayName(day.name, tempDayName)}
                            className="flex-shrink-0 p-2 text-[#ff6600] hover:bg-[#ff6600]/10 rounded-lg transition-all"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={() => setEditingDayIdx(null)}
                            className="flex-shrink-0 p-2 text-gray-500 hover:text-white rounded-lg transition-all"
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

                          {/* Menu 3 pontinhos */}
                          <div className="absolute top-2 right-2 z-20">
                            {!isGenerated && (
                              <DayMenu
                                onEdit={() => {
                                  setEditingDayIdx(dIdx);
                                  setTempDayName(day.name);
                                }}
                                onDelete={() =>
                                  setConfirmTarget({
                                    type: 'day',
                                    planId: plan._id || plan.id,
                                    dayName: day.name,
                                  })
                                }
                              />
                            )}
                          </div>

                          <div className="relative z-10 p-4 sm:p-5 pr-10 sm:pr-12">
                            <div className="flex items-center justify-between gap-3">
                              <button
                                onClick={() => setSelectedDay({ day, dayIndex: dIdx })}
                                className="flex-1 text-left min-w-0"
                                {...dragHandleListeners}
                              >
                                <h3 className="text-xl sm:text-2xl font-black italic uppercase text-[#ff6600] tracking-tight truncate">
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