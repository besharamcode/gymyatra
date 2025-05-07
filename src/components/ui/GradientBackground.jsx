import React, { useEffect, useRef } from "react";

/**
 * A component that creates an animated gradient background
 */
const GradientBackground = ({
  className = "",
  intensity = "medium",
  variant = "primary",
  children,
}) => {
  const canvasRef = useRef(null);

  // Define variants with different color schemes based on CSS variables
  const colorVariants = {
    primary: [
      { r: 55, g: 106, b: 214, a: 0.25 }, // Primary (hsl 221.2 83.2% 53.3%)
      { r: 79, g: 70, b: 229, a: 0.2 }, // Indigo
      { r: 16, g: 185, b: 129, a: 0.15 }, // Emerald
    ],
    purple: [
      { r: 139, g: 92, b: 246, a: 0.2 }, // Purple
      { r: 236, g: 72, b: 153, a: 0.15 }, // Pink
      { r: 59, g: 130, b: 246, a: 0.2 }, // Blue
    ],
    amber: [
      { r: 245, g: 158, b: 11, a: 0.15 }, // Amber
      { r: 239, g: 68, b: 68, a: 0.15 }, // Red
      { r: 217, g: 70, b: 239, a: 0.15 }, // Fuchsia
    ],
    teal: [
      { r: 20, g: 184, b: 166, a: 0.2 }, // Teal
      { r: 56, g: 189, b: 248, a: 0.15 }, // Light Blue
      { r: 14, g: 165, b: 233, a: 0.2 }, // Sky
    ],
    chart: [
      { r: 220, g: 38, b: 38, a: 0.15 }, // chart-1 (in dark mode)
      { r: 40, g: 120, b: 120, a: 0.15 }, // chart-2 (in dark mode)
      { r: 250, g: 200, b: 60, a: 0.15 }, // chart-3 (in dark mode)
    ],
  };

  // Set the number of circles based on intensity
  const getCircleCount = (intensity) => {
    switch (intensity) {
      case "low":
        return 3;
      case "high":
        return 8;
      default:
        return 5;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const colors = colorVariants[variant] || colorVariants.primary;
    const circleCount = getCircleCount(intensity);

    let circles = [];
    let animationFrameId;

    // Set canvas size to match container
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      // Create initial circles with improved positioning
      circles = Array.from({ length: circleCount }).map((_, index) => {
        // Distribute circles more evenly across the canvas
        const angle = (index / circleCount) * Math.PI * 2;
        const distance = Math.random() * (canvas.width / 4) + canvas.width / 8;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        return {
          x: centerX + Math.cos(angle) * distance,
          y: centerY + Math.sin(angle) * distance,
          radius: Math.random() * (canvas.width / 3) + canvas.width / 5,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: Math.random() * 0.15 - 0.075,
          vy: Math.random() * 0.15 - 0.075,
          pulseSpeed: 0.005 + Math.random() * 0.01,
          pulseDirection: 1,
          pulseAmount: 0,
          originalRadius: 0,
        };
      });

      // Set original radius for pulsing effect
      circles.forEach((circle) => {
        circle.originalRadius = circle.radius;
      });
    };

    // Handle window resize
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw circles
      circles.forEach((circle) => {
        // Move circle
        circle.x += circle.vx;
        circle.y += circle.vy;

        // Bounce off edges with padding
        const padding = circle.radius * 0.5;
        if (circle.x < -padding || circle.x > canvas.width + padding) {
          circle.vx = -circle.vx;
        }
        if (circle.y < -padding || circle.y > canvas.height + padding) {
          circle.vy = -circle.vy;
        }

        // Add subtle pulsing effect
        circle.pulseAmount += circle.pulseSpeed * circle.pulseDirection;
        if (circle.pulseAmount > 0.2 || circle.pulseAmount < 0) {
          circle.pulseDirection *= -1;
        }

        const currentRadius = circle.originalRadius * (1 + circle.pulseAmount);

        // Draw circle
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(
          circle.x,
          circle.y,
          0,
          circle.x,
          circle.y,
          currentRadius
        );

        gradient.addColorStop(
          0,
          `rgba(${circle.color.r}, ${circle.color.g}, ${circle.color.b}, ${circle.color.a})`
        );
        gradient.addColorStop(
          1,
          `rgba(${circle.color.r}, ${circle.color.g}, ${circle.color.b}, 0)`
        );

        ctx.fillStyle = gradient;
        ctx.arc(circle.x, circle.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = window.requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [intensity, variant]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full -z-10"
        style={{ filter: "blur(60px)" }}
      />
      {children}
    </div>
  );
};

export default GradientBackground;
