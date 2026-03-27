'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, Preload } from '@react-three/drei';
import * as THREE from 'three';

// Constants for object distribution
const OBJECT_COUNT = 8;
const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#22d3ee'];

function FloatingShapes() {
  const { viewport } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const targetScrollY = useRef(0);
  const currentScrollY = useRef(0);

  // Pre-calculate random positions, rotations, colors
  const shapes = useMemo(() => {
    return Array.from({ length: OBJECT_COUNT }).map((_, i) => ({
      // Scatter them widely along X and Y, and spread them along Z for depth
      position: new THREE.Vector3(
        (Math.random() - 0.5) * viewport.width * 1.5,
        // Start from below the hero section and extend downwards
        -viewport.height * 0.5 - Math.random() * viewport.height * 3,
        (Math.random() - 0.5) * 10 - 2
      ),
      rotation: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, 0),
      scale: 0.5 + Math.random() * 1.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      speed: 0.2 + Math.random() * 0.8,
      type: Math.random() > 0.6 ? 'torus' : Math.random() > 0.5 ? 'sphere' : 'icosahedron',
    }));
  }, [viewport.width, viewport.height]);

  useFrame((state, delta) => {
    // Read native window scroll
    const scrollY = window.scrollY;
    // Normalize scroll to viewport height units roughly mapping to canvas units
    // 1 viewport height in HTML = `viewport.height` in 3D units roughly if camera is set up a certain way
    // For standard perspective camera, we need a scaling factor.
    // Assuming 100vh ~ viewport.height in R3F.
    const scrollFactor = scrollY / window.innerHeight;
    
    targetScrollY.current = scrollFactor * viewport.height;
    
    // Smooth lerp for buttery scroll response
    currentScrollY.current = THREE.MathUtils.lerp(currentScrollY.current, targetScrollY.current, 5 * delta);

    if (groupRef.current) {
      // Move the entire group UP as we scroll DOWN, creating parallax
      groupRef.current.position.y = currentScrollY.current * 0.8;
      
      // Gentle constant rotation for all
      groupRef.current.rotation.y += delta * 0.05;
      groupRef.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {shapes.map((shape, i) => (
        <Float 
          key={i}
          speed={shape.speed} 
          rotationIntensity={1.5} 
          floatIntensity={2}
          position={shape.position}
        >
          <mesh rotation={shape.rotation} scale={shape.scale}>
            {shape.type === 'torus' && <torusGeometry args={[1, 0.4, 32, 64]} />}
            {shape.type === 'sphere' && <sphereGeometry args={[1, 32, 32]} />}
            {shape.type === 'icosahedron' && <icosahedronGeometry args={[1, 0]} />}
            
            <meshPhysicalMaterial
              color={shape.color}
              transmission={0.9} // Glass-like
              opacity={1}
              metalness={0.1}
              roughness={0.1}
              ior={1.5}
              thickness={2}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export default function Floating3DBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none" style={{ opacity: 0.6 }}>
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 45 }}
        dpr={[1, 2]} // Performance: cap DPR at 2
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={1} color="#8b5cf6" />
        <Environment preset="city" />
        <FloatingShapes />
        <Preload all />
      </Canvas>
    </div>
  );
}
