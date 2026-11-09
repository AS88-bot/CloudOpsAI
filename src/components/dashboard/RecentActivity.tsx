import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { Terminal, Clock, ExternalLink } from 'lucide-react';

interface AnalysisRecord {
  id: string;
  type: string;
  fileName: string;
  severity: string;
  timestamp: any;
}

export function RecentActivity() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<AnalysisRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'analysis_history'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc'),
      limit(5)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AnalysisRecord[];
      setActivities(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return <div className="animate-pulse space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-16 bg-slate-100 rounded-lg" />
      ))}
    </div>;
  }

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-400 border-2 border-dashed border-slate-100 rounded-xl">
        <Clock className="w-8 h-8 mb-2 opacity-20" />
        <p className="text-sm">No recent activity found.</p>
        <p className="text-xs">Start an infrastructure analysis to see results here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-100 hover:border-blue-200 transition-colors shadow-sm">
          <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
            <Terminal className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-slate-900 truncate">{activity.fileName}</h4>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <span className="capitalize">{activity.type}</span> • {activity.timestamp?.toDate().toLocaleTimeString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
              activity.severity === 'critical' ? 'bg-red-100 text-red-700' :
              activity.severity === 'warning' ? 'bg-amber-100 text-amber-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {activity.severity || 'Analysis'}
            </span>
            <button className="p-1 hover:bg-slate-100 rounded text-slate-400">
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
