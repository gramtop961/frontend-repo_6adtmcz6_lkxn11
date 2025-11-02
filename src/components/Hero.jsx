import React from 'react';
import Spline from '@splinetool/react-spline';
import { Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-[70vh] w-full overflow-hidden bg-[#0b0b15] text-white">
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/wwTRdG1D9CkNs368/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* gradient overlay, non-blocking */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#0b0b15]/40 to-[#0b0b15]" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-6 pt-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur">
          <Sparkles className="h-4 w-4 text-violet-400" />
          <span className="text-sm text-white/80">AI-powered emotion-based music</span>
        </div>
        <h1 className="mt-6 bg-gradient-to-r from-violet-300 via-sky-300 to-cyan-300 bg-clip-text text-4xl font-bold leading-tight text-transparent sm:text-6xl">
          MoodMelody.ai
        </h1>
        <p className="mt-4 max-w-2xl text-white/70">
          Type your vibe. Get instant playlists and unique AI-made tunes that match your emotions.
          Minimal, calming, and a little bit futuristic.
        </p>

        {/* subtle animated waveform */}
        <div className="mt-8 w-full max-w-3xl">
          <Waveform />
        </div>
      </div>
    </section>
  );
};

const Waveform = () => {
  const bars = new Array(48).fill(0);
  return (
    <div className="flex h-16 w-full items-end gap-1 opacity-80">
      {bars.map((_, i) => (
        <span
          key={i}
          className="animate-pulse rounded-full bg-gradient-to-t from-violet-500/30 to-cyan-400/60"
          style={{
            width: 6,
            height: 8 + Math.sin(i) * 6 + ((i % 5) + 1) * 4,
            animationDelay: `${(i % 8) * 0.12}s`,
            animationDuration: `${1 + (i % 7) * 0.12}s`,
          }}
        />
      ))}
    </div>
  );
};

export default Hero;
