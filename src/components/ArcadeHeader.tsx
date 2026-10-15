import React, { useState } from 'react';
import { 
  Sparkles, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Target, 
  Trophy, 
  Clock, 
  Globe, 
  Share2, 
  ChevronDown,
  Flame,
  Code
} from 'lucide-react';
import { PRESET_WEBSITES } from '../templates/presetWebsites';
import { sound } from '../audio/soundEffects';

interface ArcadeHeaderProps {
  currentUrl: string;
  preset: string;
  onSelectPreset: (presetKey: string) => void;
  onLoadUrl: (url: string) => void;
  onOpenCustomHtml: () => void;
  onRebuild: () => void;
  onOpenSelectorModal: () => void;
  onOpenQuestsModal: () => void;
  onOpenScreenshotModal: () => void;
  destructionPercent: number;
  destroyedCount: number;
  totalElementsCount: number;
  comboCount: number;
  score: number;
  slowMo: boolean;
  onToggleSlowMo: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const ArcadeHeader: React.FC<ArcadeHeaderProps> = ({
  currentUrl,
  preset,
  onSelectPreset,
  onLoadUrl,
  onOpenCustomHtml,
  onRebuild,
  onOpenSelectorModal,
  onOpenQuestsModal,
  onOpenScreenshotModal,
  destructionPercent,
  destroyedCount,
  totalElementsCount,
  comboCount,
  score,
  slowMo,
  onToggleSlowMo,
  isMuted,
  onToggleMute,
}) => {
  const [inputUrl, setInputUrl] = useState<string>(currentUrl);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    onLoadUrl(inputUrl.trim());
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    sound.playCoin();
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#080a1c]/90 backdrop-blur-md border-b border-pink-500/20 z-50 px-4 flex items-center justify-between text-slate-100 font-sans shadow-lg select-none">
      {/* Left: Brand Logo & Title */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => onSelectPreset('wikipedia')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 p-[1.5px] shadow-lg shadow-pink-500/30">
            <div className="w-full h-full bg-[#0b0e1b] rounded-[10px] flex items-center justify-center text-lg">
              💥
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-arcade text-xs text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300 tracking-wider">
                DESTROY
              </span>
              <span className="text-[10px] px-1.5 py-0.2 bg-pink-500/20 border border-pink-500/30 text-pink-300 rounded font-mono font-bold">
                CYBER ARCADE
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">网页元素破坏与操作工坊</p>
          </div>
        </div>

        {/* Preset Selector Dropdown */}
        <div className="relative ml-2">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/80 border border-slate-700/80 hover:border-pink-500/40 rounded-xl text-xs font-medium text-slate-200 transition"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span className="max-w-[130px] truncate">
              {PRESET_WEBSITES[preset]?.nameZh || '选择预设模板'}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-1.5 z-50">
              <span className="block px-2.5 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                经典测试网站预设
              </span>
              {Object.values(PRESET_WEBSITES).map((site) => (
                <button
                  key={site.id}
                  onClick={() => {
                    onSelectPreset(site.id);
                    setInputUrl(site.urlDisplay);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition ${
                    preset === site.id
                      ? 'bg-pink-950/40 text-pink-300 font-bold'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div>
                    <div className="font-medium">{site.nameZh}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{site.urlDisplay}</div>
                  </div>
                </button>
              ))}

              <div className="border-t border-slate-800 my-1"></div>
              <button
                onClick={() => {
                  onOpenScreenshotModal();
                  setDropdownOpen(false);
                }}
                className="w-full text-left px-2.5 py-2 rounded-lg text-xs text-pink-300 hover:bg-pink-950/30 flex items-center gap-2 font-medium"
              >
                <span>📷</span>
                <span>上传网页截图作为破坏对象...</span>
              </button>

              <button
                onClick={() => {
                  onOpenCustomHtml();
                  setDropdownOpen(false);
                }}
                className="w-full text-left px-2.5 py-2 rounded-lg text-xs text-amber-300 hover:bg-amber-950/30 flex items-center gap-2 font-medium"
              >
                <Code className="w-3.5 h-3.5" />
                <span>自定义 HTML 网页代码...</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Middle: URL Input Form */}
      <form onSubmit={handleSubmit} className="hidden lg:flex items-center gap-2 flex-1 max-w-md mx-4">
        <div className="relative flex-1">
          <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-mono select-none">
            https://
          </span>
          <input
            type="text"
            value={inputUrl.replace(/^https?:\/\//, '')}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="wikipedia.org, example.com..."
            className="w-full pl-18 pr-3 py-1.5 bg-slate-950/80 border border-slate-800 focus:border-pink-500 rounded-xl text-xs font-mono text-slate-200 focus:outline-none transition"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-1.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:brightness-110 text-white text-xs font-bold rounded-xl shadow-md shadow-pink-600/30 transition shrink-0 flex items-center gap-1.5 font-mono"
        >
          <span>🔥</span>
          <span>加载/破坏</span>
        </button>
      </form>

      {/* Right: Destruction Stats & Tools HUD */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Score & Combo */}
        <div className="hidden sm:flex items-center gap-3 border-r border-slate-800 pr-3">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-mono">CHAOS SCORE</span>
            <span className="font-arcade text-xs text-amber-300 tracking-wider">
              {score.toLocaleString()}
            </span>
          </div>

          {comboCount > 1 && (
            <div className="px-2 py-0.5 rounded-lg bg-pink-500/20 border border-pink-500/40 flex items-center gap-1 animate-bounce">
              <Flame className="w-3 h-3 text-pink-400" />
              <span className="font-arcade text-[10px] text-pink-300">
                {comboCount}x COMBO!
              </span>
            </div>
          )}
        </div>

        {/* Destruction Gauge */}
        <div className="w-28 sm:w-36">
          <div className="flex justify-between items-center text-[10px] font-mono mb-1">
            <span className="text-slate-400">DESTRUCTION</span>
            <span className="text-pink-400 font-bold">{destructionPercent}%</span>
          </div>
          <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 transition-all duration-300"
              style={{ width: `${destructionPercent}%` }}
            />
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-1.5">
          {/* Rebuild / Respawn */}
          <button
            onClick={onRebuild}
            className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-slate-300 hover:text-white transition group relative"
            title="复原/重建整个网页 (Rebuild Page)"
          >
            <RotateCcw className="w-4 h-4 group-hover:-rotate-90 transition duration-300 text-cyan-400" />
          </button>

          {/* Upload Screenshot Destructor */}
          <button
            onClick={onOpenScreenshotModal}
            className="p-2 bg-slate-900 hover:bg-pink-950/40 border border-pink-500/40 rounded-xl text-pink-300 hover:text-pink-200 transition"
            title="上传/粘贴网页截图进行物理破坏 (Upload Screenshot)"
          >
            <span className="text-sm">📷</span>
          </button>

          {/* CSS Selector Blast Modal */}
          <button
            onClick={onOpenSelectorModal}
            className="p-2 bg-slate-900 hover:bg-cyan-950/40 border border-cyan-500/40 rounded-xl text-cyan-300 hover:text-cyan-200 transition"
            title="CSS 选择器靶向定位轰炸"
          >
            <Target className="w-4 h-4" />
          </button>

          {/* Practice Quests Modal */}
          <button
            onClick={onOpenQuestsModal}
            className="p-2 bg-slate-900 hover:bg-amber-950/40 border border-amber-500/40 rounded-xl text-amber-300 hover:text-amber-200 transition"
            title="元素实战任务关卡"
          >
            <Trophy className="w-4 h-4" />
          </button>

          {/* Slow Motion */}
          <button
            onClick={onToggleSlowMo}
            className={`p-2 rounded-xl border transition ${
              slowMo
                ? 'bg-purple-950/60 border-purple-400 text-purple-300 shadow-md shadow-purple-500/30'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-700/80 text-slate-400'
            }`}
            title="慢镜头模式 (Slow-Mo 0.5x)"
          >
            <Clock className="w-4 h-4" />
          </button>

          {/* Sound Mute */}
          <button
            onClick={onToggleMute}
            className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-slate-300 hover:text-white transition"
            title={isMuted ? '取消静音' : '静音'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-slate-300 hover:text-white transition"
            title="分享应用"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
