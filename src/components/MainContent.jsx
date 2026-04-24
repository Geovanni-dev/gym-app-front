import React, { useState, useEffect, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../services/api';
import {
  loginSchema,
  registerSchema,
  verifySchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  planSchema,
  generateWorkoutSchema,
} from '../schemas';
import { theme } from '../utils/theme';
import { useAuth } from '../context/AuthContext';
import { ChevronRight, Lock, X, LogIn, UserPlus, Mail, User, ShieldCheck } from 'lucide-react';
import {
  StatusMessage,
  Navbar,
  ProfileSideMenu,
  LandingPage,
  InputField,
} from './index';
import { AuthViews } from '../views/AuthViews';
import { AppViews } from '../views/AppViews';
import { ModalsViews } from '../views/ModalsViews';

export const MainContent = ({ 
  onOpenPRPage, 
  onOpenImportPage, 
  onOpenAddExercisePage, 
  onOpenEditExercisePage, 
  onOpenEditPRPage,      
  onOpenResetHistoryPage, 
  onOpenAddDayPage 
}) => {
  const { isAuthenticated, login, logout, user } = useAuth();

  // Estados de navegação
  const [view, setView] = useState(() => localStorage.getItem('@superfrango:view') || 'landing');
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('@superfrango:activeTab') || 'dashboard');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Estados de modais
  const [isManualInfoActive, setIsManualInfoActive] = useState(false);
  const [isAutoInfoActive, setIsAutoInfoActive] = useState(false);
  const [activeAutoCard, setActiveAutoCard] = useState(null);
  const [activeManualCard, setActiveManualCard] = useState(null);
  const [isGeneratingCustom, setIsGeneratingCustom] = useState(false);
  const [showCreatePlan, setShowCreatePlan] = useState(false);
  const [isCreatingPlan, setIsCreatingPlan] = useState(false);
  const [selectedExerciseHistory, setSelectedExerciseHistory] = useState(null);

  // Estados de dados
  const [loading, setLoading] = useState(false);
  const [uiMessage, setUiMessage] = useState({ type: '', text: '' });
  const [tempEmail, setTempEmail] = useState('');
  const [isInternalReset, setIsInternalReset] = useState(false);
  const [plans, setPlans] = useState([]);
  const [generatedWorkouts, setGeneratedWorkouts] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(() => {
    const saved = localStorage.getItem('@superfrango:selectedPlan');
    return saved ? JSON.parse(saved) : null;
  });
  const [history, setHistory] = useState([]);
  const [completedExercises, setCompletedExercises] = useState(() => {
    const saved = localStorage.getItem('@superfrango:completed');
    return saved ? JSON.parse(saved) : {};
  });
  const [selectedGoal, setSelectedGoal] = useState('hipertrofia');
  const [visiblePlans, setVisiblePlans] = useState(6);
  const [visibleWorkouts, setVisibleWorkouts] = useState(6);

  // Formulários
  const formLogin = useForm({ resolver: zodResolver(loginSchema) });
  const formRegister = useForm({ resolver: zodResolver(registerSchema) });
  const formVerify = useForm({ resolver: zodResolver(verifySchema) });
  const formForgot = useForm({ resolver: zodResolver(forgotPasswordSchema) });
  const formReset = useForm({ resolver: zodResolver(resetPasswordSchema) });
  const formChangePassword = useForm({ resolver: zodResolver(changePasswordSchema), mode: 'onChange' });
  const formPlan = useForm({ resolver: zodResolver(planSchema), defaultValues: { name: '', days: [] } });
  const formGenerate = useForm({ resolver: zodResolver(generateWorkoutSchema), defaultValues: { goal: 'hipertrofia', days: 3 } });
  const { fields: dayFields, append: appendDay, remove: removeDay } = useFieldArray({ control: formPlan.control, name: 'days' });

//=============mensagem de erro global
useEffect(() => {
  const handleApiError = (event) => {
    setUiMessage({
      type: 'error',
      text: event.detail.message
    });
  };

  window.addEventListener('apiError', handleApiError);

  return () => {
    window.removeEventListener('apiError', handleApiError);
  };
}, []);


  // ============= Funções de API 
  const fetchPlans = async () => {
    try {
      const response = await api.get('/workout-plans');
      const formattedPlans = response.data.map((p) => ({ ...p, daysCount: p.days?.length || 0 }));
      setPlans(formattedPlans);
      if (selectedPlan && activeTab === 'dashboard' && formattedPlans.some((p) => (p._id || p.id) === (selectedPlan._id || selectedPlan.id))) {
        const updated = formattedPlans.find((p) => (p._id || p.id) === (selectedPlan._id || selectedPlan.id));
        if (updated) setSelectedPlan(updated);
      }
    } catch (e) { console.error('Erro ao carregar planos', e); }
  };

  const fetchGeneratedWorkouts = async () => {
    try {
      const response = await api.get('/workouts/my-workouts');
      const formatted = response.data.map((w) => ({
        ...w,
        name: `PROTOCOLO ${w.goal?.toUpperCase() || 'AUTO'}`,
        daysCount: w.days || 0,
        days: w.split?.map((s) => ({
          name: s.day,
          exercises: s.exercises?.map((ex) => ({
            name: typeof ex === 'string' ? ex : ex.name || ex.exercise || 'Exercício',
            sets: w.sets || 3,
            reps: w.reps || '8-12',
            weight: ex.weight || 0,
          })) || [],
        })) || [],
      }));
      setGeneratedWorkouts(formatted);
      if (selectedPlan && activeTab === 'generator' && formatted.some((w) => (w._id || w.id) === (selectedPlan._id || selectedPlan.id))) {
        const updated = formatted.find((w) => (w._id || w.id) === (selectedPlan._id || selectedPlan.id));
        if (updated) setSelectedPlan(updated);
      }
    } catch (e) { console.error('Erro ao carregar treinos gerados', e); }
  };

  const fetchHistory = async () => {
    try {
      const response = await api.get('/workouts/history');
      setHistory(response.data.data || response.data || []);
    } catch (e) { console.error('Erro ao carregar histórico', e); setHistory([]); }
  };

  const onUpdatePlanName = async (planId, newName) => {
    setLoading(true);
    try { await api.put(`/workout-plans/${planId}/name`, { name: newName }); fetchPlans(); } 
    catch (e) {} finally { setLoading(false); }
  };

const onUpdateDayName = async (planId, oldDayName, newDayName) => {
  setLoading(true);
  try {
    await api.put(`/workout-plans/${planId}/day/${encodeURIComponent(oldDayName)}`, { name: newDayName });
    fetchPlans();
  } catch (e) {
    console.error('Erro ao atualizar nome do dia:', e);
  } finally {
    setLoading(false);
  }
};
  const onUpdateExercise = async (planId, dayName, exerciseName, data, isGenerated = false) => {
    setLoading(true);
    try {
      if (isGenerated) {
        await api.put('/workouts/update-pr', { workoutId: planId, exerciseName: exerciseName, newPR: Number(data.weight) });
      } else {
        await api.put(`/workout-plans/${planId}/${dayName}/${encodeURIComponent(exerciseName)}`, data);
      }
      fetchPlans();
      fetchGeneratedWorkouts();
    } catch (e) { console.error('Erro detalhado:', e.response?.data); } 
    finally { setLoading(false); }
  };

  const onAddExercise = async (planId, dayName, data) => {
    setLoading(true);
    try {
      const response = await api.post(`/workout-plans/${planId}/exercise`, { dayName, ...data });
      if (response.data.workoutPlan) {
        setSelectedPlan(response.data.workoutPlan);
        setPlans(prevPlans => prevPlans.map(p => (p._id || p.id) === planId ? response.data.workoutPlan : p));
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const onAddDay = async (planId, dayName) => {
    setLoading(true);
    try { await api.post(`/workout-plans/${planId}/day`, { name: dayName }); fetchPlans(); } 
    catch (e) {} finally { setLoading(false); }
  };

  const onDeleteDay = async (planId, dayName) => {
    setLoading(true);
    try { await api.delete(`/workout-plans/${planId}/day/${dayName}`); fetchPlans(); } 
    catch (e) {} finally { setLoading(false); }
  };

  const onReorderDays = async (planId, index, direction) => {
    const currentPlan = plans.find((p) => (p._id || p.id) === planId);
    if (!currentPlan) return;
    const newDays = [...currentPlan.days];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newDays[index], newDays[targetIndex]] = [newDays[targetIndex], newDays[index]];
    setLoading(true);
    try { await api.put(`/workout-plans/${planId}/reorder`, { daysOrder: newDays.map((d) => d.name) }); fetchPlans(); } 
    catch (e) {} finally { setLoading(false); }
  };

  const handleDeletePlan = async (planId) => {
    if (loading) return;
    setLoading(true);
    try { await api.delete(`/workout-plans/${planId}`); setSelectedPlan(null); fetchPlans(); } 
    catch (e) {} finally { setLoading(false); }
  };

  const handleDeleteGeneratedWorkout = async (workoutId) => {
    if (loading) return;
    setLoading(true);
    try { await api.delete(`/workouts/${workoutId}`); setSelectedPlan(null); fetchGeneratedWorkouts(); } 
    catch (e) {} finally { setLoading(false); }
  };

  const handleDeleteExercise = async (planId, dayName, exerciseName) => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await api.delete(`/workout-plans/${planId}/${dayName}/${encodeURIComponent(exerciseName)}`);
      if (response.data.workoutPlan) setSelectedPlan(response.data.workoutPlan);
      fetchPlans();
    } catch (e) {} finally { setLoading(false); }
  };

  const toggleCheck = (key) => {
    setCompletedExercises((prev) => {
      if (prev[key]) { const { [key]: removed, ...rest } = prev; return rest; }
      return { ...prev, [key]: { completed: true, timestamp: Date.now() } };
    });
  };

  const onClearDayExercises = (planId, dayIdx) => {
    setCompletedExercises((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((key) => { if (key.startsWith(`${planId}-${dayIdx}-`)) delete newState[key]; });
      return newState;
    });
  };

  const onFinishWorkout = async (plan) => {
    setLoading(true);
    try {
      const planId = plan._id || plan.id;
      const entriesToLog = [];
      plan.days.forEach((day, dIdx) => {
        day.exercises.forEach((ex, eIdx) => {
          const key = `${planId}-${dIdx}-${eIdx}`;
          if (completedExercises[key]) {
            entriesToLog.push({
              name: ex.name,
              reps: Number(ex.reps.split('-')[0]) || 0,
              weight: Number(ex.weight) || 0,
              workoutName: `${plan.name} - ${day.name}`,
            });
          }
        });
      });
      if (entriesToLog.length === 0) return;
      await api.post('/workouts/log', { exercises: entriesToLog });
      const updatedChecks = { ...completedExercises };
      Object.keys(updatedChecks).forEach((k) => { if (k.startsWith(`${planId}-`)) delete updatedChecks[k]; });
      setCompletedExercises(updatedChecks);
      fetchHistory();
    } catch (e) {} finally { setLoading(false); }
  };

  const onForceRefresh = async () => {
    try {
      await Promise.all([fetchPlans(), fetchGeneratedWorkouts(), fetchHistory()]);
      if (selectedPlan) {
        const planId = selectedPlan._id || selectedPlan.id;
        const isGenerator = activeTab === 'generator';
        const source = isGenerator ? generatedWorkouts : plans;
        const updated = source.find(p => (p._id || p.id) === planId);
        if (updated) setSelectedPlan(updated);
      }
    } catch (e) { console.error("Erro ao sincronizar dados:", e); }
  };

  const finalResetAction = async () => {
    setLoading(true);
    try { await api.delete('/workouts/history', { data: { confirm: 'CONFIRM' } }); setHistory([]); } 
    catch (e) { console.error(e); setUiMessage({ type: 'error', text: 'Falha ao limpar histórico.' }); } 
    finally { setLoading(false); }
  };

  const onPlanSubmit = async (data) => {
    setLoading(true);
    try { await api.post('/workout-plans', data); setIsCreatingPlan(false); setShowCreatePlan(false); formPlan.reset(); fetchPlans(); } 
    catch (e) {} finally { setLoading(false); }
  };

  const onGenerateSubmit = async () => {
    setLoading(true);
    try {
      await api.post('/workouts/generate', { goal: selectedGoal, days: Number(formGenerate.getValues('days')) });
      setIsGeneratingCustom(false);
      setTimeout(() => fetchGeneratedWorkouts(), 500);
    } catch (e) { console.error('ERRO na API:', e); } finally { setLoading(false); }
  };

  //============== Funções de Autenticação
  const onLoginSubmit = async (data) => {
  if (loading) return;
  setLoading(true);
  const result = await login(data);
  setLoading(false);
  if (result.success) {
    setIsProfileOpen(false);
    setView('dashboard');
    return;
  }
  if (result.notVerified) {
    setTempEmail(data.email);
    setUiMessage({ 
      type: 'error', 
      text: 'E-mail não verificado! Enviamos um novo código.' 
    });
    setTimeout(() => setView('verify'), 1500);
    return;
  }
  setUiMessage({ 
    type: 'error', 
    text: result.message || 'Email ou senha incorretos' 
  });
};

const onForgotSubmit = async (data) => {
  setLoading(true);
  try {
    await api.post('/users/forgot-password', data);
    setTempEmail(data.email);
    setUiMessage({ type: 'success', text: 'Código enviado para o e-mail!' });
    setView('resetPassword');
  } catch (e) {
    setUiMessage({
      type: 'error',
      text: e.response?.data?.message || 'Erro ao enviar código.'
    });
  } finally {
    setLoading(false);
  }
};

  const onRegisterSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post('/users/register', data);
      setTempEmail(data.email);
      setUiMessage({ type: 'success', text: 'Conta criada! Verifique seu e-mail.' });
      setView('verify');
    } catch (e) { setUiMessage({ type: 'error', text: e.response?.data?.message || 'Falha na conexão.' }); } 
    finally { setLoading(false); }
  };

 const onVerifySubmit = async (data) => {
  setLoading(true);
  try {
    const response = await api.post('/users/verify-email', {
      email: tempEmail,
      code: data.code
    });
    const { token, user } = response.data;
    localStorage.setItem('@superfrango:token', token);
    login({ token, user }); 
    setIsProfileOpen(false);
    setView('dashboard');
  } catch (e) {
    setUiMessage({
      type: 'error',
      text: e.response?.data?.message || 'Código inválido.'
    });
  } finally {
    setLoading(false);
  }
};

const onResetSubmit = async (data) => {
  if (!tempEmail) { setView('forgotPassword'); return; }
  setLoading(true);
  try {
    await api.post('/users/reset-password', { ...data, email: tempEmail });
    setUiMessage({ type: 'success', text: 'Senha redefinida!' });
    
    if (isInternalReset) { 
      setIsInternalReset(false);
      // Volta para a view anterior sem deslogar
      setView('dashboard');
      // Fecha o menu lateral se estiver aberto
      setIsProfileOpen(false);
    } else { 
      setView('login'); 
    }
  } catch (e) { 
    setUiMessage({ type: 'error', text: e.response?.data?.message || 'Erro no reset.' }); 
  } finally { setLoading(false); }
};


  const onChangePasswordSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post('/users/update-password', data);
      setUiMessage({ type: 'success', text: 'Senha atualizada!' });
      formChangePassword.reset();
    } catch (e) { setUiMessage({ type: 'error', text: e.response?.data?.message || 'Falha ao atualizar.' }); } 
    finally { setLoading(false); }
  };

  const handleTabChange = (newTab) => {
    if (newTab === activeTab) return;
    setActiveManualCard(null);
    setActiveAutoCard(null);
    setIsGeneratingCustom(false);
    setShowCreatePlan(false);
    setSelectedPlan(null);
    setIsManualInfoActive(false);
    setIsAutoInfoActive(false);
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTab(newTab);
      setTimeout(() => setIsTransitioning(false), 150);
    }, 150);
  };

  const stats = useMemo(() => {
    const historyArray = Array.isArray(history) ? history : [];
    const maxWeight = historyArray.reduce((acc, log) => Math.max(acc, Number(log.weight) || 0), 0);
    let sessionVolume = 0;
    let completedCount = 0;
    const allPlans = [...plans, ...generatedWorkouts];
    Object.keys(completedExercises).forEach((key) => {
      const [pId, dIdx, eIdx] = key.split('-');
      const plan = allPlans.find((p) => (p._id || p.id) === pId);
      if (plan && plan.days?.[dIdx]?.exercises?.[eIdx]) {
        const ex = plan.days[dIdx].exercises[eIdx];
        const reps = parseInt(ex.reps) || 0;
        const sets = Number(ex.sets) || 1;
        const weight = Number(ex.weight) || 0;
        sessionVolume += weight * reps * sets;
        completedCount++;
      }
    });
    return { maxWeight, sessionVolume, completedCount };
  }, [history, completedExercises, plans, generatedWorkouts]);


  //================ funçoes de localStorage
  useEffect(() => {
    localStorage.setItem('@superfrango:view', view);
  }, [view]);

  useEffect(() => {
    localStorage.setItem('@superfrango:activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (selectedPlan) localStorage.setItem('@superfrango:selectedPlan', JSON.stringify(selectedPlan));
    else localStorage.removeItem('@superfrango:selectedPlan');
  }, [selectedPlan]);

  useEffect(() => {
    localStorage.setItem('@superfrango:completed', JSON.stringify(completedExercises));
  }, [completedExercises]);

  useEffect(() => {
    const checkExpiry = () => {
      const now = Date.now();
      const expiryTime = 5 * 60 * 60 * 1000;
      const updatedState = { ...completedExercises };
      Object.keys(updatedState).forEach((key) => {
        if (updatedState[key].timestamp && now - updatedState[key].timestamp > expiryTime) delete updatedState[key];
      });
      setCompletedExercises(updatedState);
    };
    const interval = setInterval(checkExpiry, 60000);
    return () => clearInterval(interval);
  }, [completedExercises]);

  useEffect(() => {
    if (uiMessage.text) {
      const timer = setTimeout(() => setUiMessage({ type: '', text: '' }), 6000);
      return () => clearTimeout(timer);
    }
  }, [uiMessage]);

  useEffect(() => {
    setSelectedPlan(null);
    setIsCreatingPlan(false);
    setIsGeneratingCustom(false);
    setSelectedGoal('hipertrofia');
    formLogin.reset();
    formRegister.reset();
    formVerify.reset();
    formForgot.reset();
    formReset.reset();
    formChangePassword.reset();
    if (isAuthenticated) { fetchPlans(); fetchGeneratedWorkouts(); fetchHistory(); }
  }, [view, activeTab, isAuthenticated]);

  //===================== Telas de autenticação
  if (view === 'forgotPassword' || view === 'resetPassword' || view === 'verify') {
    return (
      <AuthViews
        view={view}
        setView={setView}
        loading={loading}
        uiMessage={uiMessage}
        tempEmail={tempEmail}
        formForgot={formForgot}
        formReset={formReset}
        formVerify={formVerify}
        onForgotSubmit={onForgotSubmit}
        onResetSubmit={onResetSubmit}
        onVerifySubmit={onVerifySubmit}
        isAuthenticated={isAuthenticated} 
      />
    );
  }

  if (view === 'login' || view === 'register') {
    if (view === 'login') {
      return (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-start pt-[13vh] p-6 select-none overflow-hidden">
          <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#ff6600] rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900 rounded-full blur-[120px]" />
          </div>
          <div className="z-10 w-full flex justify-center">
            <div className="w-full max-w-md bg-neutral-900/95 border border-white/10 p-7 rounded-[2rem] shadow-2xl space-y-6 md:backdrop-blur-3xl relative">
              <button onClick={() => setView('landing')} className="absolute top-5 right-6 p-1 text-gray-500 hover:text-white transition-colors z-10">
                <X size={16} />
              </button>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-gradient-to-br from-[#ff6600]/20 to-[#ff6600]/5 text-[#ff6600] rounded-xl flex items-center justify-center mx-auto border border-[#ff6600]/20 shadow-[0_0_15px_rgba(255,102,0,0.1)]">
                  <LogIn size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">LOGIN</h3>
                  <p className="text-neutral-500 text-[9px] font-bold uppercase tracking-[0.2em] mt-0.5">retornar ao super frango app</p>
                </div>
              </div>
              <StatusMessage type={uiMessage.type} message={uiMessage.text} />
              <form onSubmit={formLogin.handleSubmit(onLoginSubmit)} className="space-y-6">
                <div className="space-y-3.5">
                  <InputField label="E-mail" type="email" icon={Mail} placeholder="seu@email.com" autoComplete="off" error={formLogin.formState.errors.email?.message} {...formLogin.register('email')} />
                  <div className="space-y-1">
                    <InputField label="Senha" type="password" icon={Lock} placeholder="••••••••" autoComplete="off" error={formLogin.formState.errors.password?.message} {...formLogin.register('password')} />
                    <div className="flex justify-end pr-1">
                      <button type="button" onClick={() => setView('forgotPassword')} className="text-[9px] font-bold text-[#ff6600] uppercase tracking-widest transition-all duration-200 hover:scale-105 active:scale-105 origin-right">
                        Esqueci minha senha
                      </button>
                    </div>
                  </div>
                </div>
                <button type="submit" disabled={loading} className="w-full py-4 rounded-xl font-black italic bg-[#ff6600] text-black uppercase text-[11px] tracking-[0.15em] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,102,0,0.9)]">
                  {loading ? 'PROCESSANDO...' : 'ENTRAR NO APP'}
                  {!loading && <ChevronRight size={16} />}
                </button>
              </form>
              <div className="pt-2 text-center">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Ainda é frango? </span>
                <button onClick={() => setView('register')} className="text-[10px] font-bold text-[#ff6600] uppercase tracking-widest transition-all duration-200 hover:scale-105 active:scale-105 inline-block">
                  Crie sua conta
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (view === 'register') {
      return (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-start pt-[10vh] p-6 select-none overflow-hidden">
          <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#ff6600] rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900 rounded-full blur-[120px]" />
          </div>
          <div className="z-10 w-full flex justify-center">
            <div className="w-full max-w-md bg-neutral-900/95 border border-white/10 p-7 rounded-[2rem] shadow-2xl space-y-6 md:backdrop-blur-3xl relative">
              <button onClick={() => setView('landing')} className="absolute top-5 right-6 p-1 text-gray-500 hover:text-white transition-colors z-10">
                <X size={16} />
              </button>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-gradient-to-br from-[#ff6600]/20 to-[#ff6600]/5 text-[#ff6600] rounded-xl flex items-center justify-center mx-auto border border-[#ff6600]/20 shadow-[0_0_15px_rgba(255,102,0,0.1)]">
                  <UserPlus size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">CRIAR CONTA</h3>
                  <p className="text-neutral-500 text-[9px] font-bold uppercase tracking-[0.2em] mt-0.5">torne-se um monstro</p>
                </div>
              </div>
              <form onSubmit={formRegister.handleSubmit(onRegisterSubmit)} className="space-y-6">
                <div className="space-y-3.5">
                  <InputField label="Nome" type="text" icon={User} placeholder="" autoComplete="off" error={formRegister.formState.errors.name?.message} {...formRegister.register('name')} />
                  <InputField label="E-mail" type="email" icon={Mail} placeholder="seu@email.com" autoComplete="off" error={formRegister.formState.errors.email?.message} {...formRegister.register('email')} />
                  <StatusMessage type={uiMessage.type} message={uiMessage.text} />
                  <InputField label="Senha" type="password" icon={Lock} placeholder="••••••••" autoComplete="off" error={formRegister.formState.errors.password?.message} {...formRegister.register('password')} />
                </div>
                <button type="submit" disabled={loading} className="w-full py-4 rounded-xl font-black italic bg-[#ff6600] text-black uppercase text-[11px] tracking-[0.15em] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,102,0,0.9)]">
                  {loading ? 'PROCESSANDO...' : 'CRIAR MINHA CONTA'}
                  {!loading && <ChevronRight size={16} />}
                </button>
              </form>
              <div className="pt-2 text-center">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Já é um monstro? </span>
                <button onClick={() => setView('login')} className="text-[10px] font-bold text-[#ff6600] uppercase tracking-widest transition-all duration-200 hover:scale-105 active:scale-105 inline-block">
                  Faça login
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  if (view === 'landing' || !isAuthenticated) {
    return <LandingPage onStart={(mode) => setView(mode)} />;
  }

  // App principal autenticado
  return (
    <div className={`min-h-screen ${theme.colors.background} text-white md:pt-24 px-4 relative overflow-x-hidden`}>
      {!selectedPlan && !isCreatingPlan && (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden h-[100vh] h-[100svh]">
          <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1728486145245-d4cb0c9c3470?q=80&w=2070&auto=format&fit=crop')` }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-black/65 to-black/70" />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      )}
      {!showCreatePlan && !isGeneratingCustom && (
        <Navbar activeTab={activeTab} setActiveTab={handleTabChange} onOpenProfile={() => setIsProfileOpen(true)} />
      )}
      <ProfileSideMenu
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        logout={logout}
        setView={setView}
        securityContent={
          <div className="space-y-6 pt-2">
            <StatusMessage type={uiMessage.type} message={uiMessage.text} />
            <form onSubmit={formChangePassword.handleSubmit(onChangePasswordSubmit)} className="space-y-4">
              <InputField label="Senha Atual" type="password" icon={Lock} autoComplete="off" error={formChangePassword.formState.errors.oldPassword?.message} {...formChangePassword.register('oldPassword')} />
              <InputField label="Nova Senha" type="password" autoComplete="off" icon={ShieldCheck} error={formChangePassword.formState.errors.newPassword?.message} {...formChangePassword.register('newPassword')} />
              <button type="submit" className={`w-full py-4 rounded-xl font-black italic text-black uppercase text-[10px] tracking-widest ${theme.colors.primaryBg} shadow-[0_0_20px_rgba(255,102,0,0.9)] active:scale-95 transition-all`}>
                {loading ? 'Sincronizando...' : 'Trocar Senha'}
              </button>
            </form>
            <div className="relative flex items-center justify-center py-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
              <span className="relative bg-[#111111] px-2 text-[8px] uppercase font-black text-gray-700 tracking-widest italic">ou</span>
            </div>
            <button onClick={() => { setTempEmail(user?.email); setIsInternalReset(true); setView('forgotPassword'); setIsProfileOpen(false); }} className="cursor-pointer text-center py-2 text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-[#ff6600] transition-colors flex items-center justify-center gap-2 w-full">
              Redefinição via E-mail
            </button>
          </div>
        }
      />

      <main className="max-w-7xl mx-auto w-full pt-13 pb-8 md:pt-8 relative z-10">
        {uiMessage.text && (
  <div className="mt-3 mx-4">
    <StatusMessage type={uiMessage.type} message={uiMessage.text} />
  </div>
)}
        <div className={`transition-all duration-200 ease-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          <AppViews
            activeTab={activeTab}
            selectedPlan={selectedPlan}
            setSelectedPlan={setSelectedPlan}
            completedExercises={completedExercises}
            toggleCheck={toggleCheck}
            handleDeletePlan={handleDeletePlan}
            onOpenAddExercisePage={onOpenAddExercisePage}
            onOpenEditExercisePage={onOpenEditExercisePage}
            onOpenEditPRPage={onOpenEditPRPage}
            onOpenAddDayPage={onOpenAddDayPage}
            onOpenPRPage={onOpenPRPage}
            onOpenImportPage={onOpenImportPage}
            handleDeleteExercise={handleDeleteExercise}
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
            handleDeleteGeneratedWorkout={handleDeleteGeneratedWorkout}
            stats={stats}
            plans={plans}
            generatedWorkouts={generatedWorkouts}
            history={history}
            onOpenResetHistoryPage={onOpenResetHistoryPage}
            setSelectedExerciseHistory={setSelectedExerciseHistory}
            selectedExerciseHistory={selectedExerciseHistory}
            visiblePlans={visiblePlans}
            setVisiblePlans={setVisiblePlans}
            visibleWorkouts={visibleWorkouts}
            setVisibleWorkouts={setVisibleWorkouts}
            activeManualCard={activeManualCard}
            setActiveManualCard={setActiveManualCard}
            activeAutoCard={activeAutoCard}
            setActiveAutoCard={setActiveAutoCard}
            showCreatePlan={showCreatePlan}
            setShowCreatePlan={setShowCreatePlan}
            isGeneratingCustom={isGeneratingCustom}
            setIsGeneratingCustom={setIsGeneratingCustom}
            isTransitioning={isTransitioning}
            setView={setView}
            finalResetAction={finalResetAction}
            fetchPlans={fetchPlans}
          />
        </div>
      </main>

      <ModalsViews
        showCreatePlan={showCreatePlan}
        setShowCreatePlan={setShowCreatePlan}
        formPlan={formPlan}
        onPlanSubmit={onPlanSubmit}
        dayFields={dayFields}
        appendDay={appendDay}
        removeDay={removeDay}
        isManualInfoActive={isManualInfoActive}
        setIsManualInfoActive={setIsManualInfoActive}
        loading={loading}
        isGeneratingCustom={isGeneratingCustom}
        setIsGeneratingCustom={setIsGeneratingCustom}
        selectedGoal={selectedGoal}
        setSelectedGoal={setSelectedGoal}
        formGenerate={formGenerate}
        onGenerateSubmit={onGenerateSubmit}
        isAutoInfoActive={isAutoInfoActive}
        setIsAutoInfoActive={setIsAutoInfoActive}
        selectedExerciseHistory={selectedExerciseHistory}
        setSelectedExerciseHistory={setSelectedExerciseHistory}
        api={api}
      />
    </div>
  );
};