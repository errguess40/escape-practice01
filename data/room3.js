// 3部屋目「洗面所・浴室」と4部屋目「トイレ」の面と物(版28で「ユニットバス」として追加し、版34で2つに分けた)。
// 書き方の説明は data/game.js の先頭にまとめてある。
//
// 洗面所・浴室は台所の右の面の浴室の扉から、トイレは台所の正面のトイレの扉から入り、何度でも行き来できる(区切りの画面は出さない)。
// 扉をタップしたときのルールに goWall(移る先の面)を書いて、部屋を移る。
//
// 洗面所・浴室・トイレのフラグ:
//   gotHandle : 台所の靴箱から蛇口のハンドルを取った
//   hotWater  : 浴槽にハンドルを付けてお湯を出した(謎10が解けた)。鏡に記号が3つ浮かぶ
//   boxOpen   : トイレの上の小物入れを開け、コインを手に入れた(謎11が解けた。版39までは南京錠の鍵)
//   panelOpen : コインで点検口のふたを外した(版40)
//   panelBoxOpen: 点検口の中の箱を開け、南京錠の鍵を手に入れた(謎12が解けた。版40)
//
// 謎11の答え(3桁の数字)は、新しく始めるたびにランダムに決め、保存データの state.random.mirror に入れる。
// 版39から、鏡には数字ではなく、その数字を「頂点の数」で表す記号を描く(円=0、三角=3、菱形=4、星=5。data/svg.js の mirrorSvg)。
// 「頂点を数える」という決まりの手がかりは、わざと置かない(ユーザーの判断。歯ごたえを出すため)。

// 鏡の記号(= 答えの数字)をランダムに決める(新しく始めるときに data/game.js の makeRandom から呼ばれる)。
// 記号にできる 0・3・4・5 から違う3つを選んで並べる(例: '503'。先頭が 0 でもよい。全24通り)
function makeMirrorNumber() {
  const digits = [0, 3, 4, 5];
  for (let i = digits.length - 1; i > 0; i--) { // 混ぜる(シャッフル)
    const j = Math.floor(Math.random() * (i + 1));
    [digits[i], digits[j]] = [digits[j], digits[i]];
  }
  return digits.slice(0, 3).join('');
}

// 版34: ユニットバスを「洗面所・浴室」(ROOM3)と「トイレ」(ROOM4。このファイルの最後)に分けた。
// 面のID(b-sink / b-tub)は、保存データとの互換のため版33までのまま
const ROOM3 = {
  name: '洗面所・浴室',
  startWall: 'b-sink',       // 入ったときの面
  floorClass: 'floor-bath',  // 床の見た目(style.css のクラス名)

  // 2面だけの狭い部屋。どちらの矢印を押しても、もう一方の面へ移る
  walls: {
    'b-sink': { name: '洗面所', left: 'b-tub', right: 'b-tub', objects: ['bathDoor', 'washbasin', 'mirror'] },
    'b-tub': { name: '浴室', left: 'b-sink', right: 'b-sink', objects: ['bathtub'] },
  },

  objects: {
    // ---------- 洗面所 ----------
    // 台所へ戻る扉。タップすると台所の右の面へ移る(goWall)
    bathDoor: {
      label: '台所への扉', className: 'door door-bath', x: 15, y: 18, w: 20, h: 52,
      examine: [
        { message: '台所に戻った。', goWall: 'k-right' },
      ],
    },
    washbasin: {
      // 洗面台の縦横比(100:80)に合わせて h = w × 4/3 × 0.8。下端(y + h = 70)を床の線にそろえる
      label: '洗面台', svg: WASHBASIN_SVG, x: 50, y: 38, w: 30, h: 32,
      examine: [
        { message: '洗面台だ。蛇口をひねると水が出る。' },
      ],
    },
    // 鏡。お湯を出す(hotWater)と湯気で曇り、指で書いたような数字が浮かぶ。
    // 絵は状態によって変わるので、svg に「状態 s を受け取って絵を返す関数」を書く。
    // 鏡の縦横比(100:80)に合わせて h = w × 4/3 × 0.8
    mirror: {
      label: '鏡', svg: s => mirrorSvg(s.flags.hotWater ? s.random.mirror : null), x: 53, y: 8, w: 24, h: 25.6,
      examine: [
        { need: 'hotWater', message: '鏡だ。湯気で曇って、指で書いたような記号が3つ浮かび上がっている。誰かが前もって書いておいたようだ。' },
        { message: '鏡だ。洗面台の上に付いている。' },
      ],
    },

    // ---------- 浴室 ----------
    // 謎10: 蛇口のハンドルを使うとお湯が出る(フラグ hotWater)
    bathtub: {
      // 浴槽の縦横比(100:50)に合わせて h = w × 4/3 × 0.5。下端(y + h = 70)を床の線にそろえる。
      // 版34でトイレがなくなったので、面の中央に大きめに置く(x 26〜76)
      label: '浴槽', svg: s => bathtubSvg(s.flags.hotWater), x: 26, y: 36.7, w: 50, h: 33.3,
      examine: [
        { need: 'hotWater', message: '浴槽だ。お湯が出ていて、湯気が立ちこめている。' },
        { message: '浴槽だ。蛇口のハンドルが外れていて、お湯が出せない。' },
      ],
      use: [
        {
          item: 'tapHandle', unless: 'hotWater',
          message: 'ハンドルを取り付けて蛇口をひねると、お湯が出てきた。湯気が立ちこめる。',
          remove: 'tapHandle', set: 'hotWater',
        },
      ],
    },
  },
};

// 謎12(版40)の壁の数字。電卓の表示のような7本の線(a〜g)で描く、4桁の数字。
// 線は「ふつうのペン(ink)」と「蓄光塗料(glow)」に分けて書いてあり、明るいときは ink だけ、暗いときは glow だけが見える。
// 両方を重ねると数字になる。
//   a: 上、b: 右上、c: 右下、d: 下、e: 左下、f: 左上、g: 真ん中
const SEGMENTS = {
  0: 'abcdef', 1: 'bc', 2: 'abdeg', 3: 'abcdg', 4: 'bcfg',
  5: 'acdfg', 6: 'acdefg', 7: 'abc', 8: 'abcdefg', 9: 'abcdfg',
};

// 線の集まりが、どれかの数字の形とちょうど同じか(片方だけで数字が読めてしまう分け方を避けるため)
function isDigitShape(segs) {
  const key = [...segs].sort().join('');
  return Object.values(SEGMENTS).some(v => v === key);
}

// 壁の数字(謎12の答え)と、線の分け方をランダムに決める(新しく始めるときに data/game.js の makeRandom から呼ばれる)。
// 返す値の例: { digits: '4071', ink: ['bf', 'ade', 'a', 'b'] }。glow は、その数字の線から ink を除いた残り
function makeWallCode() {
  let digits = '';
  const ink = [];
  for (let i = 0; i < 4; i++) {
    const d = Math.floor(Math.random() * 10);
    const all = SEGMENTS[d].split('');
    // ink と glow がどちらも1本以上で、どちらも単独では数字の形にならない分け方が出るまで、やり直す
    for (;;) {
      const mine = all.filter(() => Math.random() < 0.5);
      const rest = all.filter(x => !mine.includes(x));
      if (mine.length && rest.length && !isDigitShape(mine) && !isDigitShape(rest)) {
        digits += d;
        ink.push(mine.join(''));
        break;
      }
    }
  }
  return { digits, ink };
}

// トイレ(版34)。台所の正面の「トイレの扉」から入る、1面だけの部屋。
// 左右の矢印は出さない(面の left / right を書かない)。
// 版40: 照明のスイッチと壁の数字を足した(謎12の手がかり)。流れは
//   小物入れ(謎11)→ コイン → 台所の正面の点検口のねじを外す(版41で台所へ移した)→ 中の箱(4桁)→ 南京錠の鍵。
//   箱の答えは、この部屋の壁の数字の「明るいときに見える線」と「暗いときに光る線」を重ねて読む。
// 物に inDark: true と書くと、明かりを消している間も見えて調べられる。usableInDark: true は、見えないが使える(扉)。
// それ以外は「暗くて見えない。」(js/main.js)。
// toggleLight: true の物(スイッチ)は、タップすると明かりを消す・点ける(変数 lightOff。保存しない)
const ROOM4 = {
  name: 'トイレ',
  startWall: 't-toilet',
  floorClass: 'floor-bath',

  walls: {
    't-toilet': {
      name: 'トイレ',
      objects: ['toiletDoor', 'lightSwitch', 'wallDigits', 'toilet', 'smallBox', 'smallBoxOpen'],
    },
  },

  objects: {
    // 台所へ戻る扉。タップすると台所の正面へ移る(goWall)。
    // 暗い間も使える(usableInDark。絵は暗い幕の下に隠れたまま)。明かりを消したまま出られないと閉じ込められるため
    toiletDoor: {
      label: '台所への扉', className: 'door door-toilet', x: 15, y: 18, w: 18, h: 52, usableInDark: true,
      examine: [
        { message: '台所に戻った。', goWall: 'k-front' },
      ],
    },
    // 照明のスイッチ(版40)。扉の右の壁。タップするたびに明かりを消す・点ける
    lightSwitch: {
      label: '照明のスイッチ', svg: LIGHT_SWITCH_SVG, x: 35, y: 38, w: 6, h: 10.7,
      toggleLight: true, inDark: true,
    },
    // 壁の数字(版40。謎12の手がかり)。トイレの上の壁に書いてある。
    // 明るいときはペンの線だけ、暗いときは蓄光の線だけを描く(絵は lightOff で変わる)
    wallDigits: {
      label: '壁の線', svg: s => wallDigitsSvg(s.random.wallCode, lightOff), x: 44, y: 6, w: 40, h: 16.4,
      inDark: true,
      examine: [
        { message: () => lightOff
          ? '壁だ。暗がりに、光る線が浮かび上がっている。'
          : '壁だ。角ばった数字のような線が書いてあるが、ところどころ欠けている。' },
      ],
    },
    toilet: {
      // トイレの縦横比(100:130)に合わせて h = w × 4/3 × 1.3。下端(y + h = 70)を床の線にそろえる
      label: 'トイレ', svg: TOILET_SVG, x: 58, y: 35.3, w: 20, h: 34.7,
      examine: [
        { message: 'トイレだ。' },
      ],
    },
    // 謎11: トイレのタンクの上の小物入れ(数字3桁)。答えは鏡の記号が表す数字(state.random.mirror)。
    // 開けると同じ場所に開いた姿(smallBoxOpen)を表示する。版40から、中身は南京錠の鍵ではなくコイン。
    // タンクの上(トイレの絵の y = 4)に置く。縦横比(100:70)に合わせて h = w × 4/3 × 0.7
    smallBox: {
      label: '小物入れ', svg: SMALL_BOX_SVG, x: 59.5, y: 27.3, w: 10, h: 9.3,
      unless: 'boxOpen', // 開けるまで表示
      lock: {
        unless: 'boxOpen',
        prompt: '小物入れだ。3桁の数字を合わせる錠がついている。',
        pattern: '###',
        answer: s => s.random.mirror,
        message: '小物入れが開いた。中にコインが入っている！',
        gain: 'coin', set: 'boxOpen',
      },
    },
    smallBoxOpen: {
      label: '開いた小物入れ', svg: SMALL_BOX_OPEN_SVG, x: 59.5, y: 27.3, w: 10, h: 9.3,
      need: 'boxOpen', // 開けた後に表示
      examine: [
        { message: '小物入れだ。もう何も入っていない。' },
      ],
    },
  },
};
