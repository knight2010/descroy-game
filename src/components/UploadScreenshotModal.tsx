import React, { useState, useRef } from 'react';
import { X, Upload, Image, Sparkles, Check, Globe } from 'lucide-react';
import { sound } from '../audio/soundEffects';

interface UploadScreenshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadScreenshot: (dataUrl: string, name: string) => void;
}

export const UploadScreenshotModal: React.FC<UploadScreenshotModalProps> = ({
  isOpen,
  onClose,
  onLoadScreenshot,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [siteName, setSiteName] = useState<string>('my-website.com');
  const [dragOver, setDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sample pre-generated website screenshots (SVG / Canvas based high-res mock screenshots)
  const sampleScreenshots = [
    {
      title: 'Google 搜索首页',
      name: 'google.com',
      generator: () => {
        const c = document.createElement('canvas');
        c.width = 1000;
        c.height = 650;
        const ctx = c.getContext('2d')!;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 1000, 650);

        // Header
        ctx.fillStyle = '#5f6368';
        ctx.font = '14px sans-serif';
        ctx.fillText('Gmail', 840, 36);
        ctx.fillText('Images', 890, 36);
        ctx.fillStyle = '#1a73e8';
        ctx.beginPath();
        ctx.arc(965, 32, 16, 0, Math.PI * 2);
        ctx.fill();

        // Google Logo
        ctx.font = 'bold 80px "Product Sans", sans-serif';
        const colors = ['#4285F4', '#EA4335', '#FBBC05', '#4285F4', '#34A853', '#EA4335'];
        const text = 'Google';
        let x = 370;
        for (let i = 0; i < text.length; i++) {
          ctx.fillStyle = colors[i];
          ctx.fillText(text[i], x, 240);
          x += ctx.measureText(text[i]).width;
        }

        // Search Bar
        ctx.strokeStyle = '#dfe1e5';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(240, 290, 520, 48, 24);
        ctx.stroke();

        ctx.fillStyle = '#9aa0a6';
        ctx.font = '16px sans-serif';
        ctx.fillText('🔍 Search Google or type a URL', 270, 320);

        // Buttons
        ctx.fillStyle = '#f8f9fa';
        ctx.beginPath();
        ctx.roundRect(350, 370, 140, 38, 4);
        ctx.roundRect(510, 370, 140, 38, 4);
        ctx.fill();

        ctx.fillStyle = '#3c4043';
        ctx.font = '14px sans-serif';
        ctx.fillText("Google Search", 370, 394);
        ctx.fillText("I'm Feeling Lucky", 522, 394);

        // Footer
        ctx.fillStyle = '#f2f2f2';
        ctx.fillRect(0, 600, 1000, 50);
        ctx.fillStyle = '#70757a';
        ctx.font = '13px sans-serif';
        ctx.fillText('About   Advertising   Business   How Search works', 30, 630);
        ctx.fillText('Privacy   Terms   Settings', 800, 630);

        return c.toDataURL('image/png');
      },
    },
    {
      title: 'Bilibili 视频首页',
      name: 'bilibili.com',
      generator: () => {
        const c = document.createElement('canvas');
        c.width = 1000;
        c.height = 650;
        const ctx = c.getContext('2d')!;
        ctx.fillStyle = '#0f1423';
        ctx.fillRect(0, 0, 1000, 650);

        // Top pink banner
        const grad = ctx.createLinearGradient(0, 0, 1000, 0);
        grad.addColorStop(0, '#00aeec');
        grad.addColorStop(0.5, '#fb7299');
        grad.addColorStop(1, '#ff6699');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1000, 110);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText('📺 bilibili (゜-゜)つロ 干杯~', 40, 65);

        // Cards grid
        for (let row = 0; row < 2; row++) {
          for (let col = 0; col < 4; col++) {
            const bx = 40 + col * 235;
            const by = 140 + row * 230;
            // Card image
            ctx.fillStyle = '#1e293b';
            ctx.beginPath();
            ctx.roundRect(bx, by, 220, 130, 8);
            ctx.fill();

            ctx.fillStyle = '#38bdf8';
            ctx.font = 'bold 28px sans-serif';
            ctx.fillText('▶️', bx + 95, by + 75);

            // Card title
            ctx.fillStyle = '#f1f5f9';
            ctx.font = 'bold 13px sans-serif';
            ctx.fillText(`【热播】高能网页破坏实况 #${col + 1 + row * 4}`, bx, by + 160);
            ctx.fillStyle = '#94a3b8';
            ctx.font = '11px sans-serif';
            ctx.fillText('播放 142.8万 · 弹幕 8.6万', bx, by + 180);
          }
        }

        return c.toDataURL('image/png');
      },
    },
    {
      title: 'GitHub 代码仓库',
      name: 'github.com/destroy-web',
      generator: () => {
        const c = document.createElement('canvas');
        c.width = 1000;
        c.height = 650;
        const ctx = c.getContext('2d')!;
        ctx.fillStyle = '#0d1117';
        ctx.fillRect(0, 0, 1000, 650);

        // Header
        ctx.fillStyle = '#161b22';
        ctx.fillRect(0, 0, 1000, 60);
        ctx.fillStyle = '#f0f6fc';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText('🐙 GitHub', 30, 38);
        ctx.fillStyle = '#58a6ff';
        ctx.font = '14px sans-serif';
        ctx.fillText('awesome-destroyer / web-smash-engine', 150, 38);

        // Repo Body
        ctx.fillStyle = '#161b22';
        ctx.beginPath();
        ctx.roundRect(30, 90, 940, 480, 8);
        ctx.fill();
        ctx.strokeStyle = '#30363d';
        ctx.stroke();

        ctx.fillStyle = '#58a6ff';
        ctx.font = 'bold 16px monospace';
        ctx.fillText('main branch: 1,420 commits  ·  48 releases', 50, 130);

        // Code rows
        const files = ['📁 src/physics', '📁 src/weapons', '📁 src/robot-hero', '📄 index.html', '📄 README.md', '📄 package.json'];
        files.forEach((f, idx) => {
          ctx.fillStyle = idx % 2 === 0 ? '#161b22' : '#0d1117';
          ctx.fillRect(32, 150 + idx * 45, 936, 45);
          ctx.fillStyle = '#c9d1d9';
          ctx.font = '13px monospace';
          ctx.fillText(f, 60, 178 + idx * 45);
          ctx.fillStyle = '#8b949e';
          ctx.fillText('Feat: Add physics platformer and shatter engine', 320, 178 + idx * 45);
        });

        return c.toDataURL('image/png');
      },
    },
  ];

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const result = evt.target?.result as string;
      setPreviewUrl(result);
      setSiteName(file.name.replace(/\.[^/.]+$/, ''));
      sound.playInspect();
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const result = evt.target?.result as string;
        setPreviewUrl(result);
        setSiteName(file.name.replace(/\.[^/.]+$/, ''));
        sound.playInspect();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApply = () => {
    if (!previewUrl) return;
    sound.playRebuild();
    onLoadScreenshot(previewUrl, siteName || 'screenshot-site.com');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-slate-900 border border-pink-500/50 rounded-3xl p-6 shadow-2xl relative text-slate-100 font-sans max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-pink-950 border border-pink-500/40 flex items-center justify-center text-pink-400 text-2xl shadow-lg shadow-pink-500/20">
            📷
          </div>
          <div>
            <h2 className="text-lg font-bold text-pink-300 font-mono flex items-center gap-2">
              <span>上传网页截图作为破坏对象</span>
              <span className="text-[10px] px-2 py-0.5 bg-pink-500/20 text-pink-300 rounded font-bold uppercase">
                Image Destructor
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              上传任何真实网站的截图（支持截图粘贴 Ctrl+V 或拖拽），切片为物理平台供主角站立与射击粉碎！
            </p>
          </div>
        </div>

        {/* Drop Zone / File Picker */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition text-center relative overflow-hidden mb-4 ${
            dragOver
              ? 'border-pink-400 bg-pink-950/30 scale-[1.01]'
              : previewUrl
              ? 'border-cyan-500/50 bg-slate-950/60'
              : 'border-slate-700 bg-slate-950/40 hover:border-pink-500/50 hover:bg-slate-900'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {previewUrl ? (
            <div className="space-y-3 w-full flex flex-col items-center">
              <div className="max-h-52 w-full flex items-center justify-center overflow-hidden rounded-xl border border-slate-700 bg-black">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-52 object-contain"
                />
              </div>
              <p className="text-xs text-cyan-300 font-mono">
                ✓ 截图已成功加载！点击可重新选择文件，或直接在页面中 Ctrl+V 粘贴
              </p>
            </div>
          ) : (
            <div className="space-y-2 py-4">
              <Upload className="w-10 h-10 text-pink-400 mx-auto animate-bounce" />
              <p className="text-sm font-bold text-slate-200">
                点击上传，或将网页截图拖拽到此处
              </p>
              <p className="text-xs text-slate-400">
                支持 PNG, JPG, WebP 格式 · 随时按 <kbd className="px-1.5 py-0.5 bg-slate-800 rounded font-mono text-pink-400">Ctrl+V</kbd> 快速粘贴系统截图
              </p>
            </div>
          )}
        </div>

        {/* Preset Sample Screenshots */}
        <div className="mb-5">
          <span className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider font-mono">
            或者直接选用经典网站实机截图 (1-Click Sample)
          </span>
          <div className="grid grid-cols-3 gap-2.5">
            {sampleScreenshots.map((sample) => (
              <button
                key={sample.name}
                type="button"
                onClick={() => {
                  const url = sample.generator();
                  setPreviewUrl(url);
                  setSiteName(sample.name);
                  sound.playInspect();
                }}
                className="p-3 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-pink-500/50 rounded-xl text-left transition group"
              >
                <div className="text-xs font-bold text-slate-200 group-hover:text-pink-300 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{sample.title}</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">
                  {sample.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Target Site Name input */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-slate-400 mb-1 font-mono uppercase">
            目标网站域名显示 (Website URL)
          </label>
          <input
            type="text"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            placeholder="例如: bilibili.com, google.com"
            className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-cyan-300 focus:outline-none focus:border-pink-500"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-800 mt-auto">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl transition"
          >
            取消
          </button>
          <button
            onClick={handleApply}
            disabled={!previewUrl}
            className="px-6 py-2 bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl shadow-lg shadow-pink-500/30 transition flex items-center gap-2 font-mono"
          >
            <Sparkles className="w-4 h-4" />
            <span>进入截图破坏舞台 (Start Smashing)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
