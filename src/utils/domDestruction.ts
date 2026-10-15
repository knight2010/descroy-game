import { ElementInspectionData } from '../types';

/**
 * Generate a unique and clean CSS Selector for any DOM element
 */
export function getCssSelector(el: HTMLElement): string {
  if (el.id) {
    return `#${CSS.escape(el.id)}`;
  }

  const path: string[] = [];
  let current: HTMLElement | null = el;

  while (current && current.nodeType === Node.ELEMENT_NODE && current !== document.body) {
    let selector = current.nodeName.toLowerCase();
    
    // Check if element has unique meaningful classes
    if (current.className && typeof current.className === 'string') {
      const classes = current.className
        .trim()
        .split(/\s+/)
        .filter((c) => !c.startsWith('destroyed') && !c.startsWith('damage-') && !c.includes(':') && !c.includes('/'))
        .slice(0, 2);
      if (classes.length > 0) {
        selector += `.${classes.map((c) => CSS.escape(c)).join('.')}`;
      }
    }

    // Add nth-of-type if there are siblings of same tag
    const parent = current.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter((c) => c.nodeName === current!.nodeName);
      if (siblings.length > 1) {
        const index = siblings.indexOf(current) + 1;
        selector += `:nth-of-type(${index})`;
      }
    }

    path.unshift(selector);
    // Don't make path excessively long
    if (path.length >= 3) break;
    current = current.parentElement;
  }

  return path.join(' > ') || el.tagName.toLowerCase();
}

/**
 * Generate XPath for any DOM element
 */
export function getXPath(el: HTMLElement): string {
  if (el.id) {
    return `//*[@id="${el.id}"]`;
  }
  const parts: string[] = [];
  let current: HTMLElement | null = el;

  while (current && current.nodeType === Node.ELEMENT_NODE && current !== document.body) {
    let count = 0;
    let sibling = current.previousSibling;
    while (sibling) {
      if (sibling.nodeType === Node.ELEMENT_NODE && (sibling as HTMLElement).nodeName === current.nodeName) {
        count++;
      }
      sibling = sibling.previousSibling;
    }
    const tagName = current.nodeName.toLowerCase();
    const part = count > 0 ? `${tagName}[${count + 1}]` : tagName;
    parts.unshift(part);
    current = current.parentElement;
  }

  return `/${parts.join('/')}`;
}

/**
 * Inspect element properties and computed styles
 */
export function inspectElement(el: HTMLElement): ElementInspectionData {
  const rect = el.getBoundingClientRect();
  const computed = window.getComputedStyle(el);

  const hp = parseInt(el.getAttribute('data-hp') || '100', 10);
  const maxHp = parseInt(el.getAttribute('data-max-hp') || '100', 10);

  return {
    tagName: el.tagName.toLowerCase(),
    id: el.id || '(none)',
    className: el.className || '(none)',
    textContent: (el.textContent || '').trim().slice(0, 120),
    cssSelector: getCssSelector(el),
    xpath: getXPath(el),
    rect: {
      top: Math.round(rect.top),
      left: Math.round(rect.left),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
    },
    styles: {
      color: computed.color,
      backgroundColor: computed.backgroundColor,
      fontSize: computed.fontSize,
      padding: computed.padding,
      margin: computed.margin,
      display: computed.display,
    },
    childrenCount: el.children.length,
    hp,
    maxHp,
    elementRef: el,
  };
}

/**
 * Determine max base health based on element type and size
 */
export function calculateBaseHp(el: HTMLElement): number {
  const tag = el.tagName.toLowerCase();
  const rect = el.getBoundingClientRect();
  const area = rect.width * rect.height;

  let base = 80;
  if (['h1', 'header', 'nav', 'table'].includes(tag)) base = 250;
  else if (['h2', 'h3', 'section', 'article', 'form'].includes(tag)) base = 180;
  else if (['button', 'input', 'img', 'select'].includes(tag)) base = 120;
  else if (['p', 'li', 'span', 'a', 'td', 'th'].includes(tag)) base = 60;

  if (area > 80000) base += 100;
  return base;
}

/**
 * Damage an element: updates its health, applies visual destruction transforms/filters
 */
export function applyDamageToElement(
  el: HTMLElement,
  damage: number
): { destroyed: boolean; damageDealt: number; remainingHp: number } {
  // If already fully destroyed, skip
  if (el.getAttribute('data-destroyed') === 'true') {
    return { destroyed: false, damageDealt: 0, remainingHp: 0 };
  }

  let hp = parseInt(el.getAttribute('data-hp') || '', 10);
  let maxHp = parseInt(el.getAttribute('data-max-hp') || '', 10);

  if (isNaN(hp) || isNaN(maxHp)) {
    maxHp = calculateBaseHp(el);
    hp = maxHp;
    el.setAttribute('data-max-hp', maxHp.toString());
  }

  const damageDealt = Math.min(hp, damage);
  hp = Math.max(0, hp - damage);
  el.setAttribute('data-hp', hp.toString());

  const hpRatio = hp / maxHp;

  if (hp <= 0) {
    // Fully destroyed!
    el.setAttribute('data-destroyed', 'true');
    el.style.transition = 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
    el.style.opacity = '0';
    el.style.transform = `scale(0.1) rotate(${(Math.random() - 0.5) * 60}deg) translateY(40px)`;
    el.style.pointerEvents = 'none';

    setTimeout(() => {
      el.style.visibility = 'hidden';
      el.style.height = '0';
      el.style.margin = '0';
      el.style.padding = '0';
      el.style.border = 'none';
    }, 350);

    return { destroyed: true, damageDealt, remainingHp: 0 };
  } else {
    // Damaged visual state: tilt, burn/crack filters
    const tilt = (1 - hpRatio) * (Math.random() > 0.5 ? 8 : -8);
    const skew = (1 - hpRatio) * (Math.random() > 0.5 ? 6 : -6);
    el.style.transition = 'transform 0.15s ease-out, filter 0.15s ease-out';
    el.style.transform = `rotate(${tilt}deg) skewX(${skew}deg) translateY(${(1 - hpRatio) * 6}px)`;
    el.style.filter = `contrast(${1 + (1 - hpRatio) * 0.5}) brightness(${0.7 + hpRatio * 0.3}) sepia(${1 - hpRatio})`;
    el.style.boxShadow = `inset 0 0 ${(1 - hpRatio) * 20}px rgba(255, 50, 50, 0.4)`;

    return { destroyed: false, damageDealt, remainingHp: hp };
  }
}
