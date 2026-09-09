import React, { useEffect, useRef } from 'react';

export const AuroraWaves: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // 1. Global Window Mouse Tracking
    let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 2. Window Resize Handling
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // 3. Stardust Particle Cloud
    const particleCount = 85;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 1.2,
      speedX: (Math.random() - 0.5) * 0.35,
      speedY: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.7 + 0.3,
      color: ['#00f2fe', '#10b981', '#8b5cf6', '#f43f5e', '#6366f1'][Math.floor(Math.random() * 5)],
    }));

    // 4. Aurora Waves Configuration (Continuous Vibrant Northern Lights)
    const waves = [
      {
        amplitude: 85,
        frequency: 0.006,
        speed: 0.012,
        offsetY: 0.28,
        colors: ['rgba(0, 242, 254, 0.42)', 'rgba(16, 185, 129, 0.32)', 'rgba(79, 70, 229, 0)'],
      },
      {
        amplitude: 105,
        frequency: 0.005,
        speed: 0.01,
        offsetY: 0.42,
        colors: ['rgba(16, 185, 129, 0.45)', 'rgba(139, 92, 246, 0.35)', 'rgba(6, 182, 212, 0)'],
      },
      {
        amplitude: 95,
        frequency: 0.006,
        speed: 0.014,
        offsetY: 0.58,
        colors: ['rgba(139, 92, 246, 0.4)', 'rgba(244, 63, 94, 0.3)', 'rgba(99, 102, 241, 0)'],
      },
      {
        amplitude: 75,
        frequency: 0.008,
        speed: 0.016,
        offsetY: 0.74,
        colors: ['rgba(244, 63, 94, 0.35)', 'rgba(0, 242, 254, 0.28)', 'rgba(16, 185, 129, 0)'],
      },
    ];

    // 5. Animation Loop
    let time = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      time += 1;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.globalCompositeOperation = 'source-over';

      // Draw Full-Screen Aurora Waves
      waves.forEach((wave, index) => {
        ctx.beginPath();
        const baseHeight = height * wave.offsetY;

        ctx.moveTo(0, height);

        for (let x = 0; x <= width; x += 6) {
          const sin1 = Math.sin(x * wave.frequency + time * wave.speed + index);
          const sin2 = Math.cos(x * wave.frequency * 0.6 + time * wave.speed * 0.7);

          // Mouse proximity wave ripple
          const dx = x - mouse.x;
          const dist = Math.abs(dx);
          const mouseRipple = dist < 260 ? Math.sin((dist / 260) * Math.PI) * 36 * (1 - dist / 260) : 0;

          const y = baseHeight + (sin1 + sin2) * (wave.amplitude / 2) - mouseRipple;

          if (x === 0) {
            ctx.lineTo(0, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.lineTo(width, height);
        ctx.closePath();

        // Aurora Gradient Fill
        const gradient = ctx.createLinearGradient(0, baseHeight - wave.amplitude, 0, height);
        gradient.addColorStop(0, wave.colors[0]);
        gradient.addColorStop(0.5, wave.colors[1]);
        gradient.addColorStop(1, wave.colors[2]);

        ctx.fillStyle = gradient;
        ctx.fill();
      });

      // Draw Floating Stardust Particles
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    animate();

    // 6. Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="aurora-waves-canvas" />;
};
