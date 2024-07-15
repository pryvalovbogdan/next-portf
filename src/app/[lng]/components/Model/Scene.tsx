import React, { useState } from 'react';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

import { useGLTF } from '@react-three/drei';
import { extend, useFrame } from '@react-three/fiber';

extend({ TextGeometry });
export default function Model(props) {
  const { nodes, materials } = useGLTF('/scene.gltf');
  const myMesh = React.useRef(null);

  const [isRotated, setIsRotated] = useState(false);

  useFrame(({ clock }) => {
    if (!isRotated) {
      myMesh.current.rotation.x = clock.getElapsedTime();
    }
  });

  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <mesh
          ref={myMesh}
          onPointerDown={() => setIsRotated(true)}
          onPointerUp={() => setIsRotated(false)}
          geometry={nodes.defaultMaterial.geometry}
          material={materials.T_Homelander_Albedo_png_1001}
          rotation={[Math.PI / 2, 0, 0]}
          scale={1.5}
        />
      </group>
    </group>
  );
}

useGLTF.preload('/scene.gltf');
