import React from 'react';
import { 
  Dumbbell, Zap, Flame, Heart, Star, Crown, Anchor, Gem,
  Plus, ChevronRight, Activity, Trophy, Clock, ArrowLeft
} from 'lucide-react';
import { PlanDetailsView, MetricsGrid, MetricsGridAuto } from '../components';
import api from '../services/api';

export const AppViews = ({ 
  activeTab,
  selectedPlan,
  setSelectedPlan,
  completedExercises,
  toggleCheck,
  handleDeletePlan,
  onOpenAddExercisePage,
  onOpenEditExercisePage,
  onOpenEditPRPage,
  onOpenAddDayPage,
  onOpenPRPage,
  onOpenImportPage,
  handleDeleteExercise,
  onUpdatePlanName,
  onUpdateDayName,
  onUpdateExercise,
  onAddExercise,
  onReorderDays,
  onAddDay,
  onDeleteDay,
  onFinishWorkout,
  onClearDayExercises,
  onForceRefresh,
  handleDeleteGeneratedWorkout,
  stats,
  plans,
  generatedWorkouts,
  history,
  onOpenResetHistoryPage,
  finalResetAction,
  fetchPlans,
  setSelectedExerciseHistory,
  selectedExerciseHistory,
  visiblePlans,
  setVisiblePlans,
  visibleWorkouts,
  setVisibleWorkouts,
  activeManualCard,
  setActiveManualCard,
  activeAutoCard,
  setActiveAutoCard,
  showCreatePlan,
  setShowCreatePlan,
  isGeneratingCustom,
  setIsGeneratingCustom,
  isTransitioning,
  setView
}) => {
  // Dashboard - Planos Manuais
  if (activeTab === 'dashboard') {
    if (selectedPlan) {
      return (
        <PlanDetailsView
          plan={selectedPlan}
          onBack={() => setSelectedPlan(null)}
          completedExercises={completedExercises}
          toggleCheck={toggleCheck}
          onDeletePlan={handleDeletePlan}
          onOpenAddExercisePage={onOpenAddExercisePage}
          onOpenEditExercisePage={onOpenEditExercisePage}
          onOpenEditPRPage={onOpenEditPRPage}
          onOpenAddDayPage={onOpenAddDayPage}
          onDeleteExercise={handleDeleteExercise}
          onUpdatePlanName={onUpdatePlanName}
          onUpdateDayName={onUpdateDayName}
          onUpdateExercise={onUpdateExercise}
          onAddExercise={onAddExercise}
          onReorderDays={onReorderDays}
          onAddDay={onAddDay}
          onDeleteDay={onDeleteDay}
          onFinishWorkout={onFinishWorkout}
          onClearDayExercises={onClearDayExercises}
          onForceRefresh={onForceRefresh}
        />
      );
    }

    return (
      <>
        <div className="space-y-10 animate-in fade-in duration-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
            <div className="space-y-1 -mt-[-35px]">
              <div className="text-[#ff6600] drop-shadow-[0_0_15px_rgba(255,102,0,0.2)] font-black italic uppercase tracking-tighter text-4xl leading-none">
                PLANOS <br /> DE TREINOS
              </div>
              <p className="text-[11px] font-bold text-white/85 uppercase tracking-[0.4em]">
                Crie treinos manuais e <br/> acompanhe sua evolução
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCreatePlan(true)}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-[#ff6600] transition-all shadow-xl active:scale-95"
              >
                <Plus size={16} strokeWidth={3} /> Criar treino
              </button>
              <button
                onClick={() => onOpenImportPage(fetchPlans)}
                className="p-3 rounded-2xl bg-white text-black hover:bg-[#ff6600] hover:text-black transition-all active:scale-95"
                title="Importar plano"
              >
                <svg width="25" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
                  <polyline points="8 12 12 16 16 12" />
                  <line x1="12" y1="2" x2="12" y2="16" />
                </svg>
              </button>
            </div>
          </div>

          <MetricsGrid stats={stats} plans={plans} generatedWorkouts={generatedWorkouts} onOpenPRPage={onOpenPRPage} />

          <div className="space-y-6">
            {plans.length === 0 ? (
              <div className="bg-white/[0.02] border-2 border-dashed border-white/5 rounded-[2.5rem] min-h-[400px] flex flex-col items-center justify-center p-12 text-center space-y-6 backdrop-blur-sm">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-gray-700">
                  <Zap size={32} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">Sem Planos de treino</h2>
                  <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em] max-w-xs">Clique no botão acima para criar um plano de treino manualmente</p>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full px-2">
                  {plans.slice(0, visiblePlans).map((plan, idx) => {
                    const decorativeIcons = [Dumbbell, Zap, Flame, Heart, Star, Crown, Anchor, Gem];
                    const DecorativeIcon = decorativeIcons[idx % decorativeIcons.length];
                    const planId = plan._id || plan.id;
                    const isActive = activeManualCard === planId;

                    return (
                      <div
                        key={planId || `temp-${idx}`}
                        onClick={() => setActiveManualCard(isActive ? null : planId)}
                        className={`group relative p-8 rounded-[2.5rem] border transition-all duration-500 overflow-hidden cursor-pointer min-h-[220px] flex flex-col justify-end animate-in fade-in zoom-in w-full
                          ${isActive ? 'scale-[1.02] border-[#ff6600] shadow-[0_0_30px_rgba(255,102,0,0.2)]' : 'border-[#ff6600]/10 hover:border-[#ff6600]/30 shadow-xl'}`}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br from-[#0a0a0a] transition-colors duration-500 ${isActive ? 'via-[#2a1000] to-[#3d1a00]' : 'via-[#1a0a00] to-[#2a1000]'}`} />
                        <div className={`absolute -right-8 -top-8 transition-all duration-700 transform rotate-12 ${isActive ? 'text-[#ff6600]/[0.12] scale-110' : 'text-[#ff6600]/[0.04]'}`}>
                          <DecorativeIcon size={240} strokeWidth={1} />
                        </div>
                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-300 ${isActive ? 'bg-[#ff6600] shadow-[0_0_15px_#ff6600]' : 'bg-[#ff6600]/20'}`} />
                        <div className={`absolute bottom-0 left-0 h-[3px] bg-[#ff6600] shadow-[0_0_15px_#ff6600] transition-all duration-700 ${isActive ? 'w-full' : 'w-0'}`} />
                        <div className="space-y-4 relative z-10">
                          <div className="space-y-1">
                            <div className={`w-12 h-1.5 rounded-full mb-4 transition-all duration-500 ${isActive ? 'bg-[#ff6600] shadow-[0_0_15px_#ff6600]' : 'bg-white/10'}`}></div>
                            <h3 className={`text-2xl font-black italic uppercase tracking-tighter leading-none transition-colors ${isActive ? 'text-[#ff6600]' : 'text-white'}`}>
                              {plan.name}
                            </h3>
                          </div>
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Arquitetura</span>
                              <span className="text-xs font-bold text-white">{plan.daysCount} DIAS DE TREINO</span>
                            </div>
                            <div onClick={(e) => { e.stopPropagation(); setSelectedPlan(plan); }} className={`w-12 h-12 rounded-2xl border transition-all duration-200 flex items-center justify-center shadow-lg active:scale-125 ${isActive ? 'bg-[#ff6600] border-[#ff6600] text-black scale-110' : 'bg-black border-white/5 text-gray-500'}`}>
                              <ChevronRight size={24} strokeWidth={3} className="transition-transform duration-200" />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {plans.length > 6 && (
                  <div className="flex justify-center mt-6">
                    <div onClick={() => setVisiblePlans(visiblePlans === 6 ? plans.length : 6)} className="text-gray-500 hover:text-[#ff5500] hover:scale-105 active:scale-95 transition-all cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-black uppercase tracking-wider">
                          {visiblePlans === 6 ? `Exibir mais (${plans.length - 6})` : 'Exibir menos'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* FOOTER DASHBOARD */}
        {!selectedPlan && (
         <footer className="mt-1 mb-9 py-6 border-t border-transparent">
  <div className="text-center">
    <p className="text-[8px] font-black italic text-gray-600 uppercase tracking-[0.2em]">
      © {new Date().getFullYear()} Geovani Rodrigues <span className="text-white inline-block mx-1">·</span> Super Frango App
    </p>
    <div className="flex items-center justify-center gap-6 mt-3">
      <a
        href="https://github.com/Geovanni-dev"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-[9px] font-bold text-gray-500 active:text-white active:scale-110 transition-all duration-200 group"
      >
        <svg className="active:scale-110 transition-transform" height="12" width="12" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
        </svg>
        GitHub
      </a>

      <a
        href="https://www.linkedin.com/in/geovani-rodrigues-dev/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-[9px] font-bold text-gray-500 active:text-[#0077b5] active:scale-110 transition-all duration-200 group"
      >
        <svg className="active:scale-110 transition-transform" height="12" width="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.771-.773 1.771-1.729V1.729C24 .774 23.208 0 22.225 0z" />
        </svg>
        LinkedIn
      </a>

      <a
        href="https://wa.me/5562984585485"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-[9px] font-bold text-gray-500 active:text-[#25D366] active:scale-110 transition-all duration-200 group"
      >
        <svg className="active:scale-110 transition-transform" height="12" width="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.51 3.45 1.47 4.92L2 22l5.35-1.43c1.43.86 3.07 1.32 4.76 1.32 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.12c-1.49 0-2.95-.4-4.21-1.16l-.3-.18-3.18.85.85-3.09-.19-.31c-.82-1.32-1.25-2.83-1.25-4.37 0-4.56 3.71-8.27 8.27-8.27 4.56 0 8.27 3.71 8.27 8.27s-3.71 8.28-8.27 8.28zm4.53-6.19c-.25-.13-1.47-.73-1.7-.81-.23-.08-.39-.13-.56.13s-.64.81-.78.97c-.14.16-.28.18-.53.05-.25-.13-1.05-.39-2-1.24-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.39.11-.52.11-.11.25-.29.38-.44.13-.15.17-.25.26-.42.09-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43-.14-.01-.31-.01-.48-.01-.17 0-.44.06-.67.32-.23.26-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.71 4.3 3.8 2.53 1.09 2.53.73 2.99.68.46-.05 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.11-.21-.18-.46-.31z" />
        </svg>
        WhatsApp
      </a>
    </div>
  </div>
          </footer>
        )}
      </>
    );
  }

  // Generator - Planos Automáticos
  if (activeTab === 'generator') {
    if (selectedPlan) {
      return (
        <PlanDetailsView
          plan={selectedPlan}
          onBack={() => setSelectedPlan(null)}
          completedExercises={completedExercises}
          toggleCheck={toggleCheck}
          onDeletePlan={handleDeleteGeneratedWorkout}
          onOpenEditPRPage={onOpenEditPRPage}
          onDeleteExercise={handleDeleteExercise}
          onUpdatePlanName={onUpdatePlanName}
          onUpdateDayName={onUpdateDayName}
          onUpdateExercise={onUpdateExercise}
          onAddExercise={onAddExercise}
          onReorderDays={onReorderDays}
          onAddDay={onAddDay}
          onDeleteDay={onDeleteDay}
          onFinishWorkout={onFinishWorkout}
          onClearDayExercises={onClearDayExercises}
          onForceRefresh={onForceRefresh}
          isGenerated={true}
        />
      );
    }

    return (
      <>
        <div className="space-y-10 animate-in fade-in duration-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
            <div className="space-y-1 -mt-[-35px]">
              <div className="text-[#ff6600] drop-shadow-[0_0_15px_rgba(255,102,0,0.2)] font-black italic uppercase tracking-tighter text-4xl leading-none">
                TREINOS <br /> AUTOMÁTICOS
              </div>
              <p className="text-[11px] font-bold text-white/85 uppercase tracking-[0.4em]">
                TREINOS GERADOS COM BASE NA BIOMECÂNICA DO SEU OBJETIVO
              </p>
            </div>
            <div className="inline-block">
              <button onClick={() => setIsGeneratingCustom(!isGeneratingCustom)} className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-[#ff6600] transition-all shadow-xl active:scale-95 whitespace-nowrap">
                <Zap size={16} strokeWidth={2} /> Gerar TREINO
              </button>
            </div>
          </div>

          <MetricsGridAuto stats={stats} plans={plans} generatedWorkouts={generatedWorkouts} onOpenPRPage={onOpenPRPage} />

          <div className="space-y-6">
            {generatedWorkouts.length === 0 ? (
              <div className="bg-white/[0.02] border-2 border-dashed border-white/5 rounded-[2.5rem] min-h-[400px] flex flex-col items-center justify-center p-12 text-center space-y-6 backdrop-blur-sm mx-2">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-gray-700">
                  <Zap size={32} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">SEM TREINOS <br /> GERADOS</h2>
                  <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em] max-w-xs">Clique no botão acima para gerar um treino automático</p>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full px-2">
                  {generatedWorkouts.slice(0, visibleWorkouts).map((workout, idx) => {
                    const decorativeIcons = [Dumbbell, Zap, Flame, Heart, Star, Crown, Anchor, Gem];
                    const DecorativeIcon = decorativeIcons[idx % decorativeIcons.length];
                    const workoutId = workout._id || workout.id;
                    const isActive = activeAutoCard === workoutId;

                    return (
                      <div
                        key={workoutId || idx}
                        onClick={() => setActiveAutoCard(isActive ? null : workoutId)}
                        className={`group relative p-8 rounded-[2.5rem] border transition-all duration-500 overflow-hidden cursor-pointer min-h-[220px] flex flex-col justify-end w-full
                          ${isActive ? 'scale-[1.02] border-[#ff6600] shadow-[0_0_30px_rgba(255,102,0,0.2)]' : 'border-[#ff6600]/10 hover:border-[#ff6600]/30 shadow-xl'}`}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br from-[#0a0a0a] transition-colors duration-500 ${isActive ? 'via-[#2a1000] to-[#3d1a00]' : 'via-[#1a0a00] to-[#2a1000]'}`} />
                        <div className={`absolute -right-8 -top-8 transition-all duration-700 transform rotate-12 ${isActive ? 'text-[#ff6600]/[0.12] scale-110' : 'text-[#ff6600]/[0.04]'}`}>
                          <DecorativeIcon size={240} strokeWidth={1} />
                        </div>
                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-300 ${isActive ? 'bg-[#ff6600] shadow-[0_0_15px_#ff6600]' : 'bg-[#ff6600]/20'}`} />
                        <div className={`absolute bottom-0 left-0 h-[3px] bg-[#ff6600] shadow-[0_0_15px_#ff6600] transition-all duration-700 ${isActive ? 'w-full' : 'w-0'}`} />
                        <div className="space-y-4 relative z-10">
                          <div className="space-y-1">
                            <div className={`w-12 h-1.5 rounded-full mb-4 transition-all duration-500 ${isActive ? 'bg-[#ff6600] shadow-[0_0_15px_#ff6600]' : 'bg-white/10'}`}></div>
                            <h3 className={`text-2xl font-black italic uppercase tracking-tighter leading-none transition-colors ${isActive ? 'text-[#ff6600]' : 'text-white'}`}>
                              {workout.name}
                            </h3>
                          </div>
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Treino Gerado</span>
                              <span className="text-xs font-bold text-white uppercase">{workout.goal} • {workout.daysCount} DIAS</span>
                            </div>
                            <div onClick={(e) => { e.stopPropagation(); setSelectedPlan(workout); }} className={`w-12 h-12 rounded-2xl border transition-all duration-200 flex items-center justify-center shadow-lg active:scale-125 ${isActive ? 'bg-[#ff6600] border-[#ff6600] text-black scale-110' : 'bg-black border-white/5 text-gray-500'}`}>
                              <ChevronRight size={24} strokeWidth={3} />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {generatedWorkouts.length > 6 && (
                  <div className="flex justify-center mt-6">
                    <div onClick={() => setVisibleWorkouts(visibleWorkouts === 6 ? generatedWorkouts.length : 6)} className="text-gray-500 hover:text-[#ff5500] hover:scale-105 active:scale-95 transition-all cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-black uppercase tracking-wider">
                          {visibleWorkouts === 6 ? `Exibir mais (${generatedWorkouts.length - 6})` : 'Exibir menos'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* FOOTER GENERATOR */}
        <footer className="mt-1 mb-9 py-6 border-t border-transparent">
  <div className="text-center">
    <p className="text-[8px] font-black italic text-gray-600 uppercase tracking-[0.2em]">
      © {new Date().getFullYear()} Geovani Rodrigues <span className="text-white inline-block mx-1">·</span> Super Frango App
    </p>
    <div className="flex items-center justify-center gap-6 mt-3">
      <a
        href="https://github.com/Geovanni-dev"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-[9px] font-bold text-gray-500 active:text-white active:scale-110 transition-all duration-200 group"
      >
        <svg className="active:scale-110 transition-transform" height="12" width="12" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
        </svg>
        GitHub
      </a>

      <a
        href="https://www.linkedin.com/in/geovani-rodrigues-dev/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-[9px] font-bold text-gray-500 active:text-[#0077b5] active:scale-110 transition-all duration-200 group"
      >
        <svg className="active:scale-110 transition-transform" height="12" width="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.771-.773 1.771-1.729V1.729C24 .774 23.208 0 22.225 0z" />
        </svg>
        LinkedIn
      </a>

      <a
        href="https://wa.me/5562984585485"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-[9px] font-bold text-gray-500 active:text-[#25D366] active:scale-110 transition-all duration-200 group"
      >
        <svg className="active:scale-110 transition-transform" height="12" width="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.51 3.45 1.47 4.92L2 22l5.35-1.43c1.43.86 3.07 1.32 4.76 1.32 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.12c-1.49 0-2.95-.4-4.21-1.16l-.3-.18-3.18.85.85-3.09-.19-.31c-.82-1.32-1.25-2.83-1.25-4.37 0-4.56 3.71-8.27 8.27-8.27 4.56 0 8.27 3.71 8.27 8.27s-3.71 8.28-8.27 8.28zm4.53-6.19c-.25-.13-1.47-.73-1.7-.81-.23-.08-.39-.13-.56.13s-.64.81-.78.97c-.14.16-.28.18-.53.05-.25-.13-1.05-.39-2-1.24-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.39.11-.52.11-.11.25-.29.38-.44.13-.15.17-.25.26-.42.09-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43-.14-.01-.31-.01-.48-.01-.17 0-.44.06-.67.32-.23.26-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.71 4.3 3.8 2.53 1.09 2.53.73 2.99.68.46-.05 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.11-.21-.18-.46-.31z" />
        </svg>
        WhatsApp
      </a>
    </div>
  </div>
         </footer>
      </>
    );
  }

  // History - Evolução
  if (activeTab === 'history') {
    return (
      <>
        <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in duration-500 px-2 pb-10 -mt-[-35px]">
          <div className="text-center space-y-2 relative flex flex-col items-center">
            <h1 className="text-5xl font-black italic uppercase tracking-tighter text-[#ff6600]">EVOLUÇÃO</h1>
            <p className="text-gray-500 font-bold uppercase text-xs tracking-[0.3em]">Seu registro de força</p>
            {history.length > 0 && (
              <div className="mt-2 md:absolute md:top-0 md:right-0 md:mt-0">
                <span onClick={() => onOpenResetHistoryPage(finalResetAction)} className="text-[10px] font-bold text-red-500/50 hover:text-red-500 transition-colors cursor-pointer uppercase tracking-widest">
                  Limpar histórico
                </span>
              </div>
            )}
          </div>

          {history.length === 0 ? (
            <div className="py-20 text-center space-y-6 bg-white/[0.02] border-2 border-dashed border-white/5 rounded-[2.5rem]">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-gray-700 mx-auto"><Activity size={32} /></div>
              <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em]">Ainda não há histórico de exercicios.</p>
            </div>
          ) : (
            (() => {
              const groupedHistory = history.reduce((groups, log) => {
                const workoutName = log.workoutName ? log.workoutName.split(' - ')[1] : 'TREINO';
                if (!groups[workoutName]) groups[workoutName] = [];
                groups[workoutName].push(log);
                return groups;
              }, {});

              return Object.entries(groupedHistory).map(([workoutName, logs], groupIdx) => (
                <div key={groupIdx} className="space-y-4 mb-8">
                  <div className="flex items-center gap-2 px-2">
                    <div className="h-px flex-grow bg-[#ff6600]/20"></div>
                    <h2 className="text-sm sm:text-base font-black italic uppercase tracking-wider text-[#ff6600] px-3">{workoutName}</h2>
                    <div className="h-px flex-grow bg-[#ff6600]/20"></div>
                  </div>
                  <div className="space-y-3">
                    {logs.map((log, idx) => (
                      <div key={idx} onClick={async () => { try { const res = await api.get(`/workouts/history/${encodeURIComponent(log.exerciseName || log.name)}`); setSelectedExerciseHistory({ name: log.exerciseName || log.name, logs: res.data }); } catch (e) { console.error(e); } }} className="group relative p-4 rounded-2xl bg-black/1 backdrop-blur-sm border border-white/10 hover:border-[#ff6600]/60 transition-all flex items-center justify-between overflow-hidden cursor-pointer shadow-2xl">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ff6600]/10 group-hover:bg-[#ff6600] transition-all"></div>
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-[#ff6600]/5 flex items-center justify-center text-[#ff6600] group-hover:bg-[#ff6600] group-hover:text-black transition-all shadow-lg flex-shrink-0"><Trophy size={18} /></div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm sm:text-base font-black italic uppercase text-white leading-tight group-hover:text-[#ff6600] transition-colors overflow-hidden text-ellipsis whitespace-nowrap">{log.exerciseName || log.name}</h3>
                            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{new Date(log.date).toLocaleString('pt-BR')}</p>
                          </div>
                        </div>
                        <div className="text-right flex items-center gap-3 flex-shrink-0">
                          <div className="flex flex-col items-end">
                            <p className="text-xl font-black italic text-[#ff6600] leading-none">{log.weight}<span className="text-xs">KG</span></p>
                            <p className="text-[9px] font-black uppercase text-gray-600">{log.reps} Reps</p>
                          </div>
                          <ChevronRight className="text-gray-800 group-hover:text-[#ff6600] transition-colors" size={16} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ));
            })()
          )}
        </div>

        {/* FOOTER HISTORY */}
       <footer className="mt-1 mb-9 py-6 border-t border-transparent">
  <div className="text-center">
    <p className="text-[8px] font-black italic text-gray-600 uppercase tracking-[0.2em]">
      © {new Date().getFullYear()} Geovani Rodrigues <span className="text-white inline-block mx-1">·</span> Super Frango App
    </p>
    <div className="flex items-center justify-center gap-6 mt-3">
      <a
        href="https://github.com/Geovanni-dev"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-[9px] font-bold text-gray-500 active:text-white active:scale-110 transition-all duration-200 group"
      >
        <svg className="active:scale-110 transition-transform" height="12" width="12" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
        </svg>
        GitHub
      </a>

      <a
        href="https://www.linkedin.com/in/geovani-rodrigues-dev/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-[9px] font-bold text-gray-500 active:text-[#0077b5] active:scale-110 transition-all duration-200 group"
      >
        <svg className="active:scale-110 transition-transform" height="12" width="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.771-.773 1.771-1.729V1.729C24 .774 23.208 0 22.225 0z" />
        </svg>
        LinkedIn
      </a>

      <a
        href="https://wa.me/5562984585485"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-[9px] font-bold text-gray-500 active:text-[#25D366] active:scale-110 transition-all duration-200 group"
      >
        <svg className="active:scale-110 transition-transform" height="12" width="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.51 3.45 1.47 4.92L2 22l5.35-1.43c1.43.86 3.07 1.32 4.76 1.32 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.12c-1.49 0-2.95-.4-4.21-1.16l-.3-.18-3.18.85.85-3.09-.19-.31c-.82-1.32-1.25-2.83-1.25-4.37 0-4.56 3.71-8.27 8.27-8.27 4.56 0 8.27 3.71 8.27 8.27s-3.71 8.28-8.27 8.28zm4.53-6.19c-.25-.13-1.47-.73-1.7-.81-.23-.08-.39-.13-.56.13s-.64.81-.78.97c-.14.16-.28.18-.53.05-.25-.13-1.05-.39-2-1.24-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.39.11-.52.11-.11.25-.29.38-.44.13-.15.17-.25.26-.42.09-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43-.14-.01-.31-.01-.48-.01-.17 0-.44.06-.67.32-.23.26-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.71 4.3 3.8 2.53 1.09 2.53.73 2.99.68.46-.05 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.11-.21-.18-.46-.31z" />
        </svg>
        WhatsApp
      </a>
    </div>
  </div>
       </footer>
      </>
    );
  }

  return null;
};