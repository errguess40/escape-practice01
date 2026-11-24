// 1部屋目「フローリングの部屋」の面と物。
// 書き方の説明は data/game.js の先頭にまとめてある。

// ---------- 本棚の本 ----------
// 本棚は2段で、本は10冊とも同じ見た目。背表紙に番号があり、上の段は左から 1〜5、下の段は左から 6・7・8・9・0。
// (錠の数字 0〜9 がすべて答えに使えるようにするため。0 の本は10冊目)
// 栞(赤・青・黄)が挟まっているのは3冊だけ。どの本にどの色の栞を挟むかは、新しく始めるたびにランダムに決め、
// 保存データの state.random.bookmarks に入れる(例: { red: 4, blue: 1, yellow: 3 } = 赤い栞は4の本)。値は背表紙の番号(0〜9)。
// 机の錠の答えは、メモ1の「赤 → 青 → 黄」の順に本の番号を並べたもの(上の例なら 413)。
const BOOK_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]; // 本を読む順(上の段の左から、続けて下の段の左から)
const BOOKS_PER_ROW = 5;
const BOOKMARK_COLORS = [ // メモ1の順
  { id: 'red', name: '赤い' },
  { id: 'blue', name: '青い' },
  { id: 'yellow', name: '黄色い' },
];

// 本のID(book1 〜 book9、book0)。面の objects に並べるときに使う
const BOOK_IDS = BOOK_NUMBERS.map(n => `book${n}`);

// 栞の配置をランダムに決める(新しく始めるときに js/save.js の newState() から呼ばれる)。
// 本を読む順(1→9→0)に栞を見たときの色の順が、メモ1と同じ「赤・青・黄」になる配置は除く
// (並べ替える推理がいらなくなり、簡単すぎるため)。条件に合うまで決め直す
function makeBookmarks() {
  while (true) {
    // 本の番号を混ぜて(シャッフルして)、先頭から3つを 赤・青・黄 に割り当てる
    const numbers = [...BOOK_NUMBERS];
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    const bookmarks = { red: numbers[0], blue: numbers[1], yellow: numbers[2] };
    // 読む順の何番目か(0 の本は最後)で比べる
    const order = n => BOOK_NUMBERS.indexOf(n);
    const sameAsMemo = order(bookmarks.red) < order(bookmarks.blue) && order(bookmarks.blue) < order(bookmarks.yellow);
    if (!sameAsMemo) return bookmarks;
  }
}

// n の本に挟まっている栞の色の名前(「赤い」など)。挟まっていなければ null
function bookmarkName(s, n) {
  const color = BOOKMARK_COLORS.find(c => s.random.bookmarks[c.id] === n);
  return color ? color.name : null;
}

// 本の物データを10冊ぶん作る。書き方はほかの物と同じ(下の objects を参照)。
// 本棚の内側(x = 15〜53 くらい)に、幅6%・すき間1%で左から5冊ずつ並べる。
// 上の段は棚板(y = 37.5)の上、下の段は棚板(y = 56)の上に立てる(本の高さ13%)。
// 文章は栞の配置によって変わるので、message に「状態 s を受け取って文章を返す関数」を書く
function makeBooks() {
  const books = {};
  BOOK_NUMBERS.forEach((n, i) => {
    const row = Math.floor(i / BOOKS_PER_ROW); // 0 = 上の段、1 = 下の段
    const col = i % BOOKS_PER_ROW;
    books[`book${n}`] = {
      label: `${n}の本`, className: 'book', text: String(n),
      x: 17 + col * 7, y: row === 0 ? 24.5 : 43, w: 6, h: 13,
      examine: [
        {
          message: s => {
            const name = bookmarkName(s, n);
            return name
              ? `背表紙に「${n}」と書かれた本だ。開くと、${name}栞が挟まっていた。`
              : `背表紙に「${n}」と書かれた本だ。開いてみたが、何も挟まっていない。`;
          },
        },
      ],
    };
  });
  return books;
}

const ROOM1 = {
  name: 'フローリングの部屋',
  startWall: 'front',      // この部屋に入ったときの面(ゲーム開始時の面)
  floorClass: 'floor-wood', // 床の見た目(style.css のクラス名)

  // 部屋の面。left / right は矢印で移動する先(null なら矢印を出さない)。
  // 4面はひと回りにつながる: 背面 ⇄ 左の面 ⇄ 正面 ⇄ 右の面 ⇄ 背面
  // 背面を向いたときは、自分の左手側が「右の面」、右手側が「左の面」になる
  walls: {
    front: { name: '正面', left: 'left', right: 'right', objects: ['door', 'painting', 'safe', 'safeOpened', 'paintingFloor', 'plant'] },
    left: {
      name: '左の面', left: 'back', right: 'front',
      // 本棚を先に書くと、本が本棚の手前に表示される(後に書いた物ほど手前)
      objects: ['bookshelf', ...BOOK_IDS, 'bed'],
    },
    right: { name: '右の面', left: 'front', right: 'back', objects: ['clock', 'desk'] },
    back: {
      name: '背面', left: 'right', right: 'left',
      // 懐中電灯は開いたクローゼットの手前に、板は閉じたクローゼットの手前に出すため、クローゼットより後に書く
      objects: ['closet', 'closetOpen', 'flashlight', 'closetBoard', 'window', 'trash'],
    },
  },

  objects: {
    door: {
      // 下端(y + h = 70)を床の線にそろえる
      label: '扉', className: 'door', x: 39, y: 18, w: 22, h: 52,
      examine: [
        { message: '扉だ。鍵がかかっている。' },
      ],
      use: [
        // 版20: 扉を開けると、区切りの画面を出して台所へ移る(enterRoom)
        { item: 'doorKey', message: '鍵を差し込んで回した。扉が開いた！', remove: 'doorKey', set: 'leftRoom1', enterRoom: 'kitchen' },
        // 小さな鍵は扉には合わない。使う場所を考える手がかりにする
        { item: 'closetKey', message: '鍵穴に合わないようだ。' },
      ],
    },
    // 絵は、引き出しを開けて(メモ2「絵の裏を見よ」を手に入れて)から調べると外れ、裏の金庫が見つかる(フラグ foundSafe)。
    // その後は、壁には金庫を表示し、絵は金庫の真下の床に置いた姿(paintingFloor)で表示する
    painting: {
      // 絵の縦横比(100:80)に合わせて、h = w × 4/3 × 0.8 にする。
      // スマホ幅でも左の矢印ボタンと重ならないよう、x = 14 から置く
      label: '壁の絵', svg: PAINTING_SVG, x: 14, y: 14, w: 15, h: 16,
      unless: 'foundSafe', // 金庫を見つけるまで表示
      examine: [
        { need: 'drawerOpen', message: '山と朝日の風景画だ。絵を外して床に置くと、裏の壁に小さな金庫が埋め込まれていた！', set: 'foundSafe' },
        { message: '山と朝日の風景画だ。' },
      ],
    },
    // 床に置いた絵。金庫を見つけた後、金庫の真下の床に立てかけて表示する。何度でも調べられる
    // (「朝日」が、金庫の答えが午前の時刻だと分かる手がかりになる)
    paintingFloor: {
      // 下端(y + h = 72)を床の線より少し下にする
      label: '床に置いた絵', svg: PAINTING_SVG, x: 14, y: 56, w: 15, h: 16,
      need: 'foundSafe',
      examine: [
        { message: '山と朝日の風景画だ。' },
      ],
    },
    // 金庫は「閉じた姿 safe」と「開いた姿 safeOpened」を別の物として書き、フラグ safeOpen で切り替える
    safe: {
      label: '金庫', svg: SAFE_SVG, x: 14, y: 14, w: 15, h: 16,
      need: 'foundSafe', unless: 'safeOpen', // 金庫を見つけた後、開けるまで表示
      lock: {
        unless: 'safeOpen',
        prompt: '小さな金庫だ。4桁の数字を合わせる錠がついている。',
        pattern: '####',
        answer: '0615',
        message: '金庫が開いた。中に小さな鍵が入っている！',
        gain: 'closetKey', set: 'safeOpen',
      },
    },
    safeOpened: {
      label: '開いた金庫', svg: SAFE_OPEN_SVG, x: 14, y: 14, w: 15, h: 16,
      need: 'safeOpen', // 開けた後に表示
      examine: [
        { message: '金庫だ。扉は開いていて、中にはもう何もない。' },
      ],
    },
    plant: {
      // 右の矢印ボタンと重ならないよう、右端から離して置く。
      // 下端(y + h = 70)を床の線にそろえる
      label: '観葉植物', svg: PLANT_SVG, x: 66, y: 48, w: 13, h: 22,
      examine: [
        { unless: 'gotDriver', message: '観葉植物だ。鉢の土に何か埋まっている……ドライバーだ！', gain: 'driver', set: 'gotDriver' },
        { message: 'ただの観葉植物だ。' },
      ],
    },
    bookshelf: {
      // スマホ幅でも左の矢印ボタン(幅44px)と本が重ならないよう、左端から離して置く
      label: '本棚', className: 'bookshelf', x: 14, y: 20, w: 40, h: 50,
      examine: [
        { message: '2段の本棚だ。同じ装丁の本が10冊並んでいる。背表紙に 1 から 9 と 0 の番号が振ってある。' },
      ],
    },
    // 本(book1 〜 book5)は上の makeBooks() で作る
    ...makeBooks(),
    bed: {
      // 本棚の右に置き、右の矢印の範囲(右端14%)にかからないよう x + w = 86 にする。
      // 床の上に置くので、下端は床の線(y=70)より下にする。
      // ベッドの縦横比(100:52)に合わせて h = w × 4/3 × 0.52
      label: 'ベッド', svg: BED_SVG, x: 56, y: 52, w: 30, h: 20.8,
      examine: [
        { unless: 'bedLit', message: 'ベッドだ。ベッドの下は暗くて奥が見えない。' },
        { message: 'ベッドだ。ベッドの下にはもう何もない。' },
      ],
      use: [
        {
          item: 'flashlight', unless: 'bedLit',
          message: '懐中電灯でベッドの下を照らすと、奥に鍵が落ちていた！',
          remove: 'flashlight', gain: 'doorKey', set: 'bedLit',
        },
      ],
    },
    clock: {
      // 正方形にするため h = w × 4/3
      label: '壁時計', svg: CLOCK_SVG, x: 14, y: 8, w: 20, h: 26.7,
      examine: [
        { message: '壁時計だ。止まっているようだ。' },
      ],
    },
    desk: {
      // 下端(y + h = 70)を床の線にそろえる
      label: '机', className: 'desk', x: 45, y: 42, w: 40, h: 28,
      // 1回目に調べると錠に気づく(フラグ sawDrawerLock)。2回目から数字の入力画面が開く
      lock: {
        need: 'sawDrawerLock', unless: 'drawerOpen',
        prompt: '机だ。引き出しに錠がついている。3桁の数字を合わせるようだ。',
        pattern: '###',
        // 答えは栞の配置で決まる: メモ1の順(赤・青・黄)に本の番号を並べる
        answer: s => BOOKMARK_COLORS.map(c => s.random.bookmarks[c.id]).join(''),
        message: '引き出しが開いた。中にメモが入っている。',
        gain: 'memoTime', set: 'drawerOpen',
      },
      examine: [
        { need: 'drawerOpen', message: '机だ。引き出しは開いている。中にはもう何もない。' },
        { message: '机だ。引き出しに錠がついている。3桁の数字を合わせるようだ。', set: 'sawDrawerLock' },
      ],
    },

    // ---------- 背面 ----------
    // クローゼットは「閉じた姿」と「開いた姿」を別の物として書き、フラグ closetOpen で切り替える。
    // 開けるには、板を外す(boardOpen)ことと、小さな鍵を使うことの両方が要る
    closet: {
      label: 'クローゼット', svg: CLOSET_CLOSED_SVG, x: 10, y: 12, w: 34, h: 58,
      unless: 'closetOpen', // 開けるまで表示
      examine: [
        // 鍵穴は板に隠れているので、板を外すまでは鍵穴に触れない
        { unless: 'boardOpen', message: 'クローゼットだ。扉に板が打ち付けてあって開かない。' },
        { message: 'クローゼットだ。鍵がかかっている。取っ手の下に小さな鍵穴がある。' },
      ],
      use: [
        { item: 'closetKey', unless: 'boardOpen', message: '板が邪魔で扉が開かない。' },
        {
          item: 'closetKey',
          message: '鍵を回すと、クローゼットの扉が開いた。床に懐中電灯が置いてある。',
          remove: 'closetKey', set: 'closetOpen',
        },
      ],
    },
    // クローゼットの扉に留めた板。取っ手の下の鍵穴を隠す位置に重ねる。ドライバーで外すと消える。
    // スマホ幅でも左の矢印ボタンと重ならないよう、x = 14 から置く
    closetBoard: {
      label: 'クローゼットの板', className: 'board', x: 14, y: 44, w: 31, h: 7,
      unless: 'boardOpen', // 外すまで表示
      examine: [
        { message: '板だ。クローゼットの扉に打ち付けてある。ネジで留めてあるようだ。' },
      ],
      use: [
        {
          item: 'driver',
          message: 'ドライバーでネジを外し、板を取り外した。',
          remove: 'driver', set: 'boardOpen',
        },
        { item: 'closetKey', message: '板が邪魔で扉が開かない。' },
      ],
    },
    closetOpen: {
      label: '開いたクローゼット', svg: CLOSET_OPEN_SVG, x: 10, y: 12, w: 34, h: 58,
      need: 'closetOpen', // 開けた後に表示
      examine: [
        { message: 'クローゼットだ。服が何着か掛かっている。' },
      ],
    },
    flashlight: {
      // クローゼットの床に置く。懐中電灯の縦横比(100:44)に合わせて h = w × 4/3 × 0.44
      label: '懐中電灯', svg: FLASHLIGHT_SVG, x: 20, y: 60, w: 14, h: 8.2,
      need: 'closetOpen', unless: 'gotFlashlight', // 開けた後、取るまで表示
      examine: [
        { message: '懐中電灯だ。手に入れた。', gain: 'flashlight', set: 'gotFlashlight' },
      ],
    },
    window: {
      // 謎には関係しない。
      // 窓の縦横比(100:80)に合わせて h = w × 4/3 × 0.8
      label: '窓', svg: WINDOW_SVG, x: 52, y: 12, w: 30, h: 32,
      examine: [
        { message: '窓だ。外には隣の建物の壁が迫っている。はめ殺しで開かない。' },
      ],
    },
    trash: {
      // メモ1が入っている(フラグ gotMemoColor)。
      // ゴミ箱の縦横比(100:120)に合わせて h = w × 4/3 × 1.2。下端は床の線より少し下
      label: 'ゴミ箱', svg: TRASH_SVG, x: 66, y: 56, w: 10, h: 16,
      examine: [
        {
          unless: 'gotMemoColor',
          message: 'ゴミ箱だ。中に、丸めた紙が捨ててある。広げるとメモだった。',
          gain: 'memoColor', set: 'gotMemoColor',
        },
        { message: 'ゴミ箱だ。中はもう空っぽだ。' },
      ],
    },
  },
};
