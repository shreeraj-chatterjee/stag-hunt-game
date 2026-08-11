import React, { useEffect, useRef } from 'react';

export default function ParticlesBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      // Double the density for a lusher, more volumetric feel
      const numParticles = Math.floor((window.innerWidth * window.innerHeight) / 5000); 
      
      for (let i = 0; i < numParticles; i++) {
        // Create depth of field: some particles are bigger but fainter (foreground), some tiny (background)
        const isForeground = Math.random() > 0.8;
        const radius = isForeground ? Math.random() * 2.5 + 1.5 : Math.random() * 1.5 + 0.5;
        const baseAlpha = isForeground ? 0.1 : 0.3;
        
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: radius,
          vx: (Math.random() - 0.5) * 0.2, // Slower base velocity
          vy: (Math.random() - 0.5) * 0.2,
          alpha: Math.random() * 0.2 + baseAlpha
        });
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        // Move particle
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around screen for continuous effect
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Random jitter (Simulating Brownian motion)
        p.vx += (Math.random() - 0.5) * 0.02; // Gentler jitter
        p.vy += (Math.random() - 0.5) * 0.02;
        
        // Constrain maximum velocity so it's a very lazy, slow drift
        p.vx = Math.max(-0.25, Math.min(0.25, p.vx));
        p.vy = Math.max(-0.25, Math.min(0.25, p.vy));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        // Using a slate blue for contrast against the light gradient
        ctx.fillStyle = `rgba(100, 116, 139, ${p.alpha})`; 
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(drawParticles);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    drawParticles();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-80"
    />
  );
}
