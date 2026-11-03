import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

export const CursorTrail = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef({ x: 0, y: 0 });
  const animationFrame = useRef<number>(0);

  const colors = [
    "hsl(51, 100%, 50%)",
    "hsl(45, 100%, 60%)",
    "hsl(40, 100%, 55%)",
    "hsl(55, 100%, 65%)",
    "hsl(48, 100%, 50%)",
  ];

  const spawnParticles = useCallback((x: number, y: number) => {
    const count = 2;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2 + 0.5;
      particles.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 40 + Math.random() * 30,
        size: Math.random() * 3 + 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let lastX = 0, lastY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      if (Math.sqrt(dx * dx + dy * dy) > 4) {
        spawnParticles(e.clientX, e.clientY);
        lastX = e.clientX;
        lastY = e.clientY;
      }
    };
    window.addEventListener("mousemove", onMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.current = particles.current.filter((p) => p.life < p.maxLife);
      for (const p of particles.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.02;
        p.vx *= 0.99;
        p.life++;
        const alpha = 1 - p.life / p.maxLife;
        ctx.globalAlpha = alpha * 0.7;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      animationFrame.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animationFrame.current);
    };
  }, [spawnParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ mixBlendMode: "screen" }}
    />
  );
};
