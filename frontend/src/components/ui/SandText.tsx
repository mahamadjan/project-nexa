'use client';

import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  color: string;
  size: number;
  vx: number;
  vy: number;
  friction: number;
  ease: number;
}

export const SandText: React.FC<{ text: string }> = ({ text }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;
    const mouse = { x: -2000, y: -2000, radius: 100 };

    const init = async () => {
      if (typeof document !== 'undefined') {
         await document.fonts.ready;
      }

      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      // Pure theme-based color (White on Dark, Black on Light)
      const isLight = document.documentElement.classList.contains('light');
      const startColor = isLight ? '#000000' : '#FFFFFF';
      
      const isMobile = window.innerWidth < 768;
      const fontSize = isMobile ? 38 : 110;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = startColor;
      ctx.font = `900 ${fontSize}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const lines = text.split('\n');
      const lineHeight = fontSize * 0.95;
      
      lines.forEach((line, i) => {
        const yPos = (canvas.height / 2) + (i - (lines.length - 1) / 2) * lineHeight;
        ctx.fillText(line.toUpperCase(), canvas.width / 2, yPos);
      });

      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      particles = [];

      const gap = isMobile ? 2 : 4;
      for (let y = 0; y < canvas.height; y += gap) {
        for (let x = 0; x < canvas.width; x += gap) {
          const index = (y * canvas.width + x) * 4;
          const alpha = pixels[index + 3];
          if (alpha > 120) {
            particles.push({
              x: x,
              y: y,
              originX: x,
              originY: y,
              color: startColor, // Pure solid theme color
              size: Math.random() * 2 + 1,
              vx: 0,
              vy: 0,
              friction: 0.5,
              ease: 0.15
            });
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          p.vx -= Math.cos(angle) * force * 15;
          p.vy -= Math.sin(angle) * force * 15;
        }

        p.vx += (p.originX - p.x) * p.ease;
        p.vy += (p.originY - p.y) * p.ease;
        p.vx *= p.friction;
        p.vy *= p.friction;
        p.x += p.vx;
        p.y += p.vy;

        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -2000;
      mouse.y = -2000;
    };

    init();
    animate();

    const observer = new MutationObserver(() => init());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    window.addEventListener('resize', init);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', init);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [text]);

  return (
    <div ref={containerRef} className="w-full h-[220px] md:h-[420px] relative pointer-events-auto">
      <canvas ref={canvasRef} className="w-full h-full block pointer-events-none" />
    </div>
  );
};
