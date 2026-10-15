export interface PresetSiteData {
  id: string;
  name: string;
  nameZh: string;
  urlDisplay: string;
  description: string;
  html: string;
}

export const PRESET_WEBSITES: Record<string, PresetSiteData> = {
  candyland: {
    id: 'candyland',
    name: 'Candyland Kingdom',
    nameZh: '🍬 糖果王国 (视频同款)',
    urlDisplay: 'candyland-kingdom.kawaii/smash',
    description: '视频同款糖果王国！粉色甜美界面，包含纸杯蛋糕、棒棒糖、糖分数据图表与隐藏像素赛博都市背景。',
    html: `
      <div class="candyland-wrapper w-full max-w-5xl mx-auto rounded-3xl bg-gradient-to-b from-[#ffe6f2] via-[#fff0f7] to-[#ffffff] text-slate-800 font-sans shadow-2xl border-4 border-pink-300 min-h-[85vh] relative overflow-hidden select-none">
        <!-- Secret Cyber City Background (Revealed when foreground elements smash!) -->
        <div class="absolute inset-0 bg-[#0c0824] opacity-95 pointer-events-none -z-10 flex flex-col justify-end overflow-hidden">
          <div class="w-full h-72 bg-gradient-to-t from-[#ff0077]/40 via-[#7928ca]/30 to-transparent flex items-end justify-around px-8">
            <div class="w-16 h-56 bg-[#160e3d] border-t-2 border-pink-500 shadow-[0_0_15px_#ff0077]"></div>
            <div class="w-24 h-64 bg-[#120b33] border-t-2 border-cyan-400 shadow-[0_0_15px_#00ffff]"></div>
            <div class="w-20 h-48 bg-[#1f104d] border-t-2 border-amber-400"></div>
            <div class="w-28 h-60 bg-[#160e3d] border-t-2 border-pink-500"></div>
            <div class="w-16 h-40 bg-[#11092e] border-t-2 border-purple-400"></div>
          </div>
        </div>

        <!-- Top Navigation -->
        <header class="bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 px-6 py-3.5 flex items-center justify-between text-white shadow-md">
          <div class="flex items-center gap-2.5">
            <span class="text-2xl filter drop-shadow">🍬</span>
            <span class="text-lg font-bold tracking-tight text-white font-serif">Candyland Kingdom</span>
            <span class="text-sm">🌸</span>
          </div>

          <nav class="hidden md:flex items-center gap-5 text-xs font-semibold">
            <a href="#" class="hover:text-pink-100 flex items-center gap-1 transition"><span>🍬</span> Candies</a>
            <a href="#" class="hover:text-pink-100 flex items-center gap-1 transition"><span>🧁</span> Cupcakes</a>
            <a href="#" class="hover:text-pink-100 flex items-center gap-1 transition"><span>⭐</span> Magic Stars</a>
            <a href="#" class="hover:text-pink-100 flex items-center gap-1 transition"><span>🐾</span> Pets</a>
            <button class="px-4 py-1.5 bg-white text-pink-600 font-bold rounded-full shadow-md hover:bg-pink-50 hover:scale-105 transition">Smash Me!</button>
          </nav>
        </header>

        <!-- Main Content Area -->
        <div class="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <!-- Left Hero Column -->
          <div class="lg:col-span-6 space-y-6">
            <div class="inline-flex items-center gap-2 px-3 py-1 bg-amber-100/90 border border-amber-300 rounded-full text-[11px] font-bold text-amber-800 tracking-wider">
              <span>✨</span> SWEETEST WORLD ON EARTH
            </div>

            <h1 class="text-3xl md:text-5xl font-extrabold text-[#6b165b] leading-tight tracking-tight drop-shadow-sm">
              Welcome to Candyland, <br />
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600">
                Smash Everything!
              </span>
            </h1>

            <p class="text-sm text-pink-900/80 leading-relaxed max-w-md font-medium">
              Every cupcake, lollipop, star and rainbow button on this page can be blown into sparkling sweet candy pieces! Grab your Kitty Blaster and start shredding!
            </p>

            <div class="flex flex-wrap gap-3.5 pt-2">
              <button class="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-xs rounded-full shadow-lg shadow-pink-500/30 flex items-center gap-2 transform hover:-translate-y-0.5 transition">
                <span>🍓</span> Eat Strawberries
              </button>
              <button class="px-6 py-3 bg-white/90 border-2 border-pink-300 hover:bg-pink-50 text-pink-600 font-bold text-xs rounded-full shadow-sm flex items-center gap-2 transform hover:-translate-y-0.5 transition">
                <span>✨</span> Candy Rain
              </button>
            </div>
          </div>

          <!-- Right Chart Card Column (Video identical card!) -->
          <div class="lg:col-span-6">
            <div class="candy-chart-card bg-white/95 backdrop-blur-md p-6 rounded-3xl border-4 border-pink-200 shadow-xl relative overflow-hidden">
              <!-- Window top dots -->
              <div class="flex items-center gap-1.5 mb-5 pb-3 border-b border-pink-100">
                <span class="w-3 h-3 rounded-full bg-rose-400"></span>
                <span class="w-3 h-3 rounded-full bg-amber-400"></span>
                <span class="w-3 h-3 rounded-full bg-emerald-400"></span>
              </div>

              <!-- 3 Metric Pills -->
              <div class="grid grid-cols-3 gap-3 mb-6">
                <div class="p-3 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl text-center">
                  <span class="text-[10px] font-bold text-amber-700 block uppercase">Sugar Level</span>
                  <span class="text-lg font-black text-amber-600">100%</span>
                </div>
                <div class="p-3 bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-200 rounded-2xl text-center">
                  <span class="text-[10px] font-bold text-pink-700 block uppercase">Cupcakes</span>
                  <span class="text-lg font-black text-pink-600">9,999</span>
                </div>
                <div class="p-3 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-2xl text-center">
                  <span class="text-[10px] font-bold text-purple-700 block uppercase">Happiness</span>
                  <span class="text-lg font-black text-purple-600">MAX</span>
                </div>
              </div>

              <!-- Gradient Bar Chart -->
              <div class="h-44 flex items-end justify-between gap-3 px-3 pt-4 border-b-2 border-dashed border-pink-200">
                <div class="flex-1 bg-gradient-to-t from-pink-400 via-rose-300 to-amber-300 rounded-t-xl h-[45%] hover:brightness-110 transition shadow-sm"></div>
                <div class="flex-1 bg-gradient-to-t from-pink-400 via-rose-300 to-amber-300 rounded-t-xl h-[70%] hover:brightness-110 transition shadow-sm"></div>
                <div class="flex-1 bg-gradient-to-t from-pink-400 via-rose-300 to-amber-300 rounded-t-xl h-[95%] hover:brightness-110 transition shadow-sm"></div>
                <div class="flex-1 bg-gradient-to-t from-pink-400 via-rose-300 to-amber-300 rounded-t-xl h-[60%] hover:brightness-110 transition shadow-sm"></div>
                <div class="flex-1 bg-gradient-to-t from-pink-400 via-rose-300 to-amber-300 rounded-t-xl h-[85%] hover:brightness-110 transition shadow-sm"></div>
                <div class="flex-1 bg-gradient-to-t from-pink-400 via-rose-300 to-amber-300 rounded-t-xl h-[100%] hover:brightness-110 transition shadow-sm"></div>
              </div>
              <p class="text-[10px] text-center text-pink-400 mt-2 font-mono">SWEETNESS FREQUENCY SPECTRUM</p>
            </div>
          </div>
        </div>
      </div>
    `,
  },
  wikipedia: {
    id: 'wikipedia',
    name: 'Wikipedia Article',
    nameZh: '维基百科 (Wikipedia)',
    urlDisplay: 'en.wikipedia.org/wiki/World_Wide_Web',
    description: 'Classic encyclopedic page with table of contents, citations, infobox, and images.',
    html: `
      <div class="wiki-container max-w-4xl mx-auto p-8 bg-white text-slate-800 font-sans shadow-xl rounded-md min-h-screen">
        <!-- Wiki Header -->
        <header class="border-b border-gray-300 pb-4 mb-6 flex justify-between items-center">
          <div class="flex items-center gap-3">
            <span class="text-3xl">🌐</span>
            <div>
              <span class="text-xl font-serif font-bold text-slate-900 tracking-wide">WIKIPEDIA</span>
              <p class="text-xs text-gray-500 uppercase tracking-widest">The Free Encyclopedia</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <input type="text" placeholder="Search Wikipedia..." class="text-sm px-3 py-1.5 border border-gray-300 rounded bg-gray-50 text-gray-700 focus:outline-blue-500" />
            <button class="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition">Search</button>
          </div>
        </header>

        <!-- Main Title & Tagline -->
        <h1 class="text-3xl font-serif font-normal border-b border-gray-300 pb-2 mb-2 text-slate-900">World Wide Web</h1>
        <p class="text-xs text-gray-500 italic mb-6">From Wikipedia, the free encyclopedia</p>

        <!-- Infobox Right -->
        <div class="float-right ml-6 mb-4 w-72 bg-gray-50 border border-gray-300 rounded p-4 text-sm shadow-sm">
          <h2 class="text-center font-bold text-slate-900 pb-2 border-b border-gray-200">World Wide Web</h2>
          <div class="my-3 flex justify-center">
            <div class="w-full h-36 bg-gradient-to-tr from-blue-100 to-indigo-100 border border-blue-200 rounded flex flex-col items-center justify-center p-2 text-center">
              <span class="text-4xl mb-1">🌍</span>
              <span class="text-xs text-gray-600">The iconic Web logo (1990)</span>
            </div>
          </div>
          <table class="w-full text-xs">
            <tbody>
              <tr class="border-b border-gray-200"><th class="text-left py-1 font-semibold text-gray-600">Original author</th><td class="py-1 text-blue-700">Tim Berners-Lee</td></tr>
              <tr class="border-b border-gray-200"><th class="text-left py-1 font-semibold text-gray-600">First launched</th><td class="py-1">August 6, 1991</td></tr>
              <tr class="border-b border-gray-200"><th class="text-left py-1 font-semibold text-gray-600">Core technologies</th><td class="py-1">HTML, HTTP, URI</td></tr>
              <tr><th class="text-left py-1 font-semibold text-gray-600">Governing body</th><td class="py-1 text-blue-700">W3C / WHATWG</td></tr>
            </tbody>
          </table>
        </div>

        <!-- Article Body -->
        <p class="text-base leading-relaxed text-gray-800 mb-4">
          The <strong>World Wide Web</strong> (<strong>WWW</strong> or simply <strong>the Web</strong>) is an information system where documents and other web resources are identified by Uniform Resource Locators (URLs), which may be interlinked by hyperlinks and accessible over the Internet.<sup class="text-blue-600 text-xs font-semibold">[1]</sup>
        </p>

        <p class="text-base leading-relaxed text-gray-800 mb-6">
          English scientist <a href="#" class="text-blue-600 hover:underline">Sir Tim Berners-Lee</a> invented the World Wide Web in 1989 while working at CERN in Geneva, Switzerland. The first Web browser and editor was written by him in late 1990 and released to general academic institutions in 1991.<sup class="text-blue-600 text-xs font-semibold">[2]</sup>
        </p>

        <!-- Table of Contents -->
        <div class="w-72 bg-gray-100 border border-gray-300 rounded p-3 mb-6">
          <h3 class="font-bold text-xs uppercase text-gray-700 mb-2">Contents</h3>
          <ul class="text-sm space-y-1 text-blue-600 list-decimal list-inside">
            <li><a href="#" class="hover:underline">History and Inception</a></li>
            <li><a href="#" class="hover:underline">Architecture and Standards</a></li>
            <li><a href="#" class="hover:underline">Security and Privacy</a></li>
            <li><a href="#" class="hover:underline">See also and References</a></li>
          </ul>
        </div>

        <h2 class="text-xl font-serif font-bold text-slate-900 border-b border-gray-300 pb-1 mb-3">History and Inception</h2>
        <p class="text-base leading-relaxed text-gray-800 mb-4">
          In March 1989, Tim Berners-Lee wrote a proposal that referenced ENQUIRE, a database and software system he had built in 1980. His vision was to facilitate information sharing among scientists worldwide by linking hypertext nodes together over packet networks.
        </p>

        <!-- Quote Block -->
        <blockquote class="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50/60 text-gray-700 italic text-sm">
          "Vague but exciting... There are few ways in which large amounts of information could be represented so simply."
          <cite class="block text-xs font-semibold text-gray-500 mt-1">— Mike Sendall, CERN supervisor</cite>
        </blockquote>

        <h2 class="text-xl font-serif font-bold text-slate-900 border-b border-gray-300 pb-1 mb-3">Architecture and Standards</h2>
        <p class="text-base leading-relaxed text-gray-800 mb-4">
          Modern web applications rely on a three-tier architecture comprising client presentation (HTML5, CSS, ECMAScript), application server logic, and structured database storage.
        </p>

        <div class="grid grid-cols-3 gap-3 my-4">
          <div class="p-3 bg-red-50 border border-red-200 rounded text-center">
            <span class="text-xl">📄</span>
            <h4 class="font-bold text-xs text-red-900 mt-1">HTML Structure</h4>
            <p class="text-xs text-gray-600">Semantic markup</p>
          </div>
          <div class="p-3 bg-blue-50 border border-blue-200 rounded text-center">
            <span class="text-xl">🎨</span>
            <h4 class="font-bold text-xs text-blue-900 mt-1">CSS Styling</h4>
            <p class="text-xs text-gray-600">Visual layout</p>
          </div>
          <div class="p-3 bg-amber-50 border border-amber-200 rounded text-center">
            <span class="text-xl">⚡</span>
            <h4 class="font-bold text-xs text-amber-900 mt-1">JS Interaction</h4>
            <p class="text-xs text-gray-600">Dynamic scripting</p>
          </div>
        </div>

        <!-- Reference Footer -->
        <footer class="mt-8 pt-4 border-t border-gray-300 text-xs text-gray-500">
          <p>Text is available under the Creative Commons Attribution-ShareAlike License 4.0; additional terms may apply.</p>
        </footer>
      </div>
    `,
  },

  hackernews: {
    id: 'hackernews',
    name: 'Hacker News Portal',
    nameZh: '极客新闻 (Hacker News)',
    urlDisplay: 'news.ycombinator.com',
    description: 'Clean high-density tech forum with ranked links, upvotes, and comments.',
    html: `
      <div class="hn-container max-w-4xl mx-auto bg-[#f6f6ef] text-[#222] font-sans min-h-screen shadow-md">
        <!-- Top Nav -->
        <header class="bg-[#ff6600] px-3 py-2 flex items-center justify-between text-black">
          <div class="flex items-center gap-2">
            <div class="w-5 h-5 border border-white bg-[#ff6600] font-bold text-white text-xs flex items-center justify-center font-mono">Y</div>
            <span class="font-bold text-sm tracking-tight">Hacker News</span>
            <nav class="hidden md:flex gap-2 text-xs ml-2 font-medium">
              <a href="#" class="hover:underline">new</a> |
              <a href="#" class="hover:underline">past</a> |
              <a href="#" class="hover:underline">comments</a> |
              <a href="#" class="hover:underline">ask</a> |
              <a href="#" class="hover:underline">show</a> |
              <a href="#" class="hover:underline">jobs</a> |
              <a href="#" class="hover:underline">submit</a>
            </nav>
          </div>
          <div class="text-xs">
            <a href="#" class="hover:underline font-medium">login</a>
          </div>
        </header>

        <!-- Ranked News List -->
        <main class="p-4 space-y-3">
          <!-- Story 1 -->
          <article class="flex items-start gap-2 text-sm">
            <span class="text-gray-400 font-mono w-5 text-right text-xs">1.</span>
            <button class="text-gray-400 hover:text-black mt-0.5 text-xs">▲</button>
            <div>
              <a href="#" class="text-black font-medium hover:underline text-sm leading-snug">
                Show HN: Destroy Any Website – Smash DOM elements into physics rubble
              </a>
              <span class="text-xs text-gray-500 ml-1">(destroyanywebsite.com)</span>
              <div class="text-xs text-gray-500 mt-0.5">
                542 points by <a href="#" class="hover:underline">retrohacker</a> 3 hours ago | <a href="#" class="hover:underline">189 comments</a>
              </div>
            </div>
          </article>

          <!-- Story 2 -->
          <article class="flex items-start gap-2 text-sm">
            <span class="text-gray-400 font-mono w-5 text-right text-xs">2.</span>
            <button class="text-gray-400 hover:text-black mt-0.5 text-xs">▲</button>
            <div>
              <a href="#" class="text-black font-medium hover:underline text-sm leading-snug">
                Why SQLite is our favorite database for modern edge computing
              </a>
              <span class="text-xs text-gray-500 ml-1">(sqlite.org)</span>
              <div class="text-xs text-gray-500 mt-0.5">
                318 points by <a href="#" class="hover:underline">drh</a> 5 hours ago | <a href="#" class="hover:underline">94 comments</a>
              </div>
            </div>
          </article>

          <!-- Story 3 -->
          <article class="flex items-start gap-2 text-sm">
            <span class="text-gray-400 font-mono w-5 text-right text-xs">3.</span>
            <button class="text-gray-400 hover:text-black mt-0.5 text-xs">▲</button>
            <div>
              <a href="#" class="text-black font-medium hover:underline text-sm leading-snug">
                WebGPU is now supported in all major evergreen browsers
              </a>
              <span class="text-xs text-gray-500 ml-1">(w3.org)</span>
              <div class="text-xs text-gray-500 mt-0.5">
                274 points by <a href="#" class="hover:underline">graphicsnerd</a> 6 hours ago | <a href="#" class="hover:underline">72 comments</a>
              </div>
            </div>
          </article>

          <!-- Story 4 -->
          <article class="flex items-start gap-2 text-sm">
            <span class="text-gray-400 font-mono w-5 text-right text-xs">4.</span>
            <button class="text-gray-400 hover:text-black mt-0.5 text-xs">▲</button>
            <div>
              <a href="#" class="text-black font-medium hover:underline text-sm leading-snug">
                The lost art of fast desktop applications
              </a>
              <span class="text-xs text-gray-500 ml-1">(caseymuratori.com)</span>
              <div class="text-xs text-gray-500 mt-0.5">
                420 points by <a href="#" class="hover:underline">cmuratori</a> 8 hours ago | <a href="#" class="hover:underline">215 comments</a>
              </div>
            </div>
          </article>

          <!-- Story 5 -->
          <article class="flex items-start gap-2 text-sm">
            <span class="text-gray-400 font-mono w-5 text-right text-xs">5.</span>
            <button class="text-gray-400 hover:text-black mt-0.5 text-xs">▲</button>
            <div>
              <a href="#" class="text-black font-medium hover:underline text-sm leading-snug">
                How we built a 60FPS physics simulator in pure TypeScript canvas
              </a>
              <span class="text-xs text-gray-500 ml-1">(github.com/arcade)</span>
              <div class="text-xs text-gray-500 mt-0.5">
                195 points by <a href="#" class="hover:underline">canvascoder</a> 9 hours ago | <a href="#" class="hover:underline">45 comments</a>
              </div>
            </div>
          </article>

          <!-- More Button -->
          <div class="pt-4 pl-7">
            <button class="px-3 py-1 bg-gray-200 text-xs font-semibold rounded hover:bg-gray-300">More Stories...</button>
          </div>
        </main>

        <!-- Footer -->
        <footer class="border-t-2 border-[#ff6600] mt-8 p-6 text-center text-xs text-gray-500 space-y-2">
          <p>Guidelines | FAQ | Lists | API | Security | Legal | Apply to YC | Contact</p>
          <div class="flex justify-center items-center gap-2 pt-2">
            <span>Search:</span>
            <input type="text" class="px-2 py-0.5 border border-gray-400 bg-white text-xs w-48" placeholder="search hn..." />
          </div>
        </footer>
      </div>
    `,
  },

  cybershop: {
    id: 'cybershop',
    name: 'CyberShop Mega Store',
    nameZh: '赛博数码商城 (CyberShop)',
    urlDisplay: 'cybershop.io/products',
    description: 'E-commerce storefront packed with product cards, badges, prices, and CTA buttons.',
    html: `
      <div class="shop-container max-w-5xl mx-auto bg-slate-900 text-slate-100 font-sans p-6 rounded-lg min-h-screen">
        <!-- Shop Header -->
        <header class="flex justify-between items-center pb-6 border-b border-slate-800">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-gradient-to-tr from-pink-500 to-violet-600 flex items-center justify-center font-bold text-white shadow-lg shadow-pink-500/30">⚡</div>
            <div>
              <h1 class="text-xl font-bold tracking-tight text-white">CYBER<span class="text-pink-500">SHOP</span></h1>
              <p class="text-xs text-slate-400">Next-Gen Quantum Hardware</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <button class="px-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded hover:bg-slate-700">Wishlist (2)</button>
            <button class="px-4 py-1.5 text-xs bg-pink-600 font-semibold rounded text-white hover:bg-pink-500 shadow-md shadow-pink-600/40 flex items-center gap-1.5">
              <span>🛒</span> Cart (3)
            </button>
          </div>
        </header>

        <!-- Promo Banner -->
        <div class="my-6 p-4 rounded-xl bg-gradient-to-r from-pink-900/50 via-purple-900/40 to-slate-800 border border-pink-500/30 flex justify-between items-center">
          <div>
            <span class="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-pink-500 text-white rounded mb-1">Flash Sale</span>
            <h2 class="text-lg font-bold text-white">Cyber Monday: Up to 50% Off Mech-Gear</h2>
            <p class="text-xs text-slate-300">Upgrade your neural link setup before midnight.</p>
          </div>
          <button class="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold text-xs rounded-lg hover:brightness-110 shadow-lg">Claim Coupon</button>
        </div>

        <!-- Products Grid -->
        <h3 class="text-base font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <span>🔥</span> Trending Tech Assets
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Card 1 -->
          <div class="card p-4 bg-slate-800/80 border border-slate-700/80 rounded-xl hover:border-pink-500/50 transition">
            <div class="h-32 bg-slate-900 rounded-lg flex items-center justify-center text-4xl mb-3 border border-slate-800 relative">
              🎧
              <span class="absolute top-2 right-2 px-1.5 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded font-semibold">IN STOCK</span>
            </div>
            <h4 class="font-bold text-sm text-white">Quantum Haptic Headset</h4>
            <p class="text-xs text-slate-400 mt-1 line-clamp-2">Direct acoustic transmission with ultra-low latency spatial tracking.</p>
            <div class="flex justify-between items-center mt-4">
              <span class="text-lg font-bold text-pink-400">$349.00</span>
              <button class="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-xs font-semibold rounded text-white">Add to Cart</button>
            </div>
          </div>

          <!-- Card 2 -->
          <div class="card p-4 bg-slate-800/80 border border-slate-700/80 rounded-xl hover:border-pink-500/50 transition">
            <div class="h-32 bg-slate-900 rounded-lg flex items-center justify-center text-4xl mb-3 border border-slate-800 relative">
              ⌨️
              <span class="absolute top-2 right-2 px-1.5 py-0.5 text-[10px] bg-pink-500/20 text-pink-400 border border-pink-500/30 rounded font-semibold">-25% OFF</span>
            </div>
            <h4 class="font-bold text-sm text-white">Neon Cyber Mechanical Deck</h4>
            <p class="text-xs text-slate-400 mt-1 line-clamp-2">Per-key RGB lighting with magnetic levitation hall effect switches.</p>
            <div class="flex justify-between items-center mt-4">
              <div>
                <span class="text-lg font-bold text-pink-400">$189.00</span>
                <span class="text-xs text-slate-500 line-through ml-1">$250</span>
              </div>
              <button class="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-xs font-semibold rounded text-white">Add to Cart</button>
            </div>
          </div>

          <!-- Card 3 -->
          <div class="card p-4 bg-slate-800/80 border border-slate-700/80 rounded-xl hover:border-pink-500/50 transition">
            <div class="h-32 bg-slate-900 rounded-lg flex items-center justify-center text-4xl mb-3 border border-slate-800 relative">
              🕹️
              <span class="absolute top-2 right-2 px-1.5 py-0.5 text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded font-semibold">POPULAR</span>
            </div>
            <h4 class="font-bold text-sm text-white">Zero-G Arcade Joystick</h4>
            <p class="text-xs text-slate-400 mt-1 line-clamp-2">Tournament-grade SANWA microswitches for precision aerial dogfights.</p>
            <div class="flex justify-between items-center mt-4">
              <span class="text-lg font-bold text-pink-400">$129.00</span>
              <button class="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-xs font-semibold rounded text-white">Add to Cart</button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <footer class="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
          <p>© 2026 CyberShop Global Ltd. Free shipping to Sector 7 & Neo-Tokyo.</p>
        </footer>
      </div>
    `,
  },

  devblog: {
    id: 'devblog',
    name: 'Developer Portfolio & Docs',
    nameZh: '开发人员文档与博客 (DevBlog)',
    urlDisplay: 'alex-engineer.dev',
    description: 'Tech portfolio with badges, code blocks, cards, and author bio.',
    html: `
      <div class="dev-container max-w-4xl mx-auto bg-slate-950 text-slate-100 font-sans p-8 rounded-lg min-h-screen border border-slate-800">
        <!-- Hero section -->
        <header class="flex flex-col md:flex-row items-center gap-6 pb-8 border-b border-slate-800">
          <div class="w-24 h-24 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-4xl shadow-xl shadow-cyan-500/20">
            👨‍💻
          </div>
          <div>
            <div class="flex items-center gap-2 mb-1">
              <h1 class="text-2xl font-bold text-white">Alex Chen</h1>
              <span class="px-2 py-0.5 text-xs bg-cyan-950 border border-cyan-700/60 text-cyan-300 rounded-full font-mono">Senior Engineer</span>
            </div>
            <p class="text-sm text-slate-400 leading-relaxed">
              Building interactive physics engines, high-performance web graphics, and developer tooling. Obsessed with 60FPS UI and zero bundle overhead.
            </p>
            <div class="flex flex-wrap gap-2 mt-3">
              <span class="px-2.5 py-1 text-xs bg-slate-800 border border-slate-700 rounded text-slate-300 font-mono">TypeScript</span>
              <span class="px-2.5 py-1 text-xs bg-slate-800 border border-slate-700 rounded text-slate-300 font-mono">React 19</span>
              <span class="px-2.5 py-1 text-xs bg-slate-800 border border-slate-700 rounded text-slate-300 font-mono">WebGL / Canvas</span>
              <span class="px-2.5 py-1 text-xs bg-slate-800 border border-slate-700 rounded text-slate-300 font-mono">Tailwind</span>
            </div>
          </div>
        </header>

        <!-- Recent Article -->
        <main class="mt-8 space-y-6">
          <article class="p-6 bg-slate-900/70 border border-slate-800 rounded-xl space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-xs text-cyan-400 font-mono">ARTICLE #42</span>
              <span class="text-xs text-slate-500">October 14, 2026 · 6 min read</span>
            </div>
            <h2 class="text-xl font-bold text-white hover:text-cyan-400 transition cursor-pointer">
              Disintegrating the DOM: How to Smash HTML Elements with Physics
            </h2>
            <p class="text-sm text-slate-300 leading-relaxed">
              When building destruction sandboxes, you cannot merely remove an element from the page. You must slice its bounding rectangle, extract its background color or text glyphs, and spawn physics particles with decay vectors.
            </p>

            <!-- Code snippet -->
            <div class="p-4 bg-slate-950 border border-slate-800 rounded-lg font-mono text-xs text-emerald-400 overflow-x-auto">
              <pre><code>// Spawn particles from DOM bounding rect
function shatterElement(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  for (let i = 0; i < 20; i++) {
    spawnParticle(rect.left + Math.random() * rect.width, rect.top);
  }
}</code></pre>
            </div>

            <div class="flex gap-3 pt-2">
              <button class="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded transition">Read Full Article</button>
              <button class="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded border border-slate-700">Source Code</button>
            </div>
          </article>
        </main>
      </div>
    `,
  },

  htmlsandbox: {
    id: 'htmlsandbox',
    name: 'DOM Element Training Arena',
    nameZh: '网页元素实战演练场 (DOM Training)',
    urlDisplay: 'dom-element-lab.local/practice',
    description: 'Specifically engineered for testing every HTML element: buttons, inputs, tables, cards, dialogs.',
    html: `
      <div class="practice-container max-w-4xl mx-auto bg-slate-900 text-slate-100 font-sans p-6 rounded-xl border border-slate-800 min-h-screen">
        <header class="pb-4 border-b border-slate-800 mb-6 flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-amber-400 font-mono">DOM Practice Lab</h1>
            <p class="text-xs text-slate-400">Practice DOM traversal, CSS selectors, text editing, and destruction!</p>
          </div>
          <span class="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded text-xs font-mono font-bold">MODE: TRAINING</span>
        </header>

        <!-- Section 1: Buttons of different styles -->
        <section class="mb-6 p-4 bg-slate-800/60 border border-slate-700/60 rounded-lg">
          <h2 class="text-sm font-bold text-white mb-3 uppercase tracking-wider text-slate-300">Target Area 1: Button Variety</h2>
          <div class="flex flex-wrap gap-3">
            <button class="btn-primary px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded shadow">Primary Button</button>
            <button class="btn-success px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded shadow">Success Action</button>
            <button class="btn-danger px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded shadow">Danger Destroy</button>
            <button class="btn-warning px-4 py-2 bg-amber-600 hover:bg-amber-500 text-black text-xs font-bold rounded shadow">Warning Yellow</button>
            <button class="btn-outline px-4 py-2 border-2 border-purple-500 text-purple-400 hover:bg-purple-500/20 text-xs font-bold rounded">Purple Outline</button>
          </div>
        </section>

        <!-- Section 2: Form controls -->
        <section class="mb-6 p-4 bg-slate-800/60 border border-slate-700/60 rounded-lg">
          <h2 class="text-sm font-bold text-white mb-3 uppercase tracking-wider text-slate-300">Target Area 2: Interactive Form Elements</h2>
          <form class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs text-slate-300 font-medium mb-1">User Name</label>
              <input type="text" value="Agent_007" class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-xs text-white" />
            </div>
            <div>
              <label class="block text-xs text-slate-300 font-medium mb-1">Target Element Selector</label>
              <select class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-xs text-white">
                <option>div.card</option>
                <option>button.btn-danger</option>
                <option>input[type="text"]</option>
                <option>table tr:nth-child(2)</option>
              </select>
            </div>
            <div class="flex items-center gap-4 col-span-2 pt-2">
              <label class="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input type="checkbox" checked class="rounded border-slate-700" /> Enable Ragdoll Physics
              </label>
              <label class="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input type="checkbox" checked class="rounded border-slate-700" /> Shake Screen on Hit
              </label>
            </div>
          </form>
        </section>

        <!-- Section 3: Data Table -->
        <section class="mb-6 p-4 bg-slate-800/60 border border-slate-700/60 rounded-lg">
          <h2 class="text-sm font-bold text-white mb-3 uppercase tracking-wider text-slate-300">Target Area 3: Data Table Matrix</h2>
          <div class="overflow-x-auto">
            <table class="w-full text-xs text-left text-slate-300 border border-slate-700 rounded">
              <thead class="bg-slate-950 text-slate-400 uppercase font-mono">
                <tr>
                  <th class="p-2 border-b border-slate-700">Element Tag</th>
                  <th class="p-2 border-b border-slate-700">Base Health</th>
                  <th class="p-2 border-b border-slate-700">Explosion Radius</th>
                  <th class="p-2 border-b border-slate-700">Debris Count</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-700/50">
                <tr class="hover:bg-slate-700/30">
                  <td class="p-2 font-mono text-cyan-400">&lt;h1&gt; Heading</td>
                  <td class="p-2">250 HP</td>
                  <td class="p-2">Large</td>
                  <td class="p-2">35 fragments</td>
                </tr>
                <tr class="hover:bg-slate-700/30">
                  <td class="p-2 font-mono text-emerald-400">&lt;button&gt; Action</td>
                  <td class="p-2">120 HP</td>
                  <td class="p-2">Medium</td>
                  <td class="p-2">18 fragments</td>
                </tr>
                <tr class="hover:bg-slate-700/30">
                  <td class="p-2 font-mono text-amber-400">&lt;p&gt; Paragraph</td>
                  <td class="p-2">80 HP</td>
                  <td class="p-2">Small</td>
                  <td class="p-2">12 fragments</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Section 4: Banner -->
        <div class="ad-banner p-4 bg-gradient-to-r from-purple-900 to-indigo-900 border border-purple-500/50 rounded-xl flex items-center justify-between">
          <div>
            <span class="text-xs font-bold text-pink-400 uppercase tracking-widest">Sponsored Container (.ad-banner)</span>
            <h3 class="text-base font-bold text-white">Eliminate This Ad Container for 500 XP!</h3>
          </div>
          <button class="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded">Dismiss Ad</button>
        </div>
      </div>
    `,
  },
};
