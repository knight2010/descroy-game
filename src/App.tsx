import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  WeaponType, 
  ElementInspectionData, 
  PracticeQuest, 
  Particle, 
  LaserBeam, 
  ExplosionRing, 
  AsteroidShip, 
  Bullet,
  PlayerCharacter,
  GeometricShard
} from './types';
import { PRESET_WEBSITES } from './templates/presetWebsites';
import { WEAPONS } from './utils/weaponsConfig';
import { sound } from './audio/soundEffects';
import { 
  inspectElement, 
  applyDamageToElement, 
  calculateBaseHp 
} from './utils/domDestruction';
import { ArcadeHeader } from './components/ArcadeHeader';
import { WeaponToolbar } from './components/WeaponToolbar';
import { DestructionCanvas } from './components/DestructionCanvas';
import { ElementInspector } from './components/ElementInspector';
import { SelectorBlastModal } from './components/SelectorBlastModal';
import { PracticeQuestsModal } from './components/PracticeQuestsModal';
import { CustomHtmlModal } from './components/CustomHtmlModal';
import { UploadScreenshotModal } from './components/UploadScreenshotModal';
import { AvatarUploadModal } from './components/AvatarUploadModal';
import { generateScreenshotDestructibleHtml } from './utils/screenshotDestruct';
import { UserCheck, Crosshair, Sparkles } from 'lucide-react';

const INITIAL_QUESTS: PracticeQuest[] = [
  {
    id: 'q1',
    title: '元素摧毁初体验',
    titleEn: 'First Demolition',
    desc: '操控角色或武器粉碎 5 个网页元素',
    targetCount: 5,
    currentCount: 0,
    completed: false,
    rewardXp: 100,
    type: 'destruction',
  },
  {
    id: 'q2',
    title: '标题终结者',
    titleEn: 'Heading Slayer',
    desc: '摧毁页面中包含的 <h1> 或 <h2> 标题元素',
    targetCount: 2,
    currentCount: 0,
    completed: false,
    rewardXp: 150,
    type: 'tag',
  },
  {
    id: 'q3',
    title: '按钮猎手',
    titleEn: 'Button Hunter',
    desc: '击中并粉碎 3 个 <button> 按钮元素',
    targetCount: 3,
    currentCount: 0,
    completed: false,
    rewardXp: 150,
    type: 'tag',
  },
  {
    id: 'q4',
    title: '极客检查员',
    titleEn: 'DOM Inspector Master',
    desc: '使用元素探针 (Inspector) 审查并修改一次文本内容',
    targetCount: 1,
    currentCount: 0,
    completed: false,
    rewardXp: 200,
    type: 'manipulate',
  },
  {
    id: 'q5',
    title: '选择器专家',
    titleEn: 'CSS Selector Blast',
    desc: '打开选择器面板完成一次批量精准打击',
    targetCount: 1,
    currentCount: 0,
    completed: false,
    rewardXp: 250,
    type: 'selector',
  },
  {
    id: 'q6',
    title: '破坏艺术大师',
    titleEn: 'Demolition Legend',
    desc: '使当前页面的破坏率突破 70%',
    targetCount: 70,
    currentCount: 0,
    completed: false,
    rewardXp: 300,
    type: 'percentage',
  },
  {
    id: 'q7',
    title: '连击狂人',
    titleEn: 'Combo Frenzy',
    desc: '短时间内快速摧毁元素，达成 10 连击 (10x Combo)',
    targetCount: 10,
    currentCount: 0,
    completed: false,
    rewardXp: 200,
    type: 'combo',
  },
  {
    id: 'q8',
    title: '赛博主角实战',
    titleEn: 'Hero Blaster',
    desc: '使用屏幕中可移动的主角角色连续射击击碎 5 个元素',
    targetCount: 5,
    currentCount: 0,
    completed: false,
    rewardXp: 250,
    type: 'destruction',
  },
];

export default function App() {
  // State: default to candyland as seen in the video!
  const [currentWeapon, setCurrentWeapon] = useState<WeaponType>('laser');
  const [preset, setPreset] = useState<string>('candyland');
  const [currentUrl, setCurrentUrl] = useState<string>('candyland-kingdom.kawaii/smash');
  const [htmlContent, setHtmlContent] = useState<string>(PRESET_WEBSITES.candyland.html);
  const [loadingUrl, setLoadingUrl] = useState<boolean>(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  // Playable Character State (from video)
  const [characterEnabled, setCharacterEnabled] = useState<boolean>(true);

  // Stats
  const [totalElements, setTotalElements] = useState<number>(0);
  const [destroyedCount, setDestroyedCount] = useState<number>(0);
  const [destructionPercent, setDestructionPercent] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const comboTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Settings
  const [slowMo, setSlowMo] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [screenShake, setScreenShake] = useState<'mild' | 'heavy' | null>(null);

  // Modals & Panels
  const [inspectorData, setInspectorData] = useState<ElementInspectionData | null>(null);
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);
  const [hoverRect, setHoverRect] = useState<{ top: number; left: number; width: number; height: number; tag: string } | null>(null);
  const [isSelectorModalOpen, setIsSelectorModalOpen] = useState<boolean>(false);
  const [isQuestsModalOpen, setIsQuestsModalOpen] = useState<boolean>(false);
  const [isCustomHtmlOpen, setIsCustomHtmlOpen] = useState<boolean>(false);
  const [isScreenshotModalOpen, setIsScreenshotModalOpen] = useState<boolean>(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('destroy_web_robot_avatar');
    }
    return null;
  });
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState<boolean>(false);
  const customAvatarImgRef = useRef<HTMLImageElement | null>(null);

  // Load avatar image into customAvatarImgRef whenever customAvatarUrl changes
  useEffect(() => {
    if (customAvatarUrl) {
      const img = new Image();
      img.src = customAvatarUrl;
      img.onload = () => {
        customAvatarImgRef.current = img;
      };
    } else {
      customAvatarImgRef.current = null;
    }
  }, [customAvatarUrl]);

  const handleSaveAvatar = (url: string | null) => {
    setCustomAvatarUrl(url);
    if (url) {
      try {
        localStorage.setItem('destroy_web_robot_avatar', url);
      } catch {
        // Ignored
      }
    } else {
      localStorage.removeItem('destroy_web_robot_avatar');
    }
  };

  const [quests, setQuests] = useState<PracticeQuest[]>(INITIAL_QUESTS);
  const [totalXp, setTotalXp] = useState<number>(0);

  // Dragging / Magnet state
  const draggingElRef = useRef<HTMLElement | null>(null);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isMouseDownRef = useRef<boolean>(false);

  // Mouse pos ref for character aiming
  const mousePosRef = useRef<{ x: number; y: number }>({ x: window.innerWidth / 2, y: 300 });

  // Refs for Canvas Animation
  const containerRef = useRef<HTMLDivElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const lasersRef = useRef<LaserBeam[]>([]);
  const explosionsRef = useRef<ExplosionRing[]>([]);
  const bulletsRef = useRef<Bullet[]>([]);
  const shardsRef = useRef<GeometricShard[]>([]);

  // Character Ref (Kitty Blaster Hero)
  const characterRef = useRef<PlayerCharacter>({
    x: 320,
    y: 190,
    vx: 0,
    vy: 0,
    width: 32,
    height: 48,
    isGrounded: false,
    isJetpacking: false,
    facing: 'right',
    aimAngle: 0,
    walkFrame: 0,
    isWalking: false,
    health: 100,
    maxHealth: 100,
    enabled: true,
  });

  const keysPressedRef = useRef<{
    left: boolean;
    right: boolean;
    jump: boolean;
  }>({
    left: false,
    right: false,
    jump: false,
  });

  const shipRef = useRef<AsteroidShip>({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    vx: 0,
    vy: 0,
    angle: -Math.PI / 2,
    thrust: false,
    size: 16,
  });

  // Sync characterEnabled state with ref
  useEffect(() => {
    characterRef.current.enabled = characterEnabled;
  }, [characterEnabled]);

  // Screen shake helper
  const triggerShake = useCallback((type: 'mild' | 'heavy') => {
    setScreenShake(type);
    setTimeout(() => setScreenShake(null), type === 'heavy' ? 300 : 150);
  }, []);

  // Update Quest Progress helper
  const updateQuest = useCallback((type: PracticeQuest['type'], increment = 1, tag?: string) => {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.completed) return q;
        let matched = false;

        if (q.type === type) {
          if (q.id === 'q2' && tag && (tag === 'h1' || tag === 'h2')) matched = true;
          else if (q.id === 'q3' && tag && tag === 'button') matched = true;
          else if (q.id === 'q1' || q.id === 'q4' || q.id === 'q5' || q.id === 'q7' || q.id === 'q8') matched = true;
        }

        if (matched) {
          const nextCount = q.currentCount + increment;
          const completed = nextCount >= q.targetCount;
          if (completed && !q.completed) {
            sound.playCoin();
            setTotalXp((x) => x + q.rewardXp);
          }
          return { ...q, currentCount: Math.min(q.targetCount, nextCount), completed };
        }
        return q;
      })
    );
  }, []);

  // Combo counter helper
  const registerHit = useCallback((damageAmount: number, targetTag?: string) => {
    setScore((s) => s + damageAmount * Math.max(1, combo));
    setCombo((c) => {
      const next = c + 1;
      if (next >= 10) updateQuest('combo', next);
      return next;
    });

    if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
    comboTimerRef.current = setTimeout(() => {
      setCombo(0);
    }, 2200);

    updateQuest('destruction', 1);
    if (targetTag) updateQuest('tag', 1, targetTag);
  }, [combo, updateQuest]);

  // Spawn visual floating damage particle
  const spawnDamageText = useCallback((x: number, y: number, text: string, color = '#ffeb3b') => {
    particlesRef.current.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 1.5,
      vy: -2 - Math.random() * 1.5,
      size: 14,
      color,
      textColor: color,
      alpha: 1.0,
      decay: 0.02,
      rotation: (Math.random() - 0.5) * 0.1,
      vRot: 0,
      shape: 'text',
      text,
      gravity: 0.04,
    });
  }, []);

  // Spawn Geometric Shards (Matching the video's angled polygon shatter mesh)
  const spawnGeometricShards = useCallback((rect: DOMRect, baseColor: string, count = 12) => {
    for (let i = 0; i < count; i++) {
      const sx = rect.left + Math.random() * rect.width;
      const sy = rect.top + Math.random() * rect.height;
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 7;

      // Generate random polygon points (triangle or quad)
      const shardSize = 12 + Math.random() * 24;
      const points = [
        { x: -shardSize * 0.5, y: -shardSize * 0.5 },
        { x: shardSize * (0.3 + Math.random() * 0.5), y: -shardSize * (0.2 + Math.random() * 0.4) },
        { x: shardSize * (0.1 + Math.random() * 0.4), y: shardSize * (0.4 + Math.random() * 0.5) },
      ];

      shardsRef.current.push({
        x: sx,
        y: sy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        points,
        color: Math.random() > 0.3 ? baseColor : '#ffffff',
        borderColor: '#ff007f',
        alpha: 1.0,
        decay: 0.015 + Math.random() * 0.015,
        rotation: Math.random() * Math.PI,
        vRot: (Math.random() - 0.5) * 0.3,
      });
    }
  }, []);

  // Spawn Letter Particles (words breaking into falling individual letters)
  const spawnLetterParticles = useCallback((text: string, rect: DOMRect) => {
    const letters = text.trim().slice(0, 20).split('');
    letters.forEach((char, idx) => {
      if (char === ' ') return;
      particlesRef.current.push({
        x: rect.left + (idx / Math.max(1, letters.length)) * rect.width,
        y: rect.top + rect.height * 0.5,
        vx: (Math.random() - 0.5) * 4,
        vy: -3 - Math.random() * 3,
        size: 14,
        color: '#ff007f',
        textColor: Math.random() > 0.5 ? '#6b165b' : '#ff007f',
        alpha: 1,
        decay: 0.02,
        rotation: (Math.random() - 0.5) * 0.5,
        vRot: (Math.random() - 0.5) * 0.1,
        shape: 'text',
        text: char,
        gravity: 0.25,
      });
    });
  }, []);

  // Spawn sparks
  const spawnSparks = useCallback((x: number, y: number, count = 12, color = '#00ffcc') => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 5;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 4,
        color,
        alpha: 1,
        decay: 0.04,
        rotation: angle,
        vRot: 0,
        shape: 'spark',
        gravity: 0.1,
      });
    }
  }, []);

  // Scan Elements
  const scanElements = useCallback(() => {
    if (!containerRef.current) return;
    const elements = containerRef.current.querySelectorAll<HTMLElement>(
      'h1, h2, h3, h4, p, button, a, img, input, table, tr, td, th, ul, li, blockquote, div.card, [class*="card"], [class*="banner"], article, section'
    );

    let activeCount = 0;
    let destroyed = 0;

    elements.forEach((el) => {
      if (!el.getAttribute('data-hp')) {
        const hp = calculateBaseHp(el);
        el.setAttribute('data-hp', hp.toString());
        el.setAttribute('data-max-hp', hp.toString());
      }
      if (el.getAttribute('data-destroyed') === 'true') {
        destroyed++;
      } else {
        activeCount++;
      }
    });

    const total = activeCount + destroyed;
    setTotalElements(total);
    setDestroyedCount(destroyed);
    const pct = total > 0 ? Math.round((destroyed / total) * 100) : 0;
    setDestructionPercent(pct);

    setQuests((prev) =>
      prev.map((q) => {
        if (q.id === 'q6') {
          const completed = pct >= q.targetCount;
          if (completed && !q.completed) sound.playCoin();
          return { ...q, currentCount: pct, completed };
        }
        return q;
      })
    );
  }, []);

  // Initial Scan
  useEffect(() => {
    scanElements();
  }, [htmlContent, scanElements]);

  // Execute damage on a target element
  const damageElementNode = useCallback(
    (el: HTMLElement, damageAmount: number, weaponType: WeaponType) => {
      const rect = el.getBoundingClientRect();
      const textContent = (el.textContent || '').trim();
      const res = applyDamageToElement(el, damageAmount);

      if (res.damageDealt > 0) {
        registerHit(res.damageDealt, el.tagName.toLowerCase());

        // Damage particle number
        const text = res.destroyed ? `SMASHED! -${res.damageDealt}` : `-${res.damageDealt}`;
        const color = res.destroyed ? '#ff2a85' : '#00ffcc';
        spawnDamageText(rect.left + rect.width / 2, rect.top + 10, text, color);

        // Geometric Shard Shatter & Letter Scatter
        const weaponColor = WEAPONS[weaponType]?.color || '#ff007f';
        spawnGeometricShards(rect, weaponColor, res.destroyed ? 18 : 8);

        if (textContent.length > 0 && Math.random() > 0.4) {
          spawnLetterParticles(textContent, rect);
        }

        scanElements();
      }
      return res;
    },
    [registerHit, scanElements, spawnDamageText, spawnGeometricShards, spawnLetterParticles]
  );

  // Character Shoot Weapon Projectile
  const characterShoot = useCallback(() => {
    const char = characterRef.current;
    if (!char.enabled) return;

    sound.playLaser();
    const muzzleOffset = 26;
    const muzzleX = char.x + Math.cos(char.aimAngle) * muzzleOffset;
    const muzzleY = char.y + Math.sin(char.aimAngle) * muzzleOffset;
    const speed = 16;

    // Laser beam / bullet
    bulletsRef.current.push({
      x: muzzleX,
      y: muzzleY,
      vx: Math.cos(char.aimAngle) * speed,
      vy: Math.sin(char.aimAngle) * speed,
      life: 80,
      color: currentWeapon === 'rocket' ? '#ff3300' : '#00ffff',
      damage: currentWeapon === 'rocket' ? 260 : 70,
      isRocket: currentWeapon === 'rocket',
      originX: muzzleX,
      originY: muzzleY,
      distanceTraveled: 0,
    });

    // Muzzle sparks
    spawnSparks(muzzleX, muzzleY, 8, '#ff007f');
  }, [currentWeapon, spawnSparks]);

  // Check character bullet collisions with DOM elements
  useEffect(() => {
    const interval = setInterval(() => {
      const bullets = bulletsRef.current;
      if (bullets.length === 0 || !containerRef.current) return;

      const elements = containerRef.current.querySelectorAll<HTMLElement>(
        'h1, h2, h3, h4, p, button, a, img, input, table, tr, div.card, [class*="card"], [class*="banner"], [class*="tile"], .screenshot-tile'
      );

      const char = characterRef.current;

      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];

        // Ensure bullet has cleared character body before checking hits
        // This completely prevents the bullet from exploding on frame 0 inside the character's platform!
        const distFromChar = Math.hypot(b.x - char.x, b.y - char.y);
        if (distFromChar < 38) {
          continue;
        }

        for (let j = 0; j < elements.length; j++) {
          const el = elements[j];
          if (el.getAttribute('data-destroyed') === 'true') continue;
          if (el.offsetWidth === 0 || el.offsetHeight === 0) continue;

          const rect = el.getBoundingClientRect();
          // Exclude oversized container wrappers
          if (rect.width > window.innerWidth * 0.92 && rect.height > window.innerHeight * 0.85) {
            continue;
          }

          if (
            b.x >= rect.left &&
            b.x <= rect.right &&
            b.y >= rect.top &&
            b.y <= rect.bottom
          ) {
            bullets.splice(i, 1);
            if (b.isRocket) {
              sound.playExplosion(1.0);
              triggerShake('mild');
              damageElementNode(el, 260, 'rocket');
              explosionsRef.current.push({
                x: b.x,
                y: b.y,
                radius: 10,
                maxRadius: 90,
                color: '#ff9900',
                alpha: 1,
                lineWidth: 6,
              });
            } else {
              sound.playHammer();
              // Normal bullets cleanly damage elements without disorienting whole-screen shake!
              damageElementNode(el, b.damage || 70, currentWeapon);
            }
            break;
          }
        }
      }
    }, 28);

    return () => clearInterval(interval);
  }, [currentWeapon, damageElementNode, triggerShake]);

  // Screenshot loader handler
  const handleLoadScreenshot = useCallback((dataUrl: string, name: string) => {
    const html = generateScreenshotDestructibleHtml(dataUrl, name);
    setHtmlContent(html);
    setPreset('screenshot');
    setCurrentUrl(name);
    sound.playRebuild();
    // Reset character safely on top
    characterRef.current.x = 320;
    characterRef.current.y = 100;
    characterRef.current.vx = 0;
    characterRef.current.vy = 0;
  }, []);

  // Global clipboard paste & drag-drop for screenshot images
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => {
              const res = evt.target?.result as string;
              handleLoadScreenshot(res, 'clipboard-screenshot.png');
            };
            reader.readAsDataURL(file);
            break;
          }
        }
      }
    };

    const handleDragOver = (e: DragEvent) => e.preventDefault();
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer?.files?.[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          const res = evt.target?.result as string;
          handleLoadScreenshot(res, file.name || 'dropped-screenshot.png');
        };
        reader.readAsDataURL(file);
      }
    };

    window.addEventListener('paste', handlePaste);
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('drop', handleDrop);
    return () => {
      window.removeEventListener('paste', handlePaste);
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('drop', handleDrop);
    };
  }, [handleLoadScreenshot]);

  // Continuous shooting when mouse held down
  useEffect(() => {
    const shootInterval = setInterval(() => {
      if (isMouseDownRef.current && characterEnabled && currentWeapon !== 'inspect') {
        characterShoot();
      }
    }, 110);
    return () => clearInterval(shootInterval);
  }, [characterShoot, characterEnabled, currentWeapon]);

  // Keyboard Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      const key = e.key.toLowerCase();
      const keys = keysPressedRef.current;

      // Character movement keys
      if (key === 'a' || e.key === 'ArrowLeft') keys.left = true;
      if (key === 'd' || e.key === 'ArrowRight') keys.right = true;
      if (key === 'w' || e.key === 'ArrowUp' || e.key === ' ') {
        keys.jump = true;
      }

      // Weapon shortcuts
      if (key === '1') setCurrentWeapon('hammer');
      else if (key === '2') setCurrentWeapon('laser');
      else if (key === '3') setCurrentWeapon('rocket');
      else if (key === '4') setCurrentWeapon('flame');
      else if (key === '5') setCurrentWeapon('blackhole');
      else if (key === '6') setCurrentWeapon('blade');
      else if (key === '7') setCurrentWeapon('meteor');
      else if (key === '8') setCurrentWeapon('nuke');
      else if (key === '9') setCurrentWeapon('magnet');
      else if (key === '0') setCurrentWeapon('eraser');
      else if (key === 's') setCurrentWeapon('spaceship');
      else if (key === 'i') setCurrentWeapon('inspect');
      else if (key === 'c') setCharacterEnabled((v) => !v);
      else if (key === 'r') handleRebuild();
      else if (key === 'q') setIsQuestsModalOpen(true);
      else if (key === 'f') setIsSelectorModalOpen(true);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const keys = keysPressedRef.current;

      if (key === 'a' || e.key === 'ArrowLeft') keys.left = false;
      if (key === 'd' || e.key === 'ArrowRight') keys.right = false;
      if (key === 'w' || e.key === 'ArrowUp' || e.key === ' ') {
        keys.jump = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Sandbox Click
  const handleSandboxClick = (e: React.MouseEvent) => {
    if (currentWeapon === 'inspect') {
      let target = e.target as HTMLElement;
      if (target === containerRef.current) return;
      e.preventDefault();
      e.stopPropagation();

      const insp = inspectElement(target);
      setInspectorData(insp);
      sound.playInspect();
      return;
    }

    // If character is enabled, character shooting handles attacks!
    if (characterEnabled) {
      characterShoot();
      return;
    }

    // Direct cursor attacks fallback
    e.preventDefault();
    e.stopPropagation();
    let target = e.target as HTMLElement;
    if (target === containerRef.current) return;

    sound.playHammer();
    triggerShake('mild');
    damageElementNode(target, 120, currentWeapon);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isMouseDownRef.current = true;
    if (characterEnabled && currentWeapon !== 'inspect') {
      characterShoot();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    mousePosRef.current = { x: e.clientX, y: e.clientY };

    if (currentWeapon === 'inspect') {
      const target = e.target as HTMLElement;
      if (target && target !== containerRef.current && target !== hoveredElement) {
        setHoveredElement(target);
        const rect = target.getBoundingClientRect();
        setHoverRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          tag: target.tagName.toLowerCase(),
        });
      }
    } else {
      if (hoverRect) setHoverRect(null);
    }
  };

  const handleMouseUp = () => {
    isMouseDownRef.current = false;
  };

  // Rebuild / Respawn page
  const handleRebuild = () => {
    sound.playRebuild();
    triggerShake('mild');
    characterRef.current.x = 320;
    characterRef.current.y = 190;
    characterRef.current.vx = 0;
    characterRef.current.vy = 0;

    if (PRESET_WEBSITES[preset]) {
      setHtmlContent(PRESET_WEBSITES[preset].html);
    } else {
      setHtmlContent((h) => `${h} `);
    }
  };

  // Load URL through proxy
  const handleLoadUrl = async (urlInput: string) => {
    setLoadingUrl(true);
    setErrorBanner(null);
    setCurrentUrl(urlInput);

    try {
      const res = await fetch(`/api/proxy-url?url=${encodeURIComponent(urlInput)}`);
      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to fetch webpage');
      }

      let html = data.html as string;
      html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      html = html.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');

      setHtmlContent(html);
      setPreset('custom');
      sound.playRebuild();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '加载失败';
      setErrorBanner(`无法加载网页 "${urlInput}" (${msg})。已为您保留或选择演示预设。`);
      sound.playHammer();
    } finally {
      setLoadingUrl(false);
    }
  };

  const handleSelectPreset = (presetKey: string) => {
    const site = PRESET_WEBSITES[presetKey];
    if (site) {
      setPreset(presetKey);
      setCurrentUrl(site.urlDisplay);
      setHtmlContent(site.html);
      setErrorBanner(null);
      sound.playRebuild();
    }
  };

  const handleBlastSelector = (selector: string) => {
    if (!containerRef.current) return;
    try {
      const matches = containerRef.current.querySelectorAll<HTMLElement>(selector);
      matches.forEach((el, index) => {
        setTimeout(() => {
          const rect = el.getBoundingClientRect();
          lasersRef.current.push({
            x1: rect.left + rect.width / 2,
            y1: 0,
            x2: rect.left + rect.width / 2,
            y2: rect.top + rect.height / 2,
            color: '#00ffcc',
            alpha: 1,
            width: 8,
          });
          damageElementNode(el, 300, 'laser');
        }, index * 80);
      });
      updateQuest('selector', 1);
    } catch (err) {
      console.error(err);
    }
  };

  const handleHighlightSelector = (selector: string) => {
    if (!containerRef.current) return;
    try {
      const matches = containerRef.current.querySelectorAll<HTMLElement>(selector);
      matches.forEach((el) => {
        el.style.outline = '2px dashed #00ffcc';
        el.style.outlineOffset = '2px';
      });
    } catch {
      // Ignored
    }
  };

  const handleRemoveSelector = (selector: string) => {
    if (!containerRef.current) return;
    try {
      const matches = containerRef.current.querySelectorAll<HTMLElement>(selector);
      matches.forEach((el) => el.remove());
      scanElements();
      sound.playHammer();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className={`min-h-screen bg-[#080a1c] text-slate-100 flex flex-col font-sans select-none overflow-x-hidden ${
        screenShake === 'heavy' ? 'shake-heavy' : screenShake === 'mild' ? 'shake-mild' : ''
      }`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Top Arcade Header */}
      <ArcadeHeader
        currentUrl={currentUrl}
        preset={preset}
        onSelectPreset={handleSelectPreset}
        onLoadUrl={handleLoadUrl}
        onOpenCustomHtml={() => setIsCustomHtmlOpen(true)}
        onOpenScreenshotModal={() => setIsScreenshotModalOpen(true)}
        onRebuild={handleRebuild}
        onOpenSelectorModal={() => setIsSelectorModalOpen(true)}
        onOpenQuestsModal={() => setIsQuestsModalOpen(true)}
        destructionPercent={destructionPercent}
        destroyedCount={destroyedCount}
        totalElementsCount={totalElements}
        comboCount={combo}
        score={score}
        slowMo={slowMo}
        onToggleSlowMo={() => setSlowMo(!slowMo)}
        isMuted={isMuted}
        onToggleMute={() => {
          const next = sound.toggleMute();
          setIsMuted(next);
        }}
      />

      {/* Hero Character Controls Floating HUD Bar */}
      <div className="fixed top-20 left-4 z-40 flex items-center gap-2">
        <button
          onClick={() => setCharacterEnabled((v) => !v)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold shadow-lg transition backdrop-blur-md ${
            characterEnabled
              ? 'bg-pink-950/80 border-pink-400 text-pink-300 shadow-pink-500/20'
              : 'bg-slate-900/80 border-slate-700 text-slate-400 hover:text-white'
          }`}
          title="点击开启或关闭屏幕主角角色 (快捷键 C)"
        >
          <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping"></span>
          <span>🎮 角色控制: {characterEnabled ? '已激活' : '已隐藏'}</span>
        </button>

        {characterEnabled && (
          <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 font-mono shadow-md backdrop-blur-md">
            <span><kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-pink-400">A</kbd> <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-pink-400">D</kbd> 左右移动</span>
            <span>·</span>
            <span><kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-cyan-400">W</kbd> / <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-cyan-400">空格</kbd> 跳跃/喷气</span>
            <span>·</span>
            <span><kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-amber-400">鼠标</kbd> 瞄准射击</span>
          </div>
        )}

        <button
          onClick={() => setIsScreenshotModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-pink-500/40 bg-slate-900/80 hover:bg-pink-950/40 text-pink-300 text-xs font-mono font-bold shadow-md transition backdrop-blur-md"
          title="上传或截图任意网页作为破坏目标"
        >
          <span>📷</span>
          <span>上传网页截图</span>
        </button>

        <button
          onClick={() => setIsAvatarModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-cyan-500/40 bg-slate-900/80 hover:bg-cyan-950/40 text-cyan-300 text-xs font-mono font-bold shadow-md transition backdrop-blur-md"
          title="自定义机器人的头像与面罩表情"
        >
          {customAvatarUrl ? (
            <img
              src={customAvatarUrl}
              alt="Avatar"
              className="w-4 h-4 rounded-full object-cover border border-cyan-400"
            />
          ) : (
            <span className="text-sm">🐱</span>
          )}
          <span>机器人头像</span>
        </button>
      </div>

      {/* Error Banner */}
      {errorBanner && (
        <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-rose-950/90 border border-rose-500/50 rounded-xl text-xs text-rose-300 flex items-center gap-2 shadow-xl backdrop-blur-md">
          <span>⚠️</span>
          <span>{errorBanner}</span>
          <button
            onClick={() => setErrorBanner(null)}
            className="ml-2 px-1 text-rose-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Destructible Web Stage */}
      <main className="flex-1 pt-24 pb-28 px-4 max-w-7xl mx-auto w-full relative">
        {loadingUrl && (
          <div className="absolute inset-0 z-30 bg-[#080a1c]/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin"></div>
            <p className="font-arcade text-xs text-pink-400">LOADING TARGET WEBPAGE...</p>
          </div>
        )}

        {/* Website Container */}
        <div
          ref={containerRef}
          onClick={handleSandboxClick}
          className="w-full min-h-[85vh] rounded-3xl shadow-2xl overflow-hidden bg-slate-900 border border-slate-800 relative transition-all duration-300 cursor-crosshair"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* Inspector Hover Pill Overlay */}
        {currentWeapon === 'inspect' && hoverRect && (
          <div
            className="fixed pointer-events-none z-50 border-2 border-cyan-400 border-dashed rounded bg-cyan-500/10 transition-all duration-75"
            style={{
              top: hoverRect.top,
              left: hoverRect.left,
              width: hoverRect.width,
              height: hoverRect.height,
            }}
          >
            <div className="absolute -top-6 left-0 px-2 py-0.5 bg-cyan-500 text-black font-mono font-bold text-[10px] rounded shadow-md whitespace-nowrap">
              &lt;{hoverRect.tag}&gt; {Math.round(hoverRect.width)}×{Math.round(hoverRect.height)}px · 点击审查属性
            </div>
          </div>
        )}
      </main>

      {/* 60FPS Destruction Particle, Shard & Hero Character Canvas */}
      <DestructionCanvas
        weapon={currentWeapon}
        slowMo={slowMo}
        shipRef={shipRef}
        particlesRef={particlesRef}
        lasersRef={lasersRef}
        explosionsRef={explosionsRef}
        bulletsRef={bulletsRef}
        characterRef={characterRef}
        shardsRef={shardsRef}
        containerRef={containerRef}
        keysPressedRef={keysPressedRef}
        mousePosRef={mousePosRef}
        customAvatarImgRef={customAvatarImgRef}
      />

      {/* Bottom Floating Weapon Toolbar */}
      <WeaponToolbar
        currentWeapon={currentWeapon}
        onSelectWeapon={(w) => setCurrentWeapon(w)}
      />

      {/* Element Inspector Drawer */}
      <ElementInspector
        data={inspectorData}
        onClose={() => setInspectorData(null)}
        onElementUpdated={() => {
          scanElements();
          updateQuest('manipulate', 1);
        }}
        onExplodeElement={(el) => {
          damageElementNode(el, 1000, 'hammer');
        }}
        onSelectElement={(el) => {
          const insp = inspectElement(el);
          setInspectorData(insp);
        }}
      />

      {/* CSS Selector Blast Practice Modal */}
      <SelectorBlastModal
        isOpen={isSelectorModalOpen}
        onClose={() => setIsSelectorModalOpen(false)}
        onBlastSelector={handleBlastSelector}
        onHighlightSelector={handleHighlightSelector}
        onRemoveSelector={handleRemoveSelector}
        containerRef={containerRef}
      />

      {/* Practice Quests Modal */}
      <PracticeQuestsModal
        isOpen={isQuestsModalOpen}
        onClose={() => setIsQuestsModalOpen(false)}
        quests={quests}
        totalXp={totalXp}
      />

      {/* Custom HTML Code Modal */}
      <CustomHtmlModal
        isOpen={isCustomHtmlOpen}
        onClose={() => setIsCustomHtmlOpen(false)}
        onLoadHtml={(customCode) => {
          setHtmlContent(customCode);
          setPreset('custom');
          setCurrentUrl('custom-snippet.local');
          sound.playRebuild();
        }}
      />

      {/* Upload Screenshot Modal */}
      <UploadScreenshotModal
        isOpen={isScreenshotModalOpen}
        onClose={() => setIsScreenshotModalOpen(false)}
        onLoadScreenshot={handleLoadScreenshot}
      />

      {/* Custom Avatar Upload Modal */}
      <AvatarUploadModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        customAvatarUrl={customAvatarUrl}
        onSaveAvatar={handleSaveAvatar}
      />
    </div>
  );
}
