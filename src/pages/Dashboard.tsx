import React from 'react';
import { ArrowRight, Leaf, Activity, Sun, Moon, Battery, Brain } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="py-6 flex flex-col gap-8 max-w-5xl mx-auto">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-serif text-psygma-text mb-2">Good evening, Sameer.</h1>
        <p className="text-psygma-muted text-lg">Let's check in with yourself.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Wellness Card */}
        <div className="md:col-span-2 glass-card p-8 bg-gradient-to-br from-white/80 to-psygma-sand/20 border-psygma-sand">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-sm font-semibold tracking-widest uppercase text-psygma-muted mb-2">Overall Wellness</h2>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-serif text-psygma-text">76</span>
                <span className="text-xl text-psygma-muted mb-1">/ 100</span>
              </div>
            </div>
            <div className="w-16 h-16 rounded-full bg-psygma-bg flex items-center justify-center text-psygma-olive shadow-sm">
              <Leaf className="w-8 h-8" />
            </div>
          </div>
          
          <p className="text-lg text-psygma-text font-medium">Looking balanced, with some room for recovery.</p>
          <p className="text-sm text-psygma-muted mt-2 mb-6">AI estimate based on your recent inputs</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Metric title="Stress" value="Moderate" icon={Activity} />
            <Metric title="Energy" value="68" icon={Battery} />
            <Metric title="Recovery" value="54" icon={Brain} />
            <Metric title="Mood" value="Good" icon={Sun} />
            <Metric title="Activity" value="62" icon={Activity} />
            <Metric title="Sleep" value="6h 20m" icon={Moon} />
          </div>
        </div>

        {/* AI Insight Card */}
        <div className="md:col-span-1 glass-card p-6 bg-psygma-earth text-white/90 border-transparent shadow-xl relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Brain className="w-32 h-32" />
          </div>
          
          <div className="relative z-10 flex-1">
            <h3 className="text-xs font-semibold tracking-wider uppercase text-white/70 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white/80 animate-pulse"></span>
              What PSYGMA noticed
            </h3>
            
            <p className="text-lg font-serif mb-6 leading-relaxed">
              Your stress appears slightly higher than your usual baseline today.
            </p>
            
            <div className="text-sm mb-6 text-white/80 space-y-2">
              <p className="font-medium text-white">Possible contributors:</p>
              <p>• Sleep below your normal range</p>
              <p>• Longer study/work session</p>
              <p>• Less outdoor activity</p>
            </div>
          </div>
          
          <div className="relative z-10 pt-6 border-t border-white/20">
            <p className="text-sm font-medium mb-4">What would you like to do?</p>
            <div className="flex flex-wrap gap-2">
              <button className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-sm transition">Calm Now</button>
              <button className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-sm transition">Go Outside</button>
              <button className="px-4 py-2 rounded-full bg-white text-psygma-earth text-sm font-medium transition hover:bg-white/90">Explore Options</button>
            </div>
          </div>
        </div>
      </div>

      {/* Wellness Timeline (Preview) */}
      <div className="mt-4">
        <h3 className="text-xl font-serif text-psygma-text mb-6">Recent Trends</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TimelineCard day="Monday" stress="Moderate" sleep="7h" activity="High" />
          <TimelineCard day="Tuesday" stress="Elevated" sleep="5h" activity="Low" />
          <TimelineCard day="Wednesday" stress="Low" sleep="7h 40m" activity="Moderate" />
        </div>
      </div>
    </div>
  );
};

const Metric = ({ title, value, icon: Icon }: { title: string, value: string, icon: any }) => (
  <div className="bg-white/50 rounded-xl p-3 flex items-center gap-3">
    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-psygma-muted shadow-sm">
      <Icon className="w-4 h-4" />
    </div>
    <div>
      <div className="text-xs text-psygma-muted font-medium">{title}</div>
      <div className="text-sm text-psygma-text font-semibold">{value}</div>
    </div>
  </div>
);

const TimelineCard = ({ day, stress, sleep, activity }: { day: string, stress: string, sleep: string, activity: string }) => (
  <div className="glass-card p-5 hover:bg-white/40 transition">
    <div className="font-serif font-medium text-lg mb-4">{day}</div>
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-psygma-muted">Stress</span>
        <span className="font-medium text-psygma-text">{stress}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-psygma-muted">Sleep</span>
        <span className="font-medium text-psygma-text">{sleep}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-psygma-muted">Activity</span>
        <span className="font-medium text-psygma-text">{activity}</span>
      </div>
    </div>
  </div>
);

export default Dashboard;
