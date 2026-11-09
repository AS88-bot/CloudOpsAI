import { useState } from 'react';
import { BookOpen, Loader2, FileText, CheckCircle2, Sparkles, Download } from 'lucide-react';
import { generateDocs } from '../../../services/ai';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../../context/AuthContext';

export function DocGenerator() {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!content) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await generateDocs(content);
      setResult(data.result);
      
      if (user) {
        await addDoc(collection(db, 'analysis_history'), {
          userId: user.uid,
          type: 'documentation',
          fileName: `Documentation - ${new Date().toLocaleTimeString()}`,
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
          <h2 className="text-3xl font-bold text-slate-900">AI Documentation Generator</h2>
          <p className="text-slate-500">Generate READMEs and technical docs from your codebases.</p>
        </div>
        {result && (
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-all">
            <Download className="w-4 h-4" />
            Download Markdown
          </button>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-blue-600">
              <FileText className="w-4 h-4" />
              <span className="text-sm font-bold">Source Context</span>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste main files, K8s manifests, or project summary here..."
              className="w-full h-96 bg-slate-50 font-mono text-sm p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:outline-none resize-none"
            />
            <button
              onClick={handleGenerate}
              disabled={loading || !content}
              className="w-full mt-6 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Docs...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Build Documentation
                </>
              )}
            </button>
          </div>
        </div>

        <div className="h-[580px] bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-blue-50/30">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              Generated Documentation
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-8">
            <AnimatePresence mode="wait">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-50 rounded-full" />
                    <div className="w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin absolute inset-0" />
                  </div>
                  <p className="mt-4 text-sm font-medium animate-pulse">Writing technical guides...</p>
                </div>
              ) : result ? (
                <div className="prose prose-blue prose-sm max-w-none">
                  <ReactMarkdown>{result}</ReactMarkdown>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-300">
                  <BookOpen className="w-12 h-12 mb-4 opacity-10" />
                  <p className="text-sm">Documentation will be rendered in Markdown.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
