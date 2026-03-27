'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import * as THREE from 'three';

const PARTICLE_COUNT = 8000;
const TUNNEL_LENGTH = 200;
const TUNNEL_RADIUS = 15;

function VortexParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const targetZ = useRef(0);
  const currentZ = useRef(0);

  // Generate a swirling tunnel of particles
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const col = new Float32Array(PARTICLE_COUNT * 3);
    const colorBlue = new THREE.Color('#3b82f6'); // Tailwind blue-500
    const colorPink = new THREE.Color('#ec4899'); // Tailwind pink-500
    const colorTemp = new THREE.Color();

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Cylindrical distribution with noise
      const angle = Math.random() * Math.PI * 2;
      // Z goes from 0 to -TUNNEL_LENGTH (deeper into the screen)
      const z = -Math.random() * TUNNEL_LENGTH; 
      
      // Radius varies slightly, creating a cavernous feel
      const radiusOffset = (Math.random() - 0.5) * 5;
      const radius = TUNNEL_RADIUS + radiusOffset;

      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      pos[i * 3 + 0] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      // Color gradient based on depth (Z) and random mix
      const mixRatio = Math.abs(z / TUNNEL_LENGTH) + (Math.random() * 0.2);
      colorTemp.lerpColors(colorBlue, colorPink, mixRatio);
      
      col[i * 3 + 0] = colorTemp.r;
      col[i * 3 + 1] = colorTemp.g;
      col[i * 3 + 2] = colorTemp.b;
    }

    return [pos, col];
  }, []);

  const { camera } = useThree();

  useEffect(() => {
    // Start camera outside the tunnel
    camera.position.z = 10;
  }, [camera]);

  useFrame((state, delta) => {
    // 1. Calculate scroll progress (0 to 1)
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = maxScroll > 0 ? Math.max(0, Math.min(1, window.scrollY / maxScroll)) : 0;

    // 2. Map scroll progress to tunnel depth
    // As you scroll down (progress -> 1), targetZ goes negative (into the tunnel)
    // We want the journey to end just before the end of the particles
    targetZ.current = 10 - (scrollProgress * (TUNNEL_LENGTH * 0.85));

    // 3. Smooth camera movement
    currentZ.current = THREE.MathUtils.lerp(currentZ.current, targetZ.current, delta * 3);
    camera.position.z = currentZ.current;

    // 4. Add dynamic rotation to the tunnel
    if (pointsRef.current) {
      // Rotation speed increases as you go deeper (based on scroll)
      const rotationSpeed = 0.05 + (scrollProgress * 0.2);
      pointsRef.current.rotation.z -= delta * rotationSpeed;
      
      // Gentle wobble
      pointsRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.5) * 2 * scrollProgress;
      pointsRef.current.position.y = Math.cos(state.clock.elapsedTime * 0.3) * 2 * scrollProgress;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <primitive object={new THREE.BufferAttribute(positions, 3)} attach="attributes-position" />
        <primitive object={new THREE.BufferAttribute(colors, 3)} attach="attributes-color" />
      </bufferGeometry>
      <pointsMaterial 
        size={0.15} 
        vertexColors 
        transparent 
        opacity={0.8}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function ScrollVortex() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none" style={{ opacity: 0.8 }}>
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 60 }}
        dpr={[1, 2]} // Performance: cap DPR at 2
        gl={{ antialias: false, powerPreference: 'high-performance' }}
      >
        <fog attach="fog" args={['#000000', 0, 40]} />
        <VortexParticles />
        <Preload all />
      </Canvas>
      
      {/* Dark overlay gradient to blend with the pure black theme */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none opacity-80" />
    </div>
  );
}
