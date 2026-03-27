'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, Text, SoftShadows } from '@react-three/drei';
import * as THREE from 'three';

// ─── STYLIZED HARDWARE COMPONENTS ───

function CPU() {
  return (
    <group>
      {/* Base */}
      <mesh receiveShadow castShadow>
        <boxGeometry args={[3, 0.2, 3]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* IHS (Integrated Heat Spreader) */}
      <mesh position={[0, 0.15, 0]} receiveShadow castShadow>
        <boxGeometry args={[2.4, 0.1, 2.4]} />
        <meshStandardMaterial color="#silver" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Glowing Accents */}
      <mesh position={[0, 0.21, 0]}>
        <ringGeometry args={[0.5, 0.6, 32]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.8} />
      </mesh>
      <Text position={[0, 0.22, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.3} color="#111" font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeamM.woff">
        CORE i9
      </Text>
      {/* Gold Pins */}
      <mesh position={[0, -0.11, 0]}>
        <boxGeometry args={[2.8, 0.02, 2.8]} />
        <meshStandardMaterial color="#fbbf24" metalness={1} roughness={0.2} />
      </mesh>
    </group>
  );
}

function GPU() {
  const fanRef1 = useRef<THREE.Group>(null);
  const fanRef2 = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (fanRef1.current) fanRef1.current.rotation.y += delta * 10;
    if (fanRef2.current) fanRef2.current.rotation.y += delta * 10;
  });

  return (
    <group>
      {/* Main Shroud */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[5, 0.8, 2.5]} />
        <meshStandardMaterial color="#111" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Glowing Strip */}
      <mesh position={[0, 0.41, 1]}>
        <boxGeometry args={[4.8, 0.02, 0.1]} />
        <meshBasicMaterial color="#ec4899" />
      </mesh>
      <Text position={[-1.5, 0.41, 0.8]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.3} color="#fff" font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeamM.woff">
        RTX 4090
      </Text>
      
      {/* Fans */}
      {[[-1.2, 0.41, 0], [1.2, 0.41, 0]].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]} ref={i === 0 ? fanRef1 : fanRef2}>
          <mesh>
            <cylinderGeometry args={[1, 1, 0.05, 32]} />
            <meshStandardMaterial color="#050505" metalness={0.5} roughness={0.5} />
          </mesh>
          {/* Blades */}
          {Array.from({ length: 9 }).map((_, j) => (
            <mesh key={j} rotation={[0, (j * Math.PI * 2) / 9, 0]} position={[0.4, 0, 0]}>
              <boxGeometry args={[0.8, 0.02, 0.2]} />
              <meshStandardMaterial color="#222" />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function RAM() {
  return (
    <group>
       <mesh castShadow receiveShadow>
         <boxGeometry args={[4, 0.1, 1.2]} />
         <meshStandardMaterial color="#0a0a0a" metalness={0.8} roughness={0.2} />
       </mesh>
       <mesh position={[0, 0.06, 0]}>
         <boxGeometry args={[3.8, 0.02, 0.8]} />
         <meshStandardMaterial color="#1f2937" metalness={0.9} roughness={0.4} />
       </mesh>
       {/* Gold teeth */}
       <mesh position={[0, 0, -0.58]}>
         <boxGeometry args={[3.6, 0.05, 0.05]} />
         <meshStandardMaterial color="#fbbf24" metalness={1} roughness={0.2} />
       </mesh>
       {/* Glowing logo */}
       <Text position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.3} color="#3b82f6" font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeamM.woff">
         64GB DDR5
       </Text>
    </group>
  );
}

// ─── SCROLL MANAGER ───

function HardwareSequence() {
  const { viewport } = useThree();
  
  const cpuRef = useRef<THREE.Group>(null);
  const gpuRef = useRef<THREE.Group>(null);
  const ramRef = useRef<THREE.Group>(null);

  useFrame(() => {
    // 0 = top of page, 1 = bottom of page
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? Math.max(0, Math.min(1, window.scrollY / maxScroll)) : 0;

    // Helper: Map progress range to 0..1..0 for scale/opacity
    const calcActive = (prog: number, start: number, end: number) => {
      if (prog < start || prog > end) return 0;
      const mid = (start + end) / 2;
      const peak = 1 - Math.abs(prog - mid) / ((end - start) / 2);
      return Math.pow(Math.max(0, peak), 2); // easing
    };

    // 1. CPU: active from 0.1 to 0.4
    if (cpuRef.current) {
      const active = calcActive(progress, 0.05, 0.4);
      cpuRef.current.scale.setScalar(active * 1.2);
      cpuRef.current.position.set(-viewport.width * 0.25, (0.25 - progress) * 10, 0); // moves slightly down/up
      cpuRef.current.rotation.x = progress * Math.PI;
      cpuRef.current.rotation.y = progress * 2;
    }

    // 2. GPU: active from 0.35 to 0.7
    if (gpuRef.current) {
      const active = calcActive(progress, 0.35, 0.7);
      gpuRef.current.scale.setScalar(active * 1);
      gpuRef.current.position.set(viewport.width * 0.25, (0.55 - progress) * 10, 2);
      gpuRef.current.rotation.z = progress * Math.PI;
      gpuRef.current.rotation.x = -Math.PI / 4 + progress * 1;
    }

    // 3. RAM: active from 0.65 to 0.95
    if (ramRef.current) {
      const active = calcActive(progress, 0.65, 0.95);
      ramRef.current.scale.setScalar(active * 1.5);
      ramRef.current.position.set(-viewport.width * 0.15, (0.8 - progress) * 10, 1);
      ramRef.current.rotation.x = progress * Math.PI * 2;
      ramRef.current.rotation.y = -progress;
    }
  });

  return (
    <group>
      <group ref={cpuRef}>
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
          <CPU />
        </Float>
      </group>

      <group ref={gpuRef}>
        <Float speed={1.5} rotationIntensity={0.8} floatIntensity={1.5}>
          <GPU />
        </Float>
      </group>

      <group ref={ramRef}>
        <Float speed={2.5} rotationIntensity={1} floatIntensity={0.5}>
          <RAM />
        </Float>
      </group>
    </group>
  );
}

export default function ScrollHardware() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none" style={{ opacity: 0.9 }}>
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 45 }}
        dpr={[1, 2]}
      >
        <SoftShadows size={10} samples={10} focus={0.5} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={2} castShadow color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={1.5} color="#3b82f6" />
        <pointLight position={[0, -5, 5]} intensity={2} color="#ec4899" />
        
        <Environment preset="city" />
        <HardwareSequence />
      </Canvas>
    </div>
  );
}
