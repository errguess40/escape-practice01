// ゲーム全体のデータ(GAME_DATA)を組み立てるファイル。
// 部屋ごとのデータ(data/room1.js・data/room2.js)とアイテム(data/items.js)を、ここで1つにまとめる。
// 謎を追加・修正するときは、基本的に data/ のファイルだけを変更する。
//
// 【フラグ】謎の進み具合は「フラグ」(名前付きの ON/OFF)で管理する。
//   例: gotDriver = ドライバーを入手した、boardOpen = クローゼットの板を外した
//
// 【ルール】物を調べたとき・アイテムを使ったときの結果は「ルール」の配列で書く。
//   上から順に見て、条件に合った最初の1つだけが実行される。
//   need     : このフラグが ON のときだけ合う
//   unless   : このフラグが OFF のときだけ合う
//   item     : (use のみ)選択中のアイテムがこれのときだけ合う
//   message  : 表示する文章
//   gain     : 入手するアイテム
//   remove   : 持ち物から消すアイテム
//   set      : ON にするフラグ
//   message は文章の代わりに「状態 s を受け取って文章を返す関数」も書ける(栞の配置で文章が変わる本など)
//   goWall   : 別の面へ移る(面のID)。台所と洗面所・浴室・トイレの行き来に使う。区切りの画面は出さず、持ち物もそのまま
//   enterRoom: 別の部屋へ移る(部屋のID。下の rooms を参照)。区切りの画面を出し、その部屋の最初の面へ移る
//
// 【錠】数字を合わせて開ける物には lock を書く。何もアイテムを選ばずにタップすると入力画面が開く。
//   pattern: 入力欄の形。# が数字1桁ぶんのマス(例: '###' は3桁。'##:##' のように区切りの文字も書ける)
//   answer : 正解の数字(# の部分だけを順に並べたもの)。「状態 s を受け取って答えを返す関数」も書ける
//   prompt : 入力画面に出す説明
//   wrongNote: 不正解のときに入力欄の下に出す一言(書かなければ「開かない。」)
//   unless / need は【ルール】と同じ。条件に合わないとき(開けた後など)は、ふつうに「調べる」になる
//   正解したときは message / gain / set を【ルール】と同じように実行する
//
// 【色の錠】色のボタンを順に押して開ける物は、lock に type: 'color' を書く(版20)。
//   length : 押す回数(入力欄のマスの数)
//   answer : 正解の色の ID の配列(色の ID は下の LOCK_COLORS)
//   prompt / wrongNote / need / unless / 正解したときの結果は、数字の錠と同じ
//
// 【物】x, y は面の左上からの位置(%)、w, h は幅と高さ(%)。
//   面は横4:縦3なので、高さ% = 幅% × 4/3 にすると正方形になる。床の線は y = 70。
//   見た目は次のどれかで表す。
//     svg      : その絵を枠いっぱいに表示する(「状態 s を受け取って絵を返す関数」も書ける)
//     className: style.css で形を作る(扉、本棚など)。text を書くと、その文字を重ねて表示する
//     emoji    : 絵文字で表す(size は大きさ。面の幅に対する%。w, h は不要)。今は使っていない
//   need / unless を物に書くと、その条件に合うときだけ物を表示する(書き方は【ルール】と同じ)。
//   面の objects 配列は、後に書いた物ほど手前に表示される。
//   左右の矢印ボタンが重なるので、面の左右端の約14%には調べる物を置かない。

// 色の錠のボタン。この順に並べる。text はボタンの文字の色(ボタンの色の上で読みやすい色)
const LOCK_COLORS = [
  { id: 'red', name: '赤', color: '#d2463c', text: '#ffffff' },
  { id: 'blue', name: '青', color: '#3b6fc4', text: '#ffffff' },
  { id: 'yellow', name: '黄', color: '#e8c43a', text: '#2f2a26' },
  { id: 'green', name: '緑', color: '#4f9a5a', text: '#ffffff' },
  { id: 'white', name: '白', color: '#f7f5ef', text: '#2f2a26' },
];

const GAME_DATA = {
  // 開始画面に出すタイトルと文章(最初から始めたときに表示する)
  title: '鍵のかかった家',
  // \n の位置で改行して表示する(style.css の .overlay-message に white-space: pre-line を指定している)
  intro: '目が覚めると、知らない部屋にいた。\n扉から外に出よう。',

  // クリアの条件と、クリア画面に出す文章。flag が ON になったらクリア画面を出す。
  // letter は、文章の下に白い紙の枠で出す友人からの手紙(版33。仕掛けた人の種明かし)
  clear: {
    flag: 'escaped',
    title: '脱出成功！',
    message: '玄関から外に出た。外は朝だった。\nドアに、見覚えのある丸っこい字の手紙が貼ってある。',
    letter: 'おはよう。引っ越し祝いに来てくれたお礼に、脱出ゲームを用意しておいた。楽しんでくれた？ 朝ごはんを買いに行ってくる。',
  },

  // 新しく始めるときにランダムに決める物(保存データの random に入る)。
  // bookmarks: 1部屋目の栞の配置(data/room1.js の makeBookmarks)
  // plates   : 台所の流しの下の皿の並び(data/room2.js の makePlates)
  // wallCode : トイレの壁の数字と線の分け方(data/room3.js の makeWallCode。版40)
  // mirror   : 洗面所の鏡の数字(data/room3.js の makeMirrorNumber)
  makeRandom: () => ({ bookmarks: makeBookmarks(), plates: makePlates(), mirror: makeMirrorNumber(), wallCode: makeWallCode() }),

  // 部屋。ゲームは最初の部屋(startRoom)の startWall から始まる
  startRoom: 'room1',
  rooms: {
    room1: ROOM1,
    kitchen: ROOM2,
    bath: ROOM3,
    toilet: ROOM4, // 版34
  },

  // 下で、各部屋の面と物をここに集める(処理のコードは、部屋を気にせず面のID・物のIDで探せる)
  walls: {},
  objects: {},
  items: ITEMS,
};

// 各部屋の面と物を GAME_DATA.walls / GAME_DATA.objects に集める。
// 面には、どの部屋の面かを room に書き足しておく(床の見た目やデバッグの表示に使う)
for (const [roomId, room] of Object.entries(GAME_DATA.rooms)) {
  for (const [wallId, wall] of Object.entries(room.walls)) {
    wall.room = roomId;
    GAME_DATA.walls[wallId] = wall;
  }
  for (const [objectId, obj] of Object.entries(room.objects)) {
    // 物のIDが部屋をまたいで重なると、後の部屋の物で上書きされてしまうので知らせる
    if (GAME_DATA.objects[objectId]) console.error(`物のIDが重なっています: ${objectId}`);
    GAME_DATA.objects[objectId] = obj;
  }
}
GAME_DATA.startWall = GAME_DATA.rooms[GAME_DATA.startRoom].startWall;
