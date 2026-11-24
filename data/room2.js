// 2部屋目「台所」の面と物(版20で追加)。
// 書き方の説明は data/game.js の先頭にまとめてある。
//
// 謎6〜9をすべて作ってある。
//
// 流しの下の皿の並び(謎8・9)は、新しく始めるたびにランダムに決め、保存データの state.random.plates に入れる。
// 色の錠の5色(赤・青・黄・緑・白)から4色を選んで並べる(120通り)。配列は上の皿から順。

// 皿の並びをランダムに決める(新しく始めるときに data/game.js の makeRandom から呼ばれる)
function makePlates() {
  const ids = LOCK_COLORS.map(c => c.id); // 5色
  for (let i = ids.length - 1; i > 0; i--) { // 混ぜる(シャッフル)
    const j = Math.floor(Math.random() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  return ids.slice(0, 4); // 先頭の4色を、上から順の皿にする
}
//
// 台所のフラグ:
//   gotIceKey      : 冷凍室から鍵入りの氷を取った
//   iceInMicrowave : 鍵入りの氷を電子レンジに入れた(謎6が解けた)
//   gotOldKey      : 電子レンジで氷を溶かし、古い鍵を手に入れた(謎7が解けた)
//   cabinetOpen    : 流しの下の戸棚を開けた(謎8が解けた)
//   cupboardOpen   : 食器棚の色の錠を開け、鈴の付いた鍵を手に入れた(謎9が解けた)

// 玄関の扉の、調べたとき・使ったときのルール(扉とドアチェーンで共通)。
// フラグ genkanUnlocked = 鍵穴を開けた、chainOff = ドアチェーンを外した、escaped = 両方外して扉が開いた(クリア)
const GENKAN_RULES = {
  examine: [
    { need: 'chainOff', message: '玄関の扉だ。ドアチェーンは外したが、鍵がかかっている。' },
    { need: 'genkanUnlocked', message: '玄関の扉だ。鍵は開いたが、ドアチェーンの南京錠が外れない。' },
    { message: '玄関の扉だ。鍵がかかっていて、ドアチェーンにも南京錠がかかっている。' },
  ],
  use: [
    // 鈴の付いた鍵: ドアチェーンを外してあれば開く(クリア)。まだなら鍵穴だけ開ける
    { item: 'bellKey', need: 'chainOff', message: '鍵を回すと、玄関の扉が開いた！', remove: 'bellKey', set: 'escaped' },
    { item: 'bellKey', message: '鍵を回した。あとはドアチェーンだ。', remove: 'bellKey', set: 'genkanUnlocked' },
    // 南京錠の鍵: 鍵穴を開けてあれば開く(クリア)。まだならドアチェーンだけ外す
    { item: 'padlockKey', need: 'genkanUnlocked', message: '南京錠を外してドアチェーンを外すと、玄関の扉が開いた！', remove: 'padlockKey', set: 'escaped' },
    { item: 'padlockKey', message: '南京錠を外して、ドアチェーンを外した。あとは鍵だ。', remove: 'padlockKey', set: 'chainOff' },
    // 古い鍵は玄関には合わない。使う場所を考える手がかりにする
    { item: 'oldKey', message: '鍵穴に合わないようだ。' },
  ],
};

const ROOM2 = {
  name: '台所',
  startWall: 'k-front',     // この部屋に入ったときの面
  floorClass: 'floor-tile', // 床の見た目(style.css のクラス名)

  // この部屋に入るときに出す区切りの画面
  enter: {
    title: '台所',
    // 台所に入った直後は、入ってきた扉の面(正面)を表示する。扉を振り返って見ている状況に合わせた文章にする
    message: '扉の先は台所だった。振り返ると、扉が閉まって鍵のかかる音がした。',
  },
  // この部屋に入るときに持ち物から消すアイテム(1部屋目のメモは台所では使わない)
  dropItems: ['memoColor', 'memoTime'],

  // 面のIDは1部屋目と重ならないよう、先頭に k- を付ける(保存データの面のIDで、今いる部屋が分かる)。
  // つながりは1部屋目と同じ(背面では左右が反転する)
  walls: {
    'k-front': { name: '正面', left: 'k-left', right: 'k-right', objects: ['entryDoor', 'toiletDoorK', 'table', 'gratinBox', 'accessPanel', 'panelBox', 'panelBoxOpen'] },
    'k-left': { name: '左の面', left: 'k-back', right: 'k-front', objects: ['cupboard', 'cupboardOpen', 'microwave', 'microwaveIce', 'microwaveDone'] },
    'k-right': { name: '右の面', left: 'k-front', right: 'k-back', objects: ['bathDoorK', 'genkanDoor', 'doorChain', 'shoeBox'] },
    // 冷凍室は冷蔵庫の絵に重ねる透明な物なので、冷蔵庫より後に書く(後に書いた物ほど手前)
    'k-back': { name: '背面', left: 'k-right', right: 'k-left', objects: ['fridge', 'freezer', 'sink', 'sinkCabinet', 'sinkCabinetOpen'] },
  },

  objects: {
    // 1部屋目から入ってきた扉。こちら側からは開かない(一方通行)
    entryDoor: {
      label: '入ってきた扉', className: 'door', x: 16, y: 18, w: 20, h: 52,
      examine: [
        { message: 'さっきの部屋の扉だ。こちら側からは開かない。' },
      ],
    },
    // トイレの扉(版34)。タップするとトイレへ移る(goWall)。入ってきた扉の右に置く
    toiletDoorK: {
      label: 'トイレの扉', className: 'door door-toilet', x: 39, y: 18, w: 16, h: 52,
      examine: [
        { message: 'トイレに入った。', goWall: 't-toilet' },
      ],
    },
    table: {
      // テーブルの縦横比(100:50)に合わせて h = w × 4/3 × 0.5。下端(y + h = 70)を床の線にそろえる。
      // 版34でトイレの扉を置いたので、右へ詰めて小さくした(右端 x + w = 86)
      label: 'ダイニングテーブル', svg: TABLE_SVG, x: 58, y: 51.3, w: 28, h: 18.7,
      examine: [
        { message: 'ダイニングテーブルだ。' },
      ],
    },
    // 冷凍グラタンの空き箱。謎7の手がかり(解凍の時間)。テーブルの天板(y = 51.3)の上に置く。
    // 箱の縦横比(100:60)に合わせて h = w × 4/3 × 0.6
    gratinBox: {
      label: '空き箱', svg: GRATIN_BOX_SVG, x: 62, y: 44.1, w: 9, h: 7.2,
      examine: [
        { message: '冷凍グラタンの空き箱だ。『温め 600W 3分 ／ 解凍 600W 1分30秒』と書いてある。' },
      ],
    },
    // 点検口(版40。版41でトイレから台所の正面へ移した)。テーブルの上の壁。四隅をマイナスねじで留めてある。コインで開ける。
    // 縦横比(1:1)に合わせて h = w × 4/3
    accessPanel: {
      label: '点検口', svg: ACCESS_PANEL_SVG, x: 67, y: 20, w: 11, h: 14.7,
      unless: 'panelOpen',
      examine: [
        { message: '点検口だ。四隅がマイナスねじで留めてある。' },
      ],
      use: [
        {
          item: 'coin',
          message: 'コインでねじを回して、点検口のふたを外した。中に小さな箱がある。',
          remove: 'coin', set: 'panelOpen',
        },
      ],
    },
    // 謎12: 点検口の中の箱(数字4桁)。答えはトイレの壁の数字(state.random.wallCode.digits)
    panelBox: {
      label: '箱', svg: s => accessPanelOpenSvg(false), x: 67, y: 20, w: 11, h: 14.7,
      need: 'panelOpen', unless: 'panelBoxOpen',
      lock: {
        unless: 'panelBoxOpen',
        prompt: '点検口の中の箱だ。4桁の数字を合わせる錠がついている。',
        pattern: '####',
        answer: s => s.random.wallCode.digits,
        message: '箱が開いた。中に南京錠の鍵が入っている！',
        gain: 'padlockKey', set: 'panelBoxOpen',
      },
    },
    panelBoxOpen: {
      label: '開いた箱', svg: s => accessPanelOpenSvg(true), x: 67, y: 20, w: 11, h: 14.7,
      need: 'panelBoxOpen',
      examine: [
        { message: '点検口の中の箱だ。もう何も入っていない。' },
      ],
    },
    // ---------- 背面(台所) ----------
    fridge: {
      // 冷蔵庫の縦横比(100:200)に合わせて h = w × 4/3 × 2。下端(y + h = 70)を床の線にそろえる
      label: '冷蔵庫', svg: FRIDGE_SVG, x: 16, y: 6, w: 24, h: 64,
      examine: [
        { message: '冷蔵庫だ。冷蔵室の中は空っぽだ。' },
      ],
    },
    // 冷凍室。冷蔵庫の絵の下の引き出し(絵の y = 130〜194)に重ねた透明な物。
    // 位置は冷蔵庫の位置から計算: x = 16 + 24 × 0.06、y = 6 + 64 × 0.65、w = 24 × 0.88、h = 64 × 0.32
    freezer: {
      label: '冷凍室', x: 17.4, y: 47.6, w: 21.1, h: 20.5,
      examine: [
        {
          unless: 'gotIceKey',
          message: '冷凍室だ。製氷皿に、鍵が閉じ込められた氷があった。取り出しておこう。',
          gain: 'iceKey', set: 'gotIceKey',
        },
        { message: '冷凍室だ。もう何も入っていない。' },
      ],
    },
    sink: {
      // 流し台の縦横比(100:80)に合わせて h = w × 4/3 × 0.8。下端(y + h = 70)を床の線にそろえる
      label: '流し台', svg: SINK_SVG, x: 46, y: 29.5, w: 38, h: 40.5,
      examine: [
        { message: '流し台だ。蛇口をひねると水が出る。' },
      ],
      // 鍵入りの氷を使っても「何も起きない。」(流しで溶かす仕掛けがあると勘違いさせないため、専用の文章は出さない)
    },

    // 謎8: 流しの下の戸棚。流し台の絵の戸棚の部分(絵の x = 2〜98、y = 30〜78)に重ねた透明な物。
    // 位置は流し台の位置から計算: x = 46 + 38 × 0.02、y = 29.5 + 40.5 × 30/80、w = 38 × 0.96、h = 40.5 × 48/80
    // 古い鍵で開けると、同じ場所に開いた戸棚(sinkCabinetOpen)を表示する
    sinkCabinet: {
      label: '流しの下の戸棚', x: 46.8, y: 44.7, w: 36.5, h: 24.3,
      unless: 'cabinetOpen', // 開けるまで表示
      examine: [
        { message: '流しの下の戸棚だ。鍵がかかっている。古そうな鍵穴だ。' },
      ],
      use: [
        {
          item: 'oldKey',
          message: '戸棚が開いた。中に皿が重ねてしまってある。',
          remove: 'oldKey', set: 'cabinetOpen',
        },
      ],
    },
    sinkCabinetOpen: {
      // 絵の縦横比(100:50)に合わせて h = w × 4/3 × 0.5
      // 絵は皿の並びによって変わるので、svg に「状態 s を受け取って絵を返す関数」を書く
      label: '開いた戸棚', svg: s => sinkCabinetOpenSvg(s.random.plates), x: 46.8, y: 44.7, w: 36.5, h: 24.3,
      need: 'cabinetOpen', // 開けた後に表示
      examine: [
        { message: '流しの下の戸棚だ。色の違う皿が4枚重ねてある。' },
      ],
    },

    // ---------- 左の面 ----------
    // 謎9: 食器棚の色の錠。答えは、流しの下の戸棚の皿を「下から順に」読んだ色の並び(皿の並びを逆にしたもの)。
    // 戸棚を開ける前でも入力画面は開ける(仮定)。開けた後は、同じ場所に開いた食器棚(cupboardOpen)を表示する。
    // 食器棚の縦横比(100:160)に合わせて h = w × 4/3 × 1.6。下端(y + h = 70)を床の線にそろえる
    cupboard: {
      label: '食器棚', svg: CUPBOARD_SVG, x: 14, y: 6, w: 30, h: 64,
      unless: 'cupboardOpen', // 開けるまで表示
      lock: {
        type: 'color',
        unless: 'cupboardOpen',
        prompt: '食器棚だ。ガラス戸に色のボタンの錠がついている。『下から順に』と彫ってある。',
        length: 4,
        answer: s => [...s.random.plates].reverse(),
        message: '食器棚のガラス戸が開いた。中に鍵が入っている！',
        gain: 'bellKey', set: 'cupboardOpen',
      },
    },
    cupboardOpen: {
      label: '開いた食器棚', svg: CUPBOARD_OPEN_SVG, x: 14, y: 6, w: 30, h: 64,
      need: 'cupboardOpen', // 開けた後に表示
      examine: [
        { message: '食器棚だ。もう何も入っていない。' },
      ],
    },
    // 電子レンジは「空の姿 microwave」と「氷が入った姿 microwaveIce」を別の物として書き、フラグ iceInMicrowave で切り替える。
    // 右の矢印にかからないよう、右端を x + w = 80 にする。絵はレンジ台ごと描く。縦横比(100:110)に合わせて h = w × 4/3 × 1.1。下端を床の線にそろえる
    microwave: {
      label: '電子レンジ', svg: microwaveSvg(false), x: 52, y: 28.9, w: 28, h: 41.1,
      unless: 'iceInMicrowave', // 氷を入れるまで表示
      examine: [
        { message: '電子レンジだ。中は空っぽだ。' },
      ],
      use: [
        {
          item: 'iceKey',
          message: '氷を電子レンジに入れた。',
          remove: 'iceKey', set: 'iceInMicrowave',
        },
      ],
    },
    // 謎7: 氷を入れた後にタップすると、温め時間(3桁)の入力画面が開く。
    // 答えはテーブルの空き箱の「解凍 600W 1分30秒」→ 1:30(answer は数字だけの '130')。「温め」の 3:00 は不正解
    microwaveIce: {
      label: '電子レンジ', svg: microwaveSvg(true), x: 52, y: 28.9, w: 28, h: 41.1,
      need: 'iceInMicrowave', unless: 'gotOldKey', // 氷を入れた後、溶かすまで表示
      lock: {
        unless: 'gotOldKey',
        prompt: '電子レンジだ。中に、鍵入りの氷が入っている。温め時間を「分:秒」で入力する。例えば2分05秒なら「2:05」。',
        pattern: '#:##', // 分1桁と秒2桁をコロンで区切って表示する。入力するのは数字3つ
        answer: '130',
        wrongNote: 'うまくいかないようだ。', // 「開かない。」は電子レンジに合わないため
        message: '氷が溶けて、中から鍵が出てきた。',
        gain: 'oldKey', set: 'gotOldKey',
      },
    },
    // 氷を溶かした後の電子レンジ。見た目は空の姿と同じ
    microwaveDone: {
      label: '電子レンジ', svg: microwaveSvg(false), x: 52, y: 28.9, w: 28, h: 41.1,
      need: 'gotOldKey',
      examine: [
        { message: '電子レンジだ。中は空っぽだ。' },
      ],
    },

    // ---------- 右の面 ----------
    // 玄関の扉の右に置き、右の矢印にかからないよう右端を x + w = 82 にする。
    // 縦横比(100:110)に合わせて h = w × 4/3 × 1.1。下端(y + h = 70)を床の線にそろえる
    // 浴室の扉(版28。版34で「ユニットバスの扉」から改名)。タップすると洗面所へ移る(goWall)。玄関の扉の左に置く
    bathDoorK: {
      label: '浴室の扉', className: 'door door-bath', x: 15, y: 18, w: 18, h: 52,
      examine: [
        { message: '洗面所に入った。', goWall: 'b-sink' },
      ],
    },
    // 靴箱(版28から手がかりを入れる物)。1回目に蛇口のハンドルが見つかる(フラグ gotHandle)
    shoeBox: {
      label: '靴箱', svg: SHOE_BOX_SVG, x: 64, y: 43.6, w: 18, h: 26.4,
      examine: [
        { unless: 'gotHandle', message: '靴箱だ。靴はなく、工具箱が置いてある。開けると、蛇口のハンドルが入っていた。', gain: 'tapHandle', set: 'gotHandle' },
        { message: '靴箱だ。工具箱のほかには何も入っていない。' },
      ],
    },
    // 玄関の扉。鈴の付いた鍵で開けるとクリア(フラグ escaped)
    // 玄関の扉(版28で錠2つ)。鍵穴(鈴の付いた鍵)と、南京錠で留めたドアチェーン(南京錠の鍵)の両方を外すとクリア。
    // 調べる・使うのルールは、扉とドアチェーン(扉に重ねた別の物)で同じなので、GENKAN_RULES を使い回す
    genkanDoor: {
      label: '玄関の扉', className: 'door door-genkan', x: 39, y: 18, w: 22, h: 52,
      ...GENKAN_RULES,
    },
    // ドアチェーンと南京錠の絵。扉の取っ手の上あたりに重ねる。外す(chainOff)と消える。
    // 縦横比(100:50)に合わせて h = w × 4/3 × 0.5
    doorChain: {
      label: 'ドアチェーン', svg: CHAIN_SVG, x: 45, y: 36, w: 15, h: 10,
      unless: 'chainOff',
      ...GENKAN_RULES,
    },
  },
};
