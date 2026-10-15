import React, { useState } from 'react';
import { X, Code, Play } from 'lucide-react';
import { sound } from '../audio/soundEffects';

interface CustomHtmlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadHtml: (html: string) => void;
}

export const CustomHtmlModal: React.FC<CustomHtmlModalProps> = ({
  isOpen,
  onClose,
  onLoadHtml,
}) => {
  const [customHtml, setCustomHtml] = useState<string>(`
<div class="custom-card-demo max-w-2xl mx-auto p-6 bg-slate-800 text-slate-100 rounded-2xl shadow-2xl border border-slate-700">
  <div class="flex items-center justify-between border-b border-slate-700 pb-4 mb-4">
    <h2 class="text-xl font-bold text-pink-400">Custom Destructible Module</h2>
    <span class="px-2.5 py-1 bg-pink-500/20 text-pink-300 rounded text-xs font-mono">HTML V2</span>
  </div>
  <p class="text-sm text-slate-300 mb-4 leading-relaxed">
    Paste your own HTML markup here to practice DOM inspection, CSS queries, and weapon demolition!
  </p>
  <div class="grid grid-cols-2 gap-3 my-4">
    <div class="p-4 bg-slate-900 rounded-xl border border-slate-700">
      <h3 class="text-sm font-bold text-cyan-300">Widget 01</h3>
      <p class="text-xs text-slate-400 mt-1">Interactive component for targeting.</p>
      <button class="mt-3 px-3 py-1 bg-cyan-600 text-white text-xs rounded">Click Me</button>
    </div>
    <div class="p-4 bg-slate-900 rounded-xl border border-slate-700">
      <h3 class="text-sm font-bold text-amber-300">Widget 02</h3>
      <p class="text-xs text-slate-400 mt-1">Test container for gravity magnet.</p>
      <button class="mt-3 px-3 py-1 bg-amber-600 text-black text-xs font-bold rounded">Action 02</button>
    </div>
  </div>
</div>
  `.trim());

  if (!isOpen) return null;

  const handleApply = () => {
    if (!customHtml.trim()) return;
    sound.playCoin();
    onLoadHtml(customHtml);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-slate-900 border border-amber-500/40 rounded-2xl p-6 shadow-2xl relative text-slate-100 font-sans">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Code className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-amber-300 font-mono">
              编写/粘贴自定义 HTML 网页
            </h2>
            <p className="text-xs text-slate-400">
              在此粘贴或编写任意 HTML 结构，立即加载并进行 DOM 破坏与操作练习
            </p>
          </div>
        </div>

        <textarea
          value={customHtml}
          onChange={(e) => setCustomHtml(e.target.value)}
          rows={12}
          className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-emerald-300 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 resize-none"
          placeholder="<div><h1>Your Custom Content</h1>...</div>"
        />

        <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl transition font-medium"
          >
            取消
          </button>
          <button
            onClick={handleApply}
            className="px-5 py-2 bg-gradient-to-r from-amber-500 to-pink-500 hover:brightness-110 text-black font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center gap-1.5 font-mono"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>渲染并开始破坏 (Render & Destroy)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
