import { Component, useState } from 'react';
import './App.scss';
import Experience from './Experience/Experience';
import Modal from './components/Modal/Modal';
import AudioToggleButton from './components/AudioToggleButton/AudioToggleButton';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import InfoButton from './components/InfoButton/InfoButton';
import WorldHUD from './components/WorldHUD';
import { useWorldStore } from './Experience/stores/worldStore';
import './enhancements.scss';

class WorldBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed ? <div className="world-error" role="alert"><h1>The world couldn't load</h1><p>Please check your connection and enable WebGL in your browser.</p><button className="button-default" onClick={() => window.location.reload()}>Try again</button></div> : this.props.children;
  }
}

export default function App() {
  const [entered, setEntered] = useState(false);
  const photoMode = useWorldStore(state => state.photoMode);
  const [supportsWebGL] = useState(() => {
    try {
      const context = document.createElement('canvas').getContext('webgl2');
      if (!context) return false;
      context.getExtension('WEBGL_lose_context')?.loseContext();
      return true;
    } catch { return false; }
  });
  return <>
    <WorldBoundary>
      {supportsWebGL ? <>
        <LoadingScreen onEnter={() => setEntered(true)} />
        <Experience entered={entered} />
      </> : <div className="world-error"><h1>Your browser can't render this world</h1><p>Enable hardware acceleration or try a browser with WebGL2. You can still explore the portfolio with the ? menu.</p></div>}
    </WorldBoundary>
    {entered && <WorldHUD />}
    {!photoMode && (entered || !supportsWebGL) && <><AudioToggleButton /><InfoButton /></>}
    <Modal />
  </>;
}
