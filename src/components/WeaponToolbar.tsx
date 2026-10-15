import React from 'react';
import { WeaponType } from '../types';
import { WEAPONS } from '../utils/weaponsConfig';
import { sound } from '../audio/soundEffects';

interface WeaponToolbarProps {
  currentWeapon: WeaponType;
  onSelectWeapon: (weapon: WeaponType) => void;
}

export const WeaponToolbar: React.FC<WeaponToolbarProps> = ({
  currentWeapon,
  onSelectWeapon,
}) => {
  const weaponList = Object.values(WEAPONS);

  const handleSelect = (id: WeaponType) => {
    sound.playInspect();
    onSelectWeapon(id);
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 p-1.5 bg-[#080a1c]/90 backdrop-blur-md border border-pink-500/30 rounded-2xl shadow-2xl select-none max-w-[96vw] overflow-x-auto">
      {weaponList.map((w) => {
        const isActive = currentWeapon === w.id;
        return (
          <button
            key={w.id}
            onClick={() => handleSelect(w.id)}
            className={`relative group flex flex-col items-center justify-center p-2 rounded-xl transition duration-200 shrink-0 ${
              isActive
                ? 'bg-gradient-to-t from-pink-900/60 to-purple-900/40 border border-pink-400 text-white shadow-lg shadow-pink-500/30 scale-105'
                : 'bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            {/* Shortcut key badge */}
            <span
              className={`absolute top-1 right-1 text-[9px] font-mono font-bold px-1 py-0.2 rounded ${
                isActive
                  ? 'bg-pink-500 text-white'
                  : 'bg-slate-800/80 text-slate-400 group-hover:text-slate-200'
              }`}
            >
              {w.key}
            </span>

            {/* Icon */}
            <span className="text-xl mb-1 filter drop-shadow">{w.icon}</span>

            {/* Name */}
            <span className="text-[10px] font-medium tracking-tight whitespace-nowrap">
              {w.name}
            </span>

            {/* Tooltip on hover */}
            <div className="absolute bottom-full mb-3 hidden group-hover:flex flex-col items-center pointer-events-none z-50">
              <div className="p-2.5 bg-slate-900 border border-slate-700 rounded-xl shadow-xl text-left w-56 text-slate-100">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-xs text-pink-400 font-mono">
                    {w.icon} {w.name} ({w.nameEn})
                  </span>
                  <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-amber-300 font-mono">
                    KEY [{w.key}]
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">{w.description}</p>
                {w.damage > 0 && (
                  <div className="flex gap-3 text-[10px] text-slate-400 font-mono mt-1.5 pt-1.5 border-t border-slate-800">
                    <span>伤害: {w.damage} HP</span>
                    <span>半径: {w.radius}px</span>
                  </div>
                )}
              </div>
              <div className="w-2 h-2 bg-slate-900 border-r border-b border-slate-700 rotate-45 -mt-1"></div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
