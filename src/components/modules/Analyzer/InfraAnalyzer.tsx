import { useState } from 'react';
import { FileSearch, Terminal, Loader2, CheckCircle2, AlertCircle, Save } from 'lucide-react';
import { analyzeInfrastructure } from '../../../services/ai';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../../context/AuthContext';

export function InfraAnalyzer() {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [fileType, setFileType] = useState('Dockerfile');
  const [saving, setSaving] = useState(false);

  const handleAnalyze = async () => {
    if (!content) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await analyzeInfrastructure(fileType, content);
      setResult(data.result);
      
      // Auto-save to history if user is logged in
      if (user) {
        await addDoc(collection(db, 'analysis_history'), {
          userId: user.uid,
          type: fileType.toLowerCase(),
          fileName: `Analysis: ${fileType} - ${new Date().toLocaleTimeString()}`,
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
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Infrastructure Analyzer</h2>
          <p className="text-slate-500">Deep AI analysis of your cloud configuration files.</p>
        </div>
        <div className="flex gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
          {['Dockerfile', 'K8s YAML', 'Terraform', 'Nginx'].map((type) => (
            <button
              key={type}
              onClick={() => setFileType(type)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                fileType === type ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="relative group">
            <div className="absolute top-3 left-3 p-1.5 bg-slate-100 rounded text-slate-500 group-focus-within:text-blue-600 transition-colors">
              <Terminal className="w-4 h-4" />
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Paste your ${fileType} content here...`}
              className="w-full h-[500px] bg-slate-900 text-slate-100 font-mono text-sm p-12 rounded-xl border border-slate-800 focus:ring-2 focus:ring-blue-500/50 focus:outline-none resize-none shadow-inner"
            />
          </div>
          
          <button
            onClick={handleAnalyze}
            disabled={loading || !content}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                AI Analysis in progress...
              </>
            ) : (
              <>
                <FileSearch className="w-5 h-5" />
                Start Analysis
              </>
            )}
          </button>
        </div>

        <div className="h-[580px] bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">AI Report</h3>
            {result && <CheckCircle2 className="w-4 h-4 text-green-500" />}
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4"
                >
                  <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                  <p className="text-sm font-medium animate-pulse">Scanning infrastructure patterns...</p>
                </motion.div>
              ) : result ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="prose prose-slate prose-sm max-w-none"
                >
                  <ReactMarkdown>{result}</ReactMarkdown>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center px-12">
                  <AlertCircle className="w-8 h-8 mb-4 opacity-20" />
                  <p className="text-sm">Enter code and start analysis to generate a cloud infrastructure report.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
