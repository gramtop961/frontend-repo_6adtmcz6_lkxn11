import React, { useMemo, useState } from 'react';
import { Share2, Mail } from 'lucide-react';

const defaultTrends = [
  { mood: 'studying', count: 42 },
  { mood: 'peaceful', count: 35 },
  { mood: 'energetic', count: 28 },
  { mood: 'heartbroken', count: 21 },
];

const Trending = ({ recentMoods }) => {
  const [email, setEmail] = useState('');

  const trends = useMemo(() => {
    const map = new Map();
    defaultTrends.forEach((t) => map.set(t.mood, t.count));
    recentMoods.forEach((m) => map.set(m, (map.get(m) || 0) + 1));
    return Array.from(map.entries())
      .map(([mood, count]) => ({ mood, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [recentMoods]);

  const shareVibe = async () => {
    const params = new URLSearchParams();
    if (recentMoods[0]) params.set('mood', recentMoods[0]);
    const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    const title = 'My MoodMelody.ai vibe';
    const text = recentMoods[0]
      ? `I just generated a ${recentMoods[0]} playlist on MoodMelody.ai \u2014 check it out!`
      : 'Discover your vibe playlist with MoodMelody.ai';

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl });
      } catch {}
    } else {
      await navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  const subscribe = (e) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    // In a full app, this would call the backend to subscribe.
    setEmail('');
    alert('Subscribed to Daily Mood Melodies!');
  };

  return (
    <section className="mx-auto mt-12 w-full max-w-6xl px-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-white/90 md:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Now Trending</h3>
            <button
              onClick={shareVibe}
              className="inline-flex items-center gap-2 rounded-lg border border-cyan-400/40 bg-cyan-400/10 px-3 py-2 text-sm text-cyan-100 hover:bg-cyan-400/20"
            >
              <Share2 className="h-4 w-4" /> Share your vibe
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {trends.map((t) => (
              <div key={t.mood} className="rounded-lg border border-white/10 bg-black/30 p-4">
                <div className="text-sm text-white/60">{t.mood}</div>
                <div className="text-2xl font-semibold text-white">{t.count}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative rounded-2xl border border-white/10 bg-white/5 p-5 text-white/90">
          <h3 className="text-lg font-semibold text-white">Daily Mood Melodies</h3>
          <p className="mt-1 text-sm text-white/60">Get a hand-picked vibe in your inbox every morning.</p>
          <form onSubmit={subscribe} className="mt-4 flex gap-2">
            <div className="flex grow items-center gap-2 rounded-lg border border-white/10 bg-black/40 px-3 py-2">
              <Mail className="h-4 w-4 text-cyan-300/80" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@vibes.com"
                className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none"
              />
            </div>
            <button className="rounded-lg bg-gradient-to-r from-violet-600 to-cyan-600 px-3 py-2 text-sm font-medium text-white hover:brightness-110">
              Subscribe
            </button>
          </form>

          {/* Monetization slot (AdSense ready area) */}
          <div className="mt-5 rounded-lg border border-white/10 bg-black/30 p-4 text-xs text-white/50">
            <div className="mb-1 text-white/70">Sponsored</div>
            <div className="h-24 w-full rounded-md bg-gradient-to-br from-white/10 to-white/5" />
            <div className="mt-2">Ad space reserved for AdSense</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Trending;
