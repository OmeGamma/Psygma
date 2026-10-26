import React from 'react';
import { User, Shield, Bell, Database, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const handleSignOut = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/sign-in');
  };
  
  return (
    <div className="py-6 max-w-4xl mx-auto">
      <header className="mb-8 flex items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-psygma-sand flex items-center justify-center text-psygma-earth shadow-inner border-4 border-white">
          <User className="w-10 h-10" />
        </div>
        <div>
          <h1 className="text-3xl font-serif text-psygma-text">Sameer</h1>
          <p className="text-psygma-muted">Joined September 2026</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* Preferences */}
          <section className="glass-card p-6">
            <h2 className="text-xl font-serif text-psygma-text mb-4">Wellness Preferences</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-psygma-sand/30">
                <div>
                  <div className="font-medium">Primary Interests</div>
                  <div className="text-sm text-psygma-muted">Nature, Walking, Meditation</div>
                </div>
                <button className="text-sm text-psygma-earth font-medium">Edit</button>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-psygma-sand/30">
                <div>
                  <div className="font-medium">Social Preference</div>
                  <div className="text-sm text-psygma-muted">Mix of Solo and Social activities</div>
                </div>
                <button className="text-sm text-psygma-earth font-medium">Edit</button>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">Typical Sleep</div>
                  <div className="text-sm text-psygma-muted">7h - 8h (Goal)</div>
                </div>
                <button className="text-sm text-psygma-earth font-medium">Edit</button>
              </div>
            </div>
          </section>

          {/* Privacy Center */}
          <section className="glass-card p-6">
            <h2 className="text-xl font-serif text-psygma-text mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-psygma-olive" /> Privacy Center
            </h2>
            <p className="text-sm text-psygma-muted mb-6">
              You control what you share. Your data is stored securely and is only used to personalize your wellness experience.
            </p>
            
            <div className="space-y-4">
              <ToggleRow title="Location Permission" desc="For nearby activity recommendations" enabled={true} />
              <ToggleRow title="Optional Health Measurements" desc="Include data from external devices" enabled={false} />
              <ToggleRow title="Personalized AI Insights" desc="Allow AI to analyze your trends" enabled={true} />
            </div>
            
            <div className="mt-8 pt-6 border-t border-psygma-sand/30 flex gap-4">
              <button className="text-sm font-medium flex items-center gap-2 text-psygma-earth bg-psygma-bg px-4 py-2 rounded-lg">
                <Database className="w-4 h-4" /> Export Data
              </button>
              <button className="text-sm font-medium text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg transition">
                Delete Account
              </button>
            </div>
          </section>
        </div>

        {/* Sidebar settings */}
        <div className="md:col-span-1 space-y-4">
          <button className="w-full glass-card p-4 flex items-center gap-3 hover:bg-white transition text-left">
            <Bell className="w-5 h-5 text-psygma-muted" />
            <div className="font-medium">Notifications</div>
          </button>
          
          <button onClick={handleSignOut} className="w-full glass-card p-4 flex items-center gap-3 hover:bg-red-50 transition text-left text-red-600">
            <LogOut className="w-5 h-5" />
            <div className="font-medium">Sign Out</div>
          </button>
        </div>
      </div>
    </div>
  );
};

const ToggleRow = ({ title, desc, enabled }: { title: string, desc: string, enabled: boolean }) => (
  <div className="flex justify-between items-center">
    <div>
      <div className="font-medium text-sm">{title}</div>
      <div className="text-xs text-psygma-muted">{desc}</div>
    </div>
    <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${enabled ? 'bg-psygma-olive' : 'bg-gray-200'}`}>
      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-0'}`} />
    </div>
  </div>
);

export default Profile;
