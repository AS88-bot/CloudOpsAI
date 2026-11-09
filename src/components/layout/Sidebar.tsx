import { 
  LayoutDashboard, 
  ShieldAlert, 
  Coins, 
  Terminal, 
  HardDrive, 
  BookOpen, 
  FileSearch, 
  Cpu, 
  Settings, 
  LogOut,
  MessageSquare 
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuth } from "../../context/AuthContext";

const menuItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'analyzer', label: 'Infra Analyzer', icon: FileSearch },
  { id: 'security', label: 'Security Auditor', icon: ShieldAlert },
  { id: 'cost', label: 'Cost Optimizer', icon: Coins },
  { id: 'logs', label: 'Log Analyzer', icon: Terminal },
  { id: 'docs', label: 'Doc Generator', icon: BookOpen },
  { id: 'architecture', label: 'Architect', icon: Cpu },
  { id: 'coach', label: 'Interview Coach', icon: MessageSquare },
];

export function Sidebar({ activeTab, onTabChange }: { activeTab: string, onTabChange: (id: string) => void }) {
  const { user, logout } = useAuth();

  return (
    <div className="w-64 bg-slate-900 text-white h-screen flex flex-col border-r border-slate-800">
      <div className="p-6">
        <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          CloudOps AI
        </h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
              activeTab === item.id 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-2 py-2 text-sm text-slate-400">
          {user?.photoURL ? (
            <img src={user.photoURL} alt={user.displayName || 'User'} className="w-8 h-8 rounded-full border border-slate-700" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
              {user?.displayName?.charAt(0) || 'U'}
            </div>
          )}
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-white text-xs font-medium">{user?.displayName || 'Cloud Engineer'}</p>
            <p className="text-[10px] truncate opacity-50">{user?.email}</p>
          </div>
          <button 
            onClick={() => logout()}
            className="hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
