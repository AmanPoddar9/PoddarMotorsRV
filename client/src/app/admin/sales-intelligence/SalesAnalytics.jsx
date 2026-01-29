import { useState, useEffect } from 'react';
import { getCallHistory } from '@/utils/audioApi';
import { FaChartPie, FaCheckCircle, FaExclamationTriangle, FaUserTie } from 'react-icons/fa';

export default function SalesAnalytics() {
  const [stats, setStats] = useState({
    totalCalls: 0,
    hotLeads: 0,
    warmLeads: 0,
    complianceScore: 0,
    topObjections: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    calculateStats();
  }, []);

  const calculateStats = async () => {
    try {
      // Fetch last 100 calls for analytics sample
      const response = await getCallHistory(1, 100);
      const calls = response.data || [];
      
      let hot = 0, warm = 0, cold = 0;
      let brandPitchCount = 0;
      let processExplainedCount = 0;
      let totalCoached = 0;
      const objectionMap = {};

      calls.forEach(call => {
        // Lead Status
        const status = call.structuredData?.customerStatus || 'Unknown';
        if (status === 'Hot') hot++;
        else if (status === 'Warm') warm++;
        else cold++;

        // Coaching Compliance
        if (call.coaching) {
          totalCoached++;
          if (call.coaching.brandPitchDetected) brandPitchCount++;
          if (call.coaching.processExplained) processExplainedCount++;
        }

        // Objections
        if (call.analysis?.objectionsRaised) {
          call.analysis.objectionsRaised.forEach(obj => {
            objectionMap[obj] = (objectionMap[obj] || 0) + 1;
          });
        }
      });

      // Calculate aggregated metrics
      const compliance = totalCoached > 0 
        ? Math.round(((brandPitchCount + processExplainedCount) / (totalCoached * 2)) * 100) 
        : 0;

      const topObjections = Object.entries(objectionMap)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([text, count]) => ({ text, count }));

      setStats({
        totalCalls: calls.length,
        hotLeads: hot,
        warmLeads: warm,
        coldLeads: cold,
        complianceScore: compliance,
        brandPitchPct: totalCoached ? Math.round((brandPitchCount / totalCoached) * 100) : 0,
        processPct: totalCoached ? Math.round((processExplainedCount / totalCoached) * 100) : 0,
        topObjections
      });
      
      setLoading(false);

    } catch (error) {
      console.error("Analytics error:", error);
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading Analytics...</div>;

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-semibold uppercase">Total Interactions</div>
          <div className="text-2xl font-bold text-slate-800 mt-1">{stats.totalCalls}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-semibold uppercase">Hot Leads Generated</div>
          <div className="text-2xl font-bold text-red-600 mt-1">{stats.hotLeads}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
           <div className="text-slate-500 text-xs font-semibold uppercase">Script Compliance</div>
           <div className="flex items-end">
             <div className="text-2xl font-bold text-indigo-600 mt-1">{stats.complianceScore}%</div>
             <div className="text-xs text-slate-400 mb-1 ml-2">avg score</div>
           </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
           <div className="text-slate-500 text-xs font-semibold uppercase">Warm Prospects</div>
           <div className="text-2xl font-bold text-orange-500 mt-1">{stats.warmLeads}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Compliance Breakdown */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center">
            <FaUserTie className="mr-2 text-indigo-500" /> Sales Script Compliance
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600">Brand Pitch Compliance</span>
                <span className="font-semibold text-slate-800">{stats.brandPitchPct}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full" 
                  style={{ width: `${stats.brandPitchPct}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600">Process Explanation</span>
                <span className="font-semibold text-slate-800">{stats.processPct}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full" 
                  style={{ width: `${stats.processPct}%` }}
                ></div>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4 italic">
            *Percentage of interactions where the rep successfully mentioned key required topics.
          </p>
        </div>

        {/* Lead Quality & Objections */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center">
            <FaChartPie className="mr-2 text-indigo-500" /> Lead Quality & Insights
          </h3>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1 bg-red-50 p-3 rounded-lg text-center">
              <div className="text-xs text-red-600 font-bold">HOT</div>
              <div className="text-lg font-bold text-red-800">{stats.hotLeads}</div>
            </div>
            <div className="flex-1 bg-orange-50 p-3 rounded-lg text-center">
              <div className="text-xs text-orange-600 font-bold">WARM</div>
              <div className="text-lg font-bold text-orange-800">{stats.warmLeads}</div>
            </div>
            <div className="flex-1 bg-blue-50 p-3 rounded-lg text-center">
              <div className="text-xs text-blue-600 font-bold">COLD</div>
              <div className="text-lg font-bold text-blue-800">{stats.coldLeads}</div>
            </div>
          </div>

          <div>
             <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Common Objections</h4>
             <div className="space-y-2">
               {stats.topObjections.length > 0 ? (
                 stats.topObjections.map((obj, i) => (
                   <div key={i} className="flex justify-between items-center text-sm p-2 bg-slate-50 rounded">
                     <span className="text-slate-700 truncate mr-2">{obj.text}</span>
                     <span className="bg-slate-200 text-slate-600 text-xs px-2 py-0.5 rounded-full">{obj.count}</span>
                   </div>
                 ))
               ) : (
                 <div className="text-sm text-slate-400 italic">No objections recorded yet.</div>
               )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
