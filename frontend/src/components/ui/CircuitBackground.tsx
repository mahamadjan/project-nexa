'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Generate random circuit paths flowing left to right
const generatePath = (width: number, height: number, startY: number) => {
  let path = `M 0 ${startY} `;
  let currentX = 0;
  let currentY = startY;

  const points = Math.floor(Math.random() * 5) + 4; // 4 to 8 turns
  
  for (let i = 0; i < points; i++) {
    // Go right
    const dx = (width / points) * (0.5 + Math.random());
    currentX += dx;
    path += `L ${currentX} ${currentY} `;
    
    // Turn up or down
    const turn = Math.random() > 0.5 ? 1 : -1;
    const dy = turn * (50 + Math.random() * 150);
    currentY += dy;
    
    // Keep bounded
    currentY = Math.max(20, Math.min(height - 20, currentY));
    path += `L ${currentX} ${currentY} `;
  }
  
  // Finish off screen
  path += `L ${width + 100} ${currentY}`;
  return path;
};

export default function CircuitBackground() {
  const [paths, setPaths] = useState<{ d: string; delay: number; duration: number; color: string }[]>([]);

  useEffect(() => {
    // We get the full scrollable height (approximal)
    const height = Math.max(document.body.scrollHeight, window.innerHeight * 3);
    const width = window.innerWidth;

    const colors = ['#3b82f6', '#ec4899', '#8b5cf6', '#22d3ee']; // Tech colors
    const generated = [];

    // Create 8 circuit traces for better mobile performance
    for (let i = 0; i < 8; i++) {
      generated.push({
        d: generatePath(width, height, height * (Math.random())),
        delay: Math.random() * 5,
        duration: 3 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    setPaths(generated);
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-40">
      <svg 
        className="w-full absolute top-0 left-0" 
        style={{ height: '100%' }} // Will stretch to full scroll height
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Subtle grid base */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Animated circuit traces */}
        {paths.map((p, i) => (
          <g key={i}>
            {/* Base faint track */}
            <path 
              d={p.d} 
              fill="none" 
              stroke="rgba(255,255,255,0.05)" 
              strokeWidth="2" 
              strokeLinecap="square"
              strokeLinejoin="miter"
            />
            {/* Glowing moving current */}
            <motion.path 
              d={p.d} 
              fill="none" 
              stroke={p.color} 
              strokeWidth="2" 
              strokeLinecap="round"
              strokeLinejoin="miter"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: [0, 1],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: p.duration, 
                repeat: Infinity, 
                delay: p.delay,
                ease: "linear" 
              }}
            />
            {/* Circuit nodes (dots) at the end of some paths just for aesthetics */}
            <motion.circle 
              r="3" 
              fill={p.color} 
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "linear" }}
            >
              <animateMotion dur={`${p.duration}s`} repeatCount="indefinite" begin={`${p.delay}s`}>
                <mpath href={`#path-${i}`} />
              </animateMotion>
            </motion.circle>
            {/* Hidden path for the circle to follow */}
            <path id={`path-${i}`} d={p.d} fill="none" display="none" />
          </g>
        ))}
      </svg>
    </div>
  );
}
