// src/components/PlanDetailsView.jsx
import React, { useState, useEffect, useRef } from 'react';
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
  Check,
  Plus,
  X,
  MoreVertical,
  GripVertical,
  ArrowUpDown,
  ChevronRight,
  ImageIcon,
  Copy,
  CheckCheck,
} from 'lucide-react';
import api from '../services/api';
import { DayDetailsPage } from './Modals/DayDetailsPage';

// ==================== 10 FOTOS ÚNICAS DE ACADEMIA ====================
const GYM_PHOTOS = [
  'https://images.unsplash.com/photo-1434682772747-f16d3ea162c3?w=900&q=85',
  'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=900&q=85',
  'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=900&q=85',
  'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=900&q=85',
  'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?w=900&q=85',
  'https://images.unsplash.com/photo-1604233098531-90b71b1b17a6?w=900&q=85',
  'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=900&q=85',
  'https://images.unsplash.com/photo-1534368270820-9de3d8053204?w=900&q=85',
  'https://images.unsplash.com/photo-1606889463862-a8fc57a706ce?w=900&q=85',
  'https://images.unsplash.com/photo-1648995361141-30676a75fd27?w=900&q=85',
];

// Chave para salvar as fotos no localStorage
const PHOTOS_STORAGE_KEY = (planId) => `@superfrango:day_photos_${planId}`;

// Carrega fotos salvas do localStorage
const loadSavedPhotos = (planId, days) => {
  const saved = localStorage.getItem(PHOTOS_STORAGE_KEY(planId));
  if (saved) {
    return JSON.parse(saved);
  }
  // Se não tem salvo, cria mapa inicial
  const map = {};
  (days || []).forEach((day, idx) => {
    const key = day._id || day.name || `day-${idx}`;
    map[key] = GYM_PHOTOS[idx % GYM_PHOTOS.length];
  });
  return map;
};

// ==================== DRAG AND DROP WRAPPER ====================
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
    opacity: isDragging ? 0.45 : 1,
    position: 'relative',
    zIndex: isDragging ? 999 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      {children({ isDragging, dragListeners: listeners })}
    </div>
  );
};

// ==================== MENU DO DIA ====================
const DayMenu = ({ onEdit, onDelete, onChangePhoto, isGenerated = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
        className="w-9 h-9 rounded-xl bg-black/50 backdrop-blur-sm text-white/80 flex items-center justify-center hover:bg-black/70 hover:text-white transition-all border border-white/10"
      >
        <MoreVertical size={17} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-9 z-30 bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden min-w-[140px]">
          {isGenerated ? (
            <button
              onClick={(e) => { e.stopPropagation(); setIsOpen(false); onChangePhoto(); }}
              className="w-full px-4 py-3 text-left text-sm font-semibold text-gray-300 hover:bg-white/5 hover:text-white transition-all flex items-center gap-2.5"
            >
              <ImageIcon size={14} /> Trocar foto
            </button>
          ) : (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setIsOpen(false); onEdit(); }}
                className="w-full px-4 py-3 text-left text-sm font-semibold text-gray-300 hover:bg-[#ff6600]/10 hover:text-[#ff6600] transition-all flex items-center gap-2.5"
              >
                <Edit3 size={14} /> Editar nome
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setIsOpen(false); onChangePhoto(); }}
                className="w-full px-4 py-3 text-left text-sm font-semibold text-gray-300 hover:bg-white/5 hover:text-white transition-all flex items-center gap-2.5 border-t border-white/5"
              >
                <ImageIcon size={14} /> Trocar foto
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setIsOpen(false); onDelete(); }}
                className="w-full px-4 py-3 text-left text-sm font-semibold text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition-all flex items-center gap-2.5 border-t border-white/5"
              >
                <Trash2 size={14} /> Excluir
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// ==================== PICKER DE FOTOS ====================
const PhotoPicker = ({ currentPhoto, onSelect, onClose }) => (
  <div
    className="fixed inset-0 z-[250] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
    onClick={onClose}
  >
    <div
      className="bg-[#111] border border-white/10 rounded-3xl p-6 w-full max-w-sm"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-black uppercase tracking-widest text-white">Escolher foto</h3>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-gray-500 hover:text-white transition-all"
        >
          <X size={18} />
        </button>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {GYM_PHOTOS.map((photo, i) => (
          <button
            key={i}
            onClick={() => { onSelect(photo); onClose(); }}
            className={`relative h-16 rounded-xl overflow-hidden transition-all active:scale-90 ${
              currentPhoto === photo
                ? 'ring-2 ring-[#ff6600] ring-offset-2 ring-offset-[#111]'
                : 'opacity-60 hover:opacity-100 hover:scale-105'
            }`}
          >
            <img src={photo} alt="" className="w-full h-full object-cover" loading="lazy" />
            {currentPhoto === photo && (
              <div className="absolute inset-0 bg-[#ff6600]/25 flex items-center justify-center">
                <div className="w-5 h-5 rounded-full bg-[#ff6600] flex items-center justify-center">
                  <Check size={11} className="text-black" strokeWidth={3} />
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  </div>
);

// ==================== MODAL CONFIRMAÇÃO ====================
const ConfirmModal = ({ confirmTarget, onConfirm, onCancel }) => {
  if (!confirmTarget) return null;
  const isPlan = confirmTarget.type === 'plan';
  return (
    <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 w-full max-w-[320px] relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 opacity-10">
          <Trash2 size={120} strokeWidth={1} className="text-[#dc2626]" />
        </div>
        <div className="flex flex-col items-center text-center relative z-10">
          <div className="mb-5 h-14 w-14 rounded-2xl bg-red-900/20 border border-red-800/30 flex items-center justify-center text-red-500">
            <Trash2 size={24} strokeWidth={1.5} />
          </div>
          <h3 className="text-lg font-black text-white tracking-tighter uppercase">
            {isPlan ? 'Excluir plano?' : 'Excluir dia?'}
          </h3>
          <p className="mt-2 text-xs text-gray-500 leading-relaxed">
            {isPlan
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
  const planId = plan?._id || plan?.id;

  const [confirmTarget, setConfirmTarget] = useState(null);
  const [editingDayIdx, setEditingDayIdx] = useState(null);
  const [tempDayName, setTempDayName] = useState('');
  const [copied, setCopied] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [localDays, setLocalDays] = useState(plan?.days || []);
  const [isReorderMode, setIsReorderMode] = useState(false);
  // Carrega fotos salvas do localStorage
  const [dayPhotosMap, setDayPhotosMap] = useState(() => loadSavedPhotos(planId, plan?.days || []));
  const [photoPickerIdx, setPhotoPickerIdx] = useState(null);
  const [pressedIdx, setPressedIdx] = useState(null);
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Salva fotos no localStorage sempre que o mapa mudar
  useEffect(() => {
    if (planId && Object.keys(dayPhotosMap).length > 0) {
      localStorage.setItem(PHOTOS_STORAGE_KEY(planId), JSON.stringify(dayPhotosMap));
    }
  }, [dayPhotosMap, planId]);

  // Helper para obter foto de um dia pelo seu ID/nome
  const getDayPhoto = (day, idx) => {
    const key = day._id || day.name || `day-${idx}`;
    return dayPhotosMap[key] || GYM_PHOTOS[idx % GYM_PHOTOS.length];
  };

useEffect(() => {
  if (plan?.days) {
    setLocalDays((prevLocalDays) => {
      if (selectedDay !== null) {
        return plan.days.map((serverDay, idx) => {
          if (idx === selectedDay.dayIndex) {
            return prevLocalDays[idx] || serverDay;
          }
          return serverDay;
        });
      }
      return plan.days;
    });

    setDayPhotosMap((prev) => {
      const newMap = { ...prev };
      plan.days.forEach((day, idx) => {
        const key = day._id || day.name || `day-${idx}`;
        if (!newMap[key]) {
          newMap[key] = GYM_PHOTOS[idx % GYM_PHOTOS.length];
        }
      });
      return newMap;
    });
  }
}, [plan?.days]); // eslint-disable-next-line react-hooks/exhaustive-deps

  useEffect(() => { return () => setIsReorderMode(false); }, []);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } })
  );

  const handleConfirm = () => {
    if (confirmTarget.type === 'plan') onDeletePlan(confirmTarget.id);
    else if (confirmTarget.type === 'day') onDeleteDay(confirmTarget.planId, confirmTarget.dayName);
    setConfirmTarget(null);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = parseInt(active.id);
    const newIndex = parseInt(over.id);

    const newDays = [...localDays];
    const [movedDay] = newDays.splice(oldIndex, 1);
    newDays.splice(newIndex, 0, movedDay);

    setLocalDays(newDays);
    
    if (updatePlanLocally) {
      updatePlanLocally({ ...plan, days: newDays });
    }

    try {
      await api.put(`/workout-plans/${planId}/reorder`, {
        daysOrder: newDays.map((d) => d.name),
      });
    } catch (err) {
      console.error('Erro ao reordenar dias:', err);
      setLocalDays(plan?.days || []);
      if (updatePlanLocally) updatePlanLocally(plan);
    }
  };

const handleUpdatePlanLocally = (updatedDay, dayIndex) => {
  const newDays = [...localDays];
  newDays[dayIndex] = updatedDay;
  setSelectedDay({ day: updatedDay, dayIndex });
  setLocalDays(newDays);
  const updatedPlan = { ...plan, days: newDays };
  if (updatePlanLocally) updatePlanLocally(updatedPlan);
};

  const handleEditDayName = (dayName, newName) => {
    if (!newName.trim()) return;
    // Preserva a foto do dia antigo para o novo nome
    const oldPhoto = dayPhotosMap[dayName];
    onUpdateDayName(planId, dayName, newName.trim());
    setLocalDays((prev) =>
      prev.map((d) => (d.name === dayName ? { ...d, name: newName.trim() } : d))
    );
    setDayPhotosMap((prev) => {
      const newMap = { ...prev };
      newMap[newName.trim()] = oldPhoto;
      delete newMap[dayName];
      return newMap;
    });
    setEditingDayIdx(null);
  };

  const handleChangePhoto = (idx, photo) => {
    const day = localDays[idx];
    const key = day._id || day.name || `day-${idx}`;
    setDayPhotosMap((prev) => ({ ...prev, [key]: photo }));
  };

  return (
    <>
      {selectedDay && (
        <DayDetailsPage
          day={selectedDay.day}
          dayIndex={selectedDay.dayIndex}
          planId={planId}
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

      {photoPickerIdx !== null && localDays[photoPickerIdx] && (
        <PhotoPicker
          currentPhoto={getDayPhoto(localDays[photoPickerIdx], photoPickerIdx)}
          onSelect={(photo) => handleChangePhoto(photoPickerIdx, photo)}
          onClose={() => setPhotoPickerIdx(null)}
        />
      )}

      <div
        className={`fixed inset-0 z-[100] bg-black overflow-y-auto selection:bg-[#ff6600]/30 text-white pt-20 ${
          selectedDay ? 'hidden' : ''
        }`}
      >
        {/* Glow de fundo - removido para fundo totalmente preto */}
        <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#ff6600] rounded-full blur-[150px]" />
        </div>

        <ConfirmModal
          confirmTarget={confirmTarget}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmTarget(null)}
        />

        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 pb-28">

          {/* ── CABEÇALHO ── */}
          <div className="flex flex-col mb-8">
            <div className="flex items-center gap-4 mb-1">
              <button
                onClick={onBack}
                className="p-3 bg-white/5 rounded-2xl text-gray-500 hover:text-white transition-all border border-white/5 hover:border-[#ff6600]/20 flex-shrink-0"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-white break-words leading-tight truncate flex-1">
                {plan.name}
              </h1>

              <div className="flex items-center gap-2 flex-shrink-0">
                {!isGenerated && localDays.length > 1 && (
                  <button
                    onClick={() => setIsReorderMode((p) => !p)}
                    className={`flex items-center gap-1.5 px-3.5 h-9 rounded-full text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 border ${
                      isReorderMode
                        ? 'bg-[#ff6600] border-[#ff6600] text-black shadow-[0_0_16px_rgba(255,102,0,0.4)]'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-[#ff6600] hover:border-[#ff6600]/30'
                    }`}
                  >
                    {isReorderMode
                      ? <><Check size={12} strokeWidth={3} />Pronto</>
                      : <><ArrowUpDown size={12} />Ordenar</>
                    }
                  </button>
                )}
                {!isGenerated && (
                  <button
                    onClick={() => onOpenAddDayPage?.(planId, onAddDay)}
                    className="w-10 h-10 bg-[#ff6600] hover:bg-[#ff5500] text-black rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-lg shadow-[#ff6600]/20 group"
                  >
                    <Plus
                      size={18}
                      strokeWidth={3}
                      className="group-hover:rotate-90 transition-transform duration-300"
                    />
                  </button>
                )}
              </div>
            </div>

            {/* Share code + badge */}
            <div className="flex items-center gap-3 mt-2">
  {/* FRANGO STUDIO - camada da frente */}
  <span className="px-2.5 py-1 ml-5 bg-[#ff6600] text-black text-[9.5px] font-black uppercase tracking-widest rounded-full italic z-10 relative">
    FRANGO STUDIO
  </span>

  {/* shareCode - camada de trás */}
  {!isGenerated && plan.shareCode && (
    <div className="flex items-center gap-2 bg-gray border border-white/40 rounded-full pl-9 pr-1 ml-[-36px]">
      <span className="text-[8px] font-mono font-bold text-gray-400 tracking-widest">
        {plan.shareCode}
      </span>
      <button
        onClick={async () => {
          await navigator.clipboard.writeText(plan.shareCode);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="p-1 rounded text-gray-600 hover:text-[#ff6600] transition-all"
        title="Copiar código"
      >
        {copied ? <CheckCheck size={12} className="text-[#ff6600]" /> : <Copy size={12} />}
      </button>
    </div>
  )}
</div>
          </div>

          {/* ── LISTA DE DIAS ── */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={(e) => { setIsDragging(false); handleDragEnd(e); }}
            autoScroll={true}
          >
            <SortableContext
              items={localDays.map((_, idx) => idx.toString())}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-5">
                {localDays.map((day, dIdx) => {
                  const photo = getDayPhoto(day, dIdx);
                  const exerciseCount = day.exercises?.length || 0;
                  const isPressed = pressedIdx === dIdx;
                  const isPhotoSelected = selectedPhotoIdx === dIdx;

                  if (editingDayIdx === dIdx && !isGenerated) {
                    return (
                   <div
  key={day._id || dIdx}
  className="rounded-3xl border border-[#ff6600]/30 bg-white/[0.03] p-4 sm:p-5"
>
  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
    <input
      autoFocus
      className="flex-1 w-full bg-transparent text-xl sm:text-2xl font-black italic uppercase text-[#ff6600] border-b border-[#ff6600]/60 outline-none py-1 px-1"
      value={tempDayName}
      onChange={(e) => setTempDayName(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleEditDayName(day.name, tempDayName);
        if (e.key === 'Escape') setEditingDayIdx(null);
      }}
    />
    <div className="flex items-center gap-2 self-end sm:self-auto">
      <button
        onClick={() => handleEditDayName(day.name, tempDayName)}
        className="p-2 text-[#ff6600] hover:bg-[#ff6600]/10 rounded-xl transition-all"
      >
        <Check size={18} />
      </button>
      <button
        onClick={() => setEditingDayIdx(null)}
        className="p-2 text-gray-500 hover:text-white rounded-xl transition-all"
      >
        <X size={18} />
      </button>
    </div>
  </div>
</div>
                    );
                  }

                  return (
                    <DiaSortableItem key={day._id || dIdx} id={dIdx.toString()}>
                      {({ isDragging, dragListeners }) => (
                        <div
                          onMouseDown={() => !isReorderMode && setPressedIdx(dIdx)}
                          onMouseUp={() => setPressedIdx(null)}
                          onMouseLeave={() => setPressedIdx(null)}
                          onTouchStart={() => !isReorderMode && setPressedIdx(dIdx)}
                          onTouchEnd={() => setPressedIdx(null)}
                          onClick={() => {
                            if (!isReorderMode) {
                              setSelectedPhotoIdx(selectedPhotoIdx === dIdx ? null : dIdx);
                            }
                          }}
                          className={`relative h-70 sm:h-60 rounded-3xl overflow-hidden select-none shadow-xl transition-all duration-500 ${
                            isReorderMode ? 'cursor-default' : 'cursor-pointer group'
                          } ${
                            isDragging
                              ? 'shadow-[0_0_40px_rgba(255,102,0,0.25)] ring-1 ring-[#ff6600]/50 scale-[1.02]'
                              : 'hover:shadow-[0_0_30px_rgba(255,102,0,0.15)]'
                          } border border-[#ff6600]/30`}
                        >
                          {/* Foto de fundo com grayscale suavizado */}
                          <div
                            className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ${
                              isPhotoSelected
                                ? 'grayscale-0 brightness-100 scale-110'
                                : `grayscale-[0.85] brightness-[0.85] ${!isReorderMode ? 'group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-110' : ''}`
                            }`}
                            style={{ backgroundImage: `url('${photo}')` }}
                          />

                          {/* Overlay gradiente */}
                          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-black/20 transition-all duration-500 group-hover:from-black/80" />

                          {/* Borda laranja fixa nos cards */}
                          <div className="absolute inset-0 rounded-3xl pointer-events-none ring-1 ring-[#ff6600]/30" />

                          {/* Borda laranja mais forte no hover */}
                          <div className={`absolute inset-0 rounded-3xl pointer-events-none transition-all duration-500 ${
                            !isDragging && !isReorderMode ? 'group-hover:ring-2 group-hover:ring-[#ff6600]/60' : ''
                          }`} />

                          {/* Barra inferior animada */}
                          <div className={`absolute bottom-0 left-0 h-[3px] bg-[#ff6600] shadow-[0_0_15px_#ff6600] transition-all duration-700 ${
                            isPressed || isDragging || isPhotoSelected ? 'w-full' : 'w-0 group-hover:w-full'
                          }`} />

                          {/* Topo direito: handle drag OU menu */}
                          <div
                            className="absolute top-4 right-4 z-20"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {isReorderMode ? (
                              <div
                                {...dragListeners}
                                className="w-9 h-9 rounded-xl bg-black/60 backdrop-blur-sm border border-white/15 text-white flex items-center justify-center cursor-grab active:cursor-grabbing touch-none select-none hover:border-[#ff6600]/50 hover:text-[#ff6600] transition-all duration-300"
                                style={{ touchAction: 'none' }}
                              >
                                <GripVertical size={16} />
                              </div>
                            ) : (
                              <DayMenu
                                onEdit={() => {
                                  setEditingDayIdx(dIdx);
                                  setTempDayName(day.name);
                                }}
                                onChangePhoto={() => setPhotoPickerIdx(dIdx)}
                                onDelete={() =>
                                  setConfirmTarget({
                                    type: 'day',
                                    planId,
                                    dayName: day.name,
                                  })
                                }
                                isGenerated={isGenerated}
                              />
                            )}
                          </div>

                          {/* Rodapé: nome + contador + botão entrar */}
                          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 flex items-end justify-between gap-4">
                            <div className="min-w-0 overflow-hidden">
                              <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] mb-2 transition-all duration-300 group-hover:text-white/70 truncate">
                                {exerciseCount}{' '}
                                {exerciseCount === 1 ? 'EXERCÍCIO' : 'EXERCÍCIOS'}
                              </p>
                              <h3 className="text-xl sm:text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-white leading-tight break-words drop-shadow-lg transition-all duration-300 max-w-[85%]">
  {day.name}
</h3>
                            </div>

                            {!isReorderMode && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedDay({ day, dayIndex: dIdx });
                                }}
                                className="flex-shrink-0 w-12 h-12 rounded-full bg-[#ff6600] text-black flex items-center justify-center shadow-[0_0_24px_rgba(255,102,0,0.55)] hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] active:scale-90 transition-all duration-300 group/btn"
                              >
                                <ChevronRight
                                  size={20}
                                  strokeWidth={3}
                                  className="translate-x-px group-hover/btn:translate-x-1 transition-transform duration-200"
                                />
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </DiaSortableItem>
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>

        </div>
      </div>
    </>
  );
};