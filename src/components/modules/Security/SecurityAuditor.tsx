import { useState } from 'react';
import { ShieldAlert, Loader2, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { auditSecurity } from '../../../services/ai';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../../context/AuthContext';

export function SecurityAuditor() {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleAudit = async () => {
    if (!content) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await auditSecurity(content);
      setResult(data.result);
      
      if (user) {
        await addDoc(collection(db, 'analysis_history'), {
          userId: user.uid,
          type: 'security',
          fileName: `Security Audit - ${new Date().toLocaleTimeString()}`,
          rawContent: content,
          aiResponse: data.result,
          severity: 'critical',
          timestamp: serverTimestamp()
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">Security Auditor</h2>
        <p className="text-slate-500">Scan your code and configurations for secrets and vulnerabilities.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-semibold mb-4 text-slate-900">Target Configuration</h3>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste K8s YAML, Terraform, or Source Code here..."
              className="w-full h-96 bg-slate-50 font-mono text-sm p-4 rounded-lg border border-slate-200 focus:ring-2 focus:ring-rose-500/20 focus:outline-none resize-none"
            />
            <button
              onClick={handleAudit}
              disabled={loading || !content}
              className="w-full mt-6 py-4 bg-rose-600 hover:bg-rose-500 disabled:bg-slate-300 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-600/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Auditing Security...
                </>
              ) : (
                <>
                  <ShieldAlert className="w-5 h-5" />
                  Perform Security Audit
                </>
              )}
            </button>
          </div>
        </div>

        <div className="h-[580px] bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-rose-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-700 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Audit Report</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full space-y-4 text-slate-400">
                  <motion.div 
                    animate={{ scale: [1, 1.1, 1] }} 
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="p-4 bg-rose-50 rounded-full text-rose-600"
                  >
                    <ShieldAlert className="w-8 h-8" />
                  </motion.div>
                  <p className="text-sm font-medium">Scanning for exposed secrets...</p>
                </div>
              ) : result ? (
                <div className="prose prose-rose prose-sm max-w-none">
                  <ReactMarkdown>{result}</ReactMarkdown>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-300 text-center px-12">
                  <AlertTriangle className="w-12 h-12 mb-4 opacity-10" />
                  <p className="text-sm">No vulnerabilities detected. Start a scan to verify.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
