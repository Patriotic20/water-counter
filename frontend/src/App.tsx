import { useState, useEffect } from 'react';
import { Droplet, TrendingUp, BarChart3, Activity, Waves } from 'lucide-react';

function App() {
  const [totalWater, setTotalWater] = useState<number>(0);
  const [currentFlow, setCurrentFlow] = useState<number>(0);

  // Dummy effect for visual simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFlow(Math.random() * 2 + 0.5); // Random flow between 0.5 and 2.5 L/min
      setTotalWater(prev => prev + 0.05); // Slowly increment total
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-blue-500/30">

      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-600/10 blur-[120px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 py-12 flex flex-col gap-12">

        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Waves className="h-6 w-6 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">AquaTrack</h1>
              <p className="text-sm font-medium text-slate-400">Smart Water Monitoring</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800">
            <Activity className="h-4 w-4 text-emerald-400 animate-pulse" />
            <span className="text-sm font-medium text-slate-300">System Online</span>
          </div>
        </header>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Total Consumption Card */}
          <div className="group relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-8 transition-all hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
                  <Droplet className="h-6 w-6" />
                </div>
                <h2 className="text-lg font-semibold text-slate-300">Total Consumption</h2>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black tracking-tighter text-white">
                  {totalWater.toFixed(1)}
                </span>
                <span className="text-xl font-medium text-slate-500">Liters</span>
              </div>
              <div className="mt-6 flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-400 font-medium">+2.4%</span>
                <span className="text-slate-500">vs yesterday</span>
              </div>
            </div>
            {/* Decorative background element */}
            <Droplet className="absolute -bottom-6 -right-6 h-48 w-48 text-blue-500/5 rotate-12 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-700 ease-out" />
          </div>

          {/* Current Flow Rate Card */}
          <div className="group relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-8 transition-all hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400">
                  <Activity className="h-6 w-6" />
                </div>
                <h2 className="text-lg font-semibold text-slate-300">Live Flow Rate</h2>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black tracking-tighter text-white tabular-nums">
                  {currentFlow.toFixed(2)}
                </span>
                <span className="text-xl font-medium text-slate-500">L/min</span>
              </div>

              {/* Animated Progress Bar */}
              <div className="mt-8 relative h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 ease-out rounded-full"
                  style={{ width: `${Math.min((currentFlow / 5) * 100, 100)}%` }}
                />
              </div>
              <div className="mt-3 flex justify-between text-xs text-slate-500 font-medium px-1">
                <span>0 L/min</span>
                <span>5 L/min (Max)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Info Area */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 md:col-span-2 rounded-3xl bg-slate-900/50 border border-slate-800/50 p-6 flex items-center justify-center min-h-[200px] border-dashed">
            <div className="flex flex-col items-center gap-3 text-slate-500">
              <BarChart3 className="h-8 w-8 opacity-50" />
              <p className="text-sm font-medium">Historical charts will be integrated here</p>
            </div>
          </div>
          <div className="col-span-1 rounded-3xl bg-slate-900/50 border border-slate-800/50 p-6">
            <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">Device Status</h3>
            <ul className="space-y-4">
              <li className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Sensor Connection</span>
                <span className="text-sm font-medium text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Active
                </span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Last Sync</span>
                <span className="text-sm font-medium text-slate-300">Just now</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Battery Level</span>
                <span className="text-sm font-medium text-slate-300">98%</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
