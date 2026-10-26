import React, { useState } from 'react';
import { MapPin, Clock, ArrowRight, Heart, Leaf, Activity, Zap } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

const categories = [
  { id: 'all', label: 'All Recommendations' },
  { id: 'nature', label: 'Nature Explorer', icon: Leaf },
  { id: 'mind', label: 'Mind & Calm', icon: Heart },
  { id: 'activity', label: 'Activities', icon: Activity },
];

const recommendations = [
  {
    id: 1,
    title: 'Evening Nature Walk',
    category: 'nature',
    reason: 'Your activity has been low today and the weather is suitable for going outside.',
    duration: '30 minutes',
    distance: '1.4 km',
    cost: 'Free',
    image: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&q=80',
    tags: ['Outdoor', 'Solo']
  },
  {
    id: 2,
    title: 'Guided Breathing Reset',
    category: 'mind',
    reason: 'Your mental load appears high. A short reset can lower immediate stress.',
    duration: '15 minutes',
    distance: 'At home',
    cost: 'Free',
    image: 'https://images.unsplash.com/photo-1528319725582-ddc096101511?auto=format&fit=crop&q=80',
    tags: ['Indoor', 'Mindfulness']
  },
  {
    id: 3,
    title: 'Weekend Lake Retreat',
    category: 'nature',
    reason: 'You have a free weekend coming up. A longer nature reset matches your goals.',
    duration: '2 Days',
    distance: '45 km',
    cost: '$$',
    image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&q=80',
    tags: ['Travel', 'Relaxing']
  },
  {
    id: 4,
    title: 'Light Badminton',
    category: 'activity',
    reason: 'You enjoy social sports. This is a low-stress way to increase energy.',
    duration: '45 minutes',
    distance: '2.5 km',
    cost: '$',
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80',
    tags: ['Social', 'Active']
  }
];

const Explore = () => {
  const [activeTab, setActiveTab] = useState('all');

  const filtered = activeTab === 'all' 
    ? recommendations 
    : recommendations.filter(r => r.category === activeTab);

  return (
    <div className="py-6 max-w-6xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-serif text-psygma-text mb-4">Explore Wellness</h1>
        
        {/* Category Tabs */}
        <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar">
          {categories.map(cat => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={clsx(
                  "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 whitespace-nowrap",
                  isActive 
                    ? "bg-psygma-earth text-white shadow-md" 
                    : "bg-white/60 text-psygma-muted hover:bg-white hover:text-psygma-text"
                )}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {cat.label}
              </button>
            )
          })}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
        {filtered.map((item, i) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="glass-card overflow-hidden flex flex-col md:flex-row group hover:shadow-xl transition-all duration-500"
          >
            {/* Image Section */}
            <div className="md:w-2/5 h-48 md:h-auto relative overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${item.image})` }}
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
            </div>

            {/* Content Section */}
            <div className="p-6 md:w-3/5 flex flex-col justify-between bg-gradient-to-br from-white/90 to-white/60">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-serif text-psygma-text">{item.title}</h3>
                  <button className="text-psygma-muted hover:text-psygma-earth transition">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="bg-psygma-bg/80 rounded-lg p-3 mb-4 border border-psygma-sand/30">
                  <p className="text-xs text-psygma-earth font-medium mb-1 flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Why PSYGMA recommends this
                  </p>
                  <p className="text-sm text-psygma-muted leading-snug">{item.reason}</p>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {item.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-white rounded-md text-xs font-medium text-psygma-muted border border-gray-100">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex justify-between text-sm text-psygma-muted">
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {item.duration}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {item.distance}</span>
                  <span className="font-medium text-psygma-text">{item.cost}</span>
                </div>
                
                <div className="flex gap-3 mt-2">
                  <button className="flex-1 pill-button-primary py-2.5 text-sm">
                    Start
                  </button>
                  <button className="pill-button-secondary px-4 py-2.5 text-sm">
                    Save
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Explore;
