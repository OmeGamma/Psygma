import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Target, TrendingUp, Calendar } from 'lucide-react';

const weeklyData = [
  { day: 'Mon', stress: 45, sleep: 7.2, energy: 60 },
  { day: 'Tue', stress: 65, sleep: 5.5, energy: 40 },
  { day: 'Wed', stress: 55, sleep: 6.8, energy: 55 },
  { day: 'Thu', stress: 40, sleep: 7.5, energy: 75 },
  { day: 'Fri', stress: 35, sleep: 8.0, energy: 85 },
  { day: 'Sat', stress: 25, sleep: 8.5, energy: 90 },
  { day: 'Sun', stress: 30, sleep: 7.8, energy: 80 },
];

const Progress = () => {
  return (
    <div className="py-6 max-w-5xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-serif text-psygma-text mb-2">Your Progress</h1>
        <p className="text-psygma-muted">Understanding your wellness trends</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6 flex flex-col gap-2">
          <div className="flex justify-between">
            <span className="text-psygma-muted text-sm uppercase tracking-wider font-semibold">Avg Sleep</span>
            <Calendar className="w-4 h-4 text-psygma-olive" />
          </div>
          <div className="text-3xl font-serif text-psygma-text">7.3<span className="text-lg text-psygma-muted">h</span></div>
          <p className="text-xs text-green-600 font-medium">+0.4h from last week</p>
        </div>
        
        <div className="glass-card p-6 flex flex-col gap-2">
          <div className="flex justify-between">
            <span className="text-psygma-muted text-sm uppercase tracking-wider font-semibold">Stress Trend</span>
            <TrendingUp className="w-4 h-4 text-psygma-earth" />
          </div>
          <div className="text-3xl font-serif text-psygma-text">Down</div>
          <p className="text-xs text-green-600 font-medium">15% improvement</p>
        </div>

        <div className="glass-card p-6 flex flex-col gap-2">
          <div className="flex justify-between">
            <span className="text-psygma-muted text-sm uppercase tracking-wider font-semibold">Goals Met</span>
            <Target className="w-4 h-4 text-psygma-olive" />
          </div>
          <div className="text-3xl font-serif text-psygma-text">4<span className="text-lg text-psygma-muted">/5</span></div>
          <p className="text-xs text-psygma-muted font-medium">Activities completed</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trend Chart */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-serif mb-6">Energy vs Stress</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#77736A' }} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                  cursor={{ stroke: 'rgba(0,0,0,0.05)', strokeWidth: 2 }}
                />
                <Line type="monotone" dataKey="energy" stroke="#AAB49A" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} name="Energy" />
                <Line type="monotone" dataKey="stress" stroke="#756451" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} name="Stress" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Pattern Discovery */}
        <div className="glass-card bg-psygma-earth p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingUp className="w-40 h-40" />
          </div>
          
          <div className="relative z-10">
            <div className="text-xs font-semibold tracking-wider uppercase text-white/70 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white/80 animate-pulse"></span>
              Pattern discovered
            </div>
            
            <h3 className="text-2xl font-serif mb-4 leading-relaxed">
              On days when your sleep is lower than usual (like Tuesday), you tend to report higher stress and lower energy.
            </h3>
            
            <p className="text-sm text-white/80 mb-6 bg-white/10 p-4 rounded-xl border border-white/10">
              * Note: These are personal patterns based on your inputs, intended for wellness support, not medical causation.
            </p>

            <button className="pill-button bg-white text-psygma-earth hover:bg-white/90 shadow-md">
              Adjust Sleep Goals
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
