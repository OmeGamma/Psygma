import React, { useState } from 'react';
import { Mail, MessageSquare, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';

export const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
  };

  return (
    <div className="py-24 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-[#292B26]">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A6B59A]/20 text-[#34483A] text-xs font-semibold uppercase tracking-wider mb-4">
          Get in Touch
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#292B26] leading-tight">
          Connect with Team OmeGamma
        </h1>
        <p className="text-base sm:text-lg text-[#77766D] mt-4 leading-relaxed font-light">
          Have questions about Psygma’s stress estimation model, research collaborations, or sanctuary integrations? We welcome your dialogue.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
        {/* Contact Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 rounded-2xl border-[#E4DED2]">
            <Mail className="w-5 h-5 text-[#34483A] mb-2" />
            <div className="font-serif text-lg font-semibold mb-1">Direct Correspondence</div>
            <p className="text-xs text-[#77766D] mb-2">Our research and engineering team responds within 24–48 hours.</p>
            <a href="mailto:contact@omegamma.wellness" className="text-xs font-semibold text-[#34483A] hover:underline">
              contact@omegamma.wellness
            </a>
          </div>

          <div className="glass-card p-6 rounded-2xl border-[#E4DED2]">
            <MapPin className="w-5 h-5 text-[#777B51] mb-2" />
            <div className="font-serif text-lg font-semibold mb-1">Studio & Lab</div>
            <p className="text-xs text-[#77766D]">
              Team OmeGamma Wellness Systems Lab<br />
              Highland Research Quarter, Suite 402<br />
              Cascadia Bioregion
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border-[#E4DED2]">
            <MessageSquare className="w-5 h-5 text-[#D7C5AC] mb-2" />
            <div className="font-serif text-lg font-semibold mb-1">Sanctuary Partners</div>
            <p className="text-xs text-[#77766D]">
              Retreat directors interested in verified TinyFish listing integration can inquire directly via our partner desk.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <div className="glass-card p-8 sm:p-10 rounded-3xl border-[#E4DED2] shadow-lg">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#A6B59A]/30 text-[#34483A] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl text-[#292B26]">Message Received</h3>
                <p className="text-sm text-[#77766D] max-w-md mx-auto">
                  Thank you for reaching out, {name}. A member of Team OmeGamma will review your note and respond to <strong className="text-[#292B26]">{email}</strong> shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                  }}
                  className="pill-button-secondary text-xs mt-4"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#77766D] uppercase tracking-wider mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Elena Rostova"
                      className="w-full bg-[#FBF9F4] border border-[#E4DED2] rounded-xl px-4 py-3 text-sm text-[#292B26] focus:outline-none focus:ring-2 focus:ring-[#34483A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#77766D] uppercase tracking-wider mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@domain.com"
                      className="w-full bg-[#FBF9F4] border border-[#E4DED2] rounded-xl px-4 py-3 text-sm text-[#292B26] focus:outline-none focus:ring-2 focus:ring-[#34483A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#77766D] uppercase tracking-wider mb-2">
                    Inquiry Category
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-[#FBF9F4] border border-[#E4DED2] rounded-xl px-4 py-3 text-sm text-[#292B26] focus:outline-none focus:ring-2 focus:ring-[#34483A]"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Research & Clinical Partnership">Research & Clinical Partnership</option>
                    <option value="Sanctuary Listing (TinyFish)">Sanctuary Listing (TinyFish)</option>
                    <option value="Product Feedback">Product Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#77766D] uppercase tracking-wider mb-2">
                    Your Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what you are exploring or how we can collaborate..."
                    className="w-full bg-[#FBF9F4] border border-[#E4DED2] rounded-xl px-4 py-3 text-sm text-[#292B26] focus:outline-none focus:ring-2 focus:ring-[#34483A]"
                  />
                </div>

                <button
                  type="submit"
                  className="pill-button-primary w-full py-3.5 text-sm shadow-md flex items-center justify-center gap-2"
                >
                  <span>Submit Note to Team OmeGamma</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
