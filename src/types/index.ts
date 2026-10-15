export type WeaponType =
  | 'hammer'
  | 'laser'
  | 'rocket'
  | 'flame'
  | 'blackhole'
  | 'blade'
  | 'meteor'
  | 'nuke'
  | 'magnet'
  | 'eraser'
  | 'spaceship'
  | 'inspect';

export type PresetSiteType =
  | 'wikipedia'
  | 'hackernews'
  | 'cybershop'
  | 'devblog'
  | 'htmlsandbox'
  | 'custom';

export interface WeaponInfo {
  id: WeaponType;
  name: string;
  nameEn: string;
  icon: string;
  key: string;
  description: string;
  damage: number;
  radius: number;
  color: string;
}

export interface ElementInspectionData {
  tagName: string;
  id: string;
  className: string;
  textContent: string;
  cssSelector: string;
  xpath: string;
  rect: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  styles: {
    color: string;
    backgroundColor: string;
    fontSize: string;
    padding: string;
    margin: string;
    display: string;
  };
  childrenCount: number;
  hp: number;
  maxHp: number;
  elementRef?: HTMLElement;
}

export interface PracticeQuest {
  id: string;
  title: string;
  titleEn: string;
  desc: string;
  targetCount: number;
  currentCount: number;
  completed: boolean;
  rewardXp: number;
  type: 'tag' | 'selector' | 'manipulate' | 'combo' | 'percentage' | 'destruction';
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  rotation: number;
  vRot: number;
  shape?: 'rect' | 'circle' | 'spark' | 'smoke' | 'text';
  text?: string;
  textColor?: string;
  gravity?: number;
}

export interface LaserBeam {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  alpha: number;
  width: number;
}

export interface ExplosionRing {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  alpha: number;
  lineWidth: number;
}

export interface AsteroidShip {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  thrust: boolean;
  size: number;
}

export interface Bullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  damage?: number;
  isRocket?: boolean;
  originX?: number;
  originY?: number;
  distanceTraveled?: number;
}

export interface PlayerCharacter {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  isGrounded: boolean;
  isJetpacking: boolean;
  facing: 'left' | 'right';
  aimAngle: number;
  walkFrame: number;
  isWalking: boolean;
  health: number;
  maxHealth: number;
  enabled: boolean;
}

export interface GeometricShard {
  x: number;
  y: number;
  vx: number;
  vy: number;
  points: { x: number; y: number }[];
  color: string;
  borderColor?: string;
  alpha: number;
  decay: number;
  rotation: number;
  vRot: number;
}
