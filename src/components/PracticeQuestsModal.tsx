import React from 'react';
import { PracticeQuest } from '../types';
import { Trophy, CheckCircle, Circle, Award, X, Sparkles } from 'lucide-react';
import { sound } from '../audio/soundEffects';

interface PracticeQuestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  quests: PracticeQuest[];
  totalXp: number;
}

export const PracticeQuestsModal: React.FC<PracticeQuestsModalProps> = ({
  isOpen,
  onClose,
  quests,
  totalXp,
}) => {
  if (!isOpen) return null;

  const completedCount = quests.filter((q) => q.completed).length;
  const progressPercent = Math.round((completedCount / quests.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-slate-900 border border-amber-500/50 rounded-2xl p-6 shadow-2xl relative text-slate-100 font-sans max-h-[85vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition absolute top-4 right-4"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-950 border border-amber-500/40 flex items-center justify-center text-amber-400 text-2xl shadow-lg shadow-amber-500/20">
            🏆
          </div>
          <div>
            <h2 className="text-lg font-bold text-amber-300 font-mono flex items-center gap-2">
              <span>网页元素操作挑战任务</span>
              <span className="text-xs px-2 py-0.5 bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded font-mono">
                {totalXp} XP
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              完成针对 DOM 元素检索、属性审查、样式修改与物理粉碎的实战关卡
            </p>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="mb-4 p-3 bg-slate-950 border border-slate-800 rounded-xl">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-slate-400 font-semibold">任务完成进度</span>
            <span className="font-mono text-amber-400 font-bold">
              {completedCount} / {quests.length} ({progressPercent}%)
            </span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-pink-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Quest List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {quests.map((q) => (
            <div
              key={q.id}
              className={`p-3.5 rounded-xl border transition flex items-center justify-between ${
                q.completed
                  ? 'bg-emerald-950/20 border-emerald-500/30'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {q.completed ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-600" />
                  )}
                </div>
                <div>
                  <h4
                    className={`text-xs font-bold font-mono ${
                      q.completed ? 'text-emerald-300 line-through' : 'text-slate-200'
                    }`}
                  >
                    {q.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{q.desc}</p>
                </div>
              </div>

              <div className="text-right ml-4 shrink-0">
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                    q.completed
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  +{q.rewardXp} XP
                </span>
                <div className="text-[10px] text-slate-500 font-mono mt-1">
                  {q.currentCount} / {q.targetCount}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-4 mt-2 border-t border-slate-800 flex justify-between items-center text-xs">
          <span className="text-slate-500">提示: 切换不同武器和工具来加速完成任务</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition text-xs shadow-md shadow-amber-500/20"
          >
            继续挑战
          </button>
        </div>
      </div>
    </div>
  );
};
