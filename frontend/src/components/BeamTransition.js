import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const BeamLight = () => {
  const spotlightRef = useRef();
  const targetRef = useRef();

  useEffect(() => {
    if (spotlightRef.current && targetRef.current) {
      spotlightRef.current.target = targetRef.current;
    }
  }, []);

  useFrame((state) => {
    if (spotlightRef.current) {
      const time = state.clock.getElapsedTime();
      spotlightRef.current.position.x = Math.sin(time * 0.5) * 3;
      spotlightRef.current.intensity = 2 + Math.sin(time * 2) * 0.5;
    }
  });

  return (
    <>
      <spotLight
        ref={spotlightRef}
        position={[-5, 5, 0]}
        angle={0.3}
        penumbra={0.5}
        intensity={2}
        color="#60a5fa"
        castShadow
      />
      <mesh ref={targetRef} position={[0, 0, 0]} visible={false}>
        <sphereGeometry args={[0.1, 16, 16]} />
      </mesh>
    </>
  );
};

const BeamTransition = () => {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-50"
      style={{ mixBlendMode: 'screen' }}
      data-testid="beam-transition"
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.1} />
        <BeamLight />
      </Canvas>
    </div>
  );
};

export default BeamTransition;
