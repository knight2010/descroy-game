import React, { useEffect, useRef } from 'react';
import { 
  AsteroidShip, 
  Bullet, 
  ExplosionRing, 
  LaserBeam, 
  Particle, 
  PlayerCharacter, 
  GeometricShard 
} from '../types';

interface DestructionCanvasProps {
  weapon: string;
  slowMo: boolean;
  shipRef: React.MutableRefObject<AsteroidShip>;
  particlesRef: React.MutableRefObject<Particle[]>;
  lasersRef: React.MutableRefObject<LaserBeam[]>;
  explosionsRef: React.MutableRefObject<ExplosionRing[]>;
  bulletsRef: React.MutableRefObject<Bullet[]>;
  characterRef: React.MutableRefObject<PlayerCharacter>;
  shardsRef: React.MutableRefObject<GeometricShard[]>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  keysPressedRef: React.MutableRefObject<{ left: boolean; right: boolean; jump: boolean }>;
  mousePosRef: React.MutableRefObject<{ x: number; y: number }>;
  customAvatarImgRef: React.MutableRefObject<HTMLImageElement | null>;
}

export const DestructionCanvas: React.FC<DestructionCanvasProps> = ({
  weapon,
  slowMo,
  shipRef,
  particlesRef,
  lasersRef,
  explosionsRef,
  bulletsRef,
  characterRef,
  shardsRef,
  containerRef,
  keysPressedRef,
  mousePosRef,
  customAvatarImgRef,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const render = () => {
      const dt = slowMo ? 0.35 : 1.0;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // ==========================================
      // 1. Geometric Shard Mesh (Video-exact shatter)
      // ==========================================
      const shards = shardsRef.current;
      for (let i = shards.length - 1; i >= 0; i--) {
        const s = shards[i];
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.vy += 0.35 * dt; // gravity
        s.rotation += s.vRot * dt;
        s.alpha -= s.decay * dt;

        if (s.alpha <= 0 || s.y > canvas.height + 100) {
          shards.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rotation);
        ctx.globalAlpha = Math.max(0, s.alpha);

        ctx.beginPath();
        if (s.points.length > 0) {
          ctx.moveTo(s.points[0].x, s.points[0].y);
          for (let p = 1; p < s.points.length; p++) {
            ctx.lineTo(s.points[p].x, s.points[p].y);
          }
          ctx.closePath();
        }

        ctx.fillStyle = s.color;
        ctx.fill();

        ctx.strokeStyle = s.borderColor || '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.restore();
      }

      // ==========================================
      // 2. Explosions Rings
      // ==========================================
      const explosions = explosionsRef.current;
      for (let i = explosions.length - 1; i >= 0; i--) {
        const exp = explosions[i];
        exp.radius += (exp.maxRadius - exp.radius) * 0.16 * dt + 2 * dt;
        exp.alpha -= 0.035 * dt;

        if (exp.alpha <= 0 || exp.radius >= exp.maxRadius) {
          explosions.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(exp.x, exp.y, exp.radius, 0, Math.PI * 2);
        ctx.strokeStyle = exp.color;
        ctx.lineWidth = exp.lineWidth * (exp.alpha / 1);
        ctx.globalAlpha = Math.max(0, exp.alpha);
        ctx.shadowColor = exp.color;
        ctx.shadowBlur = 15;
        ctx.stroke();
        ctx.restore();
      }

      // ==========================================
      // 3. Laser Beams
      // ==========================================
      const lasers = lasersRef.current;
      for (let i = lasers.length - 1; i >= 0; i--) {
        const l = lasers[i];
        l.alpha -= 0.08 * dt;
        if (l.alpha <= 0) {
          lasers.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(l.x1, l.y1);
        ctx.lineTo(l.x2, l.y2);
        ctx.strokeStyle = l.color;
        ctx.lineWidth = l.width;
        ctx.globalAlpha = l.alpha;
        ctx.shadowColor = l.color;
        ctx.shadowBlur = 18;
        ctx.stroke();

        // Core bright center
        ctx.beginPath();
        ctx.moveTo(l.x1, l.y1);
        ctx.lineTo(l.x2, l.y2);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = l.width * 0.35;
        ctx.stroke();
        ctx.restore();
      }

      // ==========================================
      // 4. Particles (Sparks, Smoke, Words, Letters)
      // ==========================================
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += (p.gravity ?? 0.25) * dt;
        p.rotation += p.vRot * dt;
        p.alpha -= p.decay * dt;

        if (p.alpha <= 0 || p.y > canvas.height + 60) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.shape === 'text' && p.text) {
          ctx.font = 'bold 15px "Press Start 2P", monospace';
          ctx.fillStyle = p.textColor || '#ffff00';
          ctx.shadowColor = '#000000';
          ctx.shadowBlur = 4;
          ctx.textAlign = 'center';
          ctx.fillText(p.text, 0, 0);
        } else if (p.shape === 'circle' || p.shape === 'smoke') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        } else if (p.shape === 'spark') {
          ctx.beginPath();
          ctx.moveTo(-p.size, 0);
          ctx.lineTo(p.size, 0);
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 2.5;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.stroke();
        } else {
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        }

        ctx.restore();
      }

      // ==========================================
      // 5. Bullets
      // ==========================================
      const bullets = bulletsRef.current;
      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        b.life -= 1 * dt;

        if (
          b.life <= 0 ||
          b.x < 0 ||
          b.x > canvas.width ||
          b.y < 0 ||
          b.y > canvas.height
        ) {
          bullets.splice(i, 1);
          continue;
        }

        ctx.save();
        if (b.isRocket) {
          // Rocket warhead with smoke trail
          ctx.save();
          ctx.translate(b.x, b.y);
          ctx.rotate(Math.atan2(b.vy, b.vx));

          // Rocket body
          ctx.fillStyle = '#cbd5e1';
          ctx.fillRect(-12, -3.5, 16, 7);

          // Red nosecone
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.moveTo(4, -3.5);
          ctx.lineTo(12, 0);
          ctx.lineTo(4, 3.5);
          ctx.closePath();
          ctx.fill();

          // Tail fins
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(-14, -6, 4, 12);

          // Thruster flame
          ctx.beginPath();
          ctx.moveTo(-12, -3);
          ctx.lineTo(-22 - Math.random() * 8, 0);
          ctx.lineTo(-12, 3);
          ctx.closePath();
          ctx.fillStyle = Math.random() > 0.5 ? '#f97316' : '#eab308';
          ctx.shadowColor = '#f97316';
          ctx.shadowBlur = 12;
          ctx.fill();
          ctx.restore();

          // Rocket smoke trail
          if (Math.random() > 0.3) {
            particlesRef.current.push({
              x: b.x - b.vx * 0.5,
              y: b.y - b.vy * 0.5,
              vx: (Math.random() - 0.5) * 1,
              vy: (Math.random() - 0.5) * 1,
              size: 4 + Math.random() * 5,
              color: '#64748b',
              alpha: 0.65,
              decay: 0.04,
              rotation: Math.random() * Math.PI,
              vRot: 0.1,
              shape: 'smoke',
            });
          }
        } else {
          // Luminous High-Visibility Cyber Laser Tracer Bolt
          const speed = Math.hypot(b.vx, b.vy);
          const boltLen = Math.min(26, speed * 1.6);
          const angle = Math.atan2(b.vy, b.vx);
          const tailX = b.x - Math.cos(angle) * boltLen;
          const tailY = b.y - Math.sin(angle) * boltLen;

          // Outer glowing neon aura
          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = b.color || '#00ffff';
          ctx.lineWidth = 6;
          ctx.lineCap = 'round';
          ctx.shadowColor = b.color || '#00ffff';
          ctx.shadowBlur = 14;
          ctx.stroke();

          // Core bright white laser beam
          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2.5;
          ctx.stroke();

          // Glowing projectile head
          ctx.beginPath();
          ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = b.color || '#00ffff';
          ctx.shadowBlur = 12;
          ctx.fill();
        }
        ctx.restore();
      }

      // ==========================================
      // 6. Playable Hero Character (Video-exact Cyber Kitty / Chibi)
      // ==========================================
      const char = characterRef.current;
      if (char.enabled) {
        const keys = keysPressedRef.current;
        const mousePos = mousePosRef.current;

        // Aim angle towards mouse
        const dx = mousePos.x - char.x;
        const dy = mousePos.y - char.y;
        char.aimAngle = Math.atan2(dy, dx);
        if (dx < -6) char.facing = 'left';
        else if (dx > 6) char.facing = 'right';

        // Horizontal input
        if (keys.left) {
          char.vx = -5.2;
          char.facing = 'left';
        } else if (keys.right) {
          char.vx = 5.2;
          char.facing = 'right';
        } else {
          char.vx *= Math.pow(0.75, dt);
          if (Math.abs(char.vx) < 0.1) char.vx = 0;
        }

        // Jump & Jetpack
        if (keys.jump) {
          if (char.isGrounded) {
            char.vy = -12.5; // Sharp upward jump impulse
            char.isGrounded = false;
          } else {
            // Mid-air Jetpack thrust
            char.vy = Math.max(-7.5, char.vy - 0.72 * dt);
            char.isJetpacking = true;
          }
        } else {
          char.isJetpacking = false;
        }

        // Apply Gravity
        char.vy += 0.55 * dt;

        // Store pre-movement foot position for one-way platform penetration check
        const prevFootY = char.y + 20;

        // Apply movement
        char.x += char.vx * dt;
        char.y += char.vy * dt;

        const newFootY = char.y + 20;
        const charLeft = char.x - 14;
        const charRight = char.x + 14;

        // Walking animation cycle
        if (Math.abs(char.vx) > 0.3 && char.isGrounded) {
          char.walkFrame += 0.3 * dt;
          char.isWalking = true;
        } else {
          char.isWalking = false;
        }

        // DOM Element Platform Landing Detection
        let onPlatform = false;

        if (containerRef.current) {
          // Find all active interactive elements (cards, buttons, headers, tiles, images, tables)
          const platforms = containerRef.current.querySelectorAll<HTMLElement>(
            'h1, h2, h3, h4, p, button, a, img, .card, [class*="card"], [class*="banner"], [class*="box"], [class*="tile"], [class*="btn"], table, tr, input, .screenshot-tile'
          );

          for (let pIdx = 0; pIdx < platforms.length; pIdx++) {
            const el = platforms[pIdx];
            if (el.getAttribute('data-destroyed') === 'true') continue;
            if (el.offsetWidth < 20 || el.offsetHeight < 12) continue;

            const r = el.getBoundingClientRect();
            // Ignore fullscreen or giant outer wrappers
            if (r.width > canvas.width * 0.92 && r.height > canvas.height * 0.85) continue;

            // Platform collision condition:
            // 1. Horizontally overlapping element top edge
            // 2. Character is falling downward (char.vy >= 0)
            // 3. Feet were above or near top edge in prev frame, and now crossing or at top edge
            if (
              charRight > r.left + 5 &&
              charLeft < r.right - 5 &&
              char.vy >= 0 &&
              prevFootY <= r.top + 10 &&
              newFootY >= r.top - 4
            ) {
              char.y = r.top - 20;
              char.vy = 0;
              onPlatform = true;
              break;
            }
          }
        }

        // Bottom Screen Ground Floor
        const floorY = canvas.height - 30;
        if (newFootY >= floorY) {
          char.y = floorY - 20;
          char.vy = 0;
          onPlatform = true;
        }

        char.isGrounded = onPlatform;

        // Screen border bounds
        if (char.x < 25) {
          char.x = 25;
          char.vx = 0;
        }
        if (char.x > canvas.width - 25) {
          char.x = canvas.width - 25;
          char.vx = 0;
        }
        if (char.y < 35) {
          char.y = 35;
          char.vy = 0;
        }

        // Jetpack particles when flying
        if (char.isJetpacking) {
          for (let k = 0; k < 2; k++) {
            particlesRef.current.push({
              x: char.x + (char.facing === 'right' ? -10 : 10) + (Math.random() - 0.5) * 6,
              y: char.y + 16,
              vx: (Math.random() - 0.5) * 1.5,
              vy: 2 + Math.random() * 3,
              size: 4 + Math.random() * 6,
              color: Math.random() > 0.5 ? '#ff007f' : '#00ffff',
              alpha: 0.9,
              decay: 0.05,
              rotation: 0,
              vRot: 0,
              shape: 'circle',
              gravity: 0.1,
            });
          }
        }

        // ==========================================
        // RENDER CYBER CHIBI / KITTY CHARACTER
        // ==========================================
        ctx.save();
        ctx.translate(char.x, char.y);
        const flip = char.facing === 'left' ? -1 : 1;
        ctx.scale(flip, 1);

        // Jetpack on character's back
        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(-14, -6, 7, 18);
        ctx.fillStyle = '#ec4899';
        ctx.fillRect(-15, -4, 2, 14);

        // Jetpack flame
        if (char.isJetpacking) {
          ctx.beginPath();
          ctx.moveTo(-14, 12);
          ctx.lineTo(-10.5, 26 + Math.random() * 6);
          ctx.lineTo(-7, 12);
          ctx.closePath();
          ctx.fillStyle = Math.random() > 0.5 ? '#00ffff' : '#ff007f';
          ctx.shadowColor = '#ff007f';
          ctx.shadowBlur = 10;
          ctx.fill();
        }

        // Animated Legs (Walking cycle)
        const walkLegOffset = char.isWalking ? Math.sin(char.walkFrame) * 8 : 0;
        // Back leg
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-4, 10);
        ctx.lineTo(-4 - walkLegOffset, 20);
        ctx.stroke();

        // Front leg
        ctx.beginPath();
        ctx.moveTo(4, 10);
        ctx.lineTo(4 + walkLegOffset, 20);
        ctx.stroke();

        // Body / Cyber Suit
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.roundRect(-10, -8, 20, 20, 6);
        ctx.fill();
        ctx.strokeStyle = '#ec4899';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Neon chest core
        ctx.fillStyle = '#06b6d4';
        ctx.beginPath();
        ctx.arc(0, 2, 2.5, 0, Math.PI * 2);
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 6;
        ctx.fill();

        // Scarf / Neck ribbon
        ctx.fillStyle = '#ff007f';
        ctx.fillRect(-10, -9, 20, 4);

        // Head (Cat-eared cyberpunk helmet)
        ctx.fillStyle = '#1e1035';
        ctx.beginPath();
        ctx.roundRect(-14, -28, 28, 20, 8);
        ctx.fill();
        ctx.strokeStyle = '#ff007f';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Kitty Cat Ears
        // Left Ear
        ctx.beginPath();
        ctx.moveTo(-13, -27);
        ctx.lineTo(-17, -40);
        ctx.lineTo(-4, -28);
        ctx.closePath();
        ctx.fillStyle = '#ff007f';
        ctx.fill();
        ctx.fillStyle = '#fbcfe8';
        ctx.beginPath();
        ctx.moveTo(-12, -28);
        ctx.lineTo(-15, -36);
        ctx.lineTo(-6, -29);
        ctx.closePath();
        ctx.fill();

        // Right Ear
        ctx.beginPath();
        ctx.moveTo(4, -28);
        ctx.lineTo(17, -40);
        ctx.lineTo(13, -27);
        ctx.closePath();
        ctx.fillStyle = '#ff007f';
        ctx.fill();
        ctx.fillStyle = '#fbcfe8';
        ctx.beginPath();
        ctx.moveTo(6, -29);
        ctx.lineTo(15, -36);
        ctx.lineTo(12, -28);
        ctx.closePath();
        ctx.fill();

        // Visor Cockpit Area: Custom PNG Avatar or Default Cyber Face
        const avatarImg = customAvatarImgRef.current;
        if (avatarImg && avatarImg.complete && avatarImg.naturalWidth > 0) {
          // Render Custom PNG Avatar inside Helmet Display
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(-11, -26, 22, 16, 5);
          ctx.clip();
          ctx.drawImage(avatarImg, -11, -26, 22, 16);

          // Subtle Cyber Glass Shine
          const gloss = ctx.createLinearGradient(-11, -26, 11, -10);
          gloss.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
          gloss.addColorStop(0.35, 'rgba(255, 255, 255, 0.05)');
          gloss.addColorStop(1, 'rgba(0, 255, 255, 0.15)');
          ctx.fillStyle = gloss;
          ctx.fillRect(-11, -26, 22, 16);
          ctx.restore();

          // Cyber Neon Visor Frame
          ctx.strokeStyle = '#00ffff';
          ctx.lineWidth = 1.2;
          ctx.shadowColor = '#00ffff';
          ctx.shadowBlur = 4;
          ctx.beginPath();
          ctx.roundRect(-11, -26, 22, 16, 5);
          ctx.stroke();
        } else {
          // Default Cute Cyber Kitty Face
          ctx.fillStyle = '#00ffff';
          ctx.shadowColor = '#00ffff';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.roundRect(-8, -21, 16, 7, 3);
          ctx.fill();

          // Visor shine
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(-6, -20, 4, 2);

          // Cute pink cheeks
          ctx.fillStyle = 'rgba(255, 105, 180, 0.8)';
          ctx.beginPath();
          ctx.arc(-8, -13, 1.8, 0, Math.PI * 2);
          ctx.arc(8, -13, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }

        // Arm & Rotating Blaster Gun
        ctx.save();
        ctx.translate(2, 2);
        // Correct gun rotation relative to facing flip
        const gunRot = flip === 1 ? char.aimAngle : Math.PI - char.aimAngle;
        ctx.rotate(gunRot);

        // Blaster barrel
        ctx.fillStyle = '#334155';
        ctx.fillRect(0, -3, 18, 6);
        ctx.fillStyle = '#ec4899';
        ctx.fillRect(14, -4, 5, 8);
        ctx.fillStyle = '#00ffff';
        ctx.fillRect(4, -1.5, 6, 3);

        ctx.restore();

        ctx.restore();
      }

      // ==========================================
      // 7. Spaceship (if in spaceship mode)
      // ==========================================
      if (weapon === 'spaceship') {
        const ship = shipRef.current;
        ship.x += ship.vx * dt;
        ship.y += ship.vy * dt;
        ship.vx *= Math.pow(0.97, dt);
        ship.vy *= Math.pow(0.97, dt);

        if (ship.x < 0) ship.x = canvas.width;
        if (ship.x > canvas.width) ship.x = 0;
        if (ship.y < 0) ship.y = canvas.height;
        if (ship.y > canvas.height) ship.y = 0;

        ctx.save();
        ctx.translate(ship.x, ship.y);
        ctx.rotate(ship.angle);

        ctx.beginPath();
        ctx.moveTo(18, 0);
        ctx.lineTo(-14, -12);
        ctx.lineTo(-8, 0);
        ctx.lineTo(-14, 12);
        ctx.closePath();
        ctx.fillStyle = '#0f172a';
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 10;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(2, 0, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#ff007f';
        ctx.fill();

        if (ship.thrust) {
          ctx.beginPath();
          ctx.moveTo(-9, -5);
          ctx.lineTo(-24 - Math.random() * 8, 0);
          ctx.lineTo(-9, 5);
          ctx.closePath();
          ctx.fillStyle = Math.random() > 0.5 ? '#f97316' : '#eab308';
          ctx.shadowColor = '#f97316';
          ctx.shadowBlur = 15;
          ctx.fill();
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [
    slowMo,
    weapon,
    shipRef,
    particlesRef,
    lasersRef,
    explosionsRef,
    bulletsRef,
    characterRef,
    shardsRef,
    containerRef,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-40 w-full h-full"
    />
  );
};
