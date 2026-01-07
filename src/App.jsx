import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, Legend, ComposedChart,
  Line, LabelList, Area
} from 'recharts';
import {
  TrendingUp, TrendingDown, DollarSign, Package,
  Users, BarChart3, Layers, Settings, Maximize2,
  Activity, ArrowUpRight, Calendar, RefreshCw
} from 'lucide-react';
import { dailyPerformance, topMaterials, kpis, indicatorsData, sectors } from './data';

const LoginScreen = ({ onLogin }) => {
  const [key, setKey] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (key.toLowerCase() === 'granistone2026') {
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020617] p-6 selection:bg-primary selection:text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in duration-700">
        <div className="bg-[#0f172a]/80 backdrop-blur-2xl p-12 rounded-[3.5rem] border border-white/10 text-center shadow-3xl">
          <div className="flex justify-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-br from-primary via-primary to-primary-light rounded-[1.5rem] flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.5)] rotate-3">
              <Activity size={40} className="text-white -rotate-3" />
            </div>
          </div>

          <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-2 italic">
            GRANISTONE <span className="text-primary-light not-italic">INTELLIGENCE</span>
          </h1>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-12 opacity-60">Portal de Acesso Restrito</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative overflow-hidden rounded-2xl">
              <input
                type="password"
                value={key}
                autoFocus
                onChange={(e) => setKey(e.target.value)}
                placeholder="Chave de Acesso"
                className={`w-full bg-white/5 border ${error ? 'border-rose-500 shadow-[0_0_25px_rgba(244,63,94,0.2)]' : 'border-white/10 focus:border-primary/50'} py-6 px-4 rounded-2xl text-white text-center font-black uppercase tracking-[0.4em] outline-none transition-all duration-500 placeholder:text-slate-700 placeholder:tracking-widest text-lg`}
              />
              {error && (
                <div className="mt-4 animate-bounce">
                  <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Acesso Negado</p>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-light text-white font-black uppercase tracking-widest py-6 rounded-2xl transition-all duration-500 shadow-[0_20px_40px_-15px_rgba(59,130,246,0.3)] active:scale-[0.97] group"
            >
              <span className="flex items-center justify-center gap-3">
                Sincronizar Acesso
              </span>
            </button>
          </form>

          <div className="mt-14 pt-10 border-t border-white/5">
            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.3em] leading-loose">
              Copyright © 2026 Granistone Industrial<br />
              Production Control Division &bull; v4.12.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// A premium, highly aesthetic chart component
const PremiumIndicatorChart = ({ indicator, selectedYears }) => {
  const { title, sector, data, unit, meta, is_pct, is_brl, is_usd } = indicator;
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const show2024 = selectedYears.includes('2024');
  const show2025 = selectedYears.includes('2025');

  const formatValue = (val) => {
    if (val === null || val === undefined) return '-';
    // Use 2 decimal places for better uniformity
    let formatted = val.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    if (is_pct) return `${formatted}%`;
    if (is_brl) return `R$ ${formatted}`;
    if (is_usd) return `US$ ${formatted}`;
    return formatted;
  };

  // Get current and previous period averages (MÉD is the last index)
  const medData = data && data.length > 0 ? data[data.length - 1] : {};
  const med2024 = medData ? medData['2024'] : null;
  const med2025 = medData ? medData['2025'] : null;

  // Calculate variance safely
  const variance = (med2024 && med2025 && med2024 !== 0) ? ((med2025 / med2024) - 1) * 100 : 0;
  const isPositive = variance > 0;

  const renderCustomLabel = (props) => {
    const { x, y, width, value, index } = props;
    if (value === null || value === undefined) return null;

    // For the Meta line, only show at the start and end to avoid clutter
    const isMetaLine = !width;
    if (isMetaLine && index !== 0 && index !== 12) return null;

    return (
      <text
        x={x + (width ? width / 2 : 0)}
        y={y - 12}
        fill={isMetaLine ? "#10b981" : (hoveredIndex !== null ? "#3b82f6" : "#f8fafc")}
        textAnchor="middle"
        className="text-[10px] font-black tracking-tighter transition-colors duration-300"
      >
        {formatValue(value)}
      </text>
    );
  };

  // Clean title: remove anything in parentheses or brackets
  const cleanTitle = title.split('(')[0].split('[')[0].trim();

  return (
    <div className="relative group overflow-hidden rounded-[2.5rem] bg-[#0f172a]/40 border border-white/5 backdrop-blur-3xl p-10 transition-all duration-500 hover:shadow-[0_0_50px_-12px_rgba(59,130,246,0.15)] hover:border-primary/20">
      {/* Decorative background blurs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-primary/10 transition-colors duration-500" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-emerald-500/10 transition-colors duration-500" />

      {/* Header */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary-light text-[10px] font-black uppercase tracking-widest border border-primary/20">
              {sector}
            </span>
            <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <Activity size={12} className="text-emerald-500" /> Real-time Data
            </span>
          </div>
          <h2 className="text-4xl xl:text-5xl font-black text-white tracking-tighter leading-[1.1] break-words">
            {cleanTitle}
          </h2>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap gap-4 flex-shrink-0">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-center min-w-[110px] h-[90px]">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 opacity-70">Unidade</p>
            <p className="text-xl font-black text-primary-light truncate">
              {is_pct ? '%' : is_brl ? 'R$' : is_usd ? 'US$' : (unit && unit !== 'None' ? unit : '-')}
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-center min-w-[110px] h-[90px]">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 opacity-70">Meta 2025</p>
            <p className="text-xl font-black text-emerald-400">{formatValue(meta)}</p>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-center min-w-[140px] h-[90px]">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 opacity-70">Média 2025</p>
            <div className="flex items-center gap-2">
              <p className="text-xl font-black text-white">{formatValue(med2025)}</p>
              {variance !== 0 && (
                <span className={`flex items-center text-[10px] font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isPositive ? <ArrowUpRight size={12} /> : <TrendingDown size={12} />}
                  {Math.abs(variance).toFixed(1)}%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative z-10 h-[450px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
            onMouseMove={(state) => {
              if (state.activeTooltipIndex !== undefined) setHoveredIndex(state.activeTooltipIndex);
            }}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <defs>
              <linearGradient id="barGradient2025" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity={1} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.8} />
              </linearGradient>
              <linearGradient id="barGradient2024" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#475569" stopOpacity={0.2} />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <CartesianGrid strokeDasharray="10 10" vertical={false} stroke="#ffffff08" />

            <XAxis
              dataKey="name"
              stroke="#64748b"
              fontSize={12}
              fontWeight="700"
              tickLine={false}
              axisLine={{ stroke: '#ffffff10' }}
              dy={15}
            />

            <YAxis
              stroke="#64748b"
              fontSize={11}
              fontWeight="600"
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => is_pct ? `${v}%` : v}
              dx={-10}
            />

            <Tooltip
              cursor={{ fill: 'rgba(255, 255, 255, 0.03)', radius: [10, 10, 0, 0] }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[#0f172a] border border-white/10 p-5 rounded-2xl shadow-2xl backdrop-blur-xl">
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-3 border-b border-white/5 pb-2">
                        Referência: {payload[0].payload.name}
                      </p>
                      <div className="space-y-3">
                        {payload.map((entry, i) => (
                          <div key={i} className="flex items-center justify-between gap-8">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                              <span className="text-white font-bold text-xs">{entry.name}</span>
                            </div>
                            <span className="text-white font-black text-sm">
                              {formatValue(entry.value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ paddingBottom: '30px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}
            />

            {show2024 && (
              <Bar
                name="Realizado 2024"
                dataKey="2024"
                fill="url(#barGradient2024)"
                radius={[6, 6, 0, 0]}
                barSize={show2025 ? 18 : 30}
                animationDuration={1500}
              >
                <LabelList dataKey="2024" content={renderCustomLabel} />
              </Bar>
            )}

            {show2025 && (
              <Bar
                name="Realizado 2025"
                dataKey="2025"
                fill="url(#barGradient2025)"
                radius={[6, 6, 0, 0]}
                barSize={show2024 ? 18 : 30}
                animationDuration={2000}
              >
                <LabelList dataKey="2025" content={renderCustomLabel} />
              </Bar>
            )}

            {/* Meta Line - Made thicker and solid for better visibility */}
            <Line
              name="Meta 2025"
              type="monotone"
              dataKey="Meta"
              stroke="#10b981"
              strokeWidth={4}
              dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#10b981' }}
              animationDuration={2000}
            >
              <LabelList dataKey="Meta" content={renderCustomLabel} />
            </Line>
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Info */}
      <div className="relative z-10 mt-10 pt-8 border-t border-white/5 flex items-center justify-between text-slate-500">
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-6 h-6 rounded-full border-2 border-[#0f172a] bg-slate-800 flex items-center justify-center text-[8px] font-black">
                {String.fromCharCode(64 + i)}
              </div>
            ))}
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Analistas Responsáveis</p>
        </div>
        <p className="text-[10px] font-bold uppercase tracking-widest">
          Sistema: Medallion 2.0 <span className="text-slate-700 ml-2">v4.12.0</span>
        </p>
      </div>
    </div>
  );
};

// Main Dashboard Shell
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('gs_auth') === 'true');
  const [selectedSector, setSelectedSector] = useState(sectors[0] || 'Beneficiamento');
  const [selectedYears, setSelectedYears] = useState(['2024', '2025']);
  const [allIndicators, setAllIndicators] = useState(indicatorsData);
  const [allSectors, setAllSectors] = useState(sectors);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('gs_auth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('gs_auth');
  };

  const fetchData = async () => {
    const API_URL = 'http://localhost:5000/api/data';
    setIsSyncing(true);
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const result = await response.json();
        setAllIndicators(result.indicatorsData);
        setAllSectors(result.sectors);
        if (result.sectors.length > 0 && !result.sectors.includes(selectedSector)) {
          setSelectedSector(result.sectors[0]);
        }
      }
    } catch (error) {
      console.error("Erro ao sincronizar dados:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Refresh every 5 minutes automatically
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  const filteredIndicators = allIndicators.filter(ind => ind.sector === selectedSector);

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 p-6 lg:p-12 font-sans selection:bg-primary selection:text-white">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px]" />
      </div>

      {/* Navigation & Header */}
      <header className="relative z-20 flex flex-col xl:flex-row items-center justify-between gap-8 mb-16">
        <div className="flex flex-col items-center xl:items-start text-center xl:text-left">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-4 h-12 bg-gradient-to-t from-primary to-primary-light rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)]" />
            <h1 className="text-5xl font-black tracking-[-0.05em] text-white uppercase italic">
              GRANISTONE <span className="not-italic text-primary-light">INTELLIGENCE</span>
            </h1>
          </div>
          <p className="text-xs font-black text-slate-500 uppercase tracking-[0.5em] ml-1">Predictive Industrial Insights</p>
        </div>

        <div className="flex items-center gap-4 p-2 bg-white/5 backdrop-blur-3xl rounded-[2rem] border border-white/5 shadow-2xl">
          <div className="flex items-center gap-3 px-6 py-2 border-r border-white/10">
            <Layers size={18} className="text-primary-light" />
            <select
              value={selectedSector}
              onChange={(e) => {
                setSelectedSector(e.target.value);
              }}
              className="bg-transparent border-none text-[11px] font-black uppercase tracking-widest focus:ring-0 cursor-pointer outline-none min-w-[140px]"
            >
              {allSectors.map(s => <option key={s} value={s} className="bg-[#0f172a]">{s}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-3 px-6 py-2 border-r border-white/10">
            <Calendar size={18} className="text-emerald-400" />
            <select
              value={selectedYears.join(',')}
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'ALL') setSelectedYears(['2024', '2025']);
                else setSelectedYears([val]);
              }}
              className="bg-transparent border-none text-[11px] font-black uppercase tracking-widest focus:ring-0 cursor-pointer outline-none"
            >
              <option value="ALL" className="bg-[#0f172a]">2024 + 2025</option>
              <option value="2025" className="bg-[#0f172a]">Apenas 2025</option>
              <option value="2024" className="bg-[#0f172a]">Apenas 2024</option>
            </select>
          </div>
        </div>

        <button
          onClick={fetchData}
          disabled={isSyncing}
          className={`group flex items-center gap-4 px-8 py-4 rounded-2xl border transition-all duration-300 ${isSyncing ? 'bg-slate-800 border-white/5 opacity-50' : 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20'}`}
        >
          <div className={`p-2 bg-emerald-500 rounded-lg transition-transform duration-700 ${isSyncing ? 'animate-spin' : 'group-hover:rotate-180'}`}>
            <RefreshCw size={18} className="text-white" />
          </div>
          <div className="flex flex-col items-start leading-none">
            <span className="text-[10px] font-black text-emerald-500/70 uppercase tracking-widest mb-1">Base de Dados</span>
            <span className="text-sm font-black text-white group-active:scale-95 transition-transform">
              {isSyncing ? 'SINCRONIZANDO...' : 'ATUALIZAR AGORA'}
            </span>
          </div>
        </button>

        <button
          onClick={handleLogout}
          className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-rose-500/10 hover:border-rose-500/20 text-slate-500 hover:text-rose-400 transition-all group"
          title="Sair do Sistema"
        >
          <Settings size={20} className="group-hover:rotate-90 transition-transform duration-500" />
        </button>
      </header>

      {/* Content Area */}
      <main className="relative z-20 max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-1 gap-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          {filteredIndicators.length > 0 ? (
            filteredIndicators.map((indicator, index) => (
              <PremiumIndicatorChart
                key={`${selectedSector}-${index}`}
                indicator={indicator}
                selectedYears={selectedYears}
              />
            ))
          ) : (
            <div className="text-center py-20 bg-white/5 rounded-[2.5rem] border border-white/5">
              <p className="text-slate-500 uppercase tracking-widest font-black">Nenhum dado encontrado para este setor</p>
            </div>
          )}
        </div>
      </main>

      <footer className="relative z-20 mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-slate-600 text-[10px] font-black uppercase tracking-[0.6em] pb-12">
        <p>Granistone Intelligence &bull; Production Control Division</p>
        <div className="flex gap-12">
          <a href="#" className="hover:text-primary transition-all">Support</a>
          <a href="#" className="hover:text-primary transition-all">Global Analytics</a>
          <a href="#" className="hover:text-primary transition-all">Privacy</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
