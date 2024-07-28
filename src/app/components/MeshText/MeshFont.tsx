import { Color } from 'three';
import { degToRad } from 'three/src/math/MathUtils.js';

import { Environment, Float, MeshReflectorMaterial, RenderTexture, Text, useFont } from '@react-three/drei';

const bloomColor = new Color('#fff');

bloomColor.multiplyScalar(1.5);

export const Experience = () => {
  return (
    <>
      <mesh position-z={1.5} visible={false}>
        <boxGeometry args={[7.5, 2, 2]} />
        <meshBasicMaterial color='orange' transparent opacity={0.5} />
      </mesh>
      <Text
        font={'fonts/SnackFont.ttf'}
        position-x={+0.3}
        position-y={-0.5}
        position-z={1}
        lineHeight={0.8}
        textAlign='center'
        rotation-y={degToRad(30)}
        anchorY={'bottom'}
      >
        ALEX RUDENKO{'\n'}PRODUCTION
        <meshBasicMaterial color={bloomColor} toneMapped={false}>
          <RenderTexture attach={'map'}>
            <color attach='background' args={['#fff']} />
            <Environment preset='sunset' />
            <Float floatIntensity={4} rotationIntensity={5}></Float>
          </RenderTexture>
        </meshBasicMaterial>
      </Text>

      <mesh position-y={-0.48} rotation-x={-Math.PI / 4}>
        <planeGeometry args={[100, 100]} />
        <MeshReflectorMaterial
          blur={[100, 100]}
          resolution={2048}
          mixBlur={1}
          mixStrength={10}
          roughness={1}
          depthScale={1}
          opacity={0.5}
          transparent
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color='#333'
          metalness={0.5}
          mirror={1}
        />
      </mesh>
      <Environment preset='sunset' />
    </>
  );
};

useFont.preload('fonts/SnackFont.ttf');

export default Experience;
