import React, { useState, useEffect } from 'react';
import { Target, Zap, Trash2, Eye, X, Check, Code } from 'lucide-react';
import { sound } from '../audio/soundEffects';

interface SelectorBlastModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBlastSelector: (selector: string) => void;
  onHighlightSelector: (selector: string) => void;
  onRemoveSelector: (selector: string) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const SelectorBlastModal: React.FC<SelectorBlastModalProps> = ({
  isOpen,
  onClose,
  onBlastSelector,
  onHighlightSelector,
  onRemoveSelector,
  containerRef,
}) => {
  const [selector, setSelector] = useState<string>('button');
  const [matchCount, setMatchCount] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const presets = [
    { label: '所有按钮 <button>', val: 'button' },
    { label: '所有标题 <h1>, <h2>', val: 'h1, h2, h3' },
    { label: '段落文本 <p>', val: 'p' },
    { label: '图片与图标 <img>', val: 'img, svg, .thumbnail' },
    { label: '卡片容器 .card', val: '.card, [class*="card"]' },
    { label: '所有超链接 <a>', val: 'a' },
    { label: '表格行 <tr>', val: 'table tr' },
    { label: '广告容器 .ad-banner', val: '.ad-banner, [class*="banner"]' },
  ];

  // Evaluate matches
  useEffect(() => {
    if (!isOpen || !containerRef.current || !selector.trim()) {
      setMatchCount(0);
      setErrorMsg(null);
      return;
    }

    try {
      const matches = containerRef.current.querySelectorAll(selector.trim());
      setMatchCount(matches.length);
      setErrorMsg(null);
      onHighlightSelector(selector.trim());
    } catch {
      setMatchCount(0);
      setErrorMsg('无效的 CSS 选择器语法 (Invalid CSS Selector)');
    }
  }, [selector, isOpen, containerRef, onHighlightSelector]);

  if (!isOpen) return null;

  const handleBlast = () => {
    if (matchCount === 0 || errorMsg) return;
    sound.playNuke();
    onBlastSelector(selector.trim());
    onClose();
  };

  const handleRemove = () => {
    if (matchCount === 0 || errorMsg) return;
    sound.playHammer();
    onRemoveSelector(selector.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-900 border border-cyan-500/50 rounded-2xl p-6 shadow-2xl relative text-slate-100 font-sans">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Target className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-cyan-300 font-mono">
              CSS 选择器靶向打击与练习
            </h2>
            <p className="text-xs text-slate-400">
              输入任意 CSS Selector 进行匹配，高亮或一键摧毁目标 DOM 元素
            </p>
          </div>
        </div>

        {/* Selector Input */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
            输入 CSS Selector
          </label>
          <div className="relative">
            <input
              type="text"
              value={selector}
              onChange={(e) => setSelector(e.target.value)}
              placeholder="例如: button.btn-primary, h2, div > p"
              className="w-full px-4 py-2.5 bg-slate-950 border border-cyan-500/40 rounded-xl font-mono text-sm text-cyan-300 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            />
            <div className="absolute right-3 top-2.5 flex items-center gap-1.5">
              <span
                className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                  errorMsg
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : matchCount > 0
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {errorMsg ? '语法错误' : `${matchCount} 个匹配`}
              </span>
            </div>
          </div>
          {errorMsg && <p className="text-xs text-rose-400 mt-1">{errorMsg}</p>}
        </div>

        {/* Preset Chips */}
        <div className="mb-6">
          <span className="block text-[11px] font-semibold text-slate-400 mb-2 uppercase tracking-wider">
            常用练习选择器 (Quick Presets)
          </span>
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p.val}
                onClick={() => setSelector(p.val)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition border ${
                  selector === p.val
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
          <button
            onClick={handleBlast}
            disabled={matchCount === 0 || !!errorMsg}
            className="py-2.5 px-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-pink-600/30 transition"
          >
            <Zap className="w-4 h-4" />
            <span>靶向激光轰炸 ({matchCount})</span>
          </button>

          <button
            onClick={handleRemove}
            disabled={matchCount === 0 || !!errorMsg}
            className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-700 transition"
          >
            <Trash2 className="w-4 h-4 text-rose-400" />
            <span>批量移除匹配项</span>
          </button>
        </div>
      </div>
    </div>
  );
};
