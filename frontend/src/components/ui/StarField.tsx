'use client';
import { useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface Particle {
  originX: number;
  originY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  floatOffset: number; 
  floatSpeed: number;
}

interface ShootingStar {
  x: number;
  y: number;
  len: number;
  speed: number;
  opacity: number;
  thickness: number;
}

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const particlesRef = useRef<Particle[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const animFrameRef = useRef<number>(0);
  const isMobileRef = useRef(false);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Responsive configuration
    let count = 220;
    let repelRadius = 135;
    let repelStrength = 7;
    let floatAmp = 22;

    const createParticles = () => {
      isMobileRef.current = window.innerWidth < 768;
      
      // Mobile optimizations to prevent "messy" look
      if (isMobileRef.current) {
        count = 100;        // Fewer stars to avoid crowding
        repelRadius = 75;   // Smaller push-away zone for fingers
        repelStrength = 5;
        floatAmp = 12;      // Less chaotic float
      } else {
        count = 220;
        repelRadius = 135;
        repelStrength = 7;
        floatAmp = 22;
      }

      particlesRef.current = Array.from({ length: count }, () => {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        return {
          originX: x,
          originY: y,
          x,
          y,
          vx: 0,
          vy: 0,
          size: Math.random() * (isMobileRef.current ? 1.2 : 1.8) + 0.3,
          opacity: Math.random() * 0.45 + 0.25,
          floatOffset: Math.random() * Math.PI * 2,
          floatSpeed: Math.random() * 0.3 + 0.1,
        };
      });
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createParticles();
    };

    resize();
    window.addEventListener('resize', resize);

    const handleMouse = (e: MouseEvent | TouchEvent) => {
      if ('clientX' in e) {
        mouseRef.current = { x: e.clientX, y: e.clientY };
      } else if (e.touches.length > 0) {
        mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const handleLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };
    
    window.addEventListener('mousemove', handleMouse);
    window.addEventListener('touchstart', handleMouse, { passive: true });
    window.addEventListener('touchmove', handleMouse, { passive: true });
    window.addEventListener('mouseleave', handleLeave);
    window.addEventListener('touchend', handleLeave);

    const draw = (timeVal: number) => {
      const isDark = document.documentElement.classList.contains('dark');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const elapsed = timeVal * 0.0008;

      const dotColor = isDark ? '255, 255, 255' : '100, 116, 139';

      // 1. Star Field
      for (const p of particlesRef.current) {
        const targetX = p.originX + Math.cos(elapsed * p.floatSpeed + p.floatOffset) * floatAmp;
        const targetY = p.originY + Math.sin(elapsed * p.floatSpeed + p.floatOffset + 1) * floatAmp;

        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < repelRadius && dist > 0) {
          const force = (repelRadius - dist) / repelRadius;
          const angle = Math.atan2(dy, dx);
          p.vx += Math.cos(angle) * force * repelStrength;
          p.vy += Math.sin(angle) * force * repelStrength;
        }

        p.vx += (targetX - p.x) * 0.05;
        p.vy += (targetY - p.y) * 0.05;
        p.vx *= 0.82;
        p.vy *= 0.82;
        p.x += p.vx;
        p.y += p.vy;

        const twinkle = 0.6 + Math.sin(elapsed * 2.5 + p.floatOffset) * 0.4;
        const finalOpacity = p.opacity * twinkle;

        // Draw Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${dotColor}, ${finalOpacity})`;
        ctx.fill();

        if (isDark) {
          // Neon Halo (smaller bloom on mobile)
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${finalOpacity * 0.25})`;
          ctx.fill();
          
          if (!isMobileRef.current) {
            // Extra Atmosphere only for Desktop
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 6, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${finalOpacity * 0.08})`;
            ctx.fill();
          }
        }
      }

      // 2. Shooting Stars (Limit to 1 on mobile)
      const maxMeteors = isMobileRef.current ? 1 : 3;
      if (Math.random() < (isMobileRef.current ? 0.008 : 0.015) && shootingStarsRef.current.length < maxMeteors) {
        shootingStarsRef.current.push({
          x: Math.random() * canvas.width * 0.8,
          y: Math.random() * canvas.height * 0.4,
          len: Math.random() * (isMobileRef.current ? 60 : 150) + 50,
          speed: Math.random() * (isMobileRef.current ? 8 : 12) + 8,
          opacity: 1,
          thickness: Math.random() * (isMobileRef.current ? 1 : 2) + 1,
        });
      }

      for (let i = shootingStarsRef.current.length - 1; i >= 0; i--) {
        const s = shootingStarsRef.current[i];
        ctx.save();
        ctx.beginPath();
        const meteorGrad = ctx.createLinearGradient(s.x, s.y, s.x - s.len, s.y - s.len / 1.5);
        const meteorCol = isDark ? '255, 255, 255' : '100, 116, 139';
        meteorGrad.addColorStop(0, `rgba(${meteorCol}, ${s.opacity})`);
        meteorGrad.addColorStop(1, `rgba(${meteorCol}, 0)`);
        ctx.strokeStyle = meteorGrad;
        ctx.lineWidth = s.thickness;
        ctx.lineCap = 'round';
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.len, s.y - s.len / 1.5);
        ctx.stroke();
        ctx.restore();

        s.x += s.speed;
        s.y += s.speed / 1.5;
        s.opacity -= isMobileRef.current ? 0.02 : 0.012;
        if (s.opacity <= 0 || s.x > canvas.width || s.y > canvas.height) {
          shootingStarsRef.current.splice(i, 1);
        }
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('touchstart', handleMouse);
      window.removeEventListener('touchmove', handleMouse);
      window.removeEventListener('mouseleave', handleLeave);
      window.removeEventListener('touchend', handleLeave);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 bg-transparent"
      style={{ touchAction: 'none' }}
    />
  );
}
