import React, { useRef } from "react";
import { useGLTFWithKTX2 } from "../utils/useGLTFWithKTX2";
import { convertMaterialsToMeshBasicMaterial } from "../utils/convertMaterial";
import { useFrame } from "@react-three/fiber";
import { playSound } from "../../utils/audioSystem";

export default function Model({ progressRef, ...props }) {
  const { nodes, materials } = useGLTFWithKTX2("/models/ExtrasThreeT-v1.glb");
  const doorRef = useRef();
  const doorState = useRef("closed");

  convertMaterialsToMeshBasicMaterial(materials);

  useFrame(() => {
    if (!doorRef.current) return;
    const isDoorOpen = progressRef.current >= .17 && progressRef.current < .8;
    const state = isDoorOpen ? 'open' : 'closed';
    if (doorState.current === state) return;
    doorRef.current.rotation.z = isDoorOpen ? Math.PI / 2 : 0;
    playSound(isDoorOpen ? 'doorOpening' : 'doorClosing');
    doorState.current = state;
  });

  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.extras_three_Baked.geometry}
        material={materials["MergedBake_Baked.006"]}
        position={[0.597, 68.353, 2.812]}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        ref={doorRef}
        geometry={nodes.door.geometry}
        material={materials["MergedBake_Baked.006"]}
        position={[-2.935, 67.848, 0.906]}
        rotation={[Math.PI / 2, 0, 0]}
      />
    </group>
  );
}
