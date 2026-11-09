import { useState } from 'react';
import { Terminal, Loader2, AlertCircle, CheckCircle2, Search } from 'lucide-react';
import { analyzeLogs } from '../../../services/ai';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../../context/AuthContext';

export function LogAnalyzer() {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!content) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await analyzeLogs(content);
      setResult(data.result);
      
      if (user) {
        await addDoc(collection(db, 'analysis_history'), {
          userId: user.uid,
          type: 'logs',
          fileName: `Log Analysis - ${new Date().toLocaleTimeString()}`,
          rawContent: content,
          aiResponse: data.result,
          severity: 'warning',
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
        <h2 className="text-3xl font-bold text-slate-900">AI Log Analyzer</h2>
        <p className="text-slate-500">Paste your server logs for instant root cause analysis and debugging steps.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-4 text-slate-400">
              <Terminal className="w-4 h-4" />
              <span className="text-xs font-mono">system.log</span>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste logs here (Apache, Nginx, Kubernetes, Cloud Run...)"
              className="w-full h-[400px] bg-transparent text-slate-300 font-mono text-xs focus:outline-none resize-none"
            />
            <button
              onClick={handleAnalyze}
              disabled={loading || !content}
              className="w-full mt-6 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-600/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing Trace...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Scan Logs
                </>
              )}
            </button>
          </div>
        </div>

        <div className="h-[580px] bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Incident Report</h3>
            {result && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
            <AnimatePresence mode="wait">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4" />
                  <p className="text-sm font-medium">Extracting failure patterns...</p>
                </div>
              ) : result ? (
                <div className="prose prose-slate prose-sm max-w-none">
                  <ReactMarkdown>{result}</ReactMarkdown>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-300 text-center px-12">
                  <AlertCircle className="w-10 h-10 mb-4 opacity-10" />
                  <p className="text-sm font-medium">Logs are clear. No active analysis.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
