import React from 'react';
import { X, KeyRound, Lock, Mail, ChevronRight } from 'lucide-react';
import { InputField, StatusMessage } from '../components';

export const AuthViews = ({ 
  view, 
  setView, 
  loading, 
  uiMessage, 
  tempEmail,
  formForgot,
  formReset,
  formVerify,
  onForgotSubmit,
  onResetSubmit,
  onVerifySubmit,
  isAuthenticated
}) => {
  // Forgot Password
  if (view === 'forgotPassword') {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-start pt-[20vh] p-6 select-none overflow-hidden">
        <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#ff6600] rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900 rounded-full blur-[120px]" />
        </div>
        <div className="z-10 w-full flex justify-center">
          <div className="w-full max-w-md bg-neutral-900/95 border border-white/10 p-7 rounded-[2rem] shadow-2xl space-y-6 md:backdrop-blur-3xl relative">
           <button onClick={() => setView(isAuthenticated ? 'dashboard' : 'login')} className="absolute top-5 right-6 p-1 text-gray-500 hover:text-white transition-colors z-10">
              <X size={16} />
            </button>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-gradient-to-br from-[#ff6600]/20 to-[#ff6600]/5 text-[#ff6600] rounded-xl flex items-center justify-center mx-auto border border-[#ff6600]/20 shadow-[0_0_15px_rgba(255,102,0,0.1)]">
                <KeyRound size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">RECUPERAR SENHA</h3>
                <p className="text-neutral-500 text-[8px] font-bold uppercase tracking-[0.2em] mt-0.5">Enviaremos um código para seu e-mail</p>
              </div>
            </div>

            <form onSubmit={formForgot.handleSubmit(onForgotSubmit)} className="space-y-6">
              <div className="space-y-3.5">
                <InputField
                  label="E-mail"
                  type="email"
                  icon={Mail}
                  placeholder="seu@email.com"
                  autoComplete="off"
                  error={formForgot.formState.errors.email?.message}
                  {...formForgot.register('email')}
                />
              </div>
              <button type="submit" disabled={loading} className="w-full py-4 rounded-xl font-black italic bg-[#ff6600] text-black uppercase text-[11px] tracking-[0.15em] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,102,0,0.9)]">
                {loading ? 'PROCESSANDO...' : 'ENVIAR CÓDIGO'}
                {!loading && <ChevronRight size={16} />}
              </button>
            </form>

            <div className="pt-2 text-center">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Lembrou a senha? </span>
             <button onClick={() => setView(isAuthenticated ? 'dashboard' : 'login')} className="text-[10px] font-bold text-[#ff6600] uppercase tracking-widest transition-all duration-200 active:scale-105 inline-block">
                 {isAuthenticated ? 'Voltar' : 'Voltar ao login'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Reset Password
  if (view === 'resetPassword') {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-start pt-[11vh] p-6 select-none overflow-hidden">
        <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#ff6600] rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900 rounded-full blur-[120px]" />
        </div>
        <div className="z-10 w-full flex justify-center">
          <div className="w-full max-w-md bg-neutral-900/95 border border-white/10 p-7 rounded-[2rem] shadow-2xl space-y-6 md:backdrop-blur-3xl relative">
           <button onClick={() => setView(isAuthenticated ? 'dashboard' : 'landing')} className="absolute top-5 right-6 p-1 text-gray-500 hover:text-white transition-colors z-10">
              <X size={16} />
            </button>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-gradient-to-br from-[#ff6600]/20 to-[#ff6600]/5 text-[#ff6600] rounded-xl flex items-center justify-center mx-auto border border-[#ff6600]/20 shadow-[0_0_15px_rgba(255,102,0,0.1)]">
                <Lock size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">NOVA SENHA</h3>
                <p className="text-neutral-500 text-[9px] font-bold uppercase tracking-[0.2em] mt-0.5">Digite o código e a nova senha</p>
              </div>
            </div>
            <div className="mt-4">
              <StatusMessage type={uiMessage.type} message={uiMessage.text} />
            </div>
            <form onSubmit={formReset.handleSubmit(onResetSubmit)} className="space-y-6">
              <div className="space-y-3.5">
                <InputField
                  label="Código de 6 dígitos"
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  autoComplete="off"
                  error={formReset.formState.errors.code?.message}
                  {...formReset.register('code')}
                />
                <InputField
                  label="Nova Senha"
                  type="password"
                  icon={Lock}
                  placeholder="••••••••"
                  autoComplete="off"
                  error={formReset.formState.errors.password?.message}
                  {...formReset.register('password')}
                />
              </div>
              <button type="submit" disabled={loading} className="w-full py-4 rounded-xl font-black italic bg-[#ff6600] text-black uppercase text-[11px] tracking-[0.15em] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,102,0,0.9)]">
                {loading ? 'PROCESSANDO...' : 'REDEFINIR SENHA'}
                {!loading && <ChevronRight size={16} />}
              </button>
            </form>
            <div className="pt-2 text-center">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Lembrou a senha? </span>
              <button onClick={() => setView('login')} className="text-[10px] font-bold text-[#ff6600] uppercase tracking-widest hover:scale-105 transition-transform duration-200 inline-block">
                Voltar ao login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Verify Email
  if (view === 'verify') {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-start pt-[25vh] p-6 select-none overflow-hidden">
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
                <Mail size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">VERIFICAR EMAIL</h3>
                <p className="text-neutral-500 text-[9px] font-bold uppercase tracking-[0.2em] mt-0.5">Código enviado</p>
              </div>
            </div>
            <div className="mt-4">
              <StatusMessage type={uiMessage.type} message={uiMessage.text} />
            </div>
            <form onSubmit={formVerify.handleSubmit(onVerifySubmit)} className="space-y-6">
              <div className="space-y-3.5">
                <input
                  autoFocus
                  autoComplete="off"
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-5 text-white text-center font-black text-2xl tracking-[0.5em] outline-none focus:border-[#ff6600] transition-all focus:bg-black/60"
                  placeholder="000000"
                  maxLength={6}
                  {...formVerify.register('code')}
                />
              </div>
              <button type="submit" disabled={loading} className="w-full py-4 rounded-xl font-black italic bg-[#ff6600] text-black uppercase text-[11px] tracking-[0.15em] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,102,0,0.9)]">
                {loading ? 'PROCESSANDO...' : 'CONFIRMAR CÓDIGO'}
                {!loading && <ChevronRight size={16} />}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return null;
};