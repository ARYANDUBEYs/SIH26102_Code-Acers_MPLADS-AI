import React, { useEffect, useRef } from 'react';

/**
 * Next-Generation Interactive Canvas:
 * Features undulating cyber-forensic node grid, glowing light pulses,
 * subtle radar sweep arcs, and white/cyan constellation nodes that react smoothly to mouse movement.
 */
export const GlowingParticlesBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = canvas.parentElement.offsetWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle nodes
    const nodeCount = Math.min(Math.floor((width * height) / 9000), 75);
    const nodes = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2.2 + 1,
        baseAlpha: Math.random() * 0.5 + 0.3,
        pulseSpeed: Math.random() * 0.025 + 0.015,
        color: Math.random() > 0.4 ? '255, 255, 255' : '110, 231, 183', // White and soft emerald
      });
    }

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let tick = 0;
    const render = () => {
      tick++;
      // Smooth lerp mouse
      mouseX += (targetMouseX - mouseX) * 0.08;
      mouseY += (targetMouseY - mouseY) * 0.08;

      ctx.clearRect(0, 0, width, height);

      // Subtle cyber surveillance radar sweep aura around mouse
      const radarRadius = 180;
      const radarGradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, radarRadius);
      radarGradient.addColorStop(0, 'rgba(56, 189, 248, 0.12)');
      radarGradient.addColorStop(0.5, 'rgba(56, 189, 248, 0.04)');
      radarGradient.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = radarGradient;
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, radarRadius, 0, Math.PI * 2);
      ctx.fill();

      // Interconnecting forensic mesh lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 125) {
            const alpha = (1 - dist / 125) * 0.16;
            ctx.strokeStyle = 'rgba(186, 230, 253, ' + alpha + ')';
            ctx.lineWidth = 0.85;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw active nodes
      for (let i = 0; i < nodes.length; i++) {
        const p = nodes[i];

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Interactive gravitation towards cursor
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);
        if (distToMouse < 160) {
          const force = (1 - distToMouse / 160) * 0.022;
          p.x += dx * force;
          p.y += dy * force;
        }

        const currentAlpha = p.baseAlpha + Math.sin(tick * p.pulseSpeed) * 0.22;
        const radius = p.radius + Math.sin(tick * p.pulseSpeed) * 0.6;

        // Glowing outer haze
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius * 3.8);
        const effectiveAlpha = Math.max(0.1, currentAlpha);
        gradient.addColorStop(0, 'rgba(' + p.color + ', ' + effectiveAlpha + ')');
        gradient.addColorStop(1, 'rgba(' + p.color + ', 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius * 3.8, 0, Math.PI * 2);
        ctx.fill();

        // High-intensity white/cyan core
        const coreAlpha = Math.min(1, currentAlpha + 0.35);
        ctx.fillStyle = 'rgba(' + p.color + ', ' + coreAlpha + ')';
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      if (isCanvasVisible) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    let isCanvasVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isCanvasVisible;
        isCanvasVisible = entry.isIntersecting;
        if (!wasVisible && isCanvasVisible) {
          animationFrameId = requestAnimationFrame(render);
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(canvas);
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-85"
    />
  );
};
