import { useState } from 'react';
import { Coins, Loader2, TrendingDown, Sparkles, PieChart } from 'lucide-react';
import { optimizeCost } from '../../../services/ai';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../../context/AuthContext';

export function CostOptimizer() {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleOptimize = async () => {
    if (!content) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await optimizeCost(content);
      setResult(data.result);
      
      if (user) {
        await addDoc(collection(db, 'analysis_history'), {
          userId: user.uid,
          type: 'cost',
          fileName: `Cost Analysis - ${new Date().toLocaleTimeString()}`,
          rawContent: content,
          aiResponse: data.result,
          severity: 'info',
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
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">AI Cost Optimizer</h2>
          <p className="text-slate-500">Analyze infrastructure waste and reduce your cloud bill.</p>
        </div>
        <div className="p-3 bg-blue-50 text-blue-700 rounded-xl flex items-center gap-2 text-sm font-semibold">
          <Sparkles className="w-4 h-4" />
          AI Enabled
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-blue-600" />
              Resource Manifest / Usage Data
            </h3>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your Terraform plan, K8s manifests, or cloud billing exports..."
              className="w-full h-80 bg-slate-50 font-mono text-sm p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:outline-none resize-none"
            />
            <button
              onClick={handleOptimize}
              disabled={loading || !content}
              className="w-full mt-6 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Calculating Savings...
                </>
              ) : (
                <>
                  <TrendingDown className="w-5 h-5" />
                  Analyze Cost Optimization
                </>
              )}
            </button>
          </div>

          <div className="p-6 bg-emerald-900 text-white rounded-2xl shadow-xl">
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <Coins className="w-5 h-5" />
              Optimization Strategy
            </h4>
            <ul className="text-sm text-emerald-100 space-y-2 mt-4">
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-emerald-400 rounded-full" />
                Right-size idle VM instances
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-emerald-400 rounded-full" />
                Cleanup unattached persistent disks
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-emerald-400 rounded-full" />
                Optimize spot instance usage
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-bold text-slate-900">Optimization Report</h3>
          </div>
          <div className="flex-1 p-6 overflow-y-auto">
            {result ? (
              <div className="prose prose-blue prose-sm max-w-none">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <Loader2 className={`w-8 h-8 mb-4 ${loading ? 'animate-spin opacity-100' : 'opacity-10'}`} />
                <p className="text-sm font-medium">No active optimization scans.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
