'use client';

import { useEffect, useState, type ComponentType } from 'react';

export default function Home() {
  const [World, setWorld] = useState<ComponentType | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    import('../world/App.jsx').then(({ default: App }) => {
      if (active) setWorld(() => App);
    }).catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, []);

  return <main id="root" aria-label="Interactive Minecraft portfolio">
    {World ? <World /> : <div className="boot-screen" role="status">
      <p>Hi 👋! Thanks for stopping by!! ❤️</p>
      <p>{error ? 'The world could not load. Please refresh to try again.' : 'Preparing your world…'}</p>
      {error && <button onClick={() => window.location.reload()}>Try again</button>}
    </div>}
  </main>;
}
