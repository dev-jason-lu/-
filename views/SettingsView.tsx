
import React from 'react';
import { AppTheme, ThemeColor, UserProfile } from '../types';
import { User, Paintbrush, Bell, LogOut, Save, Info } from 'lucide-react';

interface SettingsViewProps {
  theme: AppTheme;
  setTheme: (color: ThemeColor) => void;
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
  onResetTutorial: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ theme, setTheme, profile, setProfile, onResetTutorial }) => {
  
  const handleSaveProfile = (key: keyof UserProfile, value: string) => {
    setProfile({ ...profile, [key]: value });
  };

  return (
    <div className="p-4 pb-24 bg-slate-50 min-h-screen animate-in fade-in">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Settings</h2>

      {/* Theme Selector */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-6">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Paintbrush size={18} className={theme.text} /> App Theme
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {[
            { id: 'rose', color: 'bg-rose-500', label: 'Love' },
            { id: 'blue', color: 'bg-blue-500', label: 'Ocean' },
            { id: 'emerald', color: 'bg-emerald-500', label: 'Nature' },
            { id: 'violet', color: 'bg-violet-500', label: 'Night' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id as ThemeColor)}
              className={`flex flex-col items-center gap-2 p-2 rounded-xl border-2 transition-all ${
                theme.id === t.id ? `${theme.border} bg-slate-50 scale-105` : 'border-transparent hover:bg-slate-50'
              }`}
            >
              <div className={`w-8 h-8 rounded-full ${t.color} shadow-sm`}></div>
              <span className="text-xs font-medium text-slate-600">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Profile Settings */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-6">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <User size={18} className={theme.text} /> Profile & Couple
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">My Name</label>
            <input 
              type="text" 
              value={profile.name}
              onChange={(e) => handleSaveProfile('name', e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-current"
              style={{ color: 'inherit' }} // Needs specific theme handling if focus ring needed
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Partner's Name</label>
            <input 
              type="text" 
              value={profile.partnerName}
              onChange={(e) => handleSaveProfile('partnerName', e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-current"
            />
          </div>
        </div>
      </div>

      {/* App Config */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-6 space-y-4">
        <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
          <Info size={18} className={theme.text} /> App Info
        </h3>
        
        <div className="flex items-center justify-between py-2 border-b border-slate-50">
          <div className="flex items-center gap-3">
            <Bell size={20} className="text-slate-400" />
            <span className="text-sm font-medium">Daily Reminders</span>
          </div>
          <div className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${theme.primary}`}>
             <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
          </div>
        </div>

        <button 
          onClick={onResetTutorial}
          className="w-full text-left py-2 flex items-center justify-between text-sm font-medium text-slate-600 hover:text-slate-900"
        >
           <span>Replay Tutorial</span>
           <span className="text-xs bg-slate-100 px-2 py-1 rounded">Restart</span>
        </button>
      </div>

      <div className="text-center mt-8">
        <p className="text-xs text-slate-400 mb-2">Love & Kitchen v1.2.0</p>
        <button className="text-rose-400 text-sm font-medium flex items-center justify-center gap-2 mx-auto hover:opacity-80">
          <LogOut size={16} /> Sign Out
        </button>
      </div>

    </div>
  );
};
