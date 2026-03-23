'use client';
import { useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Environment, Html, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '@/context/ThemeContext';

interface LaptopModelProps {
  scrollProgress?: any;
}

function LaptopModel({ scrollProgress: propProgress }: LaptopModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const lidRef = useRef<THREE.Group>(null);
  const deckRef = useRef<THREE.Group>(null);
  const logoRef = useRef<THREE.Mesh>(null);
  const screenRef = useRef<THREE.Group>(null);
  
  const labelScreenRef = useRef<HTMLDivElement>(null);
  const labelDeckRef = useRef<HTMLDivElement>(null);
  const labelBaseRef = useRef<HTMLDivElement>(null);
  
  const { theme } = useTheme();

  // Inverted colors: White/Gray on dark theme, Black on light theme
  const chassisColor = theme === 'dark' ? "#f1f5f9" : "#0f0f12";
  const deckColor = theme === 'dark' ? "#e2e8f0" : "#1a1a20";
  const keyColor = theme === 'dark' ? "#cbd5e1" : "#2d2d35";
  const textColor = theme === 'dark' ? "white" : "black";

  useFrame((state) => {
    if (!groupRef.current || !lidRef.current || !deckRef.current) return;

    // Use time to drive an oscillating value between 0 and 1 for the "explosion" effect
    // We slow down the explosion even more
    const time = state.clock.elapsedTime;
    const p = (Math.sin(time * 0.4) + 1) / 2; // Ranges from 0 to 1 very smoothly

    // ─── Animations ───
    groupRef.current.position.z = p * -1.5; 
    groupRef.current.position.y = -0.5 - p * 0.3;

    lidRef.current.rotation.x = -1.15 + p * 0.3;
    lidRef.current.position.y = 0.09 + p * 1.8; // Reduced from 4
    lidRef.current.position.z = -1.72 - p * 1.0; // Reduced from 2

    if (screenRef.current) {
      screenRef.current.position.z = 0.13 + p * 0.8; // Reduced from 1.5
    }

    if (logoRef.current) {
      logoRef.current.position.z = -0.08 - p * 1.5; // Reduced from 3
    }

    deckRef.current.position.y = 0.06 + p * 0.8; // Reduced from 1.5
    deckRef.current.position.z = 0.3 + p * 0.8; // Reduced from 1.5

    // Continuous 360 slow spin
    groupRef.current.rotation.y = time * 0.2;
    // Dynamic tilt (breathing effect)
    groupRef.current.rotation.x = Math.sin(time * 0.5) * 0.05 + 0.1;
    const labelOpacity = p > 0.2 ? (p - 0.2) * 1.25 : 0; // Fade in after p > 0.2
    if (labelScreenRef.current) labelScreenRef.current.style.opacity = Math.min(labelOpacity, 1).toFixed(2);
    if (labelDeckRef.current) labelDeckRef.current.style.opacity = Math.min(labelOpacity, 1).toFixed(2);
    if (labelBaseRef.current) labelBaseRef.current.style.opacity = Math.min(labelOpacity, 1).toFixed(2);
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]} dispose={null}>
      {/* ── Base chassis ── */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[5, 0.18, 3.5]} />
        <meshStandardMaterial 
          color={chassisColor} 
          metalness={0.6} 
          roughness={0.15} 
          transparent={true}
          opacity={0.85}
        />
        <Html position={[2.6, 0.1, 1]} center>
          <div ref={labelBaseRef} className="flex items-center gap-3 font-mono text-xs whitespace-nowrap transition-opacity duration-75" style={{ color: textColor, pointerEvents: 'none' }}>
            <div className="w-12 h-px bg-current opacity-50" />
            <span className="font-semibold tracking-widest uppercase cursor-default select-none">Корпус</span>
          </div>
        </Html>
      </mesh>

      {/* Bottom slight bevel edge glow */}
      <mesh position={[0, -0.075, 0]}>
        <boxGeometry args={[5.04, 0.04, 3.54]} />
        <meshStandardMaterial color="#3b82f6" metalness={1} roughness={0} emissive="#3b82f6" emissiveIntensity={0.4} />
      </mesh>

      {/* Keyboard deck */}
      <group ref={deckRef} position={[0, 0.06, 0.3]}>
        <mesh castShadow>
          <boxGeometry args={[4.6, 0.02, 2.4]} />
          <meshStandardMaterial 
            color={deckColor} 
            metalness={0.6} 
            roughness={0.15}
            transparent={true}
            opacity={0.9}
          />
        </mesh>
        <Html position={[2.4, 0.1, -0.5]} center>
          <div ref={labelDeckRef} className="flex items-center gap-3 font-mono text-xs whitespace-nowrap transition-opacity duration-75" style={{ color: textColor, pointerEvents: 'none' }}>
            <div className="w-12 h-px bg-current opacity-50" />
            <span className="font-semibold tracking-widest uppercase cursor-default select-none">Клавиатура</span>
          </div>
        </Html>

        {/* Key rows */}
        {[-0.8, -0.3, 0.2, 0.65].map((z, ri) =>
          Array.from({ length: 13 }, (_, ki) => (
            <mesh key={`${ri}-${ki}`} position={[-2.4 + ki * 0.4, 0.025, z]} castShadow>
              <boxGeometry args={[0.32, 0.04, 0.28]} />
              <meshStandardMaterial color={keyColor} metalness={0.3} roughness={0.6} transparent opacity={0.8} />
            </mesh>
          ))
        )}
        
        {/* Trackpad */}
        <mesh position={[0, 0.01, 0.95]}>
          <boxGeometry args={[1.8, 0.02, 0.9]} />
          <meshStandardMaterial color={keyColor} metalness={0.6} roughness={0.2} transparent opacity={0.6} />
        </mesh>
      </group>

      {/* ── Hinge ── */}
      <mesh position={[0, 0.09, -1.72]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 5.1, 20]} />
        <meshStandardMaterial color={keyColor} metalness={0.9} roughness={0.1} transparent opacity={0.8} />
      </mesh>

      {/* ── Screen lid ── */}
      <group ref={lidRef} position={[0, 0.09, -1.72]} rotation={[-1.15, 0, 0]}>
        {/* Lid outer */}
        <mesh position={[0, 1.55, 0.05]} castShadow>
          <boxGeometry args={[5, 3.1, 0.14]} />
          <meshStandardMaterial 
            color={chassisColor} 
            metalness={0.6} 
            roughness={0.15}
            transparent={true}
            opacity={0.9}
          />
        </mesh>

        {/* NEXA logo on back */}
        <mesh ref={logoRef} position={[0, 1.55, -0.08]}>
          <boxGeometry args={[0.8, 0.12, 0.02]} />
          <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={1.2} metalness={1} roughness={0} />
        </mesh>

        {/* Screen bezel & content group */}
        <group ref={screenRef}>
          {/* Screen bezel */}
          <mesh position={[0, 1.55, 0.13]}>
            <boxGeometry args={[4.9, 3.0, 0.01]} />
            <meshStandardMaterial color="#080810" metalness={0.95} roughness={0.05} transparent opacity={0.8} />
          </mesh>

          {/* Actual screen glow / Wallpaper Base */}
          <mesh position={[0, 1.55, 0.14]}>
            <planeGeometry args={[4.5, 2.7]} />
            <meshBasicMaterial color="#1e3a8a" />
          </mesh>
          
          {/* Subtle screen darkening for contrast */}
          <mesh position={[0, 1.55, 0.143]}>
            <planeGeometry args={[4.5, 2.7]} />
            <meshBasicMaterial color="#000000" transparent opacity={0.3} />
          </mesh>

          {/* Group Name Text natively in WebGL */}
          <Text
            position={[0, 1.55, 0.145]}
            fontSize={0.28}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.01}
            outlineColor="#000000"
          >
            Группа: ИСТ 5-24 B
          </Text>

          <Html position={[2.5, 1.55, 0.14]} center>
            <div ref={labelScreenRef} className="flex items-center gap-3 font-mono text-xs whitespace-nowrap transition-opacity duration-75" style={{ color: textColor, pointerEvents: 'none' }}>
              <div className="w-16 h-px bg-current opacity-50" />
              <span className="font-semibold tracking-widest uppercase cursor-default select-none">Дисплей</span>
            </div>
          </Html>
        </group>
      </group>

      {/* Base chassis and other components stay the same */}
    </group>
  );
}

export default function HeroLaptop({ scrollProgress = 0 }: { scrollProgress?: any }) {
  const { theme } = useTheme();
  
  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      <Canvas
        dpr={[1, 1.5]}
        shadows={false}
        camera={{ position: [0, 4, 14], fov: 42 }}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        style={{ touchAction: 'pan-y' }}
      >
        <ambientLight intensity={theme === 'dark' ? 0.4 : 0.8} />
        <spotLight
          position={[10, 20, 10]}
          angle={0.25}
          penumbra={1}
          intensity={theme === 'dark' ? 3 : 2}
          castShadow
        />
        <pointLight position={[-8, 5, 5]} color="#3b82f6" intensity={theme === 'dark' ? 2 : 1} />
        <pointLight position={[8, 5, -5]} color="#6366f1" intensity={theme === 'dark' ? 2 : 1} />

        <Suspense fallback={null}>
          <Float rotationIntensity={0.1} floatIntensity={0.4} speed={1.5}>
            <LaptopModel />
          </Float>
        </Suspense>
        <Suspense fallback={null}>
          <Environment preset={theme === 'dark' ? "night" : "city"} />
        </Suspense>
      </Canvas>
    </div>
  );
}
