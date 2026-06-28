'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, Lock, Key } from 'lucide-react';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Link inválido ou expirado');
    }
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Link inválido');
      return;
    }

    if (password !== confirmPassword) {
      setError('Senhas não conferem');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? 'Erro ao resetar senha');
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push('/login'), 2000);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#0f0500]">
      <div className="absolute inset-0 overflow-hidden">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30 mb-4">
            <Key size={26} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Resetar Senha</h1>
          <p className="text-amber-200/60 text-sm mt-1">Digite sua nova senha</p>
        </div>

        <div className="glass-card p-8">
          {success ? (
            <div className="text-center">
              <p className="text-green-400 text-sm bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2 mb-4">
                Senha alterada com sucesso! Redirecionando...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="glass-input-wrap">
                <Lock size={16} className="glass-input-icon" />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Nova senha"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  required
                  className="glass-input pr-10"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <div className="glass-input-wrap">
                <Lock size={16} className="glass-input-icon" />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Confirme a senha"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError('');
                  }}
                  required
                  className="glass-input pr-10"
                  minLength={6}
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-gray-900 font-bold text-sm hover:from-amber-300 hover:to-amber-400 transition-all shadow-lg shadow-amber-500/30 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                Resetar Senha
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
