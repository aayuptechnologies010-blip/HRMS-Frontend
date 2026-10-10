import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MdPersonOutline, MdLockOutline, MdArrowForward } from 'react-icons/md';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        login(data.data, data.token);
        navigate('/');
      } else {
        alert(data.error.message || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      alert('Network error. Is the backend running?');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[var(--color-brand-blue)] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-[var(--color-info)] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-[var(--color-brand-dark)] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

      <div className="max-w-md w-full bg-[var(--color-surface)]/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 relative z-10 border border-[var(--color-border)]">
        <div className="text-center mb-10 flex flex-col items-center">
          <img src="/logo.png" alt="AAYUP Technologies" className="h-24 mb-4" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
          <h1 className="text-4xl font-black text-[var(--color-brand-blue)] tracking-tight mb-2 hidden">AAYUP</h1>
          <p className="text-[var(--color-text-muted)] font-medium">HRMS & Employee Operations</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[var(--color-text-primary)] ml-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--color-text-muted)]">
                <MdPersonOutline size={22} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-transparent outline-none transition-all text-sm"
                placeholder="admin@aayup.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-semibold text-[var(--color-text-primary)]">Password</label>
              <a href="#" className="text-xs text-[var(--color-brand-blue)] hover:text-[var(--color-brand-dark)] font-medium transition-colors">Forgot password?</a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--color-text-muted)]">
                <MdLockOutline size={22} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-transparent outline-none transition-all text-sm"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[var(--color-brand-blue)] hover:bg-[var(--color-brand-dark)] text-white font-semibold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center group"
          >
            <span>Sign In</span>
            <MdArrowForward size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  );
}
