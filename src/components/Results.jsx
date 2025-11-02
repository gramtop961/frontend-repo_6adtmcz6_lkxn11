import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Play, Square } from 'lucide-react';

// Simple mapping from mood keywords to known public playlists
const moodToPlaylists = [
  {
    keywords: ['peaceful', 'calm', 'relax', 'sleep'],
    youtube: 'PLQog_Fz4E2bTDNQ6xJ6eIYY4D7GhbVnqQ', // Calm Piano
    spotify: 'https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO', // Peaceful Piano
  },
  {
    keywords: ['heartbroken', 'sad', 'melancholy'],
    youtube: 'PL1l8Jvb9P7iF0w2V3hYq7tY2c0b2n7y8z', // Sad songs (example public list)
    spotify: 'https://open.spotify.com/playlist/37i9dQZF1DX7qK8ma5wgG1', // Broken Heart
  },
  {
    keywords: ['energetic', 'workout', 'motivation', 'hype'],
    youtube: 'PLFPg_IUxqnZNnACUGsfn50DyS7ks8yqlE', // Motivation
    spotify: 'https://open.spotify.com/playlist/37i9dQZF1DX76Wlfdnj7AP', // Motivation Mix
  },
  {
    keywords: ['studying', 'study', 'focus', 'lofi'],
    youtube: 'PLzCxunOM5WFIWgZx4bYxS0c2xoYQYtN5l', // Lofi study
    spotify: 'https://open.spotify.com/playlist/37i9dQZF1DX8Uebhn9wzrS', // Lo-Fi Beats
  },
  {
    keywords: ['happy', 'joy', 'sunny', 'good vibes'],
    youtube: 'PLMC9KNkIncKtPzgY-5rmhvj7fax8fdxoj', // Feel Good
    spotify: 'https://open.spotify.com/playlist/37i9dQZF1DXdPec7aLTmlC', // Happy Hits!
  },
];

function findPlaylist(mood) {
  const m = mood.toLowerCase();
  for (const entry of moodToPlaylists) {
    if (entry.keywords.some((k) => m.includes(k))) return entry;
  }
  // default to focus/lofi
  return moodToPlaylists[3];
}

// Procedural short tune generator using WebAudio
function useAIMelody(seedText) {
  const ctxRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const seed = useMemo(() => {
    const s = seedText || '';
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return h;
  }, [seedText]);

  const pattern = useMemo(() => {
    // derive a small scale and rhythm from the seed
    const base = 220 + (seed % 6) * 20; // base frequency
    const scaleIntervals = [0, 3, 5, 7, 10, 12];
    const steps = new Array(16).fill(0).map((_, i) => {
      const idx = (seed + i * 7) % scaleIntervals.length;
      const dur = [0.15, 0.2, 0.25, 0.3][(seed + i) % 4];
      const vel = 0.2 + ((seed >> (i % 8)) % 5) * 0.15;
      return {
        freq: base * Math.pow(2, scaleIntervals[idx] / 12),
        dur,
        vel: Math.min(0.9, vel),
      };
    });
    return steps;
  }, [seed]);

  const play = async () => {
    if (isPlaying) return;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    ctxRef.current = ctx;
    setIsPlaying(true);
    let t = ctx.currentTime;

    // soft pad + pluck combo
    pattern.forEach((note, i) => {
      // pluck
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = note.freq;
      gain.gain.value = 0;
      osc.connect(gain).connect(ctx.destination);
      const start = t + i * (note.dur * 1.1);
      const end = start + note.dur;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(note.vel, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, end);
      osc.start(start);
      osc.stop(end + 0.02);

      // gentle noise shimmer based on emotion intensity
      const noise = ctx.createBufferSource();
      const buffer = ctx.createBuffer(1, ctx.sampleRate * note.dur, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let j = 0; j < data.length; j++) data[j] = (Math.random() * 2 - 1) * 0.03;
      noise.buffer = buffer;
      const ng = ctx.createGain();
      ng.gain.value = 0.08;
      noise.connect(ng).connect(ctx.destination);
      noise.start(start);
      noise.stop(end);
    });

    // auto stop after pattern
    const totalDur = pattern.reduce((acc, n) => acc + n.dur * 1.1, 0);
    setTimeout(() => stop(), totalDur * 1000 + 200);
  };

  const stop = () => {
    if (ctxRef.current) {
      ctxRef.current.close();
      ctxRef.current = null;
    }
    setIsPlaying(false);
  };

  useEffect(() => () => stop(), []);

  return { play, stop, isPlaying };
}

const Results = ({ mood }) => {
  if (!mood) return null;
  const pl = findPlaylist(mood);
  const { play, stop, isPlaying } = useAIMelody(mood);

  return (
    <section className="mx-auto mt-10 w-full max-w-6xl px-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-white/90">
          <h3 className="text-lg font-semibold text-white">Your Mood Playlist</h3>
          <p className="mt-1 text-sm text-white/60">
            Tailored mix for “{mood}”. Open in your favorite platform.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              className="rounded-lg bg-emerald-500/20 px-3 py-2 text-sm text-emerald-200 hover:bg-emerald-500/30"
              href={`https://music.youtube.com/playlist?list=${pl.youtube}`}
              target="_blank" rel="noreferrer"
            >
              YouTube Music
            </a>
            <a
              className="rounded-lg bg-green-500/20 px-3 py-2 text-sm text-green-200 hover:bg-green-500/30"
              href={pl.spotify}
              target="_blank" rel="noreferrer"
            >
              Spotify
            </a>
          </div>
          <div className="mt-4 aspect-video w-full overflow-hidden rounded-xl border border-white/10">
            <iframe
              title="Mood playlist"
              allow="autoplay; encrypted-media"
              className="h-full w-full"
              src={`https://www.youtube.com/embed/videoseries?list=${pl.youtube}`}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-white/90">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">AI Melody Generator</h3>
              <p className="mt-1 text-sm text-white/60">Short, unique tune inspired by “{mood}”.</p>
            </div>
            {/* Sponsored label replaces any pro messaging */}
            <div className="rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100">
              Sponsored
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3">
            {!isPlaying ? (
              <button
                onClick={play}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-violet-500/20 transition hover:brightness-110"
              >
                <Play className="h-4 w-4" />
                Play AI Tune
              </button>
            ) : (
              <button
                onClick={stop}
                className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
              >
                <Square className="h-4 w-4" />
                Stop
              </button>
            )}
            <span className="text-xs text-white/50">Generated locally with WebAudio</span>
          </div>

          {/* Inline ad unit for monetization */}
          <div className="mt-6 rounded-xl border border-white/10 bg-black/30 p-4">
            <div className="mb-2 text-xs uppercase tracking-wide text-white/50">Ad</div>
            <div className="h-24 w-full rounded-md bg-gradient-to-br from-white/10 to-white/5" />
            <div className="mt-2 text-xs text-white/40">Place your AdSense code here</div>
          </div>

          <div className="pointer-events-none mt-6 h-20 w-full rounded-xl bg-gradient-to-r from-violet-500/20 via-sky-500/10 to-cyan-500/20 blur-xl" />
        </div>
      </div>
    </section>
  );
};

export default Results;
