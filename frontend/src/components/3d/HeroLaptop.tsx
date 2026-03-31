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

// ─── OPTIMIZED LOADING FALLBACK ───
function FallbackLaptopModel() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full shadow-2xl">
          <p className="text-white text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap">
            Инициализация NEXA 3D...
          </p>
        </div>
      </div>
    </Html>
  );
}

// ─── PREMIUM SKETCHFAB LAPTOP ───
function SketchfabLaptopModel({ isMobile }: { isMobile: boolean }) {
  const { theme } = useTheme();
  const groupRef = useRef<THREE.Group>(null);
  
  // Attempts to load the Sketchfab GLTF model with DRACO compression support
  const { scene } = useGLTF('/laptop/scene.gltf', true) as any;

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

  // Entrance animation state - MUST NOT use React state inside useFrame
  const scaleRef = useRef(0);
  const targetScale = isMobile ? 1.3 : 1.2;

  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Smooth entrance scaling without triggering React re-renders
    if (scaleRef.current < 1) {
      scaleRef.current += 0.05;
      if (scaleRef.current > 1) scaleRef.current = 1;
    }
    groupRef.current.scale.setScalar(scaleRef.current * targetScale);

    // Constant 360 degree rotation
    const time = state.clock.elapsedTime;
    groupRef.current.rotation.y = time * 0.4; // Smooth continuous spin
    
    // Subtle idle breathing tilt
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, { threshold: 0.05 });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);
  
  // Responsive camera settings
  const cameraPos: [number, number, number] = isMobile ? [0, 1.2, 8.2] : [0, 1.5, 12];
  const cameraFov = isMobile ? 55 : 45;
  
  const neonColor = theme === 'dark' ? '#3b82f6' : '#8b5cf6'; // Blue for dark, Purple for light
  
  return (
    <div ref={containerRef} className="absolute inset-0 z-10 pointer-events-none">
      <Canvas
        frameloop={isVisible ? 'always' : 'never'}
        dpr={1}
        shadows={false}
        camera={{ position: cameraPos, fov: cameraFov }}
        gl={{ 
          antialias: false, 
          alpha: true, 
          powerPreference: "high-performance",
          stencil: false,
          depth: true
        }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener('webglcontextlost', (event) => {
            event.preventDefault();
            console.warn('NEXA: 3D Context Lost. Recovering...');
          }, false);
        }}
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
            
            {/* Removed Sparkles as per user request to have nothing underneath the floating laptop */}
          </Float>
        </Suspense>

        {/* Removed ContactShadows as per user request for a cleaner look without the bottom shadow */}

        <Suspense fallback={null}>
          <Environment preset={theme === 'dark' ? "night" : "city"} blur={0} />
        </Suspense>
      </Canvas>
    </div>
  );
}
