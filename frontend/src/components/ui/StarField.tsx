'use client';
import { useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface Particle {
  originX: number;
  originY: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  floatOffset: number; // phase for gentle idle float
  floatSpeed: number;
  vx: number;
  vy: number;
}

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const COUNT = 45;
    const REPEL_RADIUS = 130;
    const REPEL_STRENGTH = 9;
    const FRICTION = 0.78;
    const SPRING = 0.06;
    const FLOAT_AMP = 22;
    let time = 0;

    const createParticles = () => {
      particlesRef.current = Array.from({ length: COUNT }, () => {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        return {
          originX: x,
          originY: y,
          x,
          y,
          size: Math.random() * 1.2 + 0.3,
          opacity: Math.random() * 0.35 + 0.2,
          floatOffset: Math.random() * Math.PI * 2,
          floatSpeed: Math.random() * 0.4 + 0.2,
          vx: 0,
          vy: 0,
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

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const handleLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };
    window.addEventListener('mousemove', handleMouse);
    window.addEventListener('mouseleave', handleLeave);

    const draw = () => {
      const isDark = document.documentElement.classList.contains('dark');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      time += 0.01;

      for (const p of particlesRef.current) {
        // Idle float: gentle sine/cos wave around origin
        const idleX = p.originX + Math.cos(time * p.floatSpeed + p.floatOffset) * FLOAT_AMP;
        const idleY = p.originY + Math.sin(time * p.floatSpeed + p.floatOffset + 1) * FLOAT_AMP;

        // Mouse repulsion
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < REPEL_RADIUS && dist > 0) {
          const force = (REPEL_RADIUS - dist) / REPEL_RADIUS;
          const angle = Math.atan2(dy, dx);
          p.vx += Math.cos(angle) * force * REPEL_STRENGTH;
          p.vy += Math.sin(angle) * force * REPEL_STRENGTH;
        }

        // Spring back toward idle float position
        p.vx += (idleX - p.x) * SPRING;
        p.vy += (idleY - p.y) * SPRING;

        // Friction
        p.vx *= FRICTION;
        p.vy *= FRICTION;

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Glow when disturbed
        const speed = Math.abs(p.vx) + Math.abs(p.vy);
        const glow = Math.min(1, speed * 0.1);
        const finalOpacity = Math.min(1, p.opacity + glow * 0.4);
        const finalSize = p.size * (1 + glow * 0.6);

        if (isDark) {
          // Bright white stars on dark background
          ctx.beginPath();
          ctx.arc(p.x, p.y, finalSize, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${finalOpacity})`;
          ctx.fill();

          // Blue-white glow halo when disturbed
          if (glow > 0.05) {
            const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, finalSize * 4);
            grad.addColorStop(0, `rgba(180, 215, 255, ${glow * 0.7})`);
            grad.addColorStop(1, 'transparent');
            ctx.beginPath();
            ctx.arc(p.x, p.y, finalSize * 4, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();
          }
        } else {
          // Soft indigo-gray stars on light background
          ctx.beginPath();
          ctx.arc(p.x, p.y, finalSize, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(100, 110, 160, ${finalOpacity * 0.75})`;
          ctx.fill();

          if (glow > 0.05) {
            const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, finalSize * 4);
            grad.addColorStop(0, `rgba(100, 110, 200, ${glow * 0.45})`);
            grad.addColorStop(1, 'transparent');
            ctx.beginPath();
            ctx.arc(p.x, p.y, finalSize * 4, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('mouseleave', handleLeave);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ touchAction: 'pan-y' }}
    />
  );
}
