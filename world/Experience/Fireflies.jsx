import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function Fireflies({ reducedMotion }) {
  const points = useRef(null);
  const positions = useMemo(() => {
    const data = new Float32Array(64 * 3);
    for (let i = 0; i < 64; i++) {
      data[i * 3] = Math.sin(i * 127.1) * 19;
      data[i * 3 + 1] = 65 + (Math.sin(i * 29.7) + 1) * 2.8;
      data[i * 3 + 2] = 6 + (Math.sin(i * 63.7) + 1) * 16;
    }
    return data;
  }, []);
  const renderedPositions = useMemo(() => positions.slice(), [positions]);
  useFrame(({ clock }) => {
    if (reducedMotion.current || !points.current) return;
    const values = points.current.geometry.attributes.position;
    for (let i = 0; i < 64; i++) values.array[i * 3 + 1] = positions[i * 3 + 1] + Math.sin(clock.elapsedTime * .45 + i) * .35;
    values.needsUpdate = true;
    points.current.material.opacity = .6 + Math.sin(clock.elapsedTime * .7) * .15;
  });
  return <points ref={points} frustumCulled={false} raycast={() => null}>
    <bufferGeometry><bufferAttribute attach="attributes-position" args={[renderedPositions, 3]} /></bufferGeometry>
    <pointsMaterial size={.065} color="#edfbb0" transparent opacity={.65} depthWrite={false} toneMapped={false} />
  </points>;
}
