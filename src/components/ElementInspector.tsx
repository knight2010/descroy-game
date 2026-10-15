import React, { useState, useEffect } from 'react';
import { ElementInspectionData } from '../types';
import { getCssSelector, getXPath, inspectElement } from '../utils/domDestruction';
import { sound } from '../audio/soundEffects';
import { 
  X, 
  Copy, 
  Check, 
  Trash2, 
  CopyPlus, 
  Eye, 
  EyeOff, 
  Bomb, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight,
  Sparkles,
  Sliders
} from 'lucide-react';

interface ElementInspectorProps {
  data: ElementInspectionData | null;
  onClose: () => void;
  onElementUpdated: () => void;
  onExplodeElement: (el: HTMLElement) => void;
  onSelectElement: (el: HTMLElement) => void;
}

export const ElementInspector: React.FC<ElementInspectorProps> = ({
  data,
  onClose,
  onElementUpdated,
  onExplodeElement,
  onSelectElement,
}) => {
  const [copiedType, setCopiedType] = useState<'selector' | 'xpath' | null>(null);
  const [textVal, setTextVal] = useState<string>('');
  const [bgColor, setBgColor] = useState<string>('#ff007f');
  const [textColor, setTextColor] = useState<string>('#ffffff');
  const [fontSize, setFontSize] = useState<number>(14);
  const [borderRadius, setBorderRadius] = useState<number>(4);
  const [rotation, setRotation] = useState<number>(0);
  const [opacity, setOpacity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'props' | 'styles' | 'dom'>('props');

  useEffect(() => {
    if (data?.elementRef) {
      setTextVal(data.textContent || '');
      const computed = window.getComputedStyle(data.elementRef);
      setTextColor(computed.color || '#ffffff');
      const parsedSize = parseInt(computed.fontSize || '14', 10);
      if (!isNaN(parsedSize)) setFontSize(parsedSize);
      setRotation(0);
      setOpacity(parseFloat(computed.opacity || '1'));
    }
  }, [data]);

  if (!data || !data.elementRef) return null;

  const el = data.elementRef;

  const handleCopy = (text: string, type: 'selector' | 'xpath') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    sound.playCoin();
    setTimeout(() => setCopiedType(null), 1500);
  };

  const handleApplyText = () => {
    if (!el) return;
    el.textContent = textVal;
    sound.playInspect();
    onElementUpdated();
  };

  const handleApplyBg = (color: string) => {
    if (!el) return;
    setBgColor(color);
    el.style.backgroundColor = color;
    sound.playInspect();
    onElementUpdated();
  };

  const handleApplyTextColor = (color: string) => {
    if (!el) return;
    setTextColor(color);
    el.style.color = color;
    sound.playInspect();
    onElementUpdated();
  };

  const handleFontSizeChange = (val: number) => {
    if (!el) return;
    setFontSize(val);
    el.style.fontSize = `${val}px`;
    onElementUpdated();
  };

  const handleRadiusChange = (val: number) => {
    if (!el) return;
    setBorderRadius(val);
    el.style.borderRadius = `${val}px`;
    onElementUpdated();
  };

  const handleRotationChange = (val: number) => {
    if (!el) return;
    setRotation(val);
    el.style.transform = `rotate(${val}deg)`;
    onElementUpdated();
  };

  const handleOpacityChange = (val: number) => {
    if (!el) return;
    setOpacity(val);
    el.style.opacity = val.toString();
    onElementUpdated();
  };

  // DOM Traversal
  const handleTraverse = (direction: 'parent' | 'child' | 'prev' | 'next') => {
    let target: HTMLElement | null = null;
    if (direction === 'parent') {
      target = el.parentElement;
    } else if (direction === 'child') {
      target = el.firstElementChild as HTMLElement;
    } else if (direction === 'prev') {
      target = el.previousElementSibling as HTMLElement;
    } else if (direction === 'next') {
      target = el.nextElementSibling as HTMLElement;
    }

    if (target && target.nodeType === Node.ELEMENT_NODE) {
      sound.playInspect();
      onSelectElement(target);
    }
  };

  // Actions
  const handleClone = () => {
    if (!el.parentElement) return;
    const clone = el.cloneNode(true) as HTMLElement;
    el.parentElement.insertBefore(clone, el.nextSibling);
    sound.playCoin();
    onElementUpdated();
  };

  const handleDelete = () => {
    if (!el.parentElement) return;
    el.remove();
    sound.playHammer();
    onClose();
    onElementUpdated();
  };

  const handleToggleVisibility = () => {
    const isHidden = el.style.visibility === 'hidden' || el.style.display === 'none';
    el.style.visibility = isHidden ? 'visible' : 'hidden';
    sound.playInspect();
    onElementUpdated();
  };

  const handleExplode = () => {
    sound.playExplosion();
    onExplodeElement(el);
    onClose();
  };

  return (
    <div className="fixed right-4 top-20 bottom-6 w-96 bg-slate-900/95 backdrop-blur-md border border-cyan-500/40 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden text-slate-100 font-sans">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></span>
          <div>
            <h3 className="font-bold text-sm tracking-wide text-cyan-300 font-mono flex items-center gap-1.5">
              <span>&lt;{data.tagName}&gt;</span>
              <span className="text-xs text-slate-400 font-normal">Inspector</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              {data.rect.width} × {data.rect.height} px · HP: {data.hp}/{data.maxHp}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 border-b border-slate-800 bg-slate-950/40 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('props')}
          className={`py-2 text-center transition border-b-2 ${
            activeTab === 'props'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          属性与选择器
        </button>
        <button
          onClick={() => setActiveTab('styles')}
          className={`py-2 text-center transition border-b-2 ${
            activeTab === 'styles'
              ? 'border-pink-400 text-pink-300 bg-pink-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          实时样式微调
        </button>
        <button
          onClick={() => setActiveTab('dom')}
          className={`py-2 text-center transition border-b-2 ${
            activeTab === 'dom'
              ? 'border-amber-400 text-amber-300 bg-amber-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          DOM 树导航
        </button>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* Tab 1: Props & Selectors */}
        {activeTab === 'props' && (
          <div className="space-y-4">
            {/* CSS Selector */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">CSS Selector (选择器)</label>
                <button
                  onClick={() => handleCopy(data.cssSelector, 'selector')}
                  className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-mono"
                >
                  {copiedType === 'selector' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedType === 'selector' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg font-mono text-[11px] text-emerald-300 break-all select-all">
                {data.cssSelector}
              </div>
            </div>

            {/* XPath */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">XPath</label>
                <button
                  onClick={() => handleCopy(data.xpath, 'xpath')}
                  className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-mono"
                >
                  {copiedType === 'xpath' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedType === 'xpath' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg font-mono text-[11px] text-blue-300 break-all select-all">
                {data.xpath}
              </div>
            </div>

            {/* ID & Classes */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg">
                <span className="text-[10px] text-slate-400 font-semibold block">ID</span>
                <span className="font-mono text-cyan-300 break-all">{data.id}</span>
              </div>
              <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg">
                <span className="text-[10px] text-slate-400 font-semibold block">Child Elements</span>
                <span className="font-mono text-amber-300">{data.childrenCount} 节点</span>
              </div>
            </div>

            {/* Classes list */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Class Names</span>
              <div className="p-2 bg-slate-950/80 border border-slate-800 rounded-lg font-mono text-[11px] text-slate-300 max-h-20 overflow-y-auto break-all">
                {data.className || '(No classes)'}
              </div>
            </div>

            {/* Edit Text Content */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">修改文本 (Edit Text Content)</label>
              <textarea
                value={textVal}
                onChange={(e) => setTextVal(e.target.value)}
                rows={3}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono text-xs focus:outline-none focus:border-cyan-400"
                placeholder="输入新文本..."
              />
              <button
                onClick={handleApplyText}
                className="mt-2 w-full py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg text-xs transition shadow-md shadow-cyan-600/30 flex items-center justify-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" /> 应用文本更改 (Apply Text)
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Styles Editor */}
        {activeTab === 'styles' && (
          <div className="space-y-4">
            {/* Background Color Swatches */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">背景颜色 (Background)</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {['#ff007f', '#00e5ff', '#10b981', '#f59e0b', '#8b5cf6', '#0f172a', 'transparent'].map((c) => (
                  <button
                    key={c}
                    onClick={() => handleApplyBg(c)}
                    style={{ backgroundColor: c === 'transparent' ? '#334155' : c }}
                    className="w-7 h-7 rounded-full border-2 border-white/40 hover:scale-110 transition shadow"
                    title={c}
                  />
                ))}
              </div>
              <input
                type="text"
                value={bgColor}
                onChange={(e) => handleApplyBg(e.target.value)}
                placeholder="#ff007f or rgba(...)"
                className="w-full px-2.5 py-1 bg-slate-950 border border-slate-800 rounded font-mono text-xs text-white"
              />
            </div>

            {/* Text Color Swatches */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">字体颜色 (Text Color)</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {['#ffffff', '#000000', '#facc15', '#38bdf8', '#fb7185', '#a3e635'].map((c) => (
                  <button
                    key={c}
                    onClick={() => handleApplyTextColor(c)}
                    style={{ backgroundColor: c }}
                    className="w-7 h-7 rounded-full border-2 border-white/40 hover:scale-110 transition shadow"
                    title={c}
                  />
                ))}
              </div>
            </div>

            {/* Font Size */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400 font-semibold">Font Size</span>
                <span className="font-mono text-cyan-400">{fontSize}px</span>
              </div>
              <input
                type="range"
                min="10"
                max="48"
                value={fontSize}
                onChange={(e) => handleFontSizeChange(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-400"
              />
            </div>

            {/* Border Radius */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400 font-semibold">Border Radius</span>
                <span className="font-mono text-pink-400">{borderRadius}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="32"
                value={borderRadius}
                onChange={(e) => handleRadiusChange(parseInt(e.target.value, 10))}
                className="w-full accent-pink-400"
              />
            </div>

            {/* Rotation */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400 font-semibold">Transform Rotation</span>
                <span className="font-mono text-amber-400">{rotation}°</span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                value={rotation}
                onChange={(e) => handleRotationChange(parseInt(e.target.value, 10))}
                className="w-full accent-amber-400"
              />
            </div>

            {/* Opacity */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400 font-semibold">Opacity</span>
                <span className="font-mono text-purple-400">{Math.round(opacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={opacity}
                onChange={(e) => handleOpacityChange(parseFloat(e.target.value))}
                className="w-full accent-purple-400"
              />
            </div>
          </div>
        )}

        {/* Tab 3: DOM Tree Traversal */}
        {activeTab === 'dom' && (
          <div className="space-y-4">
            <p className="text-slate-400 leading-relaxed text-[11px]">
              练习 DOM 节点树的层级跳跃与遍历定位。点击快捷导航按钮即可实时切换当前选中的元素。
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleTraverse('parent')}
                disabled={!el.parentElement || el.parentElement === document.body}
                className="p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-amber-400 text-left transition disabled:opacity-30 disabled:cursor-not-allowed group"
              >
                <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-1">
                  <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition" />
                  <span>父级元素</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {el.parentElement ? `<${el.parentElement.tagName.toLowerCase()}>` : 'None'}
                </span>
              </button>

              <button
                onClick={() => handleTraverse('child')}
                disabled={!el.firstElementChild}
                className="p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-amber-400 text-left transition disabled:opacity-30 disabled:cursor-not-allowed group"
              >
                <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-1">
                  <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition" />
                  <span>首个子节点</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {el.firstElementChild ? `<${el.firstElementChild.tagName.toLowerCase()}>` : 'None'}
                </span>
              </button>

              <button
                onClick={() => handleTraverse('prev')}
                disabled={!el.previousElementSibling}
                className="p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-cyan-400 text-left transition disabled:opacity-30 disabled:cursor-not-allowed group"
              >
                <div className="flex items-center gap-1.5 text-cyan-400 font-bold mb-1">
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition" />
                  <span>前一兄弟节点</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {el.previousElementSibling ? `<${el.previousElementSibling.tagName.toLowerCase()}>` : 'None'}
                </span>
              </button>

              <button
                onClick={() => handleTraverse('next')}
                disabled={!el.nextElementSibling}
                className="p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-cyan-400 text-left transition disabled:opacity-30 disabled:cursor-not-allowed group"
              >
                <div className="flex items-center gap-1.5 text-cyan-400 font-bold mb-1">
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                  <span>后一兄弟节点</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {el.nextElementSibling ? `<${el.nextElementSibling.tagName.toLowerCase()}>` : 'None'}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Drawer Bottom Actions */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 grid grid-cols-4 gap-2">
        <button
          onClick={handleClone}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex flex-col items-center justify-center text-[10px] font-semibold transition"
          title="复制克隆节点"
        >
          <CopyPlus className="w-4 h-4 mb-1 text-cyan-400" />
          <span>克隆</span>
        </button>

        <button
          onClick={handleToggleVisibility}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex flex-col items-center justify-center text-[10px] font-semibold transition"
          title="切换显隐"
        >
          <Eye className="w-4 h-4 mb-1 text-amber-400" />
          <span>显隐</span>
        </button>

        <button
          onClick={handleDelete}
          className="p-2 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 text-rose-300 rounded-lg flex flex-col items-center justify-center text-[10px] font-semibold transition"
          title="彻底移除该 DOM"
        >
          <Trash2 className="w-4 h-4 mb-1 text-rose-400" />
          <span>移除</span>
        </button>

        <button
          onClick={handleExplode}
          className="p-2 bg-gradient-to-tr from-pink-600 to-rose-600 hover:brightness-110 text-white rounded-lg flex flex-col items-center justify-center text-[10px] font-semibold transition shadow-md shadow-pink-600/30"
          title="用粒子粉碎该元素"
        >
          <Bomb className="w-4 h-4 mb-1" />
          <span>粉碎</span>
        </button>
      </div>
    </div>
  );
};
