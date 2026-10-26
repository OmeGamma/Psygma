import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Auth = ({ type = 'signin' }: { type?: 'signin' | 'signup' }) => {
  const isSignIn = type === 'signin';
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock authentication
    localStorage.setItem('isAuthenticated', 'true');
    navigate('/check-in');
  };

  return (
    <div className="min-h-screen bg-psygma-bg flex">
      {/* Left side - Form */}
      <div className="w-full md:w-[450px] lg:w-[500px] bg-white flex flex-col justify-center px-12 md:px-16 shadow-2xl relative z-10">
        <Link to="/" className="flex items-center gap-2 text-psygma-earth absolute top-8 left-12 md:left-16">
          <Leaf className="w-6 h-6" />
          <span className="text-xl font-serif font-semibold tracking-wide">PSYGMA</span>
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-serif text-psygma-text mb-2">
            {isSignIn ? 'Welcome back.' : 'Join Psygma.'}
          </h1>
          <p className="text-psygma-muted mb-10 text-lg">
            {isSignIn ? "Let's see how you're doing today." : 'Start your journey to better wellness.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isSignIn && (
              <div>
                <label className="block text-sm font-medium text-psygma-muted mb-1.5">Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-psygma-bg/50 border border-psygma-sand/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-psygma-earth/50"
                  placeholder="Enter your name"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-psygma-muted mb-1.5">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-psygma-bg/50 border border-psygma-sand/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-psygma-earth/50"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-psygma-muted mb-1.5">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-psygma-bg/50 border border-psygma-sand/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-psygma-earth/50"
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="w-full pill-button-primary mt-8 shadow-lg">
              {isSignIn ? 'Sign In' : 'Create Account'} <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-psygma-muted">
            {isSignIn ? "Don't have an account? " : "Already have an account? "}
            <Link to={isSignIn ? "/sign-up" : "/sign-in"} className="text-psygma-earth font-medium hover:underline">
              {isSignIn ? 'Sign up' : 'Sign in'}
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Right side - Image */}
      <div className="hidden md:block flex-1 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1506744626753-1fa30fd22541?auto=format&fit=crop&q=80)' }}
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent opacity-30" />
        
        {/* Floating Glass Quote */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute bottom-16 right-16 glass-card-dark p-8 max-w-sm text-white border-white/20"
        >
          <p className="font-serif text-2xl leading-snug mb-4">"Understanding your mind is the first step to improving your life."</p>
          <div className="text-sm font-medium text-white/70 uppercase tracking-widest">Psygma Philosophy</div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
