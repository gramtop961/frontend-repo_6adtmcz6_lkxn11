import React, { useEffect, useState } from 'react';
import Hero from './components/Hero';
import MoodForm from './components/MoodForm';
import Results from './components/Results';
import Trending from './components/Trending';

function App() {
  const [mood, setMood] = useState('');
  const [recentMoods, setRecentMoods] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('mood');
    if (q) setMood(q);
  }, []);

  const handleGenerate = (m) => {
    setMood(m);
    setRecentMoods((prev) => [m, ...prev].slice(0, 20));
  };

  return (
    <div className="min-h-screen bg-[#0b0b15] font-[Inter,ui-sans-serif] text-white">
      <Hero />
      <main>
        <MoodForm onGenerate={handleGenerate} />
        <Results mood={mood} />
        <Trending recentMoods={recentMoods} />
      </main>
      <footer className="mx-auto mt-16 w-full max-w-6xl px-6 pb-16 text-center text-white/50">
        Built with love • MoodMelody.ai
      </footer>
    </div>
  );
}

export default App;
