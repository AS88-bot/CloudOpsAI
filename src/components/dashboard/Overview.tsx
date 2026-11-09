import { motion } from "motion/react";
import { 
  ShieldCheck, 
  TrendingDown, 
  Search, 
  Terminal, 
  Cpu,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from "lucide-react";
import { RecentActivity } from "./RecentActivity";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const stats = [
  { label: 'Security Health', value: '98%', icon: ShieldCheck, color: 'text-emerald-500', trend: '+2.4%', trendUp: true },
  { label: 'Cloud Spend', value: '$1,240', icon: TrendingDown, color: 'text-blue-500', trend: '-12%', trendUp: false },
  { label: 'Infrastructure Drift', value: '0', icon: Search, color: 'text-amber-500', trend: 'Stable', trendUp: true },
  { label: 'Active Clusters', value: '4', icon: Cpu, color: 'text-purple-500', trend: '+1', trendUp: true },
];

const costData = [
  { name: 'Mon', cost: 400 },
  { name: 'Tue', cost: 300 },
  { name: 'Wed', cost: 600 },
  { name: 'Thu', cost: 800 },
  { name: 'Fri', cost: 500 },
  { name: 'Sat', cost: 400 },
  { name: 'Sun', cost: 300 },
];

const distributionData = [
  { name: 'Compute', value: 45, color: '#3b82f6' },
  { name: 'Storage', value: 25, color: '#8b5cf6' },
  { name: 'Networking', value: 20, color: '#10b981' },
  { name: 'Database', value: 10, color: '#f59e0b' },
];

export function Overview() {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Infrastructure Dashboard</h2>
          <p className="text-slate-500 mt-1">Operational intelligence for your Google Cloud resources.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
            Export Report
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20">
            New Analysis
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-xl bg-slate-50 group-hover:scale-110 transition-transform ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className={`flex items-center text-xs font-bold ${stat.trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                {stat.trend}
                {stat.trendUp ? <ArrowUpRight className="w-3 h-3 ml-0.5" /> : <ArrowDownRight className="w-3 h-3 ml-0.5" />}
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</h3>
              <p className="text-sm font-medium text-slate-400">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Cost Analysis</h3>
                <p className="text-sm text-slate-500">7-day cloud consumption trends</p>
              </div>
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={costData}>
                  <defs>
                    <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#94a3b8' }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="cost" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorCost)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Activity</h3>
            <RecentActivity />
          </div>
        </div>

        <div className="space-y-8">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Resource Distribution</h3>
            <p className="text-sm text-slate-500 mb-8">Allocation by service category</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {distributionData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-medium text-slate-600">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-slate-900 text-white rounded-2xl shadow-xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-blue-600/30 blur-3xl rounded-full transition-all group-hover:scale-110" />
            <div className="relative z-10">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Terminal className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI Cloud Concierge</h3>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                Need help with a deployment? Just ask. I can generate Terraform or debug K8s issues.
              </p>
              
              <div className="flex gap-2 bg-slate-800 p-1.5 rounded-xl border border-slate-700">
                <input 
                  type="text" 
                  placeholder="Analyze prod-logs..." 
                  className="flex-1 bg-transparent border-none rounded-lg px-3 py-2 text-xs focus:outline-none placeholder:text-slate-500"
                />
                <button className="p-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/40">
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
