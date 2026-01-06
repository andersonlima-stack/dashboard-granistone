import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, Legend, ComposedChart,
  Line, LabelList, Area
} from 'recharts';
import {
  TrendingUp, TrendingDown, DollarSign, Package,
  Users, BarChart3, Layers, Settings, Maximize2,
  Activity, ArrowUpRight, Calendar
} from 'lucide-react';
import { dailyPerformance, topMaterials, kpis, indicatorsData, sectors } from './data';

// A premium, highly aesthetic chart component
const PremiumIndicatorChart = ({ title, sector, data, unit, meta }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const isPercent = unit && typeof unit === 'string' && unit.includes('%');
  const suffix = isPercent ? '%' : '';

  // Get current and previous period averages (MÉD is the last index)
  const medData = data && data.length > 0 ? data[data.length - 1] : {};
  const med2024 = medData ? medData['2024'] : null;
  const med2025 = medData ? medData['2025'] : null;

  // Calculate variance safely
  const variance = (med2024 && med2025 && med2024 !== 0) ? ((med2025 / med2024) - 1) * 100 : 0;
  const isPositive = variance > 0;

  const renderCustomLabel = (props) => {
    const { x, y, width, value } = props;
    if (value === null || value === undefined) return null;
    return (
      <text
        x={x + width / 2}
        y={y - 12}
        fill={hoveredIndex !== null ? "#3b82f6" : "#f8fafc"}
        textAnchor="middle"
        className="text-[10px] font-black tracking-tighter transition-colors duration-300"
      >
        {value.toLocaleString()}{suffix}
      </text>
    );
  };

  return (
    <div className="relative group overflow-hidden rounded-[2.5rem] bg-[#0f172a]/40 border border-white/5 backdrop-blur-3xl p-8 transition-all duration-500 hover:shadow-[0_0_50px_-12px_rgba(59,130,246,0.15)] hover:border-primary/20">
      {/* Decorative background blurs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-primary/10 transition-colors duration-500" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-emerald-500/10 transition-colors duration-500" />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary-light text-[10px] font-black uppercase tracking-widest border border-primary/20">
              {sector}
            </span>
            <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <Activity size={12} className="text-emerald-500" /> Real-time Data
            </span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter">
            {title.split('(')[0]}
            <span className="text-primary-light font-medium ml-2 opacity-50">({unit})</span>
          </h2>
        </div>

        <div className="flex gap-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-center">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Meta 2025</p>
            <p className="text-xl font-black text-emerald-400">{meta?.toLocaleString() || 'N/A'}{suffix} <span className="text-xs opacity-50">{unit}</span></p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-center">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Média 2025</p>
            <div className="flex items-center gap-2">
              <p className="text-xl font-black text-white">{med2025?.toLocaleString() || '-'}{suffix}</p>
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
              tickFormatter={(v) => `${v}${suffix}`}
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
                              {entry.value ? entry.value.toLocaleString() : '-'}{suffix}
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

            <Bar
              name="Realizado 2024"
              dataKey="2024"
              fill="url(#barGradient2024)"
              radius={[6, 6, 0, 0]}
              barSize={18}
              animationDuration={1500}
            >
              <LabelList dataKey="2024" content={renderCustomLabel} />
            </Bar>

            <Bar
              name="Realizado 2025"
              dataKey="2025"
              fill="url(#barGradient2025)"
              radius={[6, 6, 0, 0]}
              barSize={18}
              animationDuration={2000}
            >
              <LabelList dataKey="2025" content={renderCustomLabel} />
            </Bar>

            <Line
              name="Meta"
              type="monotone"
              dataKey="Meta"
              stroke="#10b981"
              strokeWidth={4}
              dot={false}
              filter="url(#glow)"
              animationDuration={3000}
            />
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
  const [selectedSector, setSelectedSector] = useState(sectors[0] || 'Beneficiamento');
  const [showKPIs, setShowKPIs] = useState(false);

  const filteredIndicators = indicatorsData.filter(ind => ind.sector === selectedSector);

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
                setShowKPIs(false);
              }}
              className="bg-transparent border-none text-[11px] font-black uppercase tracking-widest focus:ring-0 cursor-pointer outline-none"
            >
              {sectors.map(s => <option key={s} value={s} className="bg-[#0f172a]">{s}</option>)}
            </select>
          </div>
          <button
            onClick={() => setShowKPIs(!showKPIs)}
            className={`flex items-center gap-3 px-8 py-3 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all duration-500 ${showKPIs ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <Activity size={18} /> {showKPIs ? 'Ver Gráficos' : 'Ver KPIs'}
          </button>
        </div>

        <div className="hidden 2xl:flex items-center gap-4 bg-white/5 px-6 py-3 rounded-2xl border border-white/5">
          <Calendar size={18} className="text-primary-light" />
          <div className="flex flex-col leading-none">
            <span className="text-[10px] font-black text-slate-500 uppercase">Período Atual</span>
            <span className="text-sm font-black text-white">DEZEMBRO 2025</span>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <main className="relative z-20 max-w-7xl mx-auto space-y-12">
        {!showKPIs ? (
          <div className="grid grid-cols-1 gap-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {filteredIndicators.length > 0 ? (
              filteredIndicators.map((indicator, index) => (
                <PremiumIndicatorChart
                  key={`${selectedSector}-${index}`}
                  title={indicator.title}
                  sector={indicator.sector}
                  data={indicator.data}
                  unit={indicator.unit}
                  meta={indicator.meta || 0}
                />
              ))
            ) : (
              <div className="text-center py-20 bg-white/5 rounded-[2.5rem] border border-white/5">
                <p className="text-slate-500 uppercase tracking-widest font-black">Nenhum dado encontrado para este setor</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {kpis.map((kpi, i) => (
              <div key={i} className="glass-card p-10 rounded-[2rem] border border-white/5 relative group hover:border-primary/30 transition-all duration-500">
                <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity">
                  <Activity className="text-primary-light" size={24} />
                </div>
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">{kpi.label}</p>
                <h3 className="text-3xl font-black text-white">{kpi.value}</h3>
                <div className={`flex items-center gap-1 mt-4 text-[10px] font-black ${kpi.tendance === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {kpi.tendance === 'up' ? <ArrowUpRight size={14} /> : <TrendingDown size={14} />}
                  <span>{kpi.change} VS MÊS ANTERIOR</span>
                </div>
              </div>
            ))}
          </div>
        )}
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
