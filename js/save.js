// 保存・読み込みと、古い形式の保存データの変換。
'use strict';

const SAVE_KEY = 'shusaku1-save'; // localStorage に保存するときの名前
// 保存データの形式のバージョン(版7で 1 → 2、版13で 2 → 3、版17で 3 → 4、版20で 4 → 5、版24で 5 → 6、版26で 6 → 7、版28で 7 → 8、版35で 8 → 9、版39で 9 → 10、版40で 10 → 11)
const SAVE_VERSION = 11;
// 一番速いクリアの記録(ミリ秒)を保存する名前(版35)。「最初から」で消えないよう、保存データとは別にする
const BEST_KEY = 'shusaku1-best';

function newState() {
  return {
    version: SAVE_VERSION,
    wall: GAME_DATA.startWall, // 今いる面(面のIDから、今いる部屋も分かる)
    items: [],                 // 持っているアイテムの名前の配列
    flags: {},                 // 謎の進み具合 例: { gotDriver: true }
    random: GAME_DATA.makeRandom(), // 新しく始めるときにランダムに決めた物(栞の配置、皿の並び、鏡の数字)
    timer: newTimer('full'),        // クリアまでの時間(版35)
  };
}

// クリアまでの時間を計るための記録(版35)。
//   mode     : 'full'(最初から。ベストの対象)/ 'room2'(「2部屋目から」)/ 'resumed'(版34までの途中のデータを読み込んだ)/ 'none'(計れない)
//   startedAt: 計り始めた時刻(Date.now() のミリ秒)。「ゲーム開始」を押すまでは null
//   clearedAt: クリアした時刻。クリアするまでは null
//   newRecord: このクリアでベストを更新したか
// 計るのは、時計の上で実際に経った時間(途中でやめている間も含む)
function newTimer(mode, startedAt = null) {
  return { mode, startedAt, clearedAt: null, newRecord: false };
}

// ベストの記録を読む(ミリ秒。なければ null)
function loadBest() {
  try {
    const v = Number(localStorage.getItem(BEST_KEY));
    return v > 0 ? v : null;
  } catch (e) {
    return null;
  }
}

// クリアしたときに呼ぶ。クリアの時刻を記録し、最初から計っていればベストと比べる
function recordClear() {
  const t = state.timer;
  t.clearedAt = Date.now();
  if (t.mode !== 'full' || !t.startedAt) return;
  const ms = t.clearedAt - t.startedAt;
  const best = loadBest();
  if (best === null || ms < best) {
    t.newRecord = true;
    try {
      localStorage.setItem(BEST_KEY, String(ms));
    } catch (e) {
      console.warn('ベストの記録を保存できませんでした', e);
    }
  }
}

function save() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch (e) {
    // プライベートブラウズなどで保存できない場合も、遊ぶことはできるようにする
    console.warn('保存できませんでした', e);
  }
}

// 保存データを消す(保存できない環境でもエラーで止まらないようにする)
function clearSave() {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch (e) {
    console.warn('保存データを消せませんでした', e);
  }
}

function load() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const data = migrate(JSON.parse(raw));
    // 知らない面(データから消した面など)にいるデータは読まない
    if (data && !GAME_DATA.walls[data.wall]) return null;
    return data;
  } catch (e) {
    return null; // 壊れたデータは読まない(最初から始める)
  }
}

// 古い形式の保存データを今の形式に変換する。
// 古い版から順に 1→2、2→3 … と変換していき、最後に今の版になっていれば読み込む。
function migrate(data) {
  if (!data) return null;

  // version 1 → 2: 版7で金庫の中身が doorKey(扉に使う鍵)から closetKey(クローゼットに使う鍵)に変わった。
  // クリア前に doorKey を持っている(=版6で金庫を開けた)データは、closetKey に置き換える。
  // そのままだと背面の謎を飛ばしてクリアできてしまうため。
  if (data.version === 1) {
    if (!data.flags.escaped && data.items.includes('doorKey')) {
      data.items = data.items.map(id => (id === 'doorKey' ? 'closetKey' : id));
    }
    data.version = 2;
  }

  // version 2 → 3: 版13で「絵を調べて金庫を見つける」段階(フラグ foundSafe)が増えた。
  // 版12までに金庫を開けたデータは、金庫を見つけ済みにする(そうしないと開いた金庫が隠れ、絵が戻ってしまう)
  if (data.version === 2) {
    if (data.flags.safeOpen) data.flags.foundSafe = true;
    data.version = 3;
  }

  // version 3 → 4: 版17で、メモ1の入手場所が床板の下からゴミ箱に変わった(フラグ gotMemoColor が増えた)。
  // メモ1を持っているデータは、ゴミ箱から取った扱いにする(そうしないと、もう一度入手できてしまう)。
  // フラグ boardOpen は「床板を外した」から「クローゼットの板を外した」に意味が変わるが、変換はしない。
  // boardOpen が ON のデータはドライバーを使い終えているので、板も外した扱いにしないと先へ進めなくなるため。
  if (data.version === 3) {
    if (data.items.includes('memoColor')) data.flags.gotMemoColor = true;
    data.version = 4;
  }

  // version 4 → 5: 版20で台所(2部屋目)が増え、クリアのフラグ escaped が「玄関の扉を開けた」の意味に変わった。
  // 版19で1部屋目をクリアしたデータ(escaped が ON)は、1部屋目を出た扱い(leftRoom1)にして台所の最初から始める。
  // そうしないと、クリア画面が出たまま台所を遊べないため。メモは台所に入るときと同じく持ち物から消す
  if (data.version === 4) {
    if (data.flags.escaped) {
      delete data.flags.escaped;
      data.flags.leftRoom1 = true;
      const kitchen = GAME_DATA.rooms.kitchen;
      data.items = data.items.filter(id => !kitchen.dropItems.includes(id));
      data.wall = kitchen.startWall;
    }
    data.version = 5;
  }

  // version 5 → 6: 版24で、栞の配置を新しく始めるたびにランダムに決めるようにした(保存項目 random が増えた)。
  // 途中のデータは、版23までの固定の配置(1=青、3=黄、4=赤。答え 413)にする。遊んでいる途中で答えが変わらないようにするため
  if (data.version === 5) {
    data.random = { bookmarks: { red: 4, blue: 1, yellow: 3 } };
    data.version = 6;
  }

  // version 6 → 7: 版26で、流しの下の皿の並びを新しく始めるたびにランダムに決めるようにした(random.plates が増えた)。
  // 途中のデータは、版25までの固定の並び(上から 緑・赤・白・青。答え 青・白・赤・緑)にする
  if (data.version === 6) {
    data.random.plates = ['green', 'red', 'white', 'blue'];
    data.version = 7;
  }

  // version 7 → 8: 版28でユニットバスが増え、鏡の数字(random.mirror)を新しく始めるときに決めるようになった。
  // 途中のデータには、ここでランダムに決めて足す(まだ誰も見ていない数字なので、ランダムでよい)
  if (data.version === 7) {
    data.random.mirror = makeMirrorNumber();
    data.version = 8;
  }

  // version 8 → 9: 版35でクリアまでの時間(timer)が増えた。
  // 途中のデータは、いつ始めたか分からないので、読み込んだ時刻から計り始める(ベストの対象外)。
  // クリア済みのデータは、時間を計れないので「記録なし」にする
  if (data.version === 8) {
    data.timer = data.flags.escaped ? newTimer('none') : newTimer('resumed', Date.now());
    data.version = 9;
  }

  // version 9 → 10: 版39で、鏡に数字ではなく記号(頂点の数が数字になる形)を描くようになり、使える数字が 0・3・4・5 だけになった。
  // それまでの数字には記号にできない数字が含まれるので、選び直す(鏡をまだ見ていなければ影響はない)
  if (data.version === 9) {
    data.random.mirror = makeMirrorNumber();
    data.version = 10;
  }

  // version 10 → 11: 版40でトイレに謎12(点検口の箱)が増え、壁の数字(random.wallCode)を決めるようになった。
  // 小物入れの中身が「南京錠の鍵」から「コイン」に変わったので、小物入れを開け済み(南京錠の鍵を手に入れ済み)のデータは、
  // 点検口と箱も開け済みにして、そのまま玄関へ進めるようにする
  if (data.version === 10) {
    data.random.wallCode = makeWallCode();
    if (data.flags.boxOpen) {
      data.flags.panelOpen = true;
      data.flags.panelBoxOpen = true;
    }
    data.version = 11;
  }

  if (data.version === SAVE_VERSION) return data;
  return null; // 知らない形式は捨てて最初から
}
