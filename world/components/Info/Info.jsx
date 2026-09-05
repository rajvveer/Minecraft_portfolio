import './Info.scss';
import Button from '../Button/Button';
import About from '../About/About';
import Project from '../Project/Project';
import { portfolio } from '../../../portfolio.config';
import { useModalStore } from '../../Experience/stores/modalStore';

export default function Info() {
  const openModal = useModalStore(state => state.openModal);
  return <div className="data-container">
    <h2 className="info-section-header">Welcome to our world</h2>
    <p className="section-paragraph">Scroll or drag up and down to explore. On a phone, swipe. Follow the path into the house and click the glowing pictures to discover my work.</p>
    <p className="section-paragraph">You can also use ↑ / ↓ or W / S to move, Home to return to the beginning, and Escape to close a panel.</p>
    <p className="section-paragraph">Explore all four projects to complete your collection. Every new discovery earns an advancement, shown when you return to the world.</p><h2 className="info-section-header">Portfolio</h2>
    <Button onClick={() => openModal('About me', <About />, 'about')}>About {portfolio.name}</Button>
    <div className="project-menu">{Object.entries(portfolio.projects).map(([id, project]) => <Button key={id} onClick={() => openModal(project.title, <Project projectID={id} />, id)}>{project.title}</Button>)}</div>
    <h2 className="info-section-header">Credits & Inspiration</h2>
    <p className="section-paragraph">World design, original models, camera journey, and interface by <a href="https://www.woanminecraftfolio.com/" target="_blank" rel="noreferrer">Andrew Woan</a>. Adapted from his <a href="https://github.com/andrewwoan/woan-minecraft-folio" target="_blank" rel="noreferrer">open-source Minecraft portfolio</a> under the <a href="/LICENSE.md" target="_blank" rel="noreferrer">MIT license</a>.</p>
    <p className="section-paragraph">House inspiration: Foxel MC. Mob models: Vincent Yanez. Minecraft font: JDGraphics. Environment: Poly Haven. Created with Blender, MCprep, Three.js, React Three Fiber, and Drei.</p>
    <p className="section-paragraph">Original scene artwork is retained as reference decoration. Portfolio text and project cards are editable placeholders. Background music: Meadow Loop, an original ambient composition. Sound effects are retained from the original project, credited there to Myinstants and Voicemod.</p>
  </div>;
}
