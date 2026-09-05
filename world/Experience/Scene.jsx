import { Suspense, useRef, useEffect, useMemo } from "react";
import { dampProgress, useWorldStore } from "./stores/worldStore";
import { useModalStore } from "./stores/modalStore";
import Fireflies from "./Fireflies";

import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";

import House from "./models/HouseT";
import BackGrass from "./models/BackGrassT";
import Detail from "./models/DetailT";
import Extras from "./models/ExtrasT";
import ExtrasTwo from "./models/ExtrasTwoT";
import ExtrasThree from "./models/ExtrasThreeT";
import FrontGrass from "./models/FrontGrassT";
import GrassBlocks from "./models/GrassBlocksT";
import GrassSides from "./models/GrassSidesT";
import Mobs from "./models/MobsT";

const Scene = ({
  cameraGroup,
  camera,
  progressRef,
  targetScrollProgress,
  entered,
  mouseOffset,
}) => {
  const rotationBufferQuat = useRef(new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.12, 0.17, 0.02)));
  const rotationResult = useMemo(() => new THREE.Quaternion(), []);
  const pathPoint = useMemo(() => new THREE.Vector3(), []);
  const lastPublished = useRef(0);
  const reducedMotion = useRef(window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { reducedMotion.current = preference.matches; };
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  const cameraCurve = useMemo(() => new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(2, 65, 47.5),
      new THREE.Vector3(1.4, 65, 39),
      new THREE.Vector3(-2, 70, 17),
      new THREE.Vector3(-2.6, 68.5, 4.8),
      new THREE.Vector3(-2.45, 67.9, 0),
      new THREE.Vector3(-3.42, 68.9, 0.145),
      new THREE.Vector3(-8.05, 69.36, -0.875),
      new THREE.Vector3(-10.05, 69.36, -0.88),
      new THREE.Vector3(-7.148, 69.22, 0.37),
      new THREE.Vector3(-9, 69.2, 1.22),
      new THREE.Vector3(-7.8, 68.72, 3.04),
      new THREE.Vector3(-8.01, 69.97, -1.72),
      new THREE.Vector3(-3, 68.21, 0.308), //close door
      new THREE.Vector3(-2.4, 68.47, 7.1),
      new THREE.Vector3(-2, 70, 17),
      new THREE.Vector3(1.4, 65, 39),
    ],
    true
  ), []);

  const rotationTargets = useMemo(() => [
    {
      progress: 0,
      rotation: new THREE.Euler(-0.12, 0.17, 0.02),
    },
    {
      progress: 0.14,
      rotation: new THREE.Euler(-0.11, 0.003, 0.0),
    },
    {
      progress: 0.2,
      rotation: new THREE.Euler(-0.11, 0.003, 0.0),
    },
    {
      progress: 0.24,
      rotation: new THREE.Euler(0.173, 1.042, -0.15),
    },
    {
      progress: 0.365,
      rotation: new THREE.Euler(0.023, 0.024, -0.001),
    },
    {
      progress: 0.42,
      rotation: new THREE.Euler(0.177, 0.972, -0.147),
    },
    {
      progress: 0.5,
      rotation: new THREE.Euler(-2.725, 1.02, 2.782),
    },
    {
      progress: 0.56,
      rotation: new THREE.Euler(-2.9, -0.069, -3.125),
    },
    {
      progress: 0.62,
      rotation: new THREE.Euler(-2.76, 0.21, 3.06),
    },
    {
      progress: 0.715,
      rotation: new THREE.Euler(-0.467, -0.681, -0.308),
    },
    {
      progress: 0.735,
      rotation: new THREE.Euler(-0.043, 0.012, 0.0005),
    },
    {
      progress: 0.85,
      rotation: new THREE.Euler(-0.043, 0.012, 0.0005),
    },
    {
      progress: 1,
      rotation: new THREE.Euler(-0.12, 0.17, 0.02),
    },
  ].map(target => ({ ...target, quaternion: new THREE.Quaternion().setFromEuler(target.rotation) })), []);

  const getLerpedRotation = (progress) => {
    for (let i = 0; i < rotationTargets.length - 1; i++) {
      const start = rotationTargets[i];
      const end = rotationTargets[i + 1];
      if (progress >= start.progress && progress <= end.progress) {
        const lerpFactor =
          (progress - start.progress) / (end.progress - start.progress);

        return rotationResult.slerpQuaternions(start.quaternion, end.quaternion, lerpFactor);
      }
    }

    return rotationResult.copy(rotationTargets[rotationTargets.length - 1].quaternion);
  };

  useFrame((state, delta) => {
    if (!camera.current || !cameraGroup.current || useModalStore.getState().isModalOpen) return;
    const settings = useWorldStore.getState();
    const frameDelta = Math.min(delta, .05);
    if (entered && settings.touring) {
      targetScrollProgress.current = Math.min(1, targetScrollProgress.current + frameDelta * .012);
      if (targetScrollProgress.current >= 1) settings.setTouring(false);
    }
    progressRef.current = reducedMotion.current && !settings.touring
      ? targetScrollProgress.current
      : dampProgress(progressRef.current, targetScrollProgress.current, frameDelta);
    const progress = progressRef.current;
    const smoothing = reducedMotion.current ? 1 : 1 - Math.exp(-6 * frameDelta);
    cameraCurve.getPoint(progress, pathPoint);
    cameraGroup.current.position.lerp(pathPoint, smoothing);
    const parallax = settings.photoMode || reducedMotion.current ? 0 : 1;
    camera.current.position.x = THREE.MathUtils.lerp(camera.current.position.x, mouseOffset.current.x * parallax, smoothing);
    camera.current.position.y = THREE.MathUtils.lerp(camera.current.position.y, -mouseOffset.current.y * parallax, smoothing);
    camera.current.position.z = 0;
    rotationBufferQuat.current.slerp(getLerpedRotation(progress), smoothing);
    cameraGroup.current.quaternion.copy(rotationBufferQuat.current);
    if (state.clock.elapsedTime - lastPublished.current > .1) {
      settings.publishProgress(progress);
      lastPublished.current = state.clock.elapsedTime;
    }
  });

  return (
    <>
      <Environment
        background={true}
        backgroundRotation={[0, Math.PI / 2, 0]}
        files={[
          "/cubemap/px.webp",
          "/cubemap/nx.webp",
          "/cubemap/py.webp",
          "/cubemap/ny.webp",
          "/cubemap/pz.webp",
          "/cubemap/nz.webp",
        ]}
      />
      <Suspense fallback={null}>
        <House />
        <BackGrass />
        <Detail progressRef={progressRef} />
        <Extras />
        <ExtrasTwo />
        <ExtrasThree progressRef={progressRef} />
        <FrontGrass />
        <GrassBlocks />
        <GrassSides />
        <Mobs />
        <WorldReady />
      </Suspense>
      <Fireflies reducedMotion={reducedMotion} />
    </>
  );
};

function WorldReady() {
  useEffect(() => {
    useWorldStore.getState().setReady(true);
    return () => useWorldStore.getState().setReady(false);
  }, []);
  return null;
}

export default Scene;
