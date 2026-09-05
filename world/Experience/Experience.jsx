import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import Scene from './Scene';
import { useModalStore } from './stores/modalStore';
import normalizeWheel from 'normalize-wheel';
import { useWorldStore } from './stores/worldStore';

export default function Experience({ entered }) {
  const surface = useRef(null);
  const cameraGroup = useRef();
  const camera = useRef();
  const progressRef = useRef(0);
  const targetScrollProgress = useRef(0);
  const mouseOffset = useRef(new THREE.Vector3());
  const isModalOpen = useModalStore(state => state.isModalOpen);
  const jump = useWorldStore(state => state.jump);

  useEffect(() => { targetScrollProgress.current = jump.progress; }, [jump]);

  useEffect(() => {
    if (!entered || isModalOpen) return;
    const element = surface.current;
    let pointer = null;
    let previousY = 0;
    const move = amount => {
      if (useWorldStore.getState().touring) useWorldStore.getState().setTouring(false);
      targetScrollProgress.current = Math.max(0, Math.min(1, targetScrollProgress.current + amount));
    };
    const wheel = event => {
      event.preventDefault();
      const { pixelY } = normalizeWheel(event);
      move(Math.sign(pixelY) * 0.005 * Math.min(Math.abs(pixelY) / 100, 1));
    };
    const down = event => {
      if (event.button !== 0) return;
      pointer = event.pointerId;
      previousY = event.clientY;
      element.focus({ preventScroll: true });
    };
    const drag = event => {
      if (event.pointerType === 'mouse' && !useWorldStore.getState().photoMode && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        mouseOffset.current.set((event.clientX / window.innerWidth * 2 - 1) * 0.25, (event.clientY / window.innerHeight * 2 - 1) * 0.25, 0);
      }
      if (pointer !== event.pointerId) return;
      const delta = event.clientY - previousY;
      if (delta) move(Math.sign(delta) * (event.pointerType === 'touch' ? 0.0015 : 0.001));
      previousY = event.clientY;
    };
    const end = () => { pointer = null; };
    const key = event => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.target.closest('button, a, input, textarea, select, dialog')) return;
      if (['ArrowDown', 'w', 'W', 'PageDown'].includes(event.key)) { event.preventDefault(); move(0.008); }
      if (['ArrowUp', 's', 'S', 'PageUp'].includes(event.key)) { event.preventDefault(); move(-0.008); }
      if (event.key === 'Home') { event.preventDefault(); useWorldStore.getState().jumpTo(0); }
    };
    element.addEventListener('wheel', wheel, { passive: false });
    element.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', drag);
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
    window.addEventListener('blur', end);
    window.addEventListener('keydown', key);
    return () => {
      element.removeEventListener('wheel', wheel);
      element.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', drag);
      window.removeEventListener('pointerup', end);
      window.removeEventListener('pointercancel', end);
      window.removeEventListener('blur', end);
      window.removeEventListener('keydown', key);
    };
  }, [entered, isModalOpen]);

  return <div ref={surface} inert={!entered} tabIndex={entered ? 0 : -1} className="world-surface" aria-label="3D Minecraft world. Scroll, drag, or use arrow keys to explore.">
    <Canvas flat dpr={[1, 1.5]} fallback={<p className="webgl-fallback">Your browser needs WebGL to explore the world. Try enabling hardware acceleration.</p>}>
      <Scene cameraGroup={cameraGroup} camera={camera} progressRef={progressRef}
        targetScrollProgress={targetScrollProgress} entered={entered} mouseOffset={mouseOffset} />
      <group ref={cameraGroup} position={[2, 65, 47.5]}>
        <PerspectiveCamera ref={camera} makeDefault fov={70} position={[0, 0, 0]} />
      </group>
    </Canvas>
  </div>;
}
