
import React, { useState } from 'react';
import { AppTheme } from '../types';
import { X, ChevronRight, Check } from 'lucide-react';

interface TutorialOverlayProps {
  onComplete: () => void;
  theme: AppTheme;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ onComplete, theme }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Love & Kitchen! 🍳",
      desc: "The perfect app to spice up your relationship. Let's take a quick tour.",
      icon: "👋"
    },
    {
      title: "Plan Your Menu 📝",
      desc: "Add your favorite dishes or let our AI generate recipes for you.",
      icon: "🍲"
    },
    {
      title: "Earn Love Coins 🪙",
      desc: "Cook meals to earn coins. Spend them in the Store for real-life rewards like massages!",
      icon: "🎁"
    },
    {
      title: "Capture Memories 📸",
      desc: "Take photos of your meals to build a shared culinary diary.",
      icon: "❤️"
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Background Decoration */}
        <div className={`absolute top-0 left-0 w-full h-2 ${theme.primary}`}></div>
        <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full ${theme.secondary} opacity-50 blur-2xl`}></div>

        <button 
            onClick={onComplete}
            className="absolute top-4 right-4 text-slate-300 hover:text-slate-500"
        >
            <X size={24} />
        </button>

        <div className="text-center mt-4">
          <div className="text-6xl mb-6 animate-bounce duration-[2000ms]">{steps[step].icon}</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">{steps[step].title}</h2>
          <p className="text-slate-500 leading-relaxed mb-8">{steps[step].desc}</p>
          
          <div className="flex items-center justify-center gap-2 mb-8">
            {steps.map((_, i) => (
                <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === step ? `w-8 ${theme.primary}` : 'w-2 bg-slate-200'}`}></div>
            ))}
          </div>

          <button 
            onClick={handleNext}
            className={`w-full py-3.5 rounded-2xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 ${theme.primary} ${theme.shadow}`}
          >
            {step === steps.length - 1 ? (
                <>Get Started <Check size={20} /></>
            ) : (
                <>Next <ChevronRight size={20} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
