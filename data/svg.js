// 物とアイテムの絵(SVG)をまとめたファイル。
// 絵文字は OS によって見た目が変わる(古い環境では表示されないこともある)ため、絵は SVG で描く。
// ここでは絵を定数として用意するだけで、どこに置くかは data/room1.js・data/room2.js・data/items.js で決める。

// ---------- 1部屋目: 正面・右の面 ----------

// 壁時計。6時15分で止まっている。
// 長針は3の方向(真右)、短針は6と7の間(6時15分なので6から少し進んだ位置)を指す。
// 数字は 12・3・6・9 だけを大きく書き、ほかの時刻は点(目盛り)で表す。
const CLOCK_SVG = `
<svg viewBox="0 0 100 100" aria-hidden="true">
  <circle cx="50" cy="50" r="47" fill="#fdfaf3" stroke="#5e3f22" stroke-width="5"/>
  <g font-size="17" font-weight="bold" text-anchor="middle" dominant-baseline="central" fill="#333">
    <text x="50" y="17">12</text><text x="83" y="50">3</text>
    <text x="50" y="83">6</text><text x="17" y="50">9</text>
  </g>
  <g fill="#666">
    <circle cx="68.5" cy="18.0" r="2.5"/><circle cx="82.0" cy="31.5" r="2.5"/>
    <circle cx="82.0" cy="68.5" r="2.5"/><circle cx="68.5" cy="82.0" r="2.5"/>
    <circle cx="31.5" cy="82.0" r="2.5"/><circle cx="18.0" cy="68.5" r="2.5"/>
    <circle cx="18.0" cy="31.5" r="2.5"/><circle cx="31.5" cy="18.0" r="2.5"/>
  </g>
  <line x1="50" y1="50" x2="46.9" y2="73.8" stroke="#222" stroke-width="5" stroke-linecap="round"/>
  <line x1="50" y1="50" x2="73" y2="50" stroke="#222" stroke-width="3" stroke-linecap="round"/>
  <circle cx="50" cy="50" r="3" fill="#222"/>
</svg>`;

// 壁の絵。金色の額に、山と朝日の風景画(金庫の答えが午前の時刻だと分かる手がかり)。
// 朝日は右の山の稜線から半分のぼった位置に、橙色で描く(山より先に描いて、下半分を山で隠す)。
// 絵だけでは朝日か夕日か区別できないため、調べたときの文章で「朝日」と示す
const PAINTING_SVG = `
<svg viewBox="0 0 100 80" aria-hidden="true">
  <rect x="3" y="3" width="94" height="74" fill="#c9a23a" stroke="#7a5a1a" stroke-width="4"/>
  <rect x="13" y="13" width="74" height="54" fill="#bfe0f0"/>
  <rect x="13" y="40" width="74" height="27" fill="#f8d9b0"/>
  <circle cx="80" cy="50" r="10" fill="#f39a3c"/>
  <path d="M13 67 L38 34 L56 56 L68 44 L87 67 Z" fill="#6f9a5a"/>
</svg>`;

// 観葉植物。素焼きの鉢から葉が5枚のびている。
const PLANT_SVG = `
<svg viewBox="0 0 100 126" aria-hidden="true">
  <g fill="#3f8a4a">
    <ellipse cx="50" cy="40" rx="10" ry="34"/>
    <ellipse cx="22" cy="64" rx="7" ry="18" transform="rotate(-60 22 64)"/>
    <ellipse cx="78" cy="64" rx="7" ry="18" transform="rotate(60 78 64)"/>
  </g>
  <g fill="#52a05a">
    <ellipse cx="33" cy="50" rx="9" ry="27" transform="rotate(-35 33 50)"/>
    <ellipse cx="67" cy="50" rx="9" ry="27" transform="rotate(35 67 50)"/>
  </g>
  <path d="M24 82 L76 82 L69 124 L31 124 Z" fill="#b5653a"/>
  <rect x="18" y="74" width="64" height="11" rx="2" fill="#9c5430"/>
</svg>`;

// 壁に埋め込まれた小さな金庫。4桁の数字の表示窓と取っ手がある(時刻だと分からないよう、コロンは描かない)。
// 絵を外した後、絵と同じ場所・同じ大きさで表示する
const SAFE_SVG = `
<svg viewBox="0 0 100 80" aria-hidden="true">
  <rect x="3" y="3" width="94" height="74" rx="3" fill="#6f757b" stroke="#454a4f" stroke-width="4"/>
  <rect x="13" y="12" width="74" height="56" rx="2" fill="#9aa1a8" stroke="#5c6268" stroke-width="2"/>
  <rect x="24" y="22" width="40" height="18" rx="2" fill="#1e2a22"/>
  <text x="44" y="31" font-size="13" font-family="monospace" fill="#7fe39a" text-anchor="middle" dominant-baseline="central">----</text>
  <rect x="66" y="46" width="14" height="6" rx="2" fill="#454a4f"/>
  <circle cx="22" cy="58" r="2.5" fill="#5c6268"/><circle cx="78" cy="20" r="2.5" fill="#5c6268"/>
</svg>`;

// 開いた金庫。扉が左へ開き、中は空っぽ(金庫を開けた後、閉じた金庫と同じ場所に表示する)
const SAFE_OPEN_SVG = `
<svg viewBox="0 0 100 80" aria-hidden="true">
  <rect x="3" y="3" width="94" height="74" rx="3" fill="#6f757b" stroke="#454a4f" stroke-width="4"/>
  <rect x="13" y="12" width="74" height="56" rx="2" fill="#24282b"/>
  <rect x="13" y="56" width="74" height="12" fill="#33383c"/>
  <path d="M13 12 L3 6 L3 74 L13 68 Z" fill="#9aa1a8" stroke="#5c6268" stroke-width="2"/>
</svg>`;

// ---------- 1部屋目: 背面・左の面 ----------

// 閉じたクローゼット。両開きの扉で、右の扉の取っ手の下に小さな鍵穴がある。
// 鍵穴は、板(closetBoard)を外すまで板に隠れて見えない
const CLOSET_CLOSED_SVG = `
<svg viewBox="0 0 100 128" aria-hidden="true">
  <rect x="2" y="2" width="96" height="124" fill="#8a6340" stroke="#5e3f22" stroke-width="4"/>
  <rect x="8" y="8" width="41" height="118" fill="#c9a77c"/>
  <rect x="51" y="8" width="41" height="118" fill="#c9a77c"/>
  <g fill="none" stroke="#a8865c" stroke-width="2">
    <rect x="14" y="16" width="29" height="46"/><rect x="14" y="70" width="29" height="48"/>
    <rect x="57" y="16" width="29" height="46"/><rect x="57" y="70" width="29" height="48"/>
  </g>
  <g fill="#5e3f22">
    <rect x="42" y="58" width="3" height="14" rx="1.5"/><rect x="55" y="58" width="3" height="14" rx="1.5"/>
    <circle cx="56.5" cy="78" r="1.6"/><rect x="56" y="78" width="1" height="3"/>
  </g>
</svg>`;

// 開いたクローゼット。中に服が3着掛かっている(懐中電灯は別の物として手前に重ねる)
const CLOSET_OPEN_SVG = `
<svg viewBox="0 0 100 128" aria-hidden="true">
  <rect x="2" y="2" width="96" height="124" fill="#8a6340" stroke="#5e3f22" stroke-width="4"/>
  <rect x="8" y="8" width="84" height="118" fill="#3b2f25"/>
  <line x1="12" y1="22" x2="88" y2="22" stroke="#b0b0b0" stroke-width="3"/>
  <g fill="none" stroke="#cfcfcf" stroke-width="1.5">
    <path d="M30 22 L21 30 L39 30 Z"/><path d="M55 22 L47 30 L63 30 Z"/><path d="M78 22 L70 30 L86 30 Z"/>
  </g>
  <path d="M21 30 L39 30 L42 96 L18 96 Z" fill="#6b7f99"/>
  <path d="M47 30 L63 30 L65 72 L45 72 Z" fill="#c8d4c0"/>
  <path d="M70 30 L86 30 L90 104 L66 104 Z" fill="#a05252"/>
</svg>`;

// 懐中電灯(クローゼットの床に置いてある)。横向きで、右が光る側
const FLASHLIGHT_SVG = `
<svg viewBox="0 0 100 44" aria-hidden="true">
  <rect x="4" y="13" width="60" height="18" rx="4" fill="#3a5fa8"/>
  <rect x="24" y="8" width="10" height="6" fill="#ddd"/>
  <path d="M64 8 L90 2 L90 42 L64 36 Z" fill="#2c4a85"/>
  <rect x="88" y="4" width="7" height="36" fill="#fff3b0"/>
</svg>`;

// 窓。白い窓枠の向こうに、隣の建物の灰色の壁が迫っている(はめ殺しで開かない)
const WINDOW_SVG = `
<svg viewBox="0 0 100 80" aria-hidden="true">
  <rect x="3" y="3" width="94" height="74" fill="#f4f1ea" stroke="#9c958a" stroke-width="3"/>
  <rect x="11" y="11" width="78" height="58" fill="#8e9296"/>
  <g stroke="#7b7f83" stroke-width="1.5">
    <line x1="11" y1="25" x2="89" y2="25"/><line x1="11" y1="40" x2="89" y2="40"/><line x1="11" y1="55" x2="89" y2="55"/>
  </g>
  <rect x="47" y="11" width="6" height="58" fill="#f4f1ea"/>
  <path d="M14 14 L30 14 L14 30 Z" fill="#ffffff" opacity="0.35"/>
</svg>`;

// ゴミ箱。下がすぼまった筒形で、縁に黒い帯がある
const TRASH_SVG = `
<svg viewBox="0 0 100 120" aria-hidden="true">
  <path d="M10 14 L90 14 L80 116 L20 116 Z" fill="#9aa7b0" stroke="#5f6b73" stroke-width="3"/>
  <rect x="6" y="6" width="88" height="12" rx="3" fill="#4a5258"/>
  <g stroke="#7f8c95" stroke-width="3">
    <line x1="34" y1="28" x2="37" y2="106"/><line x1="50" y1="28" x2="50" y2="106"/><line x1="66" y1="28" x2="63" y2="106"/>
  </g>
</svg>`;

// ベッド(横から見た形)。左に頭板、下にすき間があり、奥は暗い
const BED_SVG = `
<svg viewBox="0 0 100 52" aria-hidden="true">
  <rect x="10" y="38" width="82" height="10" fill="#2a211a"/>
  <rect x="2" y="2" width="9" height="48" rx="2" fill="#7a5532"/>
  <rect x="88" y="34" width="6" height="16" fill="#7a5532"/>
  <rect x="2" y="28" width="96" height="11" fill="#8a6340"/>
  <rect x="10" y="17" width="88" height="12" rx="3" fill="#f4efe6"/>
  <rect x="13" y="10" width="22" height="9" rx="4" fill="#ffffff"/>
  <rect x="40" y="14" width="58" height="16" rx="3" fill="#6d8fb8"/>
</svg>`;

// ---------- 2部屋目: 台所(版20) ----------

// ダイニングテーブル(横から見た形)。天板と2本の脚。上の物(空き箱など)は別の物として手前に重ねる
const TABLE_SVG = `
<svg viewBox="0 0 100 50" aria-hidden="true">
  <rect x="2" y="2" width="96" height="7" rx="2" fill="#a0703f" stroke="#6e4a26" stroke-width="2"/>
  <rect x="8" y="9" width="6" height="40" fill="#7d5530"/>
  <rect x="86" y="9" width="6" height="40" fill="#7d5530"/>
  <rect x="14" y="9" width="72" height="4" fill="#8a5f35"/>
</svg>`;

// 冷凍グラタンの空き箱(テーブルの上)。横長の赤い箱に、グラタン皿の絵
const GRATIN_BOX_SVG = `
<svg viewBox="0 0 100 60" aria-hidden="true">
  <rect x="2" y="8" width="96" height="50" rx="2" fill="#c8453a" stroke="#8e2c24" stroke-width="3"/>
  <rect x="2" y="2" width="96" height="10" rx="2" fill="#e06a5c" stroke="#8e2c24" stroke-width="3"/>
  <ellipse cx="50" cy="36" rx="30" ry="12" fill="#f6efe0"/>
  <ellipse cx="50" cy="34" rx="24" ry="8" fill="#e9b14f"/>
</svg>`;

// 食器棚(左の面)。上がガラス戸(中にコップと皿が見える)、下が木の扉。
// 右のガラス戸に、色のボタンが5つ並んだ錠(赤・青・黄・緑・白)がついている
const CUPBOARD_SVG = `
<svg viewBox="0 0 100 160" aria-hidden="true">
  <rect x="2" y="2" width="96" height="156" fill="#8a6340" stroke="#5e3f22" stroke-width="3"/>
  <rect x="8" y="8" width="41" height="86" fill="#c9dde3" stroke="#5e3f22" stroke-width="2"/>
  <rect x="51" y="8" width="41" height="86" fill="#c9dde3" stroke="#5e3f22" stroke-width="2"/>
  <g stroke="#9fb6bd" stroke-width="2"><line x1="8" y1="38" x2="92" y2="38"/><line x1="8" y1="66" x2="92" y2="66"/></g>
  <g fill="#e8eef0" stroke="#8fa5ac" stroke-width="1">
    <rect x="14" y="24" width="8" height="13"/><rect x="26" y="24" width="8" height="13"/>
    <rect x="58" y="24" width="8" height="13"/><ellipse cx="22" cy="62" rx="10" ry="3"/><ellipse cx="72" cy="62" rx="10" ry="3"/>
  </g>
  <path d="M10 10 L22 10 L10 30 Z" fill="#ffffff" opacity="0.45"/>
  <rect x="58" y="72" width="30" height="12" rx="2" fill="#4a3a26"/>
  <circle cx="62" cy="78" r="2.2" fill="#d2463c"/><circle cx="67.5" cy="78" r="2.2" fill="#3b6fc4"/>
  <circle cx="73" cy="78" r="2.2" fill="#e8c43a"/><circle cx="78.5" cy="78" r="2.2" fill="#4f9a5a"/>
  <circle cx="84" cy="78" r="2.2" fill="#f7f5ef"/>
  <rect x="8" y="100" width="41" height="54" fill="#a07a50" stroke="#5e3f22" stroke-width="2"/>
  <rect x="51" y="100" width="41" height="54" fill="#a07a50" stroke="#5e3f22" stroke-width="2"/>
  <g fill="#5e3f22"><rect x="42" y="118" width="3" height="12" rx="1.5"/><rect x="55" y="118" width="3" height="12" rx="1.5"/></g>
</svg>`;

// 開いた食器棚。ガラス戸が左右に開き、中の棚が見える(鍵は取った後なので描かない)
const CUPBOARD_OPEN_SVG = `
<svg viewBox="0 0 100 160" aria-hidden="true">
  <rect x="2" y="2" width="96" height="156" fill="#8a6340" stroke="#5e3f22" stroke-width="3"/>
  <rect x="8" y="8" width="84" height="86" fill="#4a3a2a"/>
  <g stroke="#7a5532" stroke-width="3"><line x1="8" y1="38" x2="92" y2="38"/><line x1="8" y1="66" x2="92" y2="66"/></g>
  <g fill="#e8eef0" stroke="#8fa5ac" stroke-width="1">
    <rect x="22" y="24" width="8" height="13"/><rect x="34" y="24" width="8" height="13"/>
    <ellipse cx="34" cy="62" rx="10" ry="3"/><ellipse cx="66" cy="62" rx="10" ry="3"/>
  </g>
  <path d="M8 8 L2 4 L2 98 L8 94 Z" fill="#c9dde3" stroke="#5e3f22" stroke-width="1.5"/>
  <path d="M92 8 L98 4 L98 98 L92 94 Z" fill="#c9dde3" stroke="#5e3f22" stroke-width="1.5"/>
  <rect x="8" y="100" width="41" height="54" fill="#a07a50" stroke="#5e3f22" stroke-width="2"/>
  <rect x="51" y="100" width="41" height="54" fill="#a07a50" stroke="#5e3f22" stroke-width="2"/>
  <g fill="#5e3f22"><rect x="42" y="118" width="3" height="12" rx="1.5"/><rect x="55" y="118" width="3" height="12" rx="1.5"/></g>
</svg>`;

// 靴箱(右の面)。腰くらいの高さの白っぽい箱で、両開きの扉に細い横線(通気の溝)がある
const SHOE_BOX_SVG = `
<svg viewBox="0 0 100 110" aria-hidden="true">
  <rect x="2" y="2" width="96" height="10" rx="2" fill="#bfa47e" stroke="#7d6544" stroke-width="2"/>
  <rect x="4" y="12" width="92" height="96" fill="#ece5d8" stroke="#9c8f7a" stroke-width="2"/>
  <line x1="50" y1="12" x2="50" y2="108" stroke="#9c8f7a" stroke-width="2"/>
  <g stroke="#cfc5b4" stroke-width="2">
    <line x1="12" y1="30" x2="42" y2="30"/><line x1="12" y1="38" x2="42" y2="38"/><line x1="12" y1="46" x2="42" y2="46"/>
    <line x1="58" y1="30" x2="88" y2="30"/><line x1="58" y1="38" x2="88" y2="38"/><line x1="58" y1="46" x2="88" y2="46"/>
  </g>
  <g fill="#8a7d68"><rect x="43" y="62" width="3" height="12" rx="1.5"/><rect x="54" y="62" width="3" height="12" rx="1.5"/></g>
</svg>`;

// 冷蔵庫(背面)。上が冷蔵室の扉、下が冷凍室の引き出し。
// 冷凍室は、この絵に重ねた透明な別の物(freezer)として調べられるようにする
const FRIDGE_SVG = `
<svg viewBox="0 0 100 200" aria-hidden="true">
  <rect x="2" y="2" width="96" height="196" rx="6" fill="#e3e7ea" stroke="#9aa3ab" stroke-width="3"/>
  <rect x="6" y="6" width="88" height="118" rx="3" fill="#f4f6f8" stroke="#b5bcc3" stroke-width="2"/>
  <rect x="6" y="130" width="88" height="64" rx="3" fill="#f4f6f8" stroke="#b5bcc3" stroke-width="2"/>
  <rect x="80" y="54" width="5" height="44" rx="2" fill="#9aa3ab"/>
  <rect x="30" y="138" width="40" height="5" rx="2" fill="#9aa3ab"/>
</svg>`;

// 流し台(背面)。上に蛇口、天板に流し(シンク)、下に両開きの戸棚。
// 戸棚(謎8)は、この絵の下の部分に重ねた透明な別の物(sinkCabinet)として調べる。右の扉に古そうな鍵穴がある
const SINK_SVG = `
<svg viewBox="0 0 100 80" aria-hidden="true">
  <rect x="60" y="4" width="4" height="19" fill="#a9b2bb"/>
  <rect x="44" y="4" width="20" height="4" rx="2" fill="#a9b2bb"/>
  <rect x="44" y="4" width="4" height="8" fill="#a9b2bb"/>
  <rect x="0" y="22" width="100" height="8" fill="#c9ccce" stroke="#8f9497" stroke-width="1.5"/>
  <rect x="28" y="22" width="44" height="4" fill="#8f9497"/>
  <rect x="2" y="30" width="96" height="48" fill="#d8c3a0" stroke="#8a6f4a" stroke-width="2"/>
  <line x1="50" y1="30" x2="50" y2="78" stroke="#8a6f4a" stroke-width="2"/>
  <rect x="44" y="40" width="3" height="12" rx="1.5" fill="#8a6f4a"/>
  <rect x="53" y="40" width="3" height="12" rx="1.5" fill="#8a6f4a"/>
  <circle cx="62" cy="57" r="2" fill="#4a3a26"/><path d="M61 57 L63 57 L63.6 62 L60.4 62 Z" fill="#4a3a26"/>
</svg>`;

// 開いた流しの下の戸棚(謎8を解いた後、閉じた戸棚の部分に重ねて表示する)。
// 扉は左右に開き、中に色の違う皿が4枚重ねてある(謎9の手がかり)。皿の並びは新しく始めるたびにランダムに決まる。
// 皿は少し上から見た形で描く: 1枚ごとに「厚みの楕円(濃い色)」の上に「皿の楕円」を重ね、下の皿から順に描く。
// 下の皿は上の皿に隠れて縁だけが見え、一番上の皿だけ内側のくぼみ(明るい楕円)まで見える
function plateSvg(cy, color, edge) {
  return `
  <ellipse cx="50" cy="${cy + 2.5}" rx="28" ry="7" fill="${edge}"/>
  <ellipse cx="50" cy="${cy}" rx="28" ry="7" fill="${color}" stroke="${edge}" stroke-width="1"/>`;
}

// 皿の色(色の ID は色の錠の LOCK_COLORS と同じ)。face: 皿の色、edge: 縁(厚み)の色、well: 一番上の皿のくぼみの色
const PLATE_PAINT = {
  red: { face: '#d2463c', edge: '#8e2c24', well: '#e2685e' },
  blue: { face: '#3b6fc4', edge: '#24467e', well: '#5d8ad6' },
  yellow: { face: '#e8c43a', edge: '#a8861c', well: '#f2d86e' },
  green: { face: '#4f9a5a', edge: '#2f6338', well: '#6fb57a' },
  white: { face: '#f7f5ef', edge: '#a8a49a', well: '#e6e2d8' },
};

// plates: 皿の色の ID の配列(上から順。例: ['green', 'red', 'white', 'blue'])
function sinkCabinetOpenSvg(plates) {
  // 下の皿から描く(上の皿が手前に重なるように)。上から i 番目の皿の位置は cy = 16 + 7 × i
  let platesSvg = '';
  for (let i = plates.length - 1; i >= 0; i--) {
    const paint = PLATE_PAINT[plates[i]];
    platesSvg += plateSvg(16 + 7 * i, paint.face, paint.edge);
  }
  const top = PLATE_PAINT[plates[0]];
  return `
<svg viewBox="0 0 100 50" aria-hidden="true">
  <rect x="0" y="0" width="100" height="50" fill="#d8c3a0" stroke="#8a6f4a" stroke-width="2"/>
  <rect x="10" y="3" width="80" height="44" fill="#3a2f24"/>
  <path d="M10 3 L2 0 L2 50 L10 47 Z" fill="#c9b08a" stroke="#8a6f4a" stroke-width="1.5"/>
  <path d="M90 3 L98 0 L98 50 L90 47 Z" fill="#c9b08a" stroke="#8a6f4a" stroke-width="1.5"/>${platesSvg}
  <ellipse cx="50" cy="16.5" rx="17" ry="3.8" fill="${top.well}" stroke="${top.edge}" stroke-width="0.8"/>
</svg>`;
}

// 電子レンジ(左の面)。木のレンジ台の上に置いてある。
// withIce が true のときは、のぞき窓の中に氷(鍵入り)を描く(氷を入れた後の姿)
function microwaveSvg(withIce) {
  const ice = withIce ? `
  <rect x="28" y="25" width="20" height="16" rx="2" fill="#cdeefa" stroke="#7fbfd8" stroke-width="1.5"/>
  <circle cx="33" cy="33" r="2.5" fill="none" stroke="#8a949c" stroke-width="1.2"/>
  <line x1="35.5" y1="33" x2="44" y2="33" stroke="#8a949c" stroke-width="1.2"/>` : '';
  return `
<svg viewBox="0 0 100 110" aria-hidden="true">
  <rect x="6" y="50" width="88" height="58" fill="#b08a5e" stroke="#7d5f3c" stroke-width="2"/>
  <rect x="12" y="58" width="76" height="20" fill="none" stroke="#7d5f3c" stroke-width="1.5"/>
  <rect x="4" y="6" width="92" height="44" rx="4" fill="#ececec" stroke="#888" stroke-width="2"/>
  <rect x="10" y="12" width="56" height="32" rx="2" fill="#2b2f33"/>${ice}
  <rect x="72" y="13" width="18" height="8" rx="1" fill="#1e2a22"/>
  <g fill="#b9bcbf">
    <rect x="72" y="25" width="8" height="5" rx="1"/><rect x="82" y="25" width="8" height="5" rx="1"/>
    <rect x="72" y="33" width="8" height="5" rx="1"/><rect x="82" y="33" width="8" height="5" rx="1"/>
  </g>
</svg>`;
}

// 玄関の扉のドアチェーンと南京錠(版28)。左の扉の端から右の留め金へ鎖がわたり、金色の南京錠がぶら下がる
const CHAIN_SVG = `
<svg viewBox="0 0 100 50" aria-hidden="true">
  <rect x="2" y="8" width="10" height="16" rx="2" fill="#a9b2bb" stroke="#6f777e" stroke-width="2"/>
  <rect x="88" y="8" width="10" height="16" rx="2" fill="#a9b2bb" stroke="#6f777e" stroke-width="2"/>
  <g fill="none" stroke="#c3ccd5" stroke-width="3">
    <ellipse cx="20" cy="17" rx="7" ry="4"/><ellipse cx="32" cy="19" rx="7" ry="4"/><ellipse cx="44" cy="20" rx="7" ry="4"/>
    <ellipse cx="56" cy="20" rx="7" ry="4"/><ellipse cx="68" cy="19" rx="7" ry="4"/><ellipse cx="80" cy="17" rx="7" ry="4"/>
  </g>
  <path d="M43 24 L43 28 Q50 20 57 28 L57 24" fill="none" stroke="#8a7a3a" stroke-width="3"/>
  <rect x="40" y="27" width="20" height="18" rx="3" fill="#d9a520" stroke="#8a6d10" stroke-width="2"/>
  <circle cx="50" cy="34" r="2.5" fill="#5a4608"/><rect x="49" y="34" width="2" height="6" fill="#5a4608"/>
</svg>`;

// ---------- 3部屋目: 洗面所・浴室、4部屋目: トイレ(版28。版34で分けた) ----------

// 洗面台。白い陶器の洗面ボウルと蛇口、下に収納
const WASHBASIN_SVG = `
<svg viewBox="0 0 100 80" aria-hidden="true">
  <rect x="44" y="2" width="12" height="5" rx="2" fill="#b9c2ca"/>
  <rect x="48" y="2" width="4" height="12" fill="#b9c2ca"/>
  <path d="M4 14 L96 14 L90 30 L10 30 Z" fill="#fbfbf8" stroke="#a9b0b6" stroke-width="2"/>
  <ellipse cx="50" cy="18" rx="34" ry="3" fill="#dfe6ea"/>
  <rect x="12" y="30" width="76" height="48" fill="#f1efe8" stroke="#a9a397" stroke-width="2"/>
  <line x1="50" y1="30" x2="50" y2="78" stroke="#a9a397" stroke-width="2"/>
  <g fill="#a9a397"><rect x="44" y="46" width="3" height="10" rx="1.5"/><rect x="53" y="46" width="3" height="10" rx="1.5"/></g>
</svg>`;

// 鏡に指で描く記号(版39)。数字ごとに、頂点の数がその数字になる形を描く(円=0、三角=3、菱形=4、星=5)。
// (cx, cy) を中心に、半径およそ 12 の大きさで描く。塗らずに線だけにして、指でなぞった跡に見せる
function mirrorSymbolSvg(digit, cx, cy) {
  const r = 12;
  // 角度 deg(度。真上が -90)の向きに、中心から距離 d の点
  const pt = (deg, d) => `${(cx + d * Math.cos(deg * Math.PI / 180)).toFixed(1)},${(cy + d * Math.sin(deg * Math.PI / 180)).toFixed(1)}`;
  const line = `fill="none" stroke="#8fa3b0" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" data-digit="${digit}"`;
  if (digit === '0') return `<circle cx="${cx}" cy="${cy}" r="${r - 1}" ${line}/>`;
  if (digit === '3') return `<polygon points="${[-90, 30, 150].map(a => pt(a, r)).join(' ')}" ${line}/>`;
  if (digit === '4') return `<polygon points="${[-90, 0, 90, 180].map(a => pt(a, r)).join(' ')}" ${line}/>`;
  // 星: 外側の先(5つ)と内側のくぼみを交互に結ぶ
  const star = [];
  for (let i = 0; i < 10; i++) star.push(pt(-90 + i * 36, i % 2 === 0 ? r : r * 0.45));
  return `<polygon points="${star.join(' ')}" ${line}/>`;
}

// 鏡。digits(3桁の数字の文字列)を渡すと、湯気で曇った鏡に、その数字を表す記号を左から順に3つ描く。
// null なら、ふつうの鏡
function mirrorSvg(digits) {
  const fog = digits ? `
  <rect x="9" y="9" width="82" height="62" rx="3" fill="#ffffff" opacity="0.6"/>
  ${[...digits].map((d, i) => mirrorSymbolSvg(d, 25 + 25 * i, 40)).join('\n  ')}` : `
  <path d="M14 14 L34 14 L14 40 Z" fill="#ffffff" opacity="0.5"/>`;
  return `
<svg viewBox="0 0 100 80" aria-hidden="true">
  <rect x="3" y="3" width="94" height="74" rx="5" fill="#c9d1d7" stroke="#8e98a0" stroke-width="3"/>
  <rect x="9" y="9" width="82" height="62" rx="3" fill="#cfe3ec"/>${fog}
</svg>`;
}

// トイレ(横から見た形)。左にタンク、右に便座
const TOILET_SVG = `
<svg viewBox="0 0 100 130" aria-hidden="true">
  <rect x="8" y="4" width="46" height="56" rx="4" fill="#fbfbf8" stroke="#a9b0b6" stroke-width="2"/>
  <rect x="8" y="4" width="46" height="8" rx="3" fill="#eef0ee" stroke="#a9b0b6" stroke-width="2"/>
  <rect x="40" y="20" width="10" height="4" rx="2" fill="#b9c2ca"/>
  <path d="M20 60 L92 60 Q94 84 70 92 L60 128 L30 128 L34 92 Q20 84 20 60 Z" fill="#fbfbf8" stroke="#a9b0b6" stroke-width="2"/>
  <rect x="18" y="56" width="78" height="7" rx="3" fill="#eef0ee" stroke="#a9b0b6" stroke-width="2"/>
</svg>`;

// トイレの上の小物入れ(閉じた姿)。木の小箱に、数字の錠(ダイヤルの窓)が付いている
const SMALL_BOX_SVG = `
<svg viewBox="0 0 100 70" aria-hidden="true">
  <rect x="4" y="14" width="92" height="52" rx="4" fill="#b08a5e" stroke="#6e4a26" stroke-width="4"/>
  <rect x="2" y="4" width="96" height="16" rx="4" fill="#c49a6a" stroke="#6e4a26" stroke-width="4"/>
  <rect x="30" y="32" width="40" height="20" rx="3" fill="#2b2f33"/>
  <g fill="#dfe6ea"><rect x="34" y="36" width="9" height="12"/><rect x="46" y="36" width="9" height="12"/><rect x="58" y="36" width="9" height="12"/></g>
</svg>`;

// トイレの上の小物入れ(開いた姿)。ふたが開いて、中は空
const SMALL_BOX_OPEN_SVG = `
<svg viewBox="0 0 100 70" aria-hidden="true">
  <path d="M6 22 L20 2 L98 2 L94 22 Z" fill="#c49a6a" stroke="#6e4a26" stroke-width="4"/>
  <rect x="4" y="22" width="92" height="44" rx="4" fill="#b08a5e" stroke="#6e4a26" stroke-width="4"/>
  <rect x="12" y="26" width="76" height="14" fill="#5a3d22"/>
</svg>`;

// 浴槽(横から見た形)。hotWater が true なら、お湯と湯気を描く
function bathtubSvg(hotWater) {
  const water = hotWater ? `
  <rect x="8" y="14" width="84" height="8" fill="#9fd2e6"/>
  <g fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" opacity="0.85">
    <path d="M30 12 Q26 7 30 3"/><path d="M50 12 Q46 6 50 1"/><path d="M70 12 Q66 7 70 3"/>
  </g>` : '';
  return `
<svg viewBox="0 0 100 50" aria-hidden="true">
  <rect x="80" y="2" width="4" height="10" fill="#b9c2ca"/>
  <rect x="72" y="2" width="12" height="3" rx="1.5" fill="#b9c2ca"/>${water}
  <path d="M2 12 L98 12 L94 48 L6 48 Z" fill="#f4f6f6" stroke="#a9b0b6" stroke-width="2"/>
  <rect x="2" y="10" width="96" height="5" rx="2" fill="#e5eaec" stroke="#a9b0b6" stroke-width="1.5"/>
</svg>`;
}

// 照明のスイッチ(版40)。白いプレートに、四角いボタン
const LIGHT_SWITCH_SVG = `
<svg viewBox="0 0 30 40" aria-hidden="true">
  <rect x="2" y="2" width="26" height="36" rx="3" fill="#fbfbf8" stroke="#a9b0b6" stroke-width="2"/>
  <rect x="9" y="10" width="12" height="20" rx="2" fill="#eef0ee" stroke="#8e98a0" stroke-width="1.5"/>
  <circle cx="15" cy="15" r="1.5" fill="#7fbf7f"/>
</svg>`;

// 点検口(版40。閉じた姿)。灰色の四角いふたと、四隅のマイナスねじ
const ACCESS_PANEL_SVG = `
<svg viewBox="0 0 30 30" aria-hidden="true">
  <rect x="1.5" y="1.5" width="27" height="27" fill="#dfe3e5" stroke="#8e98a0" stroke-width="2"/>
  <rect x="5" y="5" width="20" height="20" fill="none" stroke="#b8bec2" stroke-width="1"/>
  <g fill="#9aa3ab"><circle cx="5" cy="5" r="2"/><circle cx="25" cy="5" r="2"/><circle cx="5" cy="25" r="2"/><circle cx="25" cy="25" r="2"/></g>
  <g stroke="#5f686f" stroke-width="0.8"><line x1="3.6" y1="5" x2="6.4" y2="5"/><line x1="23.6" y1="5" x2="26.4" y2="5"/><line x1="3.6" y1="25" x2="6.4" y2="25"/><line x1="23.6" y1="25" x2="26.4" y2="25"/></g>
</svg>`;

// 点検口(版40。ふたを外した姿)。暗い穴の中に、数字の錠の付いた小さな箱。opened が true なら箱のふたが開いている
function accessPanelOpenSvg(opened) {
  const box = opened ? `
  <path d="M8 13 L11 8 L23 8 L22 13 Z" fill="#c49a6a" stroke="#6e4a26" stroke-width="1"/>
  <rect x="7" y="13" width="16" height="11" fill="#b08a5e" stroke="#6e4a26" stroke-width="1"/>
  <rect x="9" y="15" width="12" height="4" fill="#5a3d22"/>` : `
  <rect x="7" y="10" width="16" height="14" fill="#b08a5e" stroke="#6e4a26" stroke-width="1"/>
  <rect x="9" y="15" width="12" height="5" rx="1" fill="#2b2f33"/>
  <g fill="#dfe6ea"><rect x="10" y="16" width="2" height="3"/><rect x="13" y="16" width="2" height="3"/><rect x="16" y="16" width="2" height="3"/><rect x="19" y="16" width="1.5" height="3"/></g>`;
  return `
<svg viewBox="0 0 30 30" aria-hidden="true">
  <rect x="1.5" y="1.5" width="27" height="27" fill="#3a3f44" stroke="#8e98a0" stroke-width="2"/>${box}
</svg>`;
}

// 壁の数字(版40。謎12)。code = { digits, ink }(data/room3.js の makeWallCode)。
// dark が false(明るい)なら ink の線を濃い灰色で、true(暗い)なら残りの線(蓄光)を黄緑に光らせて描く。
// 1桁は幅 16・高さ 28 の枠に、7本の線(a〜g)で描く
function wallDigitsSvg(code, dark) {
  const seg = {
    a: [3, 2, 13, 2], b: [14, 3, 14, 13], c: [14, 15, 14, 25], d: [3, 26, 13, 26],
    e: [2, 15, 2, 25], f: [2, 3, 2, 13], g: [3, 14, 13, 14],
  };
  let lines = '';
  [...code.digits].forEach((d, i) => {
    const all = SEGMENTS[d];
    const ink = code.ink[i];
    const shown = dark ? [...all].filter(x => !ink.includes(x)) : [...ink];
    const ox = 6 + i * 23;
    for (const k of shown) {
      const [x1, y1, x2, y2] = seg[k];
      lines += `<line x1="${ox + x1}" y1="${4 + y1}" x2="${ox + x2}" y2="${4 + y2}"/>`;
    }
  });
  const style = dark
    ? 'stroke="#c8ff8a" stroke-width="2.6" stroke-linecap="round" filter="url(#glow)"'
    : 'stroke="#7d7f80" stroke-width="2.2" stroke-linecap="round" opacity="0.85"';
  return `
<svg viewBox="0 0 100 36" aria-hidden="true">
  <defs><filter id="glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
  <g ${style}>${lines}</g>
</svg>`;
}

// ---------- アイテムの絵(持ち物欄に小さく表示する)。どれも 32×32 の枠で描く ----------

const DRIVER_SVG = `
<svg viewBox="0 0 32 32" aria-hidden="true">
  <rect x="13.5" y="1" width="5" height="2.5" fill="#a9b2bb"/>
  <rect x="14.5" y="2" width="3" height="14" fill="#a9b2bb"/>
  <rect x="11" y="15" width="10" height="16" rx="3" fill="#d9472b"/>
  <rect x="13" y="18" width="1.5" height="10" fill="#f08a73"/>
</svg>`;

// メモ1は黄色い付箋、メモ2はリング付きの白い紙にして、見分けやすくする
const MEMO_COLOR_SVG = `
<svg viewBox="0 0 32 32" aria-hidden="true">
  <rect x="5" y="5" width="22" height="22" fill="#ffe680" stroke="#b39a2e" stroke-width="1.5"/>
  <g stroke="#9a8030" stroke-width="1.5">
    <line x1="9" y1="12" x2="23" y2="12"/><line x1="9" y1="17" x2="23" y2="17"/><line x1="9" y1="22" x2="18" y2="22"/>
  </g>
</svg>`;

const MEMO_TIME_SVG = `
<svg viewBox="0 0 32 32" aria-hidden="true">
  <rect x="6" y="4" width="20" height="26" rx="1.5" fill="#ffffff" stroke="#888" stroke-width="1.5"/>
  <g fill="#555"><circle cx="11" cy="4" r="1.8"/><circle cx="16" cy="4" r="1.8"/><circle cx="21" cy="4" r="1.8"/></g>
  <g stroke="#7a9cc6" stroke-width="1.5">
    <line x1="9" y1="12" x2="23" y2="12"/><line x1="9" y1="17" x2="23" y2="17"/><line x1="9" y1="22" x2="23" y2="22"/>
  </g>
</svg>`;

// 鍵の絵は色だけを変えて使い回す。
// extra には、鍵に重ねて描く飾り(鈴など)の SVG を渡せる(なくてもよい)
function keySvg(color, extra = '') {
  return `
<svg viewBox="0 0 32 32" aria-hidden="true">
  <circle cx="9" cy="16" r="5.5" fill="none" stroke="${color}" stroke-width="3.5"/>
  <rect x="14" y="14.5" width="16" height="3" fill="${color}"/>
  <rect x="22" y="17" width="2.5" height="4" fill="${color}"/>
  <rect x="27" y="17" width="2.5" height="5.5" fill="${color}"/>${extra}
</svg>`;
}

// 鈴の付いた鍵に重ねる鈴(鍵の輪の下に、金色の鈴をぶら下げる)
const BELL_SVG_PART = `
  <line x1="9" y1="21" x2="9" y2="24" stroke="#c0392b" stroke-width="1.2"/>
  <circle cx="9" cy="27" r="3.6" fill="#e0b030" stroke="#9a7414" stroke-width="0.8"/>
  <line x1="7" y1="28" x2="11" y2="28" stroke="#9a7414" stroke-width="0.8"/>`;

// 鍵入りの氷。水色の四角い氷の中に、灰色の鍵が透けて見える
const ICE_KEY_SVG = `
<svg viewBox="0 0 32 32" aria-hidden="true">
  <rect x="4" y="5" width="24" height="22" rx="3" fill="#cdeefa" stroke="#7fbfd8" stroke-width="1.5"/>
  <circle cx="11" cy="16" r="3" fill="none" stroke="#7a838b" stroke-width="1.8"/>
  <rect x="14" y="15.2" width="10" height="1.6" fill="#7a838b"/>
  <rect x="20" y="16.5" width="1.5" height="2.5" fill="#7a838b"/>
  <rect x="22.5" y="16.5" width="1.5" height="3.2" fill="#7a838b"/>
  <path d="M7 8 L13 8 L7 13 Z" fill="#ffffff" opacity="0.6"/>
</svg>`;

// 蛇口のハンドル。銀色の十字形
const TAP_HANDLE_SVG = `
<svg viewBox="0 0 32 32" aria-hidden="true">
  <rect x="13" y="3" width="6" height="26" rx="3" fill="#b9c2ca" stroke="#7d868e" stroke-width="1"/>
  <rect x="3" y="13" width="26" height="6" rx="3" fill="#b9c2ca" stroke="#7d868e" stroke-width="1"/>
  <circle cx="16" cy="16" r="5" fill="#d7dde2" stroke="#7d868e" stroke-width="1"/>
</svg>`;

// コイン(版40)。金色の丸に、縁の線
const COIN_SVG = `
<svg viewBox="0 0 32 32" aria-hidden="true">
  <circle cx="16" cy="16" r="11" fill="#e0b030" stroke="#9a7414" stroke-width="1.5"/>
  <circle cx="16" cy="16" r="7.5" fill="none" stroke="#b88f1e" stroke-width="1"/>
  <path d="M11 12 Q13 10 15 11" fill="none" stroke="#fff2b0" stroke-width="1.2" stroke-linecap="round"/>
</svg>`;

const FLASHLIGHT_ITEM_SVG = `
<svg viewBox="0 0 32 32" aria-hidden="true">
  <rect x="2" y="12" width="18" height="8" rx="2" fill="#3a5fa8"/>
  <rect x="8" y="10" width="4" height="2.5" fill="#ddd"/>
  <path d="M20 9 L28 6 L28 26 L20 23 Z" fill="#2c4a85"/>
  <rect x="27.5" y="7" width="2.5" height="18" fill="#fff3b0"/>
</svg>`;

// ---------- 開始画面・クリア画面の絵(版29) ----------
// どちらも同じ大きさ(viewBox 240×180)・同じ位置に玄関の扉を描き、「閉じた扉」と「開いた扉」で対にする。
// 扉の枠は x=80〜160、扉の板は x=84〜156・y=24〜150、床は y=150 から下。
// 動き(扉が開く・光が広がる)は style.css の .scene-〜 のクラスで付ける。

// 開始画面: 夜の暗い玄関。鍵穴と、南京錠を掛けたドアチェーンがある閉じた扉
const START_SCENE_SVG = `
<svg viewBox="0 0 240 180" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <rect width="240" height="150" fill="#2e3540"/>
  <rect y="150" width="240" height="30" fill="#22272f"/>
  <ellipse cx="120" cy="158" rx="70" ry="9" fill="#3a4350"/>
  <rect x="80" y="20" width="80" height="130" fill="#1f2731"/>
  <rect x="84" y="24" width="72" height="126" fill="#3b4a5c"/>
  <rect x="112" y="40" width="16" height="22" fill="#1c242d" stroke="#9aa7b4" stroke-width="1.5"/>
  <circle cx="146" cy="92" r="4.5" fill="#c3ccd5"/>
  <circle cx="146" cy="104" r="2.2" fill="#141a20"/>
  <rect x="145.2" y="104" width="1.6" height="4" fill="#141a20"/>
  <rect x="160" y="62" width="6" height="12" rx="1" fill="#8a949e"/>
  <rect x="139" y="62" width="6" height="12" rx="1" fill="#8a949e"/>
  <path d="M142 66 Q152 86 163 66" fill="none" stroke="#b8c0c8" stroke-width="2.4" stroke-dasharray="3 1.6"/>
  <path d="M148.5 82 v-3.5 a3.5 3.5 0 0 1 7 0 v3.5" fill="none" stroke="#9aa3ab" stroke-width="1.8"/>
  <rect x="146" y="81" width="12" height="10" rx="1.5" fill="#c9a447"/>
  <circle cx="152" cy="85.5" r="1.3" fill="#5a4a2a"/>
</svg>`;

// クリア画面: 扉が開き、外の朝の光が差し込む。
// 扉の外には朝の空と、地平線から半分のぼった太陽(1部屋目の「山と朝日の風景画」に合わせる)
const CLEAR_SCENE_SVG = `
<svg viewBox="0 0 240 180" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="clear-sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffe7b8"/>
      <stop offset="1" stop-color="#ffb468"/>
    </linearGradient>
    <radialGradient id="clear-glow" cx="0.5" cy="0.55" r="0.6">
      <stop offset="0" stop-color="#ffcf8a" stop-opacity="0.7"/>
      <stop offset="1" stop-color="#ffcf8a" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="240" height="150" fill="#2e3540"/>
  <rect y="150" width="240" height="30" fill="#22272f"/>
  <rect class="scene-light" width="240" height="180" fill="url(#clear-glow)"/>
  <rect x="80" y="20" width="80" height="130" fill="#1f2731"/>
  <rect x="84" y="24" width="72" height="126" fill="url(#clear-sky)"/>
  <circle cx="122" cy="118" r="14" fill="#ff9a3c"/>
  <rect x="84" y="118" width="72" height="32" fill="#8fa36b"/>
  <polygon class="scene-light" points="84,150 156,150 210,180 30,180" fill="#ffcf8a" opacity="0.55"/>
  <g class="scene-door">
    <rect x="84" y="24" width="72" height="126" fill="#3b4a5c"/>
    <rect x="112" y="40" width="16" height="22" fill="#1c242d" stroke="#9aa7b4" stroke-width="1.5"/>
    <circle cx="146" cy="92" r="4.5" fill="#c3ccd5"/>
  </g>
</svg>`;
