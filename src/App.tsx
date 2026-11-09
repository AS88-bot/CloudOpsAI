import { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Overview } from './components/dashboard/Overview';
import { InfraAnalyzer } from './components/modules/Analyzer/InfraAnalyzer';
import { SecurityAuditor } from './components/modules/Security/SecurityAuditor';
import { CostOptimizer } from './components/modules/Cost/CostOptimizer';
import { ArchitectureGenerator } from './components/modules/Architecture/ArchitectureGenerator';
import { LogAnalyzer } from './components/modules/Logs/LogAnalyzer';
import { DocGenerator } from './components/modules/Docs/DocGenerator';
import { InterviewCoach } from './components/modules/Coach/InterviewCoach';
import { Login } from './components/auth/Login';
import { useAuth } from './context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2 } from 'lucide-react';

export default function App() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (loading) {
    return (
      <div className="h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4 text-slate-900">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-sm font-semibold tracking-tight">Initializing CloudOps AI...</p>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview />;
      case 'analyzer':
        return <InfraAnalyzer />;
      case 'security':
        return <SecurityAuditor />;
      case 'cost':
        return <CostOptimizer />;
      case 'architecture':
        return <ArchitectureGenerator />;
      case 'logs':
        return <LogAnalyzer />;
      case 'docs':
        return <DocGenerator />;
      case 'coach':
        return <InterviewCoach />;
      default:
        return (
          <div className="flex items-center justify-center h-full text-slate-400">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto">
                <Loader2 className="w-6 h-6 animate-spin opacity-20" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Module Under Construction</h3>
              <p className="text-sm max-w-xs mx-auto">This flagship feature is scheduled for release in the next development cycle.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

