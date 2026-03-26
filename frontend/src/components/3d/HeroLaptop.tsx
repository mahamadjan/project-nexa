'use client';
import React, { useRef, Suspense, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Environment, Html, Text, Sparkles, ContactShadows, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '@/context/ThemeContext';

// Simple Error Boundary to catch missing GLTF files
class ErrorBoundary extends React.Component<{ fallback: React.ReactNode, children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// ─── ORIGINAL FALLBACK LAPTOP (Used if Sketchfab model is not downloaded yet) ───
function FallbackLaptopModel() {
  const groupRef = useRef<THREE.Group>(null);
  const lidRef = useRef<THREE.Group>(null);
  const { theme } = useTheme();

  const chassisColor = theme === 'dark' ? "#f1f5f9" : "#0f0f12";
  const deckColor = theme === 'dark' ? "#e2e8f0" : "#1a1a20";
  const keyColor = theme === 'dark' ? "#cbd5e1" : "#2d2d35";

  useFrame((state) => {
    if (!groupRef.current || !lidRef.current) return;
    const time = state.clock.elapsedTime;
    
    // Parallax mouse tilt
    const targetX = (state.pointer.x * Math.PI) / 8;
    const targetY = (state.pointer.y * Math.PI) / 10;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetX + time * 0.1, 0.05);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -targetY + 0.1, 0.05);

    // Initial open animation
    lidRef.current.rotation.x = THREE.MathUtils.lerp(lidRef.current.rotation.x, -1.3, 0.05);
  });

  return (
    <group ref={groupRef} position={[0, -0.2, 0]} dispose={null}>
      {/* Base */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[5, 0.18, 3.5]} />
        <meshStandardMaterial color={chassisColor} metalness={0.6} roughness={0.15} />
      </mesh>
      {/* Deck */}
      <group position={[0, 0.06, 0.3]}>
        <mesh castShadow>
          <boxGeometry args={[4.6, 0.02, 2.4]} />
          <meshStandardMaterial color={deckColor} metalness={0.6} roughness={0.15} />
        </mesh>
        {/* Keys */}
        <mesh position={[0, 0.025, -0.3]}>
          <boxGeometry args={[4.2, 0.04, 1.6]} />
          <meshStandardMaterial color={keyColor} metalness={0.3} roughness={0.6} />
        </mesh>
      </group>
      {/* Lid */}
      <group ref={lidRef} position={[0, 0.09, -1.72]} rotation={[0, 0, 0]}>
        <mesh position={[0, 1.55, 0.05]} castShadow>
          <boxGeometry args={[5, 3.1, 0.14]} />
          <meshStandardMaterial color={chassisColor} metalness={0.6} roughness={0.15} />
        </mesh>
        <mesh position={[0, 1.55, 0.13]}>
          <boxGeometry args={[4.9, 3.0, 0.01]} />
          <meshStandardMaterial color="#080810" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 1.55, 0.14]}>
          <planeGeometry args={[4.5, 2.7]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.8} />
        </mesh>
      </group>
      
      {/* Placeholder Warning HTML */}
      <Html position={[0, -1, 0]} center>
        <div className="bg-blue-600/20 border border-blue-500/50 backdrop-blur-md text-white text-xs px-4 py-3 rounded-2xl flex flex-col items-center gap-2 text-center whitespace-nowrap shadow-xl">
          <p className="font-bold flex items-center gap-2">⚠️ Скетчфаб модель не найдена</p>
          <p className="text-[10px] text-blue-200">Скачайте GLTF (ссылка в чате) и поместите в <code className="bg-black/30 px-1 rounded">public/laptop/scene.gltf</code></p>
        </div>
      </Html>
    </group>
  );
}

// ─── PREMIUM SKETCHFAB LAPTOP ───
function SketchfabLaptopModel({ isMobile }: { isMobile: boolean }) {
  const { theme } = useTheme();
  const groupRef = useRef<THREE.Group>(null);
  
  // Attempts to load the Sketchfab GLTF model
  // Requires the user to download the file from https://skfb.ly/pFtHs and put it in /public/laptop/
  const { scene } = useGLTF('/laptop/scene.gltf') as any;

  // Enhance materials and replace screen
  useEffect(() => {
    if (!scene) return;

    scene.traverse((child: any) => {
      if (child.isMesh) {
        // Enhance contrast and premium look for metal components
        if (child.material) {
          // Clone material to avoid mutating shared cache
          child.material = child.material.clone();
          
          if (child.material.name && child.material.name.toLowerCase().includes('metal')) {
             child.material.metalness = Math.min((child.material.metalness || 0) + 0.3, 1);
             child.material.roughness = Math.max((child.material.roughness || 1) - 0.2, 0);
          }
          child.material.needsUpdate = true;
        }

        // Replace the screen content with an animated emissive material
        const name = child.name.toLowerCase();
        if (name.includes('screen') || name.includes('display') || name.includes('monitor') || name.includes('glass')) {
          const screenColor = theme === 'dark' ? '#1e3a8a' : '#3b82f6';
          const emissiveColor = theme === 'dark' ? '#3b82f6' : '#60a5fa';
          
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(screenColor),
            emissive: new THREE.Color(emissiveColor),
            emissiveIntensity: 1.2,
            roughness: 0.1,
            metalness: 0.8,
          });
        }
      }
    });
  }, [scene, theme]);

  // Entrance animation state
  const [scale, setScale] = useState(0);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Entrance scaling
    if (scale < 1) setScale(s => Math.min(s + 0.05, 1));
    groupRef.current.scale.setScalar(scale * (isMobile ? 1.3 : 1.2)); // Scale adjustment for the Sketchfab model

    // Constant 360 degree rotation
    const time = state.clock.elapsedTime;
    groupRef.current.rotation.y = time * 0.4; // Smooth continuous spin
    
    // Subtle idle breathing tilt (optional, keeps it feeling floating)
    groupRef.current.rotation.x = 0.1 + Math.sin(time * 0.5) * 0.05;
    groupRef.current.rotation.z = Math.cos(time * 0.3) * 0.02;
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      <primitive object={scene} />
    </group>
  );
}

// Main Component
export default function HeroLaptop({ scrollProgress = 0, isMobile = false }: { scrollProgress?: any, isMobile?: boolean }) {
  const { theme } = useTheme();
  
  // Responsive camera settings
  const cameraPos: [number, number, number] = isMobile ? [0, 1.2, 8.2] : [0, 1.5, 12];
  const cameraFov = isMobile ? 55 : 45;
  
  const neonColor = theme === 'dark' ? '#3b82f6' : '#8b5cf6'; // Blue for dark, Purple for light
  
  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      <Canvas
        dpr={[1, 1.5]}
        shadows={false}
        camera={{ position: cameraPos, fov: cameraFov }}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        style={{ touchAction: 'pan-y' }}
        onPointerOver={() => document.body.style.cursor = 'default'}
      >
        {/* --- Advanced Studio Lighting Setup --- */}
        <ambientLight intensity={theme === 'dark' ? 1.5 : 0.8} />
        
        {/* Main Key Lights */}
        <spotLight position={[10, 20, 10]} angle={0.3} penumbra={1} intensity={theme === 'dark' ? 25 : 5} castShadow />
        <spotLight position={[-10, 20, -10]} angle={0.3} penumbra={1} intensity={theme === 'dark' ? 15 : 3} />

        {/* Rim Lights (Pops the silhouette from the background) */}
        <pointLight position={[0, 5, -10]} color="#ffffff" intensity={theme === 'dark' ? 40 : 10} distance={30} />
        <pointLight position={[-8, 0, -5]} color={neonColor} intensity={theme === 'dark' ? 25 : 5} distance={20} />
        <pointLight position={[8, 0, -5]} color="#ec4899" intensity={theme === 'dark' ? 20 : 5} distance={20} />

        {/* Front Highlights */}
        <pointLight position={[-5, 2, 8]} color="#ffffff" intensity={theme === 'dark' ? 12 : 3} distance={15} />
        <pointLight position={[5, -2, 8]} color={neonColor} intensity={theme === 'dark' ? 10 : 2} distance={15} />

        {/* Anti-Gravity Float Wrapper */}
        <Suspense fallback={<FallbackLaptopModel />}>
          <Float rotationIntensity={0.2} floatIntensity={0.8} speed={1.5} floatingRange={[-0.2, 0.2]}>
            <ErrorBoundary fallback={<FallbackLaptopModel />}>
              <SketchfabLaptopModel isMobile={isMobile} />
            </ErrorBoundary>
            
            {/* Energy field particles under the laptop */}
            <Sparkles 
              count={60} 
              scale={[4, 1, 3]} 
              position={[0, -1.2, 0]} 
              size={isMobile ? 3 : 5} 
              speed={0.4} 
              opacity={theme === 'dark' ? 0.6 : 0.3} 
              color={neonColor} 
            />
          </Float>
        </Suspense>

        {/* Soft shadow and light glow underneath */}
        <ContactShadows 
          position={[0, -2.5, 0]} 
          opacity={theme === 'dark' ? 0.8 : 0.4} 
          scale={15} 
          blur={2.5} 
          far={3} 
          color={neonColor} 
        />

        <Suspense fallback={null}>
          <Environment preset={theme === 'dark' ? "night" : "city"} blur={0} />
        </Suspense>
      </Canvas>
    </div>
  );
}
