import React, { useEffect, useRef } from 'react';

/**
 * XmbWaveBackground
 * High-fidelity Sony XMB / PS3-style undulating silk ribbon waves with luminous glow
 * and floating ambient light particles on a deep purple backdrop, matching media_1789360524168.png
 */
export const XmbWaveBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Wave configurations: Compound harmonic sine waves that undulate smoothly
    const waves = [
      {
        baseYRatio: 0.52,
        amplitude1: 48,
        amplitude2: 24,
        frequency1: 0.0018,
        frequency2: 0.0035,
        speed1: 0.012,
        speed2: 0.018,
        lineWidth: 2.2,
        color: 'rgba(255, 255, 255, 0.75)',
        glowColor: 'rgba(235, 180, 255, 0.8)',
        glowBlur: 14,
        fillAlpha: 0.06
      },
      {
        baseYRatio: 0.50,
        amplitude1: 56,
        amplitude2: 30,
        frequency1: 0.0022,
        frequency2: 0.0040,
        speed1: 0.015,
        speed2: 0.022,
        lineWidth: 1.8,
        color: 'rgba(250, 230, 255, 0.65)',
        glowColor: 'rgba(240, 160, 255, 0.7)',
        glowBlur: 10,
        fillAlpha: 0.04
      },
      {
        baseYRatio: 0.55,
        amplitude1: 42,
        amplitude2: 20,
        frequency1: 0.0015,
        frequency2: 0.0030,
        speed1: 0.010,
        speed2: 0.014,
        lineWidth: 1.5,
        color: 'rgba(255, 255, 255, 0.5)',
        glowColor: 'rgba(220, 140, 255, 0.6)',
        glowBlur: 8,
        fillAlpha: 0.03
      },
      {
        baseYRatio: 0.48,
        amplitude1: 64,
        amplitude2: 34,
        frequency1: 0.0020,
        frequency2: 0.0048,
        speed1: 0.018,
        speed2: 0.024,
        lineWidth: 2.5,
        color: 'rgba(255, 255, 255, 0.85)',
        glowColor: 'rgba(255, 220, 255, 0.9)',
        glowBlur: 18,
        fillAlpha: 0.07
      }
    ];

    // Floating luminous particles (dust/light motes)
    const particleCount = 45;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: height * 0.35 + Math.random() * (height * 0.35),
      radius: 0.8 + Math.random() * 2.2,
      baseAlpha: 0.2 + Math.random() * 0.65,
      alpha: 0.3,
      pulseSpeed: 0.02 + Math.random() * 0.03,
      pulsePhase: Math.random() * Math.PI * 2,
      vx: (Math.random() - 0.45) * 0.35,
      vy: (Math.random() - 0.55) * 0.25
    }));

    let phase = 0;

    const render = () => {
      phase += 1;

      // Base atmospheric gradient fill
      const bgGradient = ctx.createRadialGradient(
        width * 0.5,
        height * 0.45,
        width * 0.1,
        width * 0.5,
        height * 0.5,
        width * 0.85
      );
      bgGradient.addColorStop(0, '#7928ca');
      bgGradient.addColorStop(0.4, '#6b21a8');
      bgGradient.addColorStop(0.75, '#581c87');
      bgGradient.addColorStop(1, '#3b0764');

      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Render floating light particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulsePhase += p.pulseSpeed;
        p.alpha = p.baseAlpha + Math.sin(p.pulsePhase) * 0.25;

        // Wrap around bounds
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < height * 0.25) p.y = height * 0.75;
        if (p.y > height * 0.75) p.y = height * 0.25;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.2, p.radius), 0, Math.PI * 2);
        const alphaVal = Math.max(0, Math.min(1, p.alpha));
        ctx.fillStyle = `rgba(255, 235, 255, ${alphaVal})`;
        ctx.shadowColor = 'rgba(255, 200, 255, 0.8)';
        ctx.shadowBlur = p.radius * 4;
        ctx.fill();
        ctx.restore();
      });

      // Calculate points for each wave to render filled ribbon strips & luminous stroke lines
      const wavePointsList = waves.map((w) => {
        const points = [];
        const baseY = height * w.baseYRatio;
        const step = 6;

        for (let x = -20; x <= width + 20; x += step) {
          const y =
            baseY +
            Math.sin(x * w.frequency1 + phase * w.speed1) * w.amplitude1 +
            Math.cos(x * w.frequency2 + phase * w.speed2) * w.amplitude2;
          points.push({ x, y });
        }
        return { wave: w, points };
      });

      // Draw translucent glowing ribbon mesh between primary wave pairs
      if (wavePointsList.length >= 2) {
        const topWave = wavePointsList[0].points;
        const bottomWave = wavePointsList[3].points;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(topWave[0].x, topWave[0].y);
        for (let i = 1; i < topWave.length; i++) {
          ctx.lineTo(topWave[i].x, topWave[i].y);
        }
        for (let i = bottomWave.length - 1; i >= 0; i--) {
          ctx.lineTo(bottomWave[i].x, bottomWave[i].y);
        }
        ctx.closePath();

        const ribbonFillGrad = ctx.createLinearGradient(0, height * 0.4, width, height * 0.6);
        ribbonFillGrad.addColorStop(0, 'rgba(255, 255, 255, 0.01)');
        ribbonFillGrad.addColorStop(0.3, 'rgba(240, 210, 255, 0.08)');
        ribbonFillGrad.addColorStop(0.7, 'rgba(255, 230, 255, 0.09)');
        ribbonFillGrad.addColorStop(1, 'rgba(255, 255, 255, 0.01)');

        ctx.fillStyle = ribbonFillGrad;
        ctx.fill();
        ctx.restore();
      }

      // Draw each wave line with specular highlight and neon glow
      wavePointsList.forEach(({ wave, points }) => {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < points.length; i++) {
          const xc = (points[i - 1].x + points[i].x) / 2;
          const yc = (points[i - 1].y + points[i].y) / 2;
          ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
        }

        // Luminous gradient across the stroke
        const lineGrad = ctx.createLinearGradient(0, 0, width, 0);
        lineGrad.addColorStop(0, 'rgba(255, 255, 255, 0.0)');
        lineGrad.addColorStop(0.15, 'rgba(255, 230, 255, 0.45)');
        lineGrad.addColorStop(0.5, wave.color);
        lineGrad.addColorStop(0.85, 'rgba(255, 230, 255, 0.45)');
        lineGrad.addColorStop(1, 'rgba(255, 255, 255, 0.0)');

        ctx.strokeStyle = lineGrad;
        ctx.lineWidth = wave.lineWidth;
        ctx.shadowColor = wave.glowColor;
        ctx.shadowBlur = wave.glowBlur;
        ctx.stroke();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};
