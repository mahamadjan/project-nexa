'use client';
import { useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface Dash {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  length: number;
  angle: number;
  color: string | null;
  opacity: number; // fixed per dash, no flickering
}

// Full color palette - like Antigravity: blue, purple, pink, red, orange, yellow, cyan
const ACCENT_COLORS = [
  '#3b82f6', '#60a5fa', '#93c5fd', // blues
  '#8b5cf6', '#a78bfa', '#6366f1', // purples
  '#ec4899', '#f472b6', '#db2777', // pinks
  '#f43f5e', '#fb7185',            // reds
  '#f97316', '#fb923c', '#fdba74', // oranges
  '#eab308', '#facc15',            // yellows
  '#22d3ee', '#67e8f9', '#06b6d4', // cyans
  '#10b981', '#34d399',            // greens
];

function create(pageW: number, pageH: number, isMobile: boolean): Dash[] {
  const out: Dash[] = [];

  // Total density: 1 dash per ~8000px² — uniform across full page
  const area = pageW * pageH;
  const density = isMobile ? 12000 : 8000;
  const total = Math.min(Math.round(area / density), isMobile ? 150 : 500);

  // Pure grid distribution — guarantees full coverage edge to edge
  const cols = Math.ceil(Math.sqrt(total * (pageW / pageH)));
  const rows = Math.ceil(total / cols);
  const cellW = pageW / cols;
  const cellH = pageH / rows;

  // ~70% of dashes are colored, for maximum vibrancy
  const colorChance = 0.70;

  let count = 0;
  for (let row = 0; row < rows && count < total; row++) {
    for (let col = 0; col < cols && count < total; col++) {
      const x = (col + 0.1 + Math.random() * 0.8) * cellW;
      const y = (row + 0.1 + Math.random() * 0.8) * cellH;

      const isColored = Math.random() < colorChance;
      const length = isColored
        ? Math.random() * 10 + 4
        : Math.random() * 5 + 2;
      // Store opacity once — prevents per-frame flicker
      const opacity = isColored
        ? 0.82 + Math.random() * 0.16  // vivid: 0.82-0.98 on both themes
        : 0.15 + Math.random() * 0.08; // neutral: subtle
      out.push({
        x, y,
        originX: x, originY: y,
        vx: 0, vy: 0,
        length,
        angle: Math.random() * Math.PI * 2,
        color: isColored
          ? ACCENT_COLORS[Math.floor(Math.random() * ACCENT_COLORS.length)]
          : null,
        opacity,
      });
      count++;
    }
  }

  return out;
}

export default function ParticleDashBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dashesRef = useRef<Dash[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef<number>(0);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;

    const rebuild = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Distribute particles only within the visible screen space
      dashesRef.current = create(canvas.width, canvas.height, isMobile);
    };
    rebuild();
    window.addEventListener('resize', rebuild);

    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const onTouch = (e: TouchEvent) => {
      if (e.touches[0]) mouseRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    };
    const onLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onTouch, { passive: true });
    window.addEventListener('touchend', onLeave);
    window.addEventListener('mouseleave', onLeave);

    const REPEL_R = 120;
    const REPEL_F = 5;
    const DAMP = 0.91;
    const SPRING = 0.018;

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);

      const isDark = theme === 'dark';
      const neutralRGB = isDark ? '200,215,235' : '220,230,245';

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (const d of dashesRef.current) {
        // Mouse repulsion (viewport coords)
        const dx = d.x - mx;
        const dy = d.y - my;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < REPEL_R * REPEL_R && dist2 > 0) {
          const dist = Math.sqrt(dist2);
          const force = (1 - dist / REPEL_R) * REPEL_F;
          d.vx += (dx / dist) * force;
          d.vy += (dy / dist) * force;
        }

        // Spring return to grid position + damping
        d.vx += (d.originX - d.x) * SPRING;
        d.vy += (d.originY - d.y) * SPRING;
        d.vx *= DAMP;
        d.vy *= DAMP;
        d.x += d.vx;
        d.y += d.vy;

        // Directly use d.x, d.y as screen positions (no scrollY)
        ctx.save();
        ctx.translate(d.x, d.y);
        ctx.rotate(d.angle);
        ctx.beginPath();
        ctx.moveTo(-d.length / 2, 0);
        ctx.lineTo(d.length / 2, 0);

        if (d.color) {
          ctx.strokeStyle = d.color;
          ctx.globalAlpha = d.opacity;
          ctx.lineWidth = 1.8;
        } else {
          ctx.strokeStyle = `rgb(${neutralRGB})`;
          ctx.globalAlpha = d.opacity;
          ctx.lineWidth = 1;
        }

        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', rebuild);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('touchend', onLeave);
      window.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
    />
  );
}
