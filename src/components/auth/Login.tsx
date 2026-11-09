import { motion } from 'motion/react';
import { Cpu, ShieldCheck, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function Login() {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
        >
          <div className="p-8 pb-4 text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-600/20">
              <Cpu className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">CloudOps AI</h1>
            <p className="text-slate-500 mt-2">The Enterprise AI Platform for Cloud Engineers.</p>
          </div>

          <div className="p-8 pt-0 space-y-6">
            <div className="space-y-4 py-6 border-y border-slate-100">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-blue-50 rounded text-blue-600">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Smart Analysis</h3>
                  <p className="text-xs text-slate-500">Gemini-powered infra & security audits.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-green-50 rounded text-green-600">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Enterprise Security</h3>
                  <p className="text-xs text-slate-500">Zero-trust authentication and safe storage.</p>
                </div>
              </div>
            </div>

            <button
              onClick={signInWithGoogle}
              className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </button>
            
            <p className="text-center text-[10px] text-slate-400 uppercase tracking-widest">
              Authorized personnel only
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
