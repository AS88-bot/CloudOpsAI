import { useState } from 'react';
import { Cpu, Loader2, Send, Download, Layers, Share2, Sparkles } from 'lucide-react';
import { generateArchitecture } from '../../../services/ai';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../../context/AuthContext';

export function ArchitectureGenerator() {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await generateArchitecture(prompt);
      setResult(data.result);
      
      if (user) {
        await addDoc(collection(db, 'architecture_blueprints'), {
          userId: user.uid,
          prompt,
          aiResponse: data.result,
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
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">AI Solution Architect</h2>
          <p className="text-slate-500">Transform requirements into professional cloud architectures.</p>
        </div>
        <div className="flex gap-3">
          <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 p-4 bg-blue-50 text-blue-600 rounded-full transition-transform group-hover:scale-110">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 mb-4">Design Requirements</h3>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., I want an AI-powered e-commerce website that scales globally with a PostgreSQL database and low latency..."
              className="w-full h-64 bg-slate-50 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:outline-none resize-none text-sm leading-relaxed"
            />
            <button
              onClick={handleGenerate}
              disabled={loading || !prompt}
              className="w-full mt-4 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98]"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Layers className="w-5 h-5" />}
              Generate Architecture
            </button>
          </div>

          <div className="p-6 bg-slate-900 text-white rounded-2xl shadow-xl">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-400" />
              GCP Expert Model
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <p>• Optimized for Google Cloud Landing Zones</p>
              <p>• Includes Mermaid.js diagram code</p>
              <p>• Cost estimations included</p>
              <p>• Security by design principles</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[650px] overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Blueprint & Specifications</h3>
          </div>
          <div className="flex-1 p-8 overflow-y-auto bg-slate-50/30">
            {result ? (
              <div className="prose prose-slate max-w-none prose-h1:text-xl prose-h2:text-lg prose-p:text-sm">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-300 space-y-4">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
                  <Layers className="w-8 h-8 opacity-20" />
                </div>
                <p className="text-sm font-medium">Architecture will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
