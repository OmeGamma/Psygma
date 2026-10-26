import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Leaf, Activity, Moon, Sun, Coffee } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
  {
    id: 'feeling',
    question: 'How are you feeling right now?',
    options: [
      { label: 'Calm', icon: Leaf },
      { label: 'Good', icon: Sun },
      { label: 'Tired', icon: Moon },
      { label: 'Stressed', icon: Activity },
      { label: 'Low', icon: Coffee }
    ]
  },
  {
    id: 'sleep',
    question: 'How was your sleep?',
    type: 'slider',
    labels: ['Poor', 'Excellent']
  },
  {
    id: 'energy',
    question: 'How energetic do you feel?',
    type: 'slider',
    labels: ['Exhausted', 'High Energy']
  },
  {
    id: 'time',
    question: 'How much time do you have for yourself today?',
    options: [
      { label: '5-10 min' },
      { label: '30 min' },
      { label: '1 hour' },
      { label: 'Free evening' },
    ]
  }
];

const CheckIn = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(curr => curr + 1);
    } else {
      navigate('/dashboard');
    }
  };

  const handleSelectOption = (option: string) => {
    setAnswers({ ...answers, [steps[currentStep].id]: option });
    setTimeout(handleNext, 300);
  };

  const step = steps[currentStep];

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col justify-center items-center p-4 relative"
      style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&q=80)' }}
    >
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm z-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-psygma-bg/80 to-psygma-earth/30 z-0" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card-dark max-w-xl w-full p-8 md:p-12 relative z-10 text-white"
      >
        <div className="mb-8 flex justify-between items-center text-sm font-medium text-white/70">
          <span>Step {currentStep + 1} of {steps.length}</span>
          <button onClick={() => navigate('/')} className="hover:text-white transition">Cancel</button>
        </div>

        <div className="min-h-[250px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-8"
            >
              <h2 className="text-3xl md:text-4xl font-serif text-center mb-4">
                {step.question}
              </h2>

              {step.options ? (
                <div className="flex flex-wrap justify-center gap-4">
                  {step.options.map((opt: any) => {
                    const Icon = opt.icon;
                    const isSelected = answers[step.id] === opt.label;
                    return (
                      <button
                        key={opt.label}
                        onClick={() => handleSelectOption(opt.label)}
                        className={clsx(
                          "px-6 py-4 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-3 min-w-[100px]",
                          isSelected 
                            ? "bg-white text-psygma-earth border-white shadow-lg scale-105" 
                            : "bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/40"
                        )}
                      >
                        {Icon && <Icon className="w-6 h-6" />}
                        <span className="font-medium">{opt.label}</span>
                      </button>
                    )
                  })}
                </div>
              ) : step.type === 'slider' ? (
                <div className="w-full px-4 flex flex-col gap-6 items-center">
                  <input 
                    type="range" 
                    min="1" max="10" 
                    defaultValue="5"
                    onChange={(e) => setAnswers({ ...answers, [step.id]: e.target.value })}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                  />
                  <div className="flex justify-between w-full text-white/80 text-sm">
                    <span>{step.labels?.[0]}</span>
                    <span>{step.labels?.[1]}</span>
                  </div>
                  <button 
                    onClick={handleNext}
                    className="pill-button bg-white text-psygma-earth mt-4 px-10 py-3"
                  >
                    Continue
                  </button>
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>

        {currentStep === steps.length - 1 && step.options && (
          <div className="mt-8 flex justify-center">
            <button 
              onClick={() => navigate('/dashboard')}
              className="pill-button bg-white text-psygma-text hover:bg-white/90 shadow-xl px-8 py-4 text-lg w-full flex justify-center"
            >
              Generate My Wellness Insight
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CheckIn;
