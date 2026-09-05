import { useEffect, useState } from 'react';
import './LoadingScreen.scss';
import { useProgress } from '@react-three/drei';
import { playBackgroundMusic, playSound } from '../../utils/audioSystem';
import { useAudioStore } from '../../Experience/stores/audioStore';
import { useWorldStore } from '../../Experience/stores/worldStore';

export default function LoadingScreen({ onEnter }) {
  const { progress, active, loaded, errors } = useProgress();
  const [revealed, setRevealed] = useState(false);
  const [finished, setFinished] = useState(false);
  const sceneReady = useWorldStore(state => state.ready);
  const ready = sceneReady && loaded > 0 && !active && progress >= 100;

  useEffect(() => {
    if (!revealed) return;
    const timeout = setTimeout(() => setFinished(true), 1100);
    return () => clearTimeout(timeout);
  }, [revealed]);

  const enter = (touring = false) => {
    useAudioStore.getState().setIsAudioEnabled(true);
    playBackgroundMusic();
    playSound('buttonClick');
    useWorldStore.getState().setTouring(touring);
    setRevealed(true);
    onEnter();
    requestAnimationFrame(() => document.querySelector('.world-surface')?.focus({ preventScroll: true }));
  };

  if (finished) return null;
  return <div className={`loading-screen expedition-entry ${revealed ? 'entry-revealed' : ''}`} aria-label="Enter the Minecraft portfolio">
    <div className="entry-landscape" aria-hidden="true" />
    <div className="entry-shade" aria-hidden="true" />
    <div className="entry-grain" aria-hidden="true" />
    <header className="entry-brand"><span className="brand-block" aria-hidden="true" /><span>OVERWORLD<span>AN INTERACTIVE PORTFOLIO</span></span></header>
    <div className="entry-edition"><span className="status-light" /> CREATIVE EDITION</div>
    <div className="entry-center">
      <p className="entry-eyebrow">A SMALL WORLD. AN OPEN INVITATION.</p>
      <div className="entry-title"><h1>MY WORLD<span>.</span></h1><span className="entry-splash">Built block by block!</span></div>
      <p className="entry-description">Ideas to explore. Stories to discover.<br />Come in. Make yourself at home.</p>
      <div className="entry-actions">
        {errors.length > 0 ? <div role="alert"><p>A piece of the world could not load.</p><button className="expedition-button" onClick={() => window.location.reload()}>Try again ↻</button></div> : <>
          <button className="expedition-button" disabled={!ready || revealed} onClick={() => enter(false)}><span className="entry-play" aria-hidden="true">▶</span>{ready ? 'Enter the world' : 'Building the terrain…'}<span className="entry-button-arrow" aria-hidden="true">→</span></button>
          <button className="expedition-secondary" disabled={!ready || revealed} onClick={() => enter(true)}><span className="item-icon icon-compass" aria-hidden="true" />Take the guided tour</button>
        </>}
        <div className="entry-loading" role="progressbar" aria-label="Loading world" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}><div><span style={{ width: `${progress}%` }} /></div><p><span>{ready ? 'YOUR ADVENTURE IS READY' : 'PREPARING YOUR ADVENTURE'}</span><span>{Math.round(progress)}%</span></p></div>
      </div>
    </div>
    <footer className="entry-footer"><span>CRAFTED WITH CURIOSITY.</span><p><kbd>SCROLL</kbd> EXPLORE <span>·</span> <kbd>CLICK</kbd> DISCOVER <span>·</span> SOUND ON FOR THE FULL EXPERIENCE</p><span>EST. 2026</span></footer>
  </div>;
}
