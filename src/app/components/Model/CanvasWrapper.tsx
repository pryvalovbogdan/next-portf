'use client';

import { Suspense } from 'react';

import { ContactShadows, Environment, OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

import MeshText from '../MeshText/MeshFont';
import MeshComponent from './Scene';

export function ModelWrapper() {
  return (
    <div className='flex justify-center items-center h-screen'>
      <Canvas
        className='h-2xl w-2xl'
        style={{ height: '100dvh', width: '100dvw', backgroundImage: 'url(/images/york.jpg)' }}
      >
        <MeshText />
        <ContactShadows
          opacity={1}
          color='#000'
          resolution={256}
          scale={10}
          blur={1}
          far={10}
          position={[0, -0.5, 0]}
        />
        <ambientLight intensity={2} />
        <OrbitControls enableZoom={false} />
        <Suspense fallback={null}>
          <MeshComponent />
        </Suspense>
        <Environment preset='sunset' />
      </Canvas>
    </div>
  );
}
