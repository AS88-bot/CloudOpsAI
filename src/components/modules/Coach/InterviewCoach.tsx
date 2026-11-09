import { useState } from 'react';
import { Cpu, Loader2, Sparkles, MessageSquare, BrainCircuit, CheckCircle2 } from 'lucide-react';
import { interviewCoach } from '../../../services/ai';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';

export function InterviewCoach() {
  const [topic, setTopic] = useState('Google Cloud Platform');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handlePractice = async () => {
    setLoading(true);
    setResult(null);
    try {
      const data = await interviewCoach(topic);
      setResult(data.result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">AI Interview Coach</h2>
        <p className="text-slate-500">Prepare for elite cloud engineering roles with AI-generated system design questions.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Practice Topic</h3>
            <div className="space-y-2">
              {['Google Cloud Platform', 'Kubernetes', 'Terraform', 'System Design', 'CI/CD Pipelines'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTopic(t)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    topic === t ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            
            <button
              onClick={handlePractice}
              disabled={loading}
              className="w-full mt-8 py-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Session...
                </>
              ) : (
                <>
                  <BrainCircuit className="w-5 h-5" />
                  Start Practice Session
                </>
              )}
            </button>
          </div>

          <div className="p-6 bg-blue-900 text-white rounded-2xl shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white/10 blur-2xl rounded-full" />
            <h4 className="font-bold mb-2 flex items-center gap-2 relative z-10">
              <Sparkles className="w-4 h-4 text-blue-300" />
              Pro Tip
            </h4>
            <p className="text-xs text-blue-100 leading-relaxed relative z-10">
              Try to answer out loud. AI will evaluate your reasoning, system constraints, and scalability considerations.
            </p>
          </div>
        </div>

        <div className="lg:col-span-2 h-[650px] bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              Interview Session: {topic}
            </h3>
          </div>
          
          <div className="flex-1 p-8 overflow-y-auto">
            <AnimatePresence mode="wait">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                  >
                    <Cpu className="w-12 h-12 text-blue-600 mb-4" />
                  </motion.div>
                  <p className="text-sm font-medium">Calibrating interview complexity...</p>
                </div>
              ) : result ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="prose prose-slate prose-sm max-w-none"
                >
                  <ReactMarkdown>{result}</ReactMarkdown>
                  
                  <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <h4 className="font-bold text-slate-900 mb-2">Record your answer</h4>
                    <textarea 
                      placeholder="Type your summary or answer here for AI evaluation..."
                      className="w-full h-32 bg-white border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-all">
                      Submit for Evaluation
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-300">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                    <MessageSquare className="w-8 h-8 opacity-20" />
                  </div>
                  <p className="text-sm font-medium">Choose a topic and start your session.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
