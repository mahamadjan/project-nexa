'use client';

import { useEffect, useState } from 'react';

// Lighter generation for static background
const generatePath = (width: number, height: number, startY: number) => {
  let path = `M 0 ${startY} `;
  let currentX = 0;
  let currentY = startY;
  const points = 4;
  for (let i = 0; i < points; i++) {
    const dx = (width / points) * (0.5 + Math.random());
    currentX += dx;
    path += `L ${currentX} ${currentY} `;
    const turn = Math.random() > 0.5 ? 1 : -1;
    const dy = turn * (50 + Math.random() * 150);
    currentY += dy;
    currentY = Math.max(20, Math.min(height - 20, currentY));
    path += `L ${currentX} ${currentY} `;
  }
  path += `L ${width + 100} ${currentY}`;
  return path;
};

export default function CircuitBackground() {
  const [paths, setPaths] = useState<{ d: string; color: string }[]>([]);

  useEffect(() => {
    // Only static calculation once
    const height = Math.min(window.innerHeight * 2, 2000); // capped height for perf
    const width = window.innerWidth;
    const colors = ['#3b82f6', '#ec4899', '#8b5cf6', '#22d3ee'];
    
    // Only 4 paths to keep DOM light
    const generated = Array.from({ length: 4 }).map(() => ({
      d: generatePath(width, height, height * Math.random()),
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setPaths(generated);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-30">
      <svg 
        className="w-full h-full absolute top-0 left-0" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Static circuit traces - no heavy motion.path loops */}
        {paths.map((p, i) => (
          <g key={i}>
            <path 
              d={p.d} 
              fill="none" 
              stroke="rgba(255,255,255,0.03)" 
              strokeWidth="1" 
              strokeLinecap="square"
            />
            <path 
              d={p.d} 
              fill="none" 
              stroke={p.color} 
              strokeWidth="1" 
              opacity="0.2"
              strokeLinecap="round"
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
