import React from 'react';
import { ArrowLeft, Plus, X, Dumbbell, Zap, Activity, Clock } from 'lucide-react';
import { DayAccordion, InputField } from '../components';

export const ModalsViews = ({ 
  showCreatePlan,
  setShowCreatePlan,
  formPlan,
  onPlanSubmit,
  dayFields,
  appendDay,
  removeDay,
  isManualInfoActive,
  setIsManualInfoActive,
  loading,
  isGeneratingCustom,
  setIsGeneratingCustom,
  selectedGoal,
  setSelectedGoal,
  formGenerate,
  onGenerateSubmit,
  isAutoInfoActive,
  setIsAutoInfoActive,
  selectedExerciseHistory,
  setSelectedExerciseHistory,
  api
}) => {
  // Modal Criar Plano Manual
  if (showCreatePlan) {
    return (
      <div className="fixed inset-0 z-[500] bg-black/95 backdrop-blur-xl overflow-y-auto">
        <div className="min-h-full flex flex-col items-center p-4">
          <div className="w-full max-w-[380px] flex flex-col">
            <div className="flex items-center gap-3 pt-2 sm:pt-24 -ml-5">
              <button onClick={() => setShowCreatePlan(false)} className="text-gray-500 hover:text-white transition-colors p-1">
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-4xl sm:text-6xl font-black italic uppercase tracking-tighter text-white leading-none drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                  CRIAR <br /> TREINOs <span className="text-[#ff6600] drop-shadow-[0_0_15px_rgba(255,102,0,0.0)]"><br /> MANUAIS</span>
                </h1>
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mt-4">
                  CRIAÇÃO MANUAL PARA FRANGOS DE ELITE
                </p>
              </div>
            </div>

            <form onSubmit={formPlan.handleSubmit(onPlanSubmit)} className="w-full">
              <div className="mt-[25px] p-6 rounded-[2.5rem] bg-[#0a0a0a] border border-white/30 space-y-6 shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-black italic uppercase tracking-tighter text-white">DADOS DO PLANO</h3>
                </div>

                <InputField
                  label="NOME DO PLANO"
                  placeholder="Ex: PPL UPPER LOWER"
                  autoComplete="off"
                  {...formPlan.register('name')}
                  error={formPlan.formState.errors.name?.message}
                />

                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-[10px] font-black italic uppercase text-white tracking-widest">TREINOS</h2>
                    <button
                      type="button"
                      onClick={() => appendDay({ name: '', exercises: [] })}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 text-[9px] font-black uppercase text-[#ff6600] border border-[#ff6600]/20 hover:bg-[#ff6600]/10 hover:border-[#ff6600]/40 transition-all"
                    >
                      <Plus size={14} /> Adicionar Dia
                    </button>
                  </div>
                  <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-1 no-scrollbar">
                    {dayFields.map((day, index) => (
                      <DayAccordion key={day.id} dayIndex={index} register={formPlan.register} removeDay={removeDay} control={formPlan.control} />
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <button disabled={loading} type="submit" className="w-full py-4 rounded-2xl bg-[#ff6600] text-black text-[12px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(255,102,0,0.9)] active:scale-95 transition-all">
                    {loading ? 'SINCRONIZANDO...' : 'CRIAR PLANO'}
                  </button>
                </div>
              </div>
            </form>

            <div onClick={() => setIsManualInfoActive(!isManualInfoActive)} className={`group relative mt-12 p-4 rounded-2xl bg-white/[0.03] backdrop-blur-sm border transition-all duration-500 shadow-2xl overflow-hidden cursor-pointer ${isManualInfoActive ? 'border-[#ff6600]/60 scale-[1.01] bg-white/[0.06]' : 'border-white/10 hover:border-white/20'}`}>
              <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 ${isManualInfoActive ? 'bg-[#ff6600] shadow-[0_0_15px_#ff6600]' : 'bg-[#ff6600]/10'}`} />
              <div className="flex items-center gap-4 relative z-10">
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-300 flex-shrink-0 ${isManualInfoActive ? 'bg-[#ff6600] text-black border-[#ff6600] shadow-[0_0_10px_#ff6600]' : 'bg-white/[0.03] border-white/5 text-gray-500'}`}>
                  <Dumbbell size={16} />
                </div>
                <div className="flex-1">
                  <p className={`text-[12px] font-bold uppercase tracking-[0.15em] leading-tight transition-colors duration-300 ${isManualInfoActive ? 'text-white' : 'text-gray-400'}`}>
                    Planos manuais <span className="text-[#ff6600]">sob medida</span>. Monte sua estrutura, depois preencha com os exercícios.
                  </p>
                </div>
              </div>
              <div className={`absolute bottom-0 left-0 h-[2px] bg-[#ff6600] shadow-[0_0_15px_#ff6600] transition-all duration-700 ${isManualInfoActive ? 'w-full' : 'w-0'}`} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Modal Gerar Treino Automático
  if (isGeneratingCustom) {
    return (
      <div className="fixed inset-0 z-[500] bg-black/95 backdrop-blur-xl overflow-y-auto">
        <div className="min-h-full flex flex-col items-center p-4">
          <div className="w-full max-w-[380px] flex flex-col">
            <div className="flex items-center gap-3 pt-1 sm:pt-24 -ml-5">
              <button onClick={() => setIsGeneratingCustom(false)} className="text-gray-500 hover:text-white transition-colors p-1">
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-4xl sm:text-6xl font-black italic uppercase tracking-tighter text-white leading-none drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                  GERAR <br />TREINOs <span className="text-[#ff6600] drop-shadow-[0_0_15px_rgba(255,102,0,0.0)]"><br /> AUTOMÁTICOs</span>
                </h1>
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mt-4">
                  PLANOS AUTOMÁTICOS PARA FRANGOS INICIANTES
                </p>
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); onGenerateSubmit(); }} className="w-full">
              <div className="mt-[25px] p-6 rounded-[2.5rem] bg-[#0a0a0a] border border-white/30 space-y-6 shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-black italic uppercase tracking-tighter text-white">OBJETIVO E DIAS</h3>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {['hipertrofia', 'força', 'resistência'].map((goal) => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => setSelectedGoal(goal)}
                      className={`py-4 rounded-2xl border-2 font-black italic uppercase text-[11px] tracking-tighter transition-all ${selectedGoal === goal ? 'bg-[#ff6600] border-[#ff6600] text-black shadow-[0_0_15px_rgba(255,102,0,0.9)]' : 'bg-black/40 border-white/10 text-gray-500 hover:border-white/20'}`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between bg-black/40 p-1.5 rounded-2xl border border-white/10">
                  {[2, 3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => formGenerate.setValue('days', num)}
                      className={`w-10 h-10 rounded-xl font-black italic text-sm transition-all ${formGenerate.watch('days') === num ? 'bg-white text-black scale-105 shadow-lg' : 'text-gray-500 hover:text-white'}`}
                    >
                      {num}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <button disabled={loading} type="submit" className="w-full py-4 rounded-2xl bg-[#ff6600] text-black text-[12px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(255,102,0,0.9)] active:scale-95 transition-all flex items-center justify-center gap-2">
                    {loading ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <><Zap size={14} /> GERAR PLANO</>}
                  </button>
                </div>
              </div>
            </form>

            <div onClick={() => setIsAutoInfoActive(!isAutoInfoActive)} className={`group relative mt-6 p-4 rounded-2xl bg-white/[0.03] backdrop-blur-sm border transition-all duration-500 shadow-2xl overflow-hidden cursor-pointer ${isAutoInfoActive ? 'border-[#ff6600]/60 scale-[1.01] bg-white/[0.06]' : 'border-white/10 hover:border-white/20'}`}>
              <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 ${isAutoInfoActive ? 'bg-[#ff6600] shadow-[0_0_15px_#ff6600]' : 'bg-[#ff6600]/10'}`} />
              <div className="flex items-center gap-4 relative z-10">
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-300 flex-shrink-0 ${isAutoInfoActive ? 'bg-[#ff6600] text-black border-[#ff6600] shadow-[0_0_10px_#ff6600]' : 'bg-white/[0.03] border-white/5 text-gray-500'}`}>
                  <Zap size={16} />
                </div>
                <div className="flex-1">
                  <p className={`text-[12px] font-bold uppercase tracking-[0.15em] leading-tight transition-colors duration-300 ${isAutoInfoActive ? 'text-white' : 'text-gray-400'}`}>
                    Treinos automatizados de <span className="text-[#ff6600]">alta performance</span>. Escolha seu objetivo e dias para gerar um plano de treino automático.
                  </p>
                </div>
              </div>
              <div className={`absolute bottom-0 left-0 h-[2px] bg-[#ff6600] shadow-[0_0_15px_#ff6600] transition-all duration-700 ${isAutoInfoActive ? 'w-full' : 'w-0'}`} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Modal Histórico do Exercício
  if (selectedExerciseHistory) {
    return (
      <div className="fixed inset-0 z-[99999] bg-black flex flex-col overflow-y-auto">
        <div className="flex-1 px-6 pb-20 pt-21 sm:pt-24">
          <div className="max-w-md mx-auto">
            <div className="mb-12 text-left relative flex items-start gap-3 -ml-1">
              <button onClick={() => setSelectedExerciseHistory(null)} className="text-gray-500 hover:text-white transition-colors pt-1">
                <ArrowLeft size={24} />
              </button>
              <div className="flex-1">
                <h1 className="text-4xl sm:text-6xl font-black italic uppercase tracking-tighter text-white leading-none drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                  {selectedExerciseHistory.name}<br />
                  <span className="text-[#ff6600] drop-shadow-none">HISTÓRICO</span>
                </h1>
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mt-4">
                  ANÁLISE DE EVOLUÇÃO DE CARGA
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {selectedExerciseHistory.logs.map((h, idx) => (
                <div key={idx} className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 text-center relative overflow-hidden shadow-2xl">
                  <div className="absolute top-6 right-6">
                    <div className="bg-[#ff6600]/10 border border-[#ff6600]/20 rounded-xl px-3 py-1 flex flex-col items-center">
                      <span className="text-xl font-black text-[#ff6600]">{h.reps}</span>
                      <span className="text-[7px] font-bold text-[#ff6600]/60 uppercase -mt-1">REPS</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-black uppercase text-gray-700 tracking-[0.3em] italic mb-4 block">
                    ENTRADA Nº {selectedExerciseHistory.logs.length - idx}
                  </span>
                  <div className="flex items-end justify-center gap-2 mb-6">
                    <span className="text-7xl font-black italic text-[#ff6600] leading-none tracking-tighter" style={{ textShadow: '0 0 30px rgba(255,102,0,0.3)' }}>
                      {h.weight}
                    </span>
                    <span className="text-2xl font-black italic text-gray-800 -mb-1">KG</span>
                  </div>
                  <div className="flex justify-center items-center gap-4 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} className="text-gray-600" />
                      <span className="text-[10px] font-bold text-gray-400 uppercase">{new Date(h.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="w-1 h-1 bg-gray-800 rounded-full"></div>
                    <span className="text-[9px] font-black text-gray-700 uppercase">
                      {new Date(h.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};