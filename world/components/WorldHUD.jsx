import { useEffect } from 'react';
import { portfolio } from '../../portfolio.config';
import { chapterAt, useWorldStore } from '../Experience/stores/worldStore';
import { useModalStore } from '../Experience/stores/modalStore';
import { playSound } from '../utils/audioSystem';
import About from './About/About';
import Project from './Project/Project';
import Info from './Info/Info';
import Button from './Button/Button';

const chapters = {
  meadow: { number: '01', name: 'The Overworld', quest: 'Find the house. Follow your curiosity.', title: <>A little world.<br />A lot to discover.</>, detail: 'Scroll into a world of ideas, projects, and possibilities.' },
  house: { number: '02', name: 'The Maker’s House', quest: 'Step inside. Every picture has a story.', title: <>Made with care.<br />Built to explore.</>, detail: 'The door is open. Make yourself at home.' },
  gallery: { number: '03', name: 'The Project Gallery', quest: 'Click the glowing pictures to discover my work.', title: <>Ideas, turned<br />into something real.</>, detail: 'A few things I’ve put my heart into.' },
  about: { number: '04', name: 'Behind the Blocks', quest: 'Meet the person behind the pixels.', title: <>There’s a maker<br />behind this world.</>, detail: 'Click the pictures to get to know me.' },
};

function ProjectCollection() {
  const discovered = useWorldStore(state => state.discovered);
  return <div className="collection-panel">
    <div className="panel-eyebrow">THE INVENTORY / SELECTED WORK</div>
    <h2>Ideas I brought to life.</h2>
    <p className="panel-description">Pick a creation. Take a closer look.</p>
    <div className="collection-grid">{Object.entries(portfolio.projects).map(([id, project], index) => <button key={id} className={`collection-card collection-${id}`} onClick={() => useModalStore.getState().openModal(project.title, <Project projectID={id} />, id)}>
      <div className="collection-art">{project.image ? <img src={project.image} alt="" /> : <span className={`inventory-art art-${id}`} aria-hidden="true"><i /><i /><i /><i /></span>}<span className="collection-number">0{index + 1}</span></div>
      <span className="collection-category">{project.category}</span><strong>{project.title}</strong><span className="collection-action">{discovered.includes(id) ? 'Discovered ✓' : 'Explore project ↗'}</span>
    </button>)}</div>
    <Button onClick={() => { useModalStore.getState().closeModal(); useWorldStore.getState().jumpTo(0.365); }}>Take me to the gallery →</Button>
  </div>;
}

function Contact() {
  const links = Object.entries(portfolio.socials).filter(([, url]) => url);
  return <div className="contact-panel"><span className="item-icon icon-letter" aria-hidden="true" /><div className="panel-eyebrow">LET’S BUILD SOMETHING</div><h2>Great things start<br />with a hello.</h2><p className="panel-description">Have an idea, a project, or just a good story? There’s always room for a new connection.</p>
    {portfolio.email ? <Button type="link" href={`mailto:${portfolio.email}`}>{portfolio.email} ↗</Button> : <p className="contact-empty">Contact details coming soon.</p>}
    <div className="contact-socials">{links.map(([label, url]) => <Button key={label} type="link" href={url}>{label} ↗</Button>)}</div>
    <p className="contact-signoff">See you in the Overworld.</p>
  </div>;
}

const items = [
  { label: 'Spawn', icon: 'grass', action: () => useWorldStore.getState().jumpTo(0) },
  { label: 'Projects', icon: 'pickaxe', action: () => useModalStore.getState().openModal('Project inventory', <ProjectCollection />, 'projects') },
  { label: 'About', icon: 'book', action: () => useModalStore.getState().openModal('Behind the blocks', <About />, 'about') },
  { label: 'Contact', icon: 'letter', action: () => useModalStore.getState().openModal('Say hello', <Contact />, 'contact') },
  { label: 'Guided tour', icon: 'compass', action: () => { const state = useWorldStore.getState(); if (!state.touring && state.progress >= 99) state.jumpTo(0); useWorldStore.getState().setTouring(!state.touring); } },
  { label: 'Photo mode', icon: 'camera', action: () => useWorldStore.getState().setPhotoMode(true) },
  { label: 'Guide', icon: 'guide', action: () => useModalStore.getState().openModal('World guide', <Info />, 'info') },
];

export default function WorldHUD() {
  const progress = useWorldStore(state => state.progress);
  const touring = useWorldStore(state => state.touring);
  const photoMode = useWorldStore(state => state.photoMode);
  const discovered = useWorldStore(state => state.discovered);
  const notice = useWorldStore(state => state.notice);
  const modalType = useModalStore(state => state.modalType);
  const isModalOpen = useModalStore(state => state.isModalOpen);
  const chapter = chapters[chapterAt(progress / 100)];

  useEffect(() => {
    if (!notice || isModalOpen) return;
    const timer = setTimeout(() => useWorldStore.getState().dismissNotice(), 4500);
    return () => clearTimeout(timer);
  }, [notice, isModalOpen]);

  useEffect(() => {
    const handleKey = event => {
      if (event.ctrlKey || event.metaKey || event.altKey || event.repeat) return;
      if (event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
      if (event.key === 'Escape' && useWorldStore.getState().photoMode) { useWorldStore.getState().setPhotoMode(false); return; }
      if (useModalStore.getState().isModalOpen) return;
      const index = Number(event.key) - 1;
      if (/^[1-7]$/.test(event.key)) { event.preventDefault(); playSound('buttonClick'); items[index].action(); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  if (photoMode) return <button className="photo-exit" onClick={() => useWorldStore.getState().setPhotoMode(false)}>Exit photo mode <kbd>Esc</kbd></button>;
  return <div className="world-hud">
    <header className="world-brand"><span className="brand-block" aria-hidden="true" /><div><strong>OVERWORLD</strong><span>A CREATIVE PORTFOLIO</span></div></header>
    <div className="location-marker"><span className="status-light" />{chapter.name}<span className="location-mode">CREATIVE MODE</span></div>
    <section className="quest-card"><span className="quest-icon" aria-hidden="true">!</span><div><span className="panel-eyebrow">CURRENT QUEST</span><p>{chapter.quest}</p></div></section>
    <section className="chapter-caption" key={chapter.name}><p className="chapter-number">CHAPTER {chapter.number} / THE JOURNEY</p><h1>{chapter.title}</h1><p>{chapter.detail}</p></section>
    {touring && <button className="tour-status" onClick={() => useWorldStore.getState().setTouring(false)}><span className="status-light" /> Guided tour playing <span>Ⅱ Pause</span></button>}
    <div className="world-inventory"><div className="inventory-status"><div className="health-hearts" aria-hidden="true">{Array.from({ length: 10 }, (_, i) => <i key={i} />)}</div><span>{discovered.length}/4 discovered</span></div>
      <div className="journey-track" role="progressbar" aria-label="World journey" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${progress}%` }} /></div>
      <nav className="hotbar" aria-label="Portfolio inventory">{items.map((item, index) => <button key={item.label} className={`hotbar-slot ${index === 4 && touring || index === 1 && modalType === 'projects' || index === 2 && modalType === 'about' || index === 3 && modalType === 'contact' ? 'is-selected' : ''}`} aria-label={`${item.label} (${index + 1})`} aria-pressed={index === 4 ? touring : undefined} onClick={() => { playSound('buttonClick'); item.action(); }}><kbd>{index + 1}</kbd><span className={`item-icon icon-${item.icon}`} aria-hidden="true">{item.icon === 'guide' ? '?' : ''}</span><span className="item-tooltip">{item.label}</span></button>)}</nav>
      <p className="inventory-hint"><span>SCROLL / DRAG TO EXPLORE</span><span>1–7 QUICK SELECT</span></p>
    </div>
    <div className="journey-counter"><span>WORLD EXPLORED</span><strong>{String(progress).padStart(2, '0')}<small>%</small></strong></div>
    {notice && !isModalOpen && <div className="achievement-toast" key={notice.id} role="status"><span className="item-icon icon-diamond" aria-hidden="true" /><div><span>ADVANCEMENT MADE!</span><strong>{notice.title}</strong><p>{notice.subtitle}</p></div></div>}
  </div>;
}
