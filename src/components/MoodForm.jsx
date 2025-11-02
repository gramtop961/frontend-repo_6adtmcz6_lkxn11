import React, { useState } from 'react';
import { Music, Sparkles } from 'lucide-react';

const suggestions = [
  'peaceful',
  'heartbroken',
  'energetic',
  'studying',
  'focus',
  'happy',
  'sad but hopeful piano',
];

const MoodForm = ({ onGenerate }) => {
  const [mood, setMood] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!mood.trim()) return;
    onGenerate(mood.trim());
  };

  const pickSuggestion = (s) => {
    setMood(s);
    onGenerate(s);
  };

  return (
    <section className="relative -mt-16 z-10 mx-auto w-full max-w-4xl rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="text-sm uppercase tracking-widest text-white/60">Describe your mood</label>
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/40 p-3 focus-within:border-cyan-400/50">
          <Music className="h-5 w-5 text-cyan-300/80" />
          <input
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            placeholder="e.g. peaceful, heartbroken, energetic, studying"
            className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-violet-500/20 transition hover:brightness-110"
          >
            <Sparkles className="h-4 w-4" />
            Generate
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-white/50">Try:</span>
          {suggestions.map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => pickSuggestion(s)}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 hover:bg-white/10"
            >
              {s}
            </button>
          ))}
        </div>
      </form>
    </section>
  );
};

export default MoodForm;
