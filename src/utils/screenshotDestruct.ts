/**
 * Generates an interactive, destructible DOM layout from an uploaded webpage screenshot.
 * Slices the screenshot into seamless interactive tiles that act as physical platforms,
 * can be inspected, and can be destroyed tile-by-tile with physics!
 */
export function generateScreenshotDestructibleHtml(
  imageDataUrl: string,
  siteName: string = 'screenshot-website.com'
): string {
  const rows = 5;
  const cols = 6;
  let tilesHtml = '';

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const posX = (c / (cols - 1)) * 100;
      const posY = (r / (rows - 1)) * 100;
      const tileId = `tile-${r}-${c}`;
      const isHeader = r === 0;
      const isCard = r > 0 && r < rows - 1;

      tilesHtml += `
        <div 
          id="${tileId}"
          class="screenshot-tile group relative overflow-hidden transition-all duration-200 border border-slate-700/20 hover:border-pink-500/50 cursor-crosshair"
          data-tile-type="${isHeader ? 'header-tile' : isCard ? 'card-tile' : 'footer-tile'}"
          style="
            background-image: url('${imageDataUrl}');
            background-size: ${cols * 100}% ${rows * 100}%;
            background-position: ${posX}% ${posY}%;
            min-height: 110px;
          "
        >
          <div class="absolute inset-0 bg-pink-500/0 group-hover:bg-pink-500/10 transition pointer-events-none"></div>
          <div class="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition px-1.5 py-0.5 bg-black/70 text-[9px] font-mono text-cyan-300 rounded pointer-events-none">
            [${r + 1},${c + 1}]
          </div>
        </div>
      `;
    }
  }

  return `
    <div class="screenshot-destruct-wrapper w-full max-w-5xl mx-auto rounded-3xl bg-[#0c0824] border-4 border-slate-700 shadow-2xl overflow-hidden select-none relative min-h-[85vh]">
      <!-- Background Cyber Matrix (Exposed when screenshot pieces are shot away) -->
      <div class="absolute inset-0 bg-gradient-to-br from-[#12082b] via-[#090517] to-[#1a0033] pointer-events-none -z-10 flex flex-col justify-end overflow-hidden">
        <div class="w-full h-72 bg-gradient-to-t from-pink-600/30 via-purple-600/20 to-transparent flex items-end justify-around px-8">
          <div class="w-16 h-52 bg-[#1b0e3b] border-t-2 border-pink-500 shadow-[0_0_15px_#ff0077]"></div>
          <div class="w-24 h-64 bg-[#120826] border-t-2 border-cyan-400 shadow-[0_0_15px_#00ffff]"></div>
          <div class="w-20 h-44 bg-[#23124d] border-t-2 border-amber-400"></div>
          <div class="w-28 h-56 bg-[#160b33] border-t-2 border-pink-500"></div>
        </div>
      </div>

      <!-- Simulated Web Browser Top Bar -->
      <header class="bg-[#1e1b4b] px-4 py-3 flex items-center justify-between border-b border-slate-700 text-slate-200">
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-rose-500"></span>
          <span class="w-3 h-3 rounded-full bg-amber-500"></span>
          <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
          <span class="text-xs font-mono text-slate-400 ml-2">Web Inspector Preview</span>
        </div>

        <div class="flex-1 max-w-md mx-4 px-3 py-1 bg-slate-900/90 border border-slate-700 rounded-lg text-xs font-mono text-cyan-300 flex items-center justify-between">
          <span class="truncate">https://${siteName}</span>
          <span class="text-[10px] text-pink-400 uppercase font-bold">Screenshot Live Target</span>
        </div>

        <div class="text-[11px] text-slate-400 font-mono">
          <span>${cols}×${rows} 块可破坏单元</span>
        </div>
      </header>

      <!-- Sliced Screenshot Interactive Canvas Grid -->
      <div class="p-4">
        <div class="grid grid-cols-${cols} gap-1 rounded-2xl overflow-hidden shadow-2xl bg-black border border-slate-800" style="grid-template-columns: repeat(${cols}, minmax(0, 1fr));">
          ${tilesHtml}
        </div>
      </div>
    </div>
  `;
}
