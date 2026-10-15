import React, { useState, useRef } from 'react';
import { X, Upload, Sparkles, RotateCcw, Check, User, Camera } from 'lucide-react';
import { sound } from '../audio/soundEffects';

interface AvatarUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  customAvatarUrl: string | null;
  onSaveAvatar: (url: string | null) => void;
}

export const AvatarUploadModal: React.FC<AvatarUploadModalProps> = ({
  isOpen,
  onClose,
  customAvatarUrl,
  onSaveAvatar,
}) => {
  const [preview, setPreview] = useState<string | null>(customAvatarUrl);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Preset sample cute avatars for instant 1-click test
  const sampleAvatars = [
    {
      name: '粉红猫咪 (Pink Kitty)',
      generator: () => {
        const c = document.createElement('canvas');
        c.width = 100;
        c.height = 100;
        const ctx = c.getContext('2d')!;
        ctx.fillStyle = '#ff77a9';
        ctx.beginPath();
        ctx.arc(50, 50, 48, 0, Math.PI * 2);
        ctx.fill();
        // Ears
        ctx.fillStyle = '#ff3388';
        ctx.beginPath();
        ctx.moveTo(15, 30);
        ctx.lineTo(25, 5);
        ctx.lineTo(40, 20);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(85, 30);
        ctx.lineTo(75, 5);
        ctx.lineTo(60, 20);
        ctx.fill();
        // Eyes
        ctx.fillStyle = '#1e1035';
        ctx.beginPath();
        ctx.arc(35, 45, 6, 0, Math.PI * 2);
        ctx.arc(65, 45, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(33, 43, 2.5, 0, Math.PI * 2);
        ctx.arc(63, 43, 2.5, 0, Math.PI * 2);
        ctx.fill();
        // Nose & mouth
        ctx.fillStyle = '#ff1493';
        ctx.beginPath();
        ctx.arc(50, 56, 3, 0, Math.PI * 2);
        ctx.fill();
        // Cheeks
        ctx.fillStyle = '#ff99cc';
        ctx.beginPath();
        ctx.arc(28, 55, 5, 0, Math.PI * 2);
        ctx.arc(72, 55, 5, 0, Math.PI * 2);
        ctx.fill();
        return c.toDataURL('image/png');
      },
    },
    {
      name: '柴犬狗头 (Doge)',
      generator: () => {
        const c = document.createElement('canvas');
        c.width = 100;
        c.height = 100;
        const ctx = c.getContext('2d')!;
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(50, 50, 46, 0, Math.PI * 2);
        ctx.fill();
        // Muzzle
        ctx.fillStyle = '#fef3c7';
        ctx.beginPath();
        ctx.ellipse(50, 62, 24, 18, 0, 0, Math.PI * 2);
        ctx.fill();
        // Eyes
        ctx.fillStyle = '#1e1035';
        ctx.beginPath();
        ctx.arc(36, 42, 5, 0, Math.PI * 2);
        ctx.arc(64, 42, 5, 0, Math.PI * 2);
        ctx.fill();
        // Nose
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(50, 56, 4, 0, Math.PI * 2);
        ctx.fill();
        // Eyebrows
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(34, 32, 4, 0, Math.PI * 2);
        ctx.arc(66, 32, 4, 0, Math.PI * 2);
        ctx.fill();
        return c.toDataURL('image/png');
      },
    },
    {
      name: '像素宇航员 (Astro)',
      generator: () => {
        const c = document.createElement('canvas');
        c.width = 100;
        c.height = 100;
        const ctx = c.getContext('2d')!;
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, 100, 100);
        // Helmet
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.roundRect(15, 15, 70, 70, 22);
        ctx.fill();
        // Gold Visor
        const grad = ctx.createLinearGradient(25, 25, 75, 75);
        grad.addColorStop(0, '#fbbf24');
        grad.addColorStop(0.5, '#f59e0b');
        grad.addColorStop(1, '#b45309');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(25, 30, 50, 36, 12);
        ctx.fill();
        // Reflection
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fillRect(32, 36, 12, 6);
        return c.toDataURL('image/png');
      },
    },
    {
      name: '赛博朋克 (Cyber Girl)',
      generator: () => {
        const c = document.createElement('canvas');
        c.width = 100;
        c.height = 100;
        const ctx = c.getContext('2d')!;
        ctx.fillStyle = '#1e1035';
        ctx.fillRect(0, 0, 100, 100);
        // Neon hair
        ctx.fillStyle = '#00ffff';
        ctx.beginPath();
        ctx.arc(50, 48, 40, 0, Math.PI * 2);
        ctx.fill();
        // Face
        ctx.fillStyle = '#ffedd5';
        ctx.beginPath();
        ctx.arc(50, 54, 28, 0, Math.PI * 2);
        ctx.fill();
        // Neon Visor Glasses
        ctx.fillStyle = '#ff007f';
        ctx.beginPath();
        ctx.roundRect(28, 46, 44, 14, 4);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(34, 49, 10, 3);
        return c.toDataURL('image/png');
      },
    },
    {
      name: '像素黑客 (Glitch)',
      generator: () => {
        const c = document.createElement('canvas');
        c.width = 100;
        c.height = 100;
        const ctx = c.getContext('2d')!;
        ctx.fillStyle = '#050510';
        ctx.fillRect(0, 0, 100, 100);
        // Green skull / mask
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 50px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('👾', 50, 52);
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
      const res = evt.target?.result as string;
      setPreview(res);
      sound.playInspect();
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const res = evt.target?.result as string;
        setPreview(res);
        sound.playInspect();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    sound.playCoin();
    onSaveAvatar(preview);
    onClose();
  };

  const handleResetToDefault = () => {
    sound.playInspect();
    setPreview(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="w-full max-w-md bg-slate-900 border border-pink-500/50 rounded-3xl p-6 shadow-2xl relative text-slate-100 font-sans">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white text-2xl shadow-lg shadow-pink-500/30">
            🐱
          </div>
          <div>
            <h2 className="text-base font-bold text-pink-300 font-mono flex items-center gap-2">
              <span>自定义机器人头像</span>
              <span className="text-[10px] px-1.5 py-0.5 bg-pink-500/20 text-pink-300 rounded font-bold uppercase">
                Avatar PNG
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              上传 PNG 头像，将完美嵌入机器人猫耳头盔的面罩驾驶舱中！
            </p>
          </div>
        </div>

        {/* Live Head Helmet Preview */}
        <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center justify-around mb-4">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-mono text-slate-400 mb-2">头盔面罩实时效果</span>
            {/* Miniature Helmet Container */}
            <div className="relative w-20 h-20 bg-[#1e1035] border-2 border-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/20 overflow-visible">
              {/* Cat Ears */}
              <div className="absolute -top-3 -left-1 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[14px] border-b-pink-500"></div>
              <div className="absolute -top-3 -right-1 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[14px] border-b-pink-500"></div>

              {/* Visor / Face Inner */}
              <div className="w-14 h-12 rounded-xl overflow-hidden border border-cyan-400/80 bg-slate-900 shadow-[inset_0_0_8px_rgba(0,255,255,0.3)] flex items-center justify-center relative">
                {preview ? (
                  <img
                    src={preview}
                    alt="Custom Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-10 h-3.5 bg-cyan-400 rounded shadow-[0_0_8px_#00ffff]"></div>
                    <div className="flex gap-4 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                    </div>
                  </div>
                )}
                {/* Cyber glass shine overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none"></div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:brightness-110 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>选择 PNG 图片</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileChange}
              className="hidden"
            />

            {preview && (
              <button
                onClick={handleResetToDefault}
                className="w-full px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3 h-3 text-cyan-400" />
                <span>恢复默认猫咪</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Sample Avatars */}
        <div className="mb-5">
          <span className="block text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider font-mono">
            精选趣味头像库 (1-Click Test)
          </span>
          <div className="grid grid-cols-5 gap-2">
            {sampleAvatars.map((s) => (
              <button
                key={s.name}
                type="button"
                onClick={() => {
                  const url = s.generator();
                  setPreview(url);
                  sound.playInspect();
                }}
                className="p-1.5 bg-slate-950 border border-slate-800 hover:border-pink-500 rounded-xl flex flex-col items-center justify-center transition group hover:scale-105"
                title={s.name}
              >
                <img
                  src={s.generator()}
                  alt={s.name}
                  className="w-9 h-9 rounded-lg object-cover"
                />
                <span className="text-[9px] text-slate-400 truncate w-full text-center mt-1 group-hover:text-pink-300">
                  {s.name.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl transition"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 hover:brightness-110 text-white font-bold text-xs rounded-xl shadow-lg shadow-pink-500/30 transition flex items-center gap-1.5 font-mono"
          >
            <Check className="w-3.5 h-3.5" />
            <span>应用头像 (Apply Avatar)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
